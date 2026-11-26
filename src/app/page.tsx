import { TrustStrip } from "@/components/ui/Trust";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { products as defaultProducts } from "@/data/products";
import { siteConfig, whatsappLink } from "@/config/site";
import { DEFAULT_BANNER_CONFIG } from "@/lib/admin-store";
import { fetchSupabaseBanner, fetchSupabaseProducts } from "@/lib/supabase";
import HomePromoBanner from "@/components/home/HomePromoBanner";
import HomeCatalogSections from "@/components/home/HomeCatalogSections";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dbProducts, dbBanner] = await Promise.all([
    fetchSupabaseProducts(),
    fetchSupabaseBanner(),
  ]);

  const initialProducts = dbProducts ?? defaultProducts;
  const initialBanner = dbBanner ?? DEFAULT_BANNER_CONFIG;

  return (
    <>
      {/* H1 ACESSÍVEL PARA SEO */}
      <h1 className="sr-only">
        GIZZAR — Bolsas de luxo e acessórios com elegância atemporal
      </h1>

      {/* BANNER PROMOCIONAL DO BANCO DE DADOS SUPABASE */}
      <HomePromoBanner initialBanner={initialBanner} />

      {/* BARRA DE CONFIANÇA */}
      <div className="mt-4 sm:mt-5">
        <TrustStrip />
      </div>

      {/* VITRINE & EDITORIAL DIRETO DO BANCO DE DADOS SUPABASE */}
      <HomeCatalogSections initialProducts={initialProducts} />

      {/* MANIFESTO */}
      <section className="container-page mt-14 sm:mt-20 text-center">
        <p className="eyebrow">A essência {siteConfig.name}</p>
        <blockquote className="heading-display mx-auto mt-4 max-w-2xl text-2xl sm:text-4xl text-ink leading-snug">
          “Uma bolsa não é só um acessório. É a peça que{" "}
          <em className="italic text-gold-dark">completa</em> quem você é.”
        </blockquote>
      </section>

      {/* CTA WHATSAPP */}
      <section className="container-page mt-14 sm:mt-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-10 sm:px-12 sm:py-14 text-center">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <p className="eyebrow text-gold-light!">Atendimento personalizado</p>
          <h2 className="heading-display mx-auto mt-3 max-w-2xl text-3xl sm:text-4xl lg:text-5xl text-ivory">
            Ficou com dúvida? Fale com a gente.
          </h2>
          <p className="mx-auto mt-3.5 max-w-md text-sm sm:text-base text-ivory/70">
            Ajudamos você a escolher a bolsa ideal, com fotos extras, medidas e prazos.
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-6 bg-[#25D366] text-white hover:brightness-110"
          >
            <WhatsAppIcon size={20} /> Chamar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
