import type { Metadata } from "next";
import ProductPageClient from "@/components/product/ProductPageClient";
import { products as defaultProducts, getProductBySlug } from "@/data/products";

export function generateStaticParams() {
  return defaultProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Bolsa GIZZAR" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/produto/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug) ?? null;

  return <ProductPageClient slug={slug} initialProduct={product} />;
}
