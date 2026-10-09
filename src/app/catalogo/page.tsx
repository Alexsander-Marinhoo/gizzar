import type { Metadata } from "next";
import CatalogView from "@/components/product/CatalogView";
import { categories, getAllProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Bolsas",
  description: "Conheça todas as bolsas GIZZAR: totes, transversais, mini bags, clutches e mais. Parcele em até 6x ou pague no Pix.",
};

export default function CatalogPage() {
  return (
    <div className="container-page pt-10 sm:pt-16">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow">Coleção</p>
        <h1 className="heading-display mt-3 text-5xl sm:text-6xl">Todas as bolsas</h1>
        <p className="mt-4 text-taupe">Modelos pensados para o dia a dia, para o trabalho e para as ocasiões especiais.</p>
      </header>
      <CatalogView products={getAllProducts()} categories={categories} />
    </div>
  );
}
