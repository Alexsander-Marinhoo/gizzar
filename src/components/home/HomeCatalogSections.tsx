"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCarousel from "@/components/product/ProductCarousel";
import { ArrowRightIcon, SparkleIcon } from "@/components/ui/Icons";
import type { Product } from "@/data/products";
import { getStoredProducts, syncProductsFromSupabase } from "@/lib/admin-store";

export default function HomeCatalogSections({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [allBags, setAllBags] = useState<Product[]>(initialProducts);

  useEffect(() => {
    // Prioriza os dados vindos do Supabase no servidor e atualiza em tempo real
    if (initialProducts && initialProducts.length > 0) {
      try {
        window.localStorage.setItem(
          "gizzar_admin_products_v2",
          JSON.stringify(initialProducts)
        );
      } catch {
        // ignore
      }
    }
    void syncProductsFromSupabase().then((remote) => {
      if (remote) setAllBags(remote);
    });

    const handleUpdate = () => setAllBags(getStoredProducts());
    window.addEventListener("gizzar_products_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("gizzar_products_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const newest = allBags.filter((p) => p.isNew);
  const spotlight = newest[0] ?? allBags[0];
  const spotlightImage =
    spotlight?.images?.[2] ||
    spotlight?.images?.[1] ||
    spotlight?.images?.[0] ||
    "/brand/hero.jpg";

  return (
    <>
      {/* DESTAQUES DA VITRINE COM CARROSSEL SWIPER */}
      <section className="container-page mt-6 sm:mt-8 overflow-hidden">
        <div className="mb-6 sm:mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Mais desejadas</p>
            <h2 className="heading-display mt-2 text-3xl sm:text-4xl lg:text-5xl">
              Destaques da vitrine
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

        <ProductCarousel products={allBags} />

        <div className="mt-8 text-center sm:hidden">
          <Link href="/catalogo" className="btn-outline">
            Ver todas as bolsas
          </Link>
        </div>
      </section>

      {/* EDITORIAL */}
      {spotlight && (
        <section className="container-page mt-14 sm:mt-20">
          <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-sand/70 md:grid-cols-2 md:gap-0">
            <div className="relative aspect-[4/5] md:aspect-auto md:h-full md:min-h-[480px]">
              <Image
                src={spotlightImage}
                alt={spotlight.name}
                fill
                unoptimized={
                  spotlightImage.startsWith("data:") ||
                  spotlightImage.startsWith("blob:")
                }
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-bottom"
                style={{ objectPosition: "center bottom" }}
              />
            </div>
            <div className="px-6 pb-10 pt-4 md:px-12 md:py-12 lg:px-16">
              <p className="eyebrow flex items-center gap-2">
                <SparkleIcon size={14} /> Acabou de chegar
              </p>
              <h2 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
                {spotlight.name}
              </h2>
              <div className="gold-line mt-4" />
              <p className="mt-4 max-w-md leading-relaxed text-sm sm:text-base text-taupe">
                {spotlight.description || spotlight.shortDescription}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href={`/produto/${spotlight.slug}`} className="btn-primary">
                  Descobrir <ArrowRightIcon size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
