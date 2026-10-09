import { siteConfig } from "@/config/site";
import { getProductById } from "@/data/products";
import { onlyDigits } from "@/lib/format";
import { createInfinitePayCheckout, isInfinitePayConfigured, toCents } from "@/lib/infinitepay";
import { quoteShipping, ShippingError, type ShippingItem } from "@/lib/shipping";

type CheckoutBody = {
  items: ShippingItem[];
  shippingOptionId: "pac" | "sedex";
  customer: { name: string; email: string; phone: string; cpf?: string };
  address: { cep: string; number: string; complement?: string };
};

function baseUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin || siteConfig.url;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const { customer, address } = body;

    if (!body.items?.length) return error("Seu carrinho está vazio.");
    if (!customer?.name?.trim() || !customer.email?.includes("@") || onlyDigits(customer.phone ?? "").length < 10)
      return error("Preencha nome, e-mail e WhatsApp corretamente.");
    if (!address?.number?.trim()) return error("Informe o número do endereço.");

    // Recalcula tudo no servidor — nunca confie em preços vindos do navegador.
    const items = body.items.map((line) => {
      const product = getProductById(line.productId);
      if (!product) throw new ShippingError("Um dos produtos não está mais disponível.");
      const quantity = Math.max(1, Math.min(product.stock, Math.floor(line.quantity)));
      return { product, quantity };
    });

    const quote = await quoteShipping(address.cep, body.items);
    const shipping = quote.options.find((o) => o.id === body.shippingOptionId) ?? quote.options[0];

    const orderNsu = `GZ${Date.now().toString(36).toUpperCase()}`;
    const origin = baseUrl(request);

    const ipItems = items.map(({ product, quantity }) => ({
      quantity,
      price: toCents(product.price),
      description: product.name,
    }));
    if (shipping.price > 0) {
      ipItems.push({ quantity: 1, price: toCents(shipping.price), description: `Frete ${shipping.name}` });
    }

    if (!isInfinitePayConfigured()) {
      // MODO DEMONSTRAÇÃO — sem conta InfinitePay configurada.
      console.info("[checkout:demo]", orderNsu, { customer: customer.email, items: ipItems });
      return Response.json({ url: `${origin}/pedido/sucesso?order_nsu=${orderNsu}&demo=1`, orderNsu, demo: true });
    }

    const url = await createInfinitePayCheckout({
      orderNsu,
      items: ipItems,
      redirectUrl: `${origin}/pedido/sucesso`,
      webhookUrl: `${origin}/api/webhooks/infinitepay`,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        phone_number: `+55${onlyDigits(customer.phone)}`,
      },
      address: {
        cep: quote.cep,
        street: quote.address.street,
        neighborhood: quote.address.neighborhood,
        number: address.number.trim(),
        complement: address.complement?.trim() || undefined,
      },
    });

    return Response.json({ url, orderNsu });
  } catch (err) {
    console.error("[checkout]", err);
    return error(err instanceof Error ? err.message : "Erro ao processar o pedido.");
  }
}

function error(message: string) {
  return Response.json({ error: message }, { status: 400 });
}
