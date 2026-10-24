"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminProduct, saveProduct } from "@/lib/admin-store";
import { CloseIcon } from "@/components/ui/Icons";

interface AdminProductModalProps {
  product?: AdminProduct | null;
  onClose: () => void;
  onSaved: () => void;
}

const AVAILABLE_PROJECT_IMAGES = [
  { url: "/products/tote-noir.jpg", label: "Tote Noir" },
  { url: "/products/crossbody-caramelo.jpg", label: "Crossbody Caramelo" },
  { url: "/products/mini-perola.jpg", label: "Mini Pérola" },
  { url: "/products/bucket-palha.jpg", label: "Bucket Palha" },
  { url: "/products/hobo-bordo.jpg", label: "Hobo Bordô" },
  { url: "/products/clutch-dourada.jpg", label: "Clutch Dourada" },
  { url: "/products/baguette-oliva.jpg", label: "Baguette Oliva" },
  { url: "/products/satchel-terracota.jpg", label: "Satchel Terracota" },
  { url: "/products/flap-croco-noir.jpg", label: "Flap Croco Noir" },
];

export default function AdminProductModal({
  product,
  onClose,
  onSaved,
}: AdminProductModalProps) {
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [price, setPrice] = useState(product?.price ? String(product.price) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice ? String(product.compareAtPrice) : ""
  );
  const [category, setCategory] = useState(product?.category || "bolsas");
  const [stock, setStock] = useState(product?.stock ? String(product.stock) : "10");
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription || ""
  );
  const [description, setDescription] = useState(product?.description || "");
  const [imageUrl, setImageUrl] = useState(
    product?.images[0] || "/products/tote-noir.jpg"
  );
  const [detailsText, setDetailsText] = useState(
    product?.details?.join("\n") ||
      "Material: couro sintético premium\nFerragens douradas antioxidantes\nForro interno em tecido acetinado\nDimensões: 28 x 20 x 10 cm"
  );
  const [weightKg, setWeightKg] = useState(
    product?.weightKg ? String(product.weightKg) : "0.6"
  );
  const [lengthCm, setLengthCm] = useState(
    product?.dimensionsCm?.length ? String(product.dimensionsCm.length) : "30"
  );
  const [widthCm, setWidthCm] = useState(
    product?.dimensionsCm?.width ? String(product.dimensionsCm.width) : "20"
  );
  const [heightCm, setHeightCm] = useState(
    product?.dimensionsCm?.height ? String(product.dimensionsCm.height) : "12"
  );
  const [featured, setFeatured] = useState(product?.featured ?? true);
  const [isNew, setIsNew] = useState(product?.isNew ?? true);

  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Por favor, informe o nome da peça.");
      return;
    }
    const numPrice = parseFloat(price.replace(",", "."));
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Por favor, informe um preço válido.");
      return;
    }

    const detailsArray = detailsText
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    const newProduct: AdminProduct = {
      id: product?.id || `gz-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      slug: slug.trim() || `bolsa-${Date.now()}`,
      category,
      price: numPrice,
      compareAtPrice: compareAtPrice
        ? parseFloat(compareAtPrice.replace(",", "."))
        : undefined,
      shortDescription:
        shortDescription.trim() || `${name.trim()} em acabamento refinado com ferragens exclusivas.`,
      description:
        description.trim() ||
        `${name.trim()} traduz a elegância atemporal da mulher moderna.`,
      details: detailsArray.length > 0 ? detailsArray : ["Material premium GIZZAR"],
      images: [imageUrl, ...(product?.images?.slice(1) || [])],
      weightKg: parseFloat(weightKg) || 0.5,
      dimensionsCm: {
        length: parseFloat(lengthCm) || 28,
        width: parseFloat(widthCm) || 20,
        height: parseFloat(heightCm) || 10,
      },
      stock: parseInt(stock, 10) || 1,
      featured,
      isNew,
    };

    saveProduct(newProduct);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-ivory p-6 sm:p-10 shadow-2xl border border-stone/80 z-10 animate-fade-up my-auto">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between pb-5 border-b border-stone/50">
          <div>
            <p className="eyebrow">Atelier GIZZAR</p>
            <h2 className="heading-display text-2xl sm:text-3xl font-medium text-ink mt-1">
              {isEditing ? "Editar Peça" : "Nova Criação"}
            </h2>
            <div className="gold-line mt-2" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-taupe hover:bg-sand transition cursor-pointer"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs font-semibold text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Nome e Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="prod-name">
                Nome da Bolsa *
              </label>
              <input
                id="prod-name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Bolsa Baguete Milano"
                className="input text-xs font-semibold"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="prod-slug">
                Slug (URL) *
              </label>
              <input
                id="prod-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ex: bolsa-baguete-milano"
                className="input text-xs font-mono"
                required
              />
            </div>
          </div>

          {/* Preço, Comparação e Estoque */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label" htmlFor="prod-price">
                Preço (R$) *
              </label>
              <input
                id="prod-price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="389.90"
                className="input text-xs font-bold"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="prod-compare">
                Preço Riscado (R$)
              </label>
              <input
                id="prod-compare"
                type="text"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="449.90"
                className="input text-xs"
              />
            </div>
            <div>
              <label className="label" htmlFor="prod-stock">
                Estoque (Unidades) *
              </label>
              <input
                id="prod-stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="input text-xs font-semibold"
                required
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="label" htmlFor="prod-cat">
              Categoria
            </label>
            <select
              id="prod-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input text-xs font-semibold cursor-pointer"
            >
              <option value="bolsas">Bolsas</option>
              <option value="acessorios">Acessórios</option>
              <option value="clutches">Clutches</option>
            </select>
          </div>

          {/* Imagem do Produto */}
          <div>
            <label className="label">
              Fotografia de Capa
            </label>
            <div className="mt-1 flex items-center gap-3">
              <div className="relative h-16 w-14 rounded-xl overflow-hidden bg-sand border border-stone shrink-0">
                <Image
                  src={imageUrl || "/products/tote-noir.jpg"}
                  alt="Prévia"
                  fill
                  className="object-cover"
                />
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/products/tote-noir.jpg"
                className="input text-xs font-mono flex-1"
                required
              />
            </div>

            {/* Presets das bolsas da Gizzar */}
            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-taupe mb-2">
                Ou selecione foto do acervo:
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {AVAILABLE_PROJECT_IMAGES.map((item) => (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => setImageUrl(item.url)}
                    className={`relative h-14 w-12 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                      imageUrl === item.url
                        ? "border-gold ring-2 ring-gold/40 scale-105"
                        : "border-stone/60 opacity-60 hover:opacity-100"
                    }`}
                    title={item.label}
                  >
                    <Image src={item.url} alt={item.label} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Descrição Curta */}
          <div>
            <label className="label" htmlFor="prod-short-desc">
              Frase de Destaque
            </label>
            <input
              id="prod-short-desc"
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ex: Tote estruturada em couro sintético premium com fecho dourado."
              className="input text-xs"
            />
          </div>

          {/* Descrição Detalhada */}
          <div>
            <label className="label" htmlFor="prod-desc">
              História & Detalhes da Peça
            </label>
            <textarea
              id="prod-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a inspiração, materiais e ocasiões de uso..."
              className="input text-xs resize-none"
            />
          </div>

          {/* Especificações e Detalhes */}
          <div>
            <label className="label" htmlFor="prod-details">
              Especificações Técnicas (uma por linha)
            </label>
            <textarea
              id="prod-details"
              rows={3}
              value={detailsText}
              onChange={(e) => setDetailsText(e.target.value)}
              className="input text-xs font-mono resize-none"
            />
          </div>

          {/* Peso e Dimensões para Frete */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-sand/40 border border-stone/60">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-taupe block mb-1">
                Peso (kg)
              </label>
              <input
                type="text"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="input text-xs py-2 bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-taupe block mb-1">
                Compr. (cm)
              </label>
              <input
                type="text"
                value={lengthCm}
                onChange={(e) => setLengthCm(e.target.value)}
                className="input text-xs py-2 bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-taupe block mb-1">
                Largura (cm)
              </label>
              <input
                type="text"
                value={widthCm}
                onChange={(e) => setWidthCm(e.target.value)}
                className="input text-xs py-2 bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-taupe block mb-1">
                Altura (cm)
              </label>
              <input
                type="text"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="input text-xs py-2 bg-white"
              />
            </div>
          </div>

          {/* Flags de Exibição */}
          <div className="flex flex-wrap items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-stone text-ink accent-[#161412]"
              />
              <span className="text-xs font-semibold text-ink">
                Destacar na Vitrine
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="h-4 w-4 rounded border-stone text-ink accent-[#161412]"
              />
              <span className="text-xs font-semibold text-ink">
                Marcar como Lançamento (&quot;Novo&quot;)
              </span>
            </label>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-5 border-t border-stone/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline rounded-full py-3 px-6 text-sm font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary rounded-full py-3 px-7 text-sm font-semibold cursor-pointer shadow-xs"
            >
              {isEditing ? "Salvar alterações" : "Publicar bolsa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
