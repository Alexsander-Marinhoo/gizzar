"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { Category, Product } from "@/data/products";

type Sort = "featured" | "price-asc" | "price-desc" | "new";

export default function CatalogView({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("featured");

  const list = useMemo(() => {
    const filtered = category === "all" ? products : products.filter((p) => p.category === category);
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "new") sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    if (sort === "featured") sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return sorted;
  }, [products, category, sort]);

  return (
    <div>
      <div className="sticky top-[68px] z-20 -mx-5 mb-8 flex items-center justify-between gap-4 border-b border-stone/60 bg-ivory/90 px-5 py-3 backdrop-blur-xl sm:top-20 sm:mx-0 sm:rounded-full sm:border sm:px-3">
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {[{ id: "all", name: "Todas" }, ...categories].map((c) => (
            <button
              key={c.id}
              id={`filter-${c.id}`}
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                category === c.id ? "bg-ink text-ivory" : "text-taupe hover:bg-sand hover:text-ink"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-xs text-taupe sm:inline">{list.length} produtos</span>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="cursor-pointer rounded-full border border-stone bg-white px-4 py-2 text-xs font-medium text-ink outline-none focus:border-gold"
            aria-label="Ordenar produtos"
          >
            <option value="featured">Destaques</option>
            <option value="new">Novidades</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((p, i) => (
          <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <ProductCard product={p} priority={i < 4} />
          </div>
        ))}
      </div>
    </div>
  );
}
