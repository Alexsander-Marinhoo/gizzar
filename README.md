# GIZZAR — E-commerce de Bolsas e Acessórios

Loja virtual moderna e responsiva desenvolvida para a marca **GIZZAR**, com foco em elegância atemporal, alta taxa de conversão em dispositivos móveis, checkout integrado com gateway **InfinitePay** (Pix e Cartão de crédito parcelado) e cálculo de frete para todo o Brasil.

---

## 🚀 Tecnologias Utilizadas

- **Framework:** Next.js (App Router, Turbopack, React 19)
- **Estilização:** Tailwind CSS (paleta personalizada em tons marfim, areia, preto quente e dourado)
- **Tipografia:** Cormorant Garamond (Editorial de luxo) + Manrope (Interface limpa)
- **Pagamentos:** Checkout Integrado InfinitePay (Pix e Cartão em até 6x)
- **Logística:** Estimativa de frete Correios (PAC / SEDEX) integrada com consulta de CEP ViaCEP
- **Deploy:** Otimizado para hospedagem gratuita na Vercel

---

## 📁 Estrutura do Projeto

```
gizzar/
├── public/
│   ├── brand/          # Imagens institucionais (hero.jpg)
│   └── products/       # Fotos dos produtos (tote-noir.jpg, mini-perola.jpg, etc.)
├── src/
│   ├── app/            # Rotas Next.js (Home, Catálogo, Produto, Carrinho, Checkout, Sobre, APIs)
│   ├── components/     # Componentes reutilizáveis (Header, Footer, ProductCard, etc.)
│   ├── config/
│   │   └── site.ts     # Configurações gerais: WhatsApp, telefone, e-mail, parcelas, frete
│   ├── data/
│   │   └── products.ts # Catálogo de produtos e categorias (fácil de editar)
│   └── lib/            # Módulos de frete, carrinho e InfinitePay
```

---

## 🛠️ Como Rodar Localmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000).

---

## 📸 Como Trocar as Fotos Demonstrativas pelas Fotos Reais da Cliente

O código foi arquitetado para que a troca de imagens seja extremamente simples:

1. **Salve as novas fotos** na pasta `public/products/`.
   - *Dica:* Prefira imagens verticais na proporção **3:4** (ex.: 1200x1600px), com boa iluminação e fundo claro ou neutro.
2. **Abra o arquivo [`src/data/products.ts`](src/data/products.ts):**
   - Altere os caminhos em `images: ["/products/sua-foto-1.jpg", "/products/sua-foto-2.jpg"]`.
   - Ajuste o nome, preço (`price: 389.90`), descrição e detalhes da peça.
3. Para trocar o banner principal da vitrine (Hero), substitua o arquivo `public/brand/hero.jpg`.

---

## 💳 Integração com a InfinitePay

O checkout da loja já está 100% preparado para gerar o link de pagamento seguro com Pix e Cartão de Crédito parcelado:

1. **Modo Demonstração (Padrão inicial):**
   - Enquanto a conta da InfinitePay não for configurada, a loja opera automaticamente em modo de teste/simulação, permitindo testar o fluxo de compra completo até a tela de confirmação.
2. **Ativando a InfinitePay em Produção:**
   - Acesse o painel da sua conta InfinitePay e obtenha a sua **InfiniteTag** (ex.: se for `$gizzar`, seu identificador é `gizzar`).
   - Habilite a opção **Checkout Integrado** no aplicativo ou painel InfinitePay.
   - Configure a variável de ambiente:
     ```env
     INFINITEPAY_HANDLE=sua_tag_aqui
     ```
   - No painel da Vercel: **Settings** > **Environment Variables** > adicione `INFINITEPAY_HANDLE`.

---

## 📦 Cálculo de Frete

O cálculo de frete funciona com estimativa dinâmica para **PAC** e **SEDEX**:
- O cliente digita o CEP na página do produto, no carrinho ou no checkout.
- O sistema autocompleta rua, bairro, cidade e estado via ViaCEP.
- Aplica a regra de **Frete Grátis** automaticamente para pedidos acima do valor estipulado em [`src/config/site.ts`](src/config/site.ts) (padrão: R$ 499,00).

---

## 🌐 Deploy na Vercel (Passo a Passo)

1. Suba este projeto para um repositório no seu GitHub.
2. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
3. Clique em **"Add New Project"** e selecione o repositório `gizzar`.
4. Em **Environment Variables**, adicione:
   - `INFINITEPAY_HANDLE`: sua tag InfinitePay (quando criada).
   - `NEXT_PUBLIC_SITE_URL`: seu domínio Vercel (ex.: `https://gizzar.vercel.app`).
5. Clique em **"Deploy"**. Em cerca de 1 minuto seu e-commerce estará no ar com certificado SSL gratuito e alta velocidade global.
