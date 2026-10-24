"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminProduct, deleteProduct } from "@/lib/admin-store";
import PriceTag from "@/components/product/PriceTag";
import { SearchIcon, EditIcon, TrashIcon, ExternalLinkIcon } from "./AdminIcons";
import { PlusIcon } from "@/components/ui/Icons";
import AdminProductModal from "./AdminProductModal";

interface AdminProductsViewProps {
  products: AdminProduct[];
  onProductsUpdated: () => void;
  openCreateOnMount?: boolean;
}

export default function AdminProductsView({
  products,
  onProductsUpdated,
}: AdminProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      categoryFilter === "all" ? true : p.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  const handleDelete = (product: AdminProduct) => {
    if (
      confirm(
        `Tem certeza que deseja excluir "${product.name}"? Esta peça será removida do catálogo.`
      )
    ) {
      deleteProduct(product.id);
      onProductsUpdated();
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone/50">
        <div>
          <p className="eyebrow">Catálogo GIZZAR</p>
          <h2 className="heading-display mt-1 text-3xl font-medium text-ink">
            Gestão de Bolsas
          </h2>
          <p className="text-sm text-taupe mt-1">
            Cadastre novas criações, edite preços, parcelamentos e controle o estoque.
          </p>
        </div>

        {/* Botão idêntico ao 'Comprar agora' */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn-primary rounded-full px-6 py-3.5 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <PlusIcon size={16} />
          <span>Nova bolsa</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-taupe/60">
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou modelo..."
            className="input pl-11 text-sm py-3"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-taupe shrink-0">
            Categoria:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-full border border-stone bg-white px-4 py-2.5 text-xs font-semibold text-ink cursor-pointer focus:border-gold outline-none"
          >
            <option value="all">Todas as peças</option>
            <option value="bolsas">Bolsas</option>
            <option value="acessorios">Acessórios</option>
            <option value="clutches">Clutches</option>
          </select>
        </div>
      </div>

      {/* Grid de Produtos Idêntico ao /catalogo com cards limpos e elegantes */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-stone/70 bg-white p-12 text-center">
          <p className="text-lg font-bold text-ink">Nenhuma bolsa encontrada</p>
          <p className="text-xs text-taupe mt-1.5">
            Tente outro termo ou cadastre uma nova peça no botão acima.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {filtered.map((product) => {
            const discount = product.compareAtPrice
              ? Math.round((1 - product.price / product.compareAtPrice) * 100)
              : null;

            return (
              <article
                key={product.id}
                className="group relative flex flex-col"
              >
                {/* Imagem Proporção 3:4 com cantos arredondados idênticos ao catálogo */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-sand shadow-2xs">
                  {/* Imagem Principal */}
                  <Image
                    src={product.images[0] || "/brand/hero.jpg"}
                    alt={product.name}
                    fill
                    unoptimized={
                      product.images[0]?.startsWith("data:") ||
                      product.images[0]?.startsWith("blob:")
                    }
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className={`object-cover object-center transition duration-700 ease-out group-hover:scale-105 ${
                      product.images[1] ? "group-hover:opacity-0" : ""
                    }`}
                  />

                  {/* Segunda Imagem no Hover (se houver) */}
                  {product.images[1] && (
                    <Image
                      src={product.images[1]}
                      alt=""
                      fill
                      unoptimized={
                        product.images[1]?.startsWith("data:") ||
                        product.images[1]?.startsWith("blob:")
                      }
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover opacity-0 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                    />
                  )}

                  {/* Badges empilhadas no canto superior esquerdo (idêntico ao catálogo) */}
                  <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 flex flex-col gap-1 sm:gap-1.5 z-10 pointer-events-none">
                    {product.isNew && (
                      <span className="rounded-full bg-ivory/95 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-ink shadow-2xs">
                        NOVO
                      </span>
                    )}
                    {discount && (
                      <span className="rounded-full bg-ink px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-gold-light shadow-2xs">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Pílula discreta de Estoque no canto superior direito */}
                  <div className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 z-10">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-xs ${
                        product.stock > 0
                          ? "bg-ivory/95 text-ink"
                          : "bg-danger/90 text-white"
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} un` : "Esgotado"}
                    </span>
                  </div>

                  {/* Barra de Ações Rápidas no Hover sobre a foto */}
                  <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3 sm:bottom-3 flex items-center gap-2 transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 z-20">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(product)}
                      className="btn-primary rounded-full px-4 py-2 text-xs font-semibold shadow-md flex-1 text-center cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <EditIcon size={13} />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-md text-taupe hover:text-danger hover:bg-white shadow-md transition cursor-pointer flex items-center justify-center shrink-0"
                      title="Excluir bolsa"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>

                {/* Informações da Peça com Tipografia Idêntica ao Catálogo */}
                <div className="mt-2.5 sm:mt-3.5 flex flex-1 flex-col px-0.5">
                  {/* Título com fonte Serif Display */}
                  <h3
                    onClick={() => handleOpenEdit(product)}
                    className="font-display text-[15px] sm:text-lg text-ink font-normal leading-snug tracking-normal transition hover:text-gold-dark line-clamp-1 cursor-pointer"
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  {/* Preço e Parcelamento usando PriceTag oficial */}
                  <div className="mt-1">
                    <PriceTag
                      price={product.price}
                      compareAtPrice={product.compareAtPrice}
                      size="sm"
                    />
                  </div>

                  {/* Rodapé com cores e atalhos sutis */}
                  <div className="mt-2.5 pt-2 border-t border-stone/30 flex items-center justify-between text-xs">
                    {/* Swatches de cores */}
                    {product.colors && product.colors.length > 0 ? (
                      <div className="flex items-center gap-1">
                        {product.colors.map((c, i) => (
                          <span
                            key={i}
                            title={c.name}
                            className="h-3 w-3 rounded-full border border-stone/80 ring-1 ring-ink/20 shadow-2xs"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                        <span className="text-[10px] text-taupe font-medium ml-1">
                          {product.colors.length > 1
                            ? `${product.colors.length} cores`
                            : product.colors[0].name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-taupe uppercase tracking-wider font-medium">
                        {product.category}
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(product)}
                        className="text-[11px] font-semibold text-ink hover:text-gold-dark transition cursor-pointer"
                      >
                        Editar
                      </button>
                      <span className="text-stone/60">·</span>
                      <Link
                        href={`/produto/${product.slug}`}
                        target="_blank"
                        className="text-[11px] text-taupe hover:text-ink transition flex items-center gap-1"
                        title="Ver na loja pública"
                      >
                        <span>Ver</span>
                        <ExternalLinkIcon size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <AdminProductModal
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSaved={() => {
            onProductsUpdated();
          }}
        />
      )}
    </div>
  );
}
