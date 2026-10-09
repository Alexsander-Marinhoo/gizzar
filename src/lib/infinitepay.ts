/**
 * ============================================================
 *  INTEGRAÇÃO INFINITEPAY — Checkout Integrado (link de pagamento)
 *
 *  Fluxo:
 *   1. O site envia o pedido para /api/checkout (servidor).
 *   2. O servidor recalcula preços e frete e chama a API da
 *      InfinitePay para criar um link de checkout.
 *   3. A cliente é redirecionada para a página segura da
 *      InfinitePay, onde paga com Pix ou cartão (parcelado).
 *   4. Após o pagamento, volta para /pedido/sucesso e a
 *      InfinitePay notifica /api/webhooks/infinitepay.
 *
 *  Configuração (variáveis de ambiente na Vercel):
 *   INFINITEPAY_HANDLE   -> sua InfiniteTag, SEM o "$"
 *   INFINITEPAY_API_URL  -> (opcional) endpoint de criação de links
 *   NEXT_PUBLIC_SITE_URL -> ex.: https://gizzar.vercel.app
 *
 *  Sem INFINITEPAY_HANDLE a loja roda em MODO DEMONSTRAÇÃO:
 *  o pedido é simulado e a cliente vai direto para a página de
 *  sucesso (útil para testar o fluxo antes da conta ficar pronta).
 *
 *  Documentação: https://www.infinitepay.io/checkout-documentacao
 * ============================================================
 */

const DEFAULT_API_URL = "https://api.infinitepay.io/invoices/public/checkout/links";

export type InfinitePayItem = {
  quantity: number;
  /** Valor unitário em CENTAVOS. */
  price: number;
  description: string;
};

export type InfinitePayCheckoutInput = {
  orderNsu: string;
  items: InfinitePayItem[];
  redirectUrl: string;
  webhookUrl: string;
  customer?: { name: string; email: string; phone_number: string };
  address?: { cep: string; street: string; neighborhood: string; number: string; complement?: string };
};

export function isInfinitePayConfigured() {
  return Boolean(process.env.INFINITEPAY_HANDLE);
}

export async function createInfinitePayCheckout(input: InfinitePayCheckoutInput): Promise<string> {
  const handle = process.env.INFINITEPAY_HANDLE?.replace(/^\$/, "");
  if (!handle) throw new Error("INFINITEPAY_HANDLE não configurado.");

  const res = await fetch(process.env.INFINITEPAY_API_URL || DEFAULT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle,
      order_nsu: input.orderNsu,
      redirect_url: input.redirectUrl,
      webhook_url: input.webhookUrl,
      items: input.items,
      customer: input.customer,
      address: input.address,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("[InfinitePay] erro ao criar checkout", res.status, data);
    throw new Error("Não foi possível iniciar o pagamento. Tente novamente.");
  }

  const url: string | undefined = data.url ?? data.link ?? data.checkout_url;
  if (!url) {
    console.error("[InfinitePay] resposta sem URL", data);
    throw new Error("Resposta inesperada do gateway de pagamento.");
  }
  return url;
}

export function toCents(value: number) {
  return Math.round(value * 100);
}
