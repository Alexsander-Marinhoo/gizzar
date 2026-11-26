# Plano de Implementação — Pagamentos Mercado Pago (Pix e Cartão)

Este documento detalha o passo a passo completo para conectar a conta do **Mercado Pago** da dona da loja ao site **GIZZAR**, permitindo pagamentos via **Pix (aprovação imediata)** e **Cartão de Crédito parcelado (em até 6x/12x)** com atualização automática dos pedidos no **Supabase**.

---

## 1. Como conectar a conta do Mercado Pago dela (Sem pedir a senha dela)

Para o site gerar os links de pagamento direto na conta dela, precisamos apenas da chave **`MERCADOPAGO_ACCESS_TOKEN`** (código que começa com `APP_USR-...`). Existem **2 formas 100% seguras** de obter essa chave sem ela te passar a senha:

### Opção A — Convite de Colaborador (Mais segura e recomendada)
1. No aplicativo ou site do **Mercado Pago** dela, ela acessa: **Seu Negócio > Colaboradores > Convidar colaborador**.
2. Ela digita o **seu e-mail** e seleciona apenas a permissão técnica de **"Desenvolvedor / Integrações"**.
3. Você aceita o convite no seu e-mail, entra com a **sua própria conta** no [Painel de Desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel/app) e copia o **`Access Token` de Produção** (`APP_USR-...`).
   *(Essa permissão técnica não permite ver saldo nem transferir dinheiro da conta dela).*

### Opção B — Familiar copia as Credenciais de Produção
1. A pessoa de confiança que ajudou ela a criar a conta acessa [mercadopago.com.br/developers/panel/app](https://www.mercadopago.com.br/developers/panel/app) logada na conta dela.
2. Clica em **Criar aplicação** (nome: `Loja Gizzar`, produto: `Checkout Pro`).
3. No menu lateral esquerdo, clica em **Credenciais de produção**, copia o campo **`Access Token`** (`APP_USR-...`) e te envia no WhatsApp.

---

## 2. Variáveis de Ambiente (`.env.local` e Vercel)

Assim que tiver o `Access Token` de produção e o CEP exato da rua dela no Rio de Janeiro:

```env
# URL oficial do site na Vercel
NEXT_PUBLIC_SITE_URL=https://gizzar.vercel.app

# Credencial de Produção do Mercado Pago (começa com APP_USR-...)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-0000000000000000-000000-00000000000000000000000000000000-000000000

# (Opcional) Public Key de Produção do Mercado Pago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-00000000-0000-0000-0000-000000000000

# CEP de origem dela no Rio de Janeiro
NEXT_PUBLIC_ORIGIN_CEP=20040-002
```

---

## 3. O que JÁ está pronto e funcionando no projeto hoje

- **Banco de Dados e Auth no Supabase (`ffqbjycwxlsiwetszepk`):** Tabelas `products`, `orders` e `banner_config` com `id uuid`, RLS ativo e upload de fotos no bucket `product-images`.
- **Frete Correios do Rio de Janeiro ([src/lib/shipping.ts](file:///c:/programacao/antigravity/gizzar/src/lib/shipping.ts)):** Cálculo de Peso Cubado + Matriz de Balcão Capital/Interior + API de cotação.
- **Cor da Bolsa no Carrinho e Checkout ([src/lib/cart.ts](file:///c:/programacao/antigravity/gizzar/src/lib/cart.ts) e [PurchasePanel.tsx](file:///c:/programacao/antigravity/gizzar/src/components/product/PurchasePanel.tsx)):** A cor selecionada pela cliente já vai para a sacola e para o pedido.
- **Compatibilidade com Produtos do Admin ([src/app/api/checkout/route.ts](file:///c:/programacao/antigravity/gizzar/src/app/api/checkout/route.ts)):** O servidor de checkout e frete já reconhece qualquer bolsa criada ou editada pela dona da loja no Painel Admin / Supabase.

---

## 4. O que vamos implementar no código (Checklist Mercado Pago)

Quando quiser que eu execute este plano, basta pedir: **"Implemente o `PLANO_INFINITEPAY.md`"** (já atualizado para o Mercado Pago).

### Etapa 1 — Cliente Oficial Mercado Pago Checkout Pro (`src/lib/mercadopago.ts`)
- **O que será feito:**
  1. Criar `createMercadoPagoPreference()` consumindo `POST https://api.mercadopago.com/checkout/preferences` com:
     - `items`: cada bolsa do carrinho com `id`, `title` (incluindo a cor escolhida, ex: `"Bolsa Tote Noir — Cor: Preto"`), `quantity`, `unit_price` e `currency_id: "BRL"`.
     - `shipments`: custo exato do frete dos Correios (`PAC` ou `SEDEX`) e endereço de entrega completo da compradora.
     - `payer`: nome, e-mail e telefone da compradora.
     - `payment_methods`: suporte a Pix, Cartão de Crédito em até `siteConfig.payment.maxInstallments` (6x) e Boleto desativado (para não travar estoque).
     - `back_urls`: redirecionamento automático (`auto_return: "approved"`) para `/pedido/sucesso`.
     - `notification_url`: webhook `/api/webhooks/mercadopago`.
     - `external_reference`: UUID do pedido salvo no Supabase.
  2. Criar `getMercadoPagoPayment(paymentId)` consumindo `GET https://api.mercadopago.com/v1/payments/{id}` para validar com segurança se o pagamento foi realmente aprovado (`status === "approved"`).

### Etapa 2 — Atualizar o Endpoint de Checkout (`src/app/api/checkout/route.ts`)
- **O que será feito:**
  1. Conectar o `POST /api/checkout` ao Mercado Pago (`createMercadoPagoPreference`) quando `MERCADOPAGO_ACCESS_TOKEN` estiver configurado (mantendo o modo demonstração automático caso a variável ainda esteja vazia).
  2. Retornar a URL segura do Mercado Pago (`init_point`) e o `orderId` (UUID) para o navegador redirecionar a cliente.

### Etapa 3 — Webhook do Mercado Pago e Baixa Automática no Supabase (`src/app/api/webhooks/mercadopago/route.ts`)
- **O que será feito:**
  1. Receber as notificações IPN/Webhook do Mercado Pago (`type === "payment"`).
  2. Consultar o status oficial na API do Mercado Pago (`getMercadoPagoPayment`).
  3. Quando `status === "approved"`, atualizar automaticamente o pedido na tabela `public.orders` do Supabase para `status = "paid"`, registrando se foi pago via `pix` ou `credit_card` (e número de parcelas), além de descontar a unidade vendida do estoque (`stock`) na tabela `public.products`.

### Etapa 4 — Confirmação na Página de Sucesso e Textos da Loja (`src/app/pedido/sucesso/page.tsx`)
- **O que será feito:**
  1. Ler os parâmetros de retorno do Mercado Pago (`payment_id`, `status`, `external_reference`, `payment_type`).
  2. Confirmar a aprovação do pedido e exibir o botão **"Confirmar pedido pelo WhatsApp"** com o resumo completo da compra para a dona da loja.
  3. Atualizar os textos informativos do rodapé ([Footer.tsx](file:///c:/programacao/antigravity/gizzar/src/components/layout/Footer.tsx)), Checkout ([CheckoutView.tsx](file:///c:/programacao/antigravity/gizzar/src/components/checkout/CheckoutView.tsx)) e Política de Privacidade ([politica-de-privacidade/page.tsx](file:///c:/programacao/antigravity/gizzar/src/app/politica-de-privacidade/page.tsx)) de "InfinitePay" para **"Mercado Pago"**.
