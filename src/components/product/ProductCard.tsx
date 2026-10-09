import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import PriceTag from "./PriceTag";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [cover, hover] = product.images;
  const soldOut = product.stock <= 0;

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/produto/${product.slug}`}
        id={`product-card-${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl bg-sand"
      >
        <Image
          src={cover}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={`object-cover transition duration-700 ease-out group-hover:scale-105 ${hover ? "group-hover:opacity-0" : ""}`}
        />
        {hover && (
          <Image
            src={hover}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 flex flex-col gap-1 sm:gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-ivory/95 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-ink shadow-xs">
              Novo
            </span>
          )}
          {product.compareAtPrice && (
            <span className="rounded-full bg-ink px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-gold-light shadow-xs">
              -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
            </span>
          )}
        </div>

        {!soldOut && (
          <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <AddToCartButton productId={product.id} variant="icon" id={`quick-add-${product.slug}`} />
          </div>
        )}
        {soldOut && (
          <span className="absolute inset-x-2.5 sm:inset-x-3 bottom-2.5 sm:bottom-3 rounded-full bg-ivory/90 py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest shadow-xs">
            Esgotado
          </span>
        )}
      </Link>

      <div className="mt-2.5 sm:mt-3.5 flex flex-1 flex-col px-0.5">
        <Link
          href={`/produto/${product.slug}`}
          className="font-display text-[15px] sm:text-xl leading-snug text-ink transition hover:text-gold-dark line-clamp-1"
        >
          {product.name}
        </Link>
        <div className="mt-1 sm:mt-1.5">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
        </div>
      </div>
    </article>
  );
}
