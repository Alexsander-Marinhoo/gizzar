import Link from "next/link";
import Logo from "./Logo";
import { siteConfig, whatsappLink } from "@/config/site";
import { CardIcon, InstagramIcon, MailIcon, PixIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { PaymentBadgesGroup } from "@/components/ui/PaymentBadges";

export default function Footer() {
  return (
    <footer className="mt-14 sm:mt-20 bg-ink text-ivory/70">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo light className="items-start!" />
          <p className="mt-6 text-sm leading-relaxed">{siteConfig.tagline}. Peças pensadas para acompanhar você em todos os momentos.</p>
        </div>

        <div>
          <h3 className="eyebrow text-gold-light!">Loja</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="transition hover:text-ivory" href="/catalogo">Todas as bolsas</Link></li>
            <li><Link className="transition hover:text-ivory" href="/carrinho">Carrinho</Link></li>
            <li><Link className="transition hover:text-ivory" href="/sobre">Sobre a GIZZAR</Link></li>
            <li><Link className="transition hover:text-ivory" href="/politica-de-privacidade">Privacidade & Termos</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-gold-light!">Atendimento</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a className="inline-flex items-center gap-2 transition hover:text-ivory" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
            </li>
            <li>
              <a className="inline-flex items-center gap-2 transition hover:text-ivory" href={`mailto:${siteConfig.contact.email}`}>
                <MailIcon size={16} /> {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <a className="inline-flex items-center gap-2 transition hover:text-ivory" href={siteConfig.contact.instagram} target="_blank" rel="noopener noreferrer">
                <InstagramIcon size={16} /> {siteConfig.contact.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-gold-light!">Pagamento</h3>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ivory/15 px-3 py-1.5"><PixIcon size={14} /> Pix</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ivory/15 px-3 py-1.5"><CardIcon size={14} /> Cartão em até {siteConfig.payment.maxInstallments}x</span>
          </div>

          <div className="mt-3.5">
            <p className="mb-2 text-[11px] uppercase tracking-wider text-ivory/40">Bandeiras aceitas</p>
            <PaymentBadgesGroup />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-ivory/50">Pagamento processado com segurança pela InfinitePay. Envio pelos Correios para todo o Brasil.</p>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-page py-6 text-center text-xs text-ivory/40">
          <p>© {siteConfig.name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
