# Plano de Implementação — Pagamentos InfinitePay (Pix e Cartão)

Este documento detalha tudo o que já está pronto no projeto **GIZZAR** e o checklist exato do que vamos implementar na próxima sessão para deixar os pagamentos via **InfinitePay** 100% funcionais de ponta a ponta.

---

## 1. O que a Dona da Loja precisa fazer (Sem passar senha para você)

1. Baixar o aplicativo **InfinitePay** no celular dela (Android ou iPhone) e criar a conta gratuita.
2. Cadastrar a conta bancária dela dentro do app da InfinitePay (para onde o dinheiro das vendas vai cair).
3. Olhar no aplicativo qual é a **InfiniteTag** dela (exemplo: `$gizzar`) e enviar **apenas esse nome** para você no WhatsApp.

> [!IMPORTANT]
> A **InfiniteTag** é um identificador público de recebimento (igual a uma Chave Pix). Você não precisa de login, senha ou token secreto da conta dela.

---

## 2. Variáveis de Ambiente (`.env.local` e Vercel)

Quando tiver a InfiniteTag e o CEP exato da rua dela no Rio de Janeiro, basta preencher:

```env
# URL oficial do site na Vercel
NEXT_PUBLIC_SITE_URL=https://gizzar.vercel.app

# InfiniteTag da dona da loja (SEM o símbolo $)
INFINITEPAY_HANDLE=gizzar

# CEP de origem dela no Rio de Janeiro
NEXT_PUBLIC_ORIGIN_CEP=20040-002
```

---

## 3. O que JÁ está pronto no código hoje

- **[src/lib/infinitepay.ts](file:///c:/programacao/antigravity/gizzar/src/lib/infinitepay.ts)**: Função `createInfinitePayCheckout()` que monta o payload oficial da API pública da InfinitePay (`https://api.infinitepay.io/invoices/public/checkout/links`) com itens em centavos, frete, dados do comprador e endereço de entrega.
- **[src/app/api/checkout/route.ts](file:///c:/programacao/antigravity/gizzar/src/app/api/checkout/route.ts)**: Endpoint `POST /api/checkout` que valida os dados, recalcula o preço dos produtos e o frete dos Correios no servidor e gera o link de pagamento (ou roda em modo demonstração enquanto `INFINITEPAY_HANDLE` estiver vazio).

---

## 4. O que vamos implementar na próxima sessão (Checklist de Código)

Quando quiser que eu execute este plano, basta pedir: **"Implemente o `PLANO_INFINITEPAY.md`"**.

### Etapa 1 — Validação Automática de Pagamento (`payment_check`)
- **Arquivo:** [src/lib/infinitepay.ts](file:///c:/programacao/antigravity/gizzar/src/lib/infinitepay.ts)
- **O que será feito:** Adicionar a função `checkInfinitePayPayment({ orderNsu, transactionNsu, slug })` que consulta o endpoint público oficial `https://api.infinitepay.io/invoices/public/checkout/payment_check` da InfinitePay para confirmar com segurança se o Pix ou Cartão foi realmente aprovado (`paid: true`) e qual método foi utilizado (`pix` ou `credit_card`).

### Etapa 2 — Salvar a Cor Escolhida no Carrinho e no Checkout
- **Arquivos:** [src/lib/cart.ts](file:///c:/programacao/antigravity/gizzar/src/lib/cart.ts), [src/components/product/PurchasePanel.tsx](file:///c:/programacao/antigravity/gizzar/src/components/product/PurchasePanel.tsx), [src/components/product/AddToCartButton.tsx](file:///c:/programacao/antigravity/gizzar/src/components/product/AddToCartButton.tsx) e [src/app/api/checkout/route.ts](file:///c:/programacao/antigravity/gizzar/src/app/api/checkout/route.ts)
- **O que será feito:** Incluir a cor selecionada pela cliente no item do carrinho e na descrição enviada para a InfinitePay (ex.: `"Bolsa Tote Noir (Cor: Preto)"`), para que a dona da loja saiba exatamente qual cor enviar.

### Etapa 3 — Registrar o Pedido no Painel Admin ao Iniciar e Aprovar o Checkout
- **Arquivos:** [src/components/checkout/CheckoutView.tsx](file:///c:/programacao/antigravity/gizzar/src/components/checkout/CheckoutView.tsx), [src/lib/admin-store.ts](file:///c:/programacao/antigravity/gizzar/src/lib/admin-store.ts) e [src/app/pedido/sucesso/page.tsx](file:///c:/programacao/antigravity/gizzar/src/app/pedido/sucesso/page.tsx)
- **O que será feito:**
  1. Ao clicar em *"Ir para pagamento"*, registrar o pedido (`orderNsu`) na lista de pedidos do Admin com status `"pending"`, dados da cliente, endereço completo com CEP, método de envio (PAC/SEDEX) e itens.
  2. Quando a cliente voltar da InfinitePay para `/pedido/sucesso`, ler os parâmetros de retorno da InfinitePay (`order_nsu`, `transaction_nsu`, `capture_method`, `receipt_url`), validar o pagamento, atualizar o status do pedido para `"paid"`, dar baixa automática no estoque das bolsas compradas e limpar a sacola.

### Etapa 4 — Webhook da InfinitePay e Notificação Rápida via WhatsApp
- **Arquivos:** [src/app/api/webhooks/infinitepay/route.ts](file:///c:/programacao/antigravity/gizzar/src/app/api/webhooks/infinitepay/route.ts) e [src/app/pedido/sucesso/page.tsx](file:///c:/programacao/antigravity/gizzar/src/app/pedido/sucesso/page.tsx)
- **O que será feito:**
  1. Atualizar o webhook para validar o payload recebido da InfinitePay usando `checkInfinitePayPayment`.
  2. Na página `/pedido/sucesso`, exibir o comprovante do pedido e um botão **"Enviar confirmação do pedido no WhatsApp"** que já abre o WhatsApp da dona da loja com o resumo completo (Número do pedido, Bolsa + Cor, Valor pago, Método PAC/SEDEX e Endereço completo para postagem nos Correios).

### Etapa 5 — Compatibilidade de Produtos Criados pelo Painel Admin no Checkout
- **Arquivos:** [src/app/api/checkout/route.ts](file:///c:/programacao/antigravity/gizzar/src/app/api/checkout/route.ts) e [src/lib/shipping.ts](file:///c:/programacao/antigravity/gizzar/src/lib/shipping.ts)
- **O que será feito:** Permitir que novas bolsas cadastradas ou editadas pela dona da loja no Painel Admin também sejam aceitas no cálculo de frete e no checkout da InfinitePay.

