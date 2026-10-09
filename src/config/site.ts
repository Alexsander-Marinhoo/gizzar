/**
 * ============================================================
 *  CONFIGURAÇÃO GERAL DA LOJA GIZZAR
 *  Edite este arquivo para trocar contatos, regras de frete,
 *  parcelamento e textos institucionais.
 * ============================================================
 */

export const siteConfig = {
  name: "GIZZAR",
  tagline: "Bolsas e acessórios com elegância atemporal",
  description:
    "GIZZAR — bolsas femininas com design atemporal, acabamento premium e preço justo. Compre online com Pix ou cartão em até 6x.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gizzar.vercel.app",

  contact: {
    /** Número do WhatsApp com DDI + DDD, só dígitos. Ex.: 5511999999999 */
    whatsapp: "5511999999999",
    whatsappMessage: "Olá! Vim pelo site da GIZZAR e gostaria de mais informações.",
    email: "contato@gizzar.com.br",
    instagram: "https://instagram.com/gizzar",
    instagramHandle: "@gizzar",
    city: "São Paulo — SP",
  },

  payment: {
    /** Parcelas máximas exibidas na vitrine (configure igual à sua conta InfinitePay). */
    maxInstallments: 6,
    /** Valor mínimo de cada parcela (R$). */
    minInstallmentValue: 50,
    /** true = exibe "sem juros". */
    interestFree: true,
  },

  shipping: {
    /** CEP de origem (de onde as bolsas são enviadas). */
    originCep: "01310-100",
    /** Frete grátis a partir deste valor (R$). Use 0 para desativar. */
    freeShippingThreshold: 499,
    /** Dias de manuseio/postagem somados ao prazo dos Correios. */
    handlingDays: 1,
  },

  announcement: [
    "Frete grátis acima de R$ 499",
    "Parcele em até 6x sem juros",
    "Pix com aprovação imediata",
  ],
} as const;

export function whatsappLink(message: string = siteConfig.contact.whatsappMessage) {
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
