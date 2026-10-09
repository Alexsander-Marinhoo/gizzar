/**
 * Webhook da InfinitePay — chamado quando um pagamento é aprovado.
 *
 * Próximos passos sugeridos (quando houver banco de dados/e-mail):
 *  - Salvar o pedido como "pago" (order_nsu, transaction_nsu, valor).
 *  - Baixar estoque.
 *  - Enviar e-mail/WhatsApp de confirmação para a cliente e para a loja.
 *
 * Os eventos aparecem nos logs da Vercel (Project > Logs).
 */
export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  console.info("[webhook:infinitepay]", JSON.stringify(payload));

  // TODO: validar o pagamento consultando a API da InfinitePay antes de liberar o pedido.

  return Response.json({ received: true });
}
