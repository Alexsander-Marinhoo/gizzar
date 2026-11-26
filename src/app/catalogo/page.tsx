import type { Metadata } from "next";
import CatalogView from "@/components/product/CatalogView";
import { categories, products as defaultProducts } from "@/data/products";
import { fetchSupabaseProducts } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bolsas",
  description:
    "Conheça todas as bolsas GIZZAR: totes, transversais, mini bags, clutches e mais. Parcele em até 6x ou pague no Pix.",
};

export default async function CatalogPage() {
  const dbProducts = await fetchSupabaseProducts();

  return (
    <div className="container-page pt-10 sm:pt-16">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow">Coleção</p>
        <h1 className="heading-display mt-3 text-5xl sm:text-6xl">
          Todas as bolsas
        </h1>
        <p className="mt-4 text-taupe">
          Modelos pensados para o dia a dia, para o trabalho e para as ocasiões
          especiais.
        </p>
      </header>
      <CatalogView
        products={dbProducts ?? defaultProducts}
        categories={categories}
      />
    </div>
  );
}
