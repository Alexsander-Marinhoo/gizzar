import type { Metadata } from "next";
import ProductPageClient from "@/components/product/ProductPageClient";
import { getProductBySlug } from "@/data/products";
import { fetchSupabaseProductBySlug } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product =
    (await fetchSupabaseProductBySlug(slug)) ?? getProductBySlug(slug);
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
  const product =
    (await fetchSupabaseProductBySlug(slug)) ?? getProductBySlug(slug) ?? null;

  return <ProductPageClient slug={slug} initialProduct={product} />;
}
