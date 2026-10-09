import { quoteShipping, ShippingError, type ShippingItem } from "@/lib/shipping";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { cep?: string; items?: ShippingItem[] };
    const quote = await quoteShipping(body.cep ?? "", body.items ?? []);
    return Response.json(quote);
  } catch (err) {
    const message = err instanceof ShippingError ? err.message : "Erro ao calcular o frete.";
    return Response.json({ error: message }, { status: 400 });
  }
}
