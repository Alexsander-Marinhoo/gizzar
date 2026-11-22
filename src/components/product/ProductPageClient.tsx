"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductGallery from "@/components/product/ProductGallery";
import PriceTag from "@/components/product/PriceTag";
import PurchasePanel from "@/components/product/PurchasePanel";
import ProductCarousel from "@/components/product/ProductCarousel";
import { SecureBadges } from "@/components/ui/Trust";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { getRelatedProducts, type Product } from "@/data/products";
import { whatsappLink } from "@/config/site";
import { getStoredProducts, syncProductsFromSupabase } from "@/lib/admin-store";
import { fetchSupabaseProductBySlug } from "@/lib/supabase";

export default function ProductPageClient({
  slug,
  initialProduct,
}: {
  slug: string;
  initialProduct: Product | null;
}) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [related, setRelated] = useState<Product[]>(
    initialProduct ? getRelatedProducts(initialProduct, 8) : []
  );
  const [loading, setLoading] = useState(!initialProduct);

  useEffect(() => {
    const updateFromStore = (list: Product[]) => {
      const found = list.find((p) => p.slug === slug);
      if (found) {
        setProduct(found);
        setRelated(getRelatedProducts(found, 8));
        setLoading(false);
        return true;
      }
      return false;
    };

    const localList = getStoredProducts();
    const foundLocal = updateFromStore(localList);

    void syncProductsFromSupabase().then(async (remoteList) => {
      if (remoteList && updateFromStore(remoteList)) return;
      if (!foundLocal && !initialProduct) {
        const direct = await fetchSupabaseProductBySlug(slug);
        if (direct) {
          setProduct(direct);
          setRelated(getRelatedProducts(direct, 8));
        }
        setLoading(false);
      }
    });

    const handleUpdate = () => updateFromStore(getStoredProducts());
    window.addEventListener("gizzar_products_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("gizzar_products_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [slug, initialProduct]);

  if (loading) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-taupe">
          Carregando detalhes da peça...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <p className="eyebrow">Catálogo GIZZAR</p>
        <h1 className="heading-display mt-3 text-4xl sm:text-5xl">
          Peça não encontrada
        </h1>
        <p className="mt-4 text-taupe">
          Esta bolsa pode ter sido removida ou o endereço digitado não existe.
        </p>
        <Link href="/catalogo" className="btn-primary mt-8">
          Ver todas as bolsas
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page pb-32 sm:pb-20 pt-6 sm:pt-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-taupe">
        <Link href="/" className="hover:text-ink">
          Início
        </Link>
        <span className="mx-2">/</span>
        <Link href="/catalogo" className="hover:text-ink">
          Bolsas
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="animate-fade-in">
          {product.isNew && <p className="eyebrow mb-3">Novidade</p>}
          <h1 className="heading-display text-4xl sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-taupe">{product.shortDescription}</p>

          <div className="mt-6 border-y border-stone/60 py-6">
            <PriceTag
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              size="lg"
            />
            <p className="mt-2 text-sm text-taupe">
              ou <span className="font-medium text-ink">à vista no Pix</span> com
              aprovação imediata
            </p>
          </div>

          <div className="mt-8">
            <PurchasePanel product={product} />
          </div>

          <div className="mt-6">
            <SecureBadges />
          </div>

          <div className="mt-10 space-y-8">
            {product.description && (
              <section>
                <h2 className="eyebrow">Descrição</h2>
                <p className="mt-3 leading-relaxed text-ink/80">
                  {product.description}
                </p>
              </section>
            )}
            {product.details && product.details.length > 0 && (
              <section>
                <h2 className="eyebrow">Detalhes</h2>
                <ul className="mt-3 space-y-2">
                  {product.details.map((d) => (
                    <li key={d} className="flex gap-3 text-sm text-ink/80">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {d}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <a
              href={whatsappLink(
                `Olá! Tenho interesse na ${product.name}. Pode me ajudar?`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-stone/70 bg-white/60 p-5 transition hover:border-[#25D366] mb-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                <WhatsAppIcon size={22} />
              </span>
              <span>
                <span className="block text-sm font-semibold">
                  Dúvidas sobre este modelo?
                </span>
                <span className="text-xs text-taupe">
                  Peça fotos extras e medidas pelo WhatsApp
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 sm:mt-24 overflow-hidden">
          <div className="mb-6 sm:mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Sugestões para você</p>
              <h2 className="heading-display mt-2 text-3xl sm:text-4xl">
                Você também vai amar
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="group hidden items-center gap-2 text-sm font-semibold text-ink sm:inline-flex mr-24"
            >
              Ver todas{" "}
              <ArrowRightIcon
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>

          <ProductCarousel products={related} />

          <div className="mt-8 text-center sm:hidden">
            <Link href="/catalogo" className="btn-outline">
              Ver todas as bolsas
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
