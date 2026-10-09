import { siteConfig } from "@/config/site";
import { CardIcon, PixIcon, RefreshIcon, ShieldIcon, TruckIcon } from "@/components/ui/Icons";

const items = [
  { icon: TruckIcon, title: "Envio para todo o Brasil", text: `Frete grátis acima de R$ ${siteConfig.shipping.freeShippingThreshold}` },
  { icon: CardIcon, title: `Até ${siteConfig.payment.maxInstallments}x sem juros`, text: "Nos principais cartões de crédito" },
  { icon: PixIcon, title: "Pix instantâneo", text: "Aprovação imediata do pedido" },
  { icon: RefreshIcon, title: "Troca fácil", text: "Primeira troca em até 7 dias" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-stone/60 bg-sand/50">
      <div className="container-page grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory text-gold-dark">
              <Icon size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="mt-0.5 text-xs text-taupe">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SecureBadges() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-taupe">
      <span className="inline-flex items-center gap-1.5"><ShieldIcon size={16} className="text-success" /> Compra 100% segura</span>
      <span className="inline-flex items-center gap-1.5"><PixIcon size={16} /> Pix</span>
      <span className="inline-flex items-center gap-1.5"><CardIcon size={16} /> Cartão de crédito</span>
    </div>
  );
}
