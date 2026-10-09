import Image from "next/image";
import Link from "next/link";
import ProductCarousel from "@/components/product/ProductCarousel";
import { TrustStrip } from "@/components/ui/Trust";
import { ArrowRightIcon, SparkleIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { getAllProducts, getFeaturedProducts } from "@/data/products";
import { siteConfig, whatsappLink } from "@/config/site";

export default function HomePage() {
  const allBags = getAllProducts();
  const newest = allBags.filter((p) => p.isNew);
  const spotlight = newest[0] ?? allBags[0];

  return (
    <>
      {/* H1 ACESSÍVEL PARA SEO */}
      <h1 className="sr-only">GIZZAR — Bolsas de luxo e acessórios com elegância atemporal</h1>

      {/* BANNER PROMOCIONAL COMPACTO — IMAGEM DIRETA COM PUBLICIDADE FRETE GRÁTIS */}
      <section className="container-page pt-3 sm:pt-4">
        <Link
          href="/catalogo"
          aria-label="Campanha Promocional — Frete Grátis a partir de R$ 499,90"
          className="group block relative overflow-hidden rounded-2xl sm:rounded-3xl bg-sand shadow-xs transition duration-300 hover:shadow-md aspect-[16/7] sm:aspect-[16/6] lg:aspect-[16/5.2] max-h-[380px] w-full"
        >
          <Image
            src="/brand/sem titulo.jpg"
            alt="GIZZAR — Frete Grátis a partir de R$ 499,90"
            fill
            priority
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
          />
        </Link>
      </section>


      {/* BARRA DE CONFIANÇA */}
      <div className="mt-4 sm:mt-5">
        <TrustStrip />
      </div>

      {/* DESTAQUES DA VITRINE COM CARROSSEL SWIPER — APARECE LOGO DE CARA NO DESKTOP */}
      <section className="container-page mt-6 sm:mt-8 overflow-hidden">

        <div className="mb-6 sm:mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Mais desejadas</p>
            <h2 className="heading-display mt-2 text-3xl sm:text-4xl lg:text-5xl">Destaques da vitrine</h2>
          </div>
          <Link href="/catalogo" className="group hidden items-center gap-2 text-sm font-semibold text-ink sm:inline-flex mr-24">
            Ver todas <ArrowRightIcon size={16} className="transition group-hover:translate-x-1" />
          </Link>
        </div>

        <ProductCarousel products={allBags} />

        <div className="mt-8 text-center sm:hidden">
          <Link href="/catalogo" className="btn-outline">Ver todas as bolsas</Link>
        </div>
      </section>

      {/* EDITORIAL */}
      {spotlight && (
        <section className="container-page mt-14 sm:mt-20">
          <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-sand/70 md:grid-cols-2 md:gap-0">
            <div className="relative aspect-[4/5] md:aspect-auto md:h-full md:min-h-[480px]">
              <Image
                src={spotlight.images[2]}
                alt={spotlight.name}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-bottom"
                style={{ objectPosition: "center bottom" }}
              />
            </div>
            <div className="px-6 pb-10 pt-4 md:px-12 md:py-12 lg:px-16">
              <p className="eyebrow flex items-center gap-2"><SparkleIcon size={14} /> Acabou de chegar</p>
              <h2 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-5xl">{spotlight.name}</h2>
              <div className="gold-line mt-4" />
              <p className="mt-4 max-w-md leading-relaxed text-sm sm:text-base text-taupe">{spotlight.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href={`/produto/${spotlight.slug}`} className="btn-primary">
                  Descobrir <ArrowRightIcon size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MANIFESTO */}
      <section className="container-page mt-14 sm:mt-20 text-center">
        <p className="eyebrow">A essência {siteConfig.name}</p>
        <blockquote className="heading-display mx-auto mt-4 max-w-2xl text-2xl sm:text-4xl text-ink leading-snug">
          “Uma bolsa não é só um acessório. É a peça que <em className="italic text-gold-dark">completa</em> quem você é.”
        </blockquote>
      </section>

      {/* CTA WHATSAPP */}
      <section className="container-page mt-14 sm:mt-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-10 sm:px-12 sm:py-14 text-center">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <p className="eyebrow text-gold-light!">Atendimento personalizado</p>
          <h2 className="heading-display mx-auto mt-3 max-w-2xl text-3xl sm:text-4xl lg:text-5xl text-ivory">Ficou com dúvida? Fale com a gente.</h2>
          <p className="mx-auto mt-3.5 max-w-md text-sm sm:text-base text-ivory/70">Ajudamos você a escolher a bolsa ideal, com fotos extras, medidas e prazos.</p>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn mt-6 bg-[#25D366] text-white hover:brightness-110">
            <WhatsAppIcon size={20} /> Chamar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
