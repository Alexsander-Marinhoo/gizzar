import Link from "next/link";
import { ArrowRightIcon, BagIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { siteConfig, whatsappLink } from "@/config/site";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-gold-dark shadow-inner">
        <BagIcon size={36} />
      </span>

      <p className="eyebrow mt-6">Erro 404</p>
      <h1 className="heading-display mt-3 text-4xl sm:text-6xl text-ink">
        Página não encontrada
      </h1>

      <p className="mt-4 max-w-md text-base text-taupe leading-relaxed">
        O modelo ou a página que você está procurando pode ter mudado de endereço ou não está mais disponível no momento.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Ir para o Início <ArrowRightIcon size={16} />
        </Link>
        <Link href="/catalogo" className="btn-outline">
          Ver todas as bolsas
        </Link>
        <a
          href={whatsappLink("Olá! Estava navegando no site da GIZZAR e não encontrei o que procurava. Pode me ajudar?")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-white"
        >
          <WhatsAppIcon size={18} /> Ajuda no WhatsApp
        </a>
      </div>
    </div>
  );
}
