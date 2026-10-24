"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminProduct, deleteProduct } from "@/lib/admin-store";
import { formatPrice, installmentLabel } from "@/lib/format";
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

      {/* Grid de Produtos com Preço, Parcelamento e Badges idênticos ao anexo */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-stone/70 bg-white p-12 text-center">
          <p className="text-lg font-bold text-ink">Nenhuma bolsa encontrada</p>
          <p className="text-xs text-taupe mt-1.5">
            Tente outro termo ou cadastre uma nova peça no botão acima.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const installments = installmentLabel(product.price);
            const discount = product.compareAtPrice
              ? Math.round((1 - product.price / product.compareAtPrice) * 100)
              : null;

            return (
              <article
                key={product.id}
                className="rounded-2xl border border-stone/70 bg-white p-4 flex flex-col justify-between group hover:border-gold transition-all duration-300"
              >
                <div>
                  {/* Foto aspecto 3/4 */}
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-sand">
                    <Image
                      src={product.images[0] || "/brand/hero.jpg"}
                      alt={product.name}
                      fill
                      unoptimized={
                        product.images[0]?.startsWith("data:") ||
                        product.images[0]?.startsWith("blob:")
                      }
                      className="object-cover object-center group-hover:scale-105 transition duration-700 ease-out"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                      {product.isNew && (
                        <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink shadow-xs">
                          Novo
                        </span>
                      )}
                      {product.featured && (
                        <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-light shadow-xs">
                          Destaque
                        </span>
                      )}
                    </div>

                    {/* Pílula de estoque parecida com seletor de quantidade */}
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-full border border-stone/80 bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-xs">
                        {product.stock} un
                      </span>
                    </div>
                  </div>

                  {/* Informações de Produto com Preço e Parcelamento idênticos ao anexo */}
                  <div className="mt-3.5 px-0.5">
                    <h3 className="font-display text-lg sm:text-xl font-medium text-ink line-clamp-1 group-hover:text-gold-dark transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-taupe mt-1 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Variações de cor do produto cadastradas */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2.5">
                        {product.colors.map((c, i) => (
                          <span
                            key={i}
                            title={c.name}
                            className="h-3.5 w-3.5 rounded-full border border-stone/80 ring-1 ring-ink/20 shadow-2xs"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                        <span className="text-[10px] text-taupe font-medium ml-1">
                          {product.colors.length > 1
                            ? `${product.colors.length} cores`
                            : product.colors[0].name}
                        </span>
                      </div>
                    )}

                    {/* Preço idêntico ao Anexo 1 */}
                    <div className="mt-3 pt-3 border-t border-stone/40">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-xl sm:text-2xl font-bold tracking-tight text-ink font-sans">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <>
                            <span className="text-xs text-taupe line-through">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                            {discount && (
                              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold-dark">
                                -{discount}%
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Parcelamento idêntico ao Anexo 1 */}
                      {installments && (
                        <p className="mt-1 text-xs text-taupe leading-tight">
                          ou <span className="font-medium text-ink">{installments}</span>
                        </p>
                      )}
                      <p className="mt-0.5 text-[11px] text-taupe">
                        ou <span className="font-medium text-ink">à vista no Pix</span> com aprovação imediata
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ações inferiores com botões pílula */}
                <div className="mt-5 pt-3 border-t border-stone/40 flex items-center justify-between text-xs px-0.5">
                  <Link
                    href={`/produto/${product.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-taupe hover:text-ink transition flex items-center gap-1"
                  >
                    <span>Ver na loja</span>
                    <ExternalLinkIcon size={12} />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(product)}
                      className="btn-outline rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="p-1.5 text-taupe hover:text-danger rounded-full hover:bg-sand transition cursor-pointer"
                      title="Excluir bolsa"
                    >
                      <TrashIcon size={15} />
                    </button>
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
