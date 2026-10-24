"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminProduct, saveProduct } from "@/lib/admin-store";
import { formatPrice, installmentLabel } from "@/lib/format";
import {
  CloseIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  BagIcon,
  SparkleIcon,
} from "@/components/ui/Icons";
import { EditIcon } from "./AdminIcons";

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

  // Estados dos campos editáveis diretamente na tela do produto
  const [name, setName] = useState(product?.name || "Bolsa Baguete Milano");
  const [slug, setSlug] = useState(product?.slug || "");
  const [price, setPrice] = useState<number>(product?.price || 389.9);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(
    product?.compareAtPrice || 449.9
  );
  const [category, setCategory] = useState(product?.category || "bolsas");
  const [stock, setStock] = useState<number>(product?.stock ?? 12);
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription ||
      "Bolsa tiracolo em couro estruturado com acabamento refinado e fecho dourado."
  );
  const [description, setDescription] = useState(
    product?.description ||
      "A Baguete Milano é a peça que combina praticidade diária e sofisticação atemporal. Espaçosa na medida certa, conta com forro em tecido acetinado e ferragens que não oxidam."
  );
  const [imageUrl, setImageUrl] = useState(
    product?.images[0] || "/products/tote-noir.jpg"
  );
  const [colorName, setColorName] = useState(
    product?.colors?.[0]?.name || "Preto"
  );
  const [colorHex, setColorHex] = useState(
    product?.colors?.[0]?.hex || "#161412"
  );

  const [details, setDetails] = useState<string[]>(
    product?.details || [
      "Material: couro sintético premium texturizado",
      "Ferragens com banho dourado antioxidante",
      "Forro interno acetinado com bolso de zíper",
      "Dimensões: 26 x 15 x 7 cm",
      "Alça de ombro confortável",
    ]
  );

  const [isNew, setIsNew] = useState(product?.isNew ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? true);

  const [showImageSelector, setShowImageSelector] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Calcula parcelas em tempo real
  const installments = installmentLabel(price);
  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round((1 - price / compareAtPrice) * 100)
      : null;

  // Atualização de detalhes
  const handleDetailChange = (index: number, val: string) => {
    const updated = [...details];
    updated[index] = val;
    setDetails(updated);
  };

  const handleRemoveDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleAddDetail = () => {
    setDetails([...details, "Novo detalhe da peça"]);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Por favor, digite o nome da bolsa.");
      return;
    }
    if (!price || price <= 0) {
      setError("Por favor, defina um preço de venda válido.");
      return;
    }

    const generatedSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newProduct: AdminProduct = {
      id: product?.id || `gz-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      slug: generatedSlug,
      category,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      details: details.filter((d) => d.trim().length > 0),
      images: [imageUrl],
      colors: [{ name: colorName, hex: colorHex }],
      weightKg: product?.weightKg || 0.6,
      dimensionsCm: product?.dimensionsCm || {
        length: 28,
        width: 20,
        height: 10,
      },
      stock: Math.max(0, Number(stock)),
      featured,
      isNew,
    };

    saveProduct(newProduct);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Fundo escurecido suave */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Janela Modal estilo Página do Produto (WYSIWYG Live Preview) */}
      <div className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-3xl bg-ivory shadow-2xl border border-stone/80 z-10 animate-fade-up my-auto flex flex-col">
        {/* Barra Superior Informativa do Editor Visual */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-stone/60 bg-ivory/95 px-6 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand text-ink border border-stone">
              <EditIcon size={12} />
            </span>
            <div>
              <p className="text-xs font-semibold text-ink">
                Modo Editor Visual da Peça
              </p>
              <p className="text-[11px] text-taupe">
                Clique diretamente em qualquer texto, foto ou preço para editar em tempo real.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary rounded-full px-5 py-2 text-xs font-semibold cursor-pointer shadow-xs"
            >
              <CheckIcon size={14} />
              <span>{isEditing ? "Salvar alterações" : "Publicar bolsa"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-taupe hover:bg-sand transition cursor-pointer"
              title="Fechar"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 sm:mx-10 mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-xs font-semibold text-danger">
            {error}
          </div>
        )}

        {/* CORPO DO MODAL: Layout idêntico ao da tela /produto/[slug] */}
        <div className="p-6 sm:p-10 lg:p-12">
          {/* Breadcrumb da Loja */}
          <div className="mb-6 flex items-center gap-2 text-xs text-taupe">
            <span>Início</span>
            <span>/</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-taupe hover:text-ink font-medium border-b border-dashed border-stone outline-none cursor-pointer"
            >
              <option value="bolsas">Bolsas</option>
              <option value="acessorios">Acessórios</option>
              <option value="clutches">Clutches</option>
            </select>
            <span>/</span>
            <span className="text-ink font-semibold truncate max-w-[200px]">
              {name}
            </span>
          </div>

          {/* Grid de 2 colunas igualzinho à tela do produto */}
          <div className="grid gap-10 md:grid-cols-2 lg:gap-14 items-start">
            {/* ============================================================
                COLUNA ESQUERDA: FOTOGRAFIA DA BOLSA COM TROCA VISUAL
               ============================================================ */}
            <div>
              <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-sand border border-stone/70 group shadow-xs">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  priority
                  className="object-cover object-center transition duration-500 group-hover:scale-102"
                />

                {/* Botão sobre a foto para trocar imagem */}
                <button
                  type="button"
                  onClick={() => setShowImageSelector(!showImageSelector)}
                  className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 backdrop-blur-md p-3 text-xs font-semibold text-ink shadow-md border border-stone/60 flex items-center justify-center gap-2 hover:bg-ink hover:text-ivory transition cursor-pointer"
                >
                  <EditIcon size={15} />
                  <span>{showImageSelector ? "Ocultar catálogo de fotos" : "Clique aqui para trocar a foto"}</span>
                </button>
              </div>

              {/* Seletor visual de fotos do acervo */}
              {showImageSelector && (
                <div className="mt-4 p-4 rounded-2xl bg-sand/40 border border-stone/70 animate-fade-in space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-taupe">
                    Selecione uma foto do acervo de bolsas:
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {AVAILABLE_PROJECT_IMAGES.map((item) => (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => {
                          setImageUrl(item.url);
                          setShowImageSelector(false);
                        }}
                        className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition ${
                          imageUrl === item.url
                            ? "border-gold ring-2 ring-gold/40 scale-102"
                            : "border-stone/60 opacity-60 hover:opacity-100"
                        }`}
                        title={item.label}
                      >
                        <Image src={item.url} alt={item.label} fill className="object-cover" />
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone/40 flex gap-2">
                    <input
                      type="text"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="Ou cole uma URL externa de imagem..."
                      className="input text-xs py-2 bg-white flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customImageUrl.trim()) {
                          setImageUrl(customImageUrl.trim());
                          setCustomImageUrl("");
                          setShowImageSelector(false);
                        }
                      }}
                      className="btn-outline rounded-xl py-2 px-3 text-xs font-semibold"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================
                COLUNA DIREITA: CONTEÚDO EDITÁVEL EM TEMPO REAL
               ============================================================ */}
            <div className="space-y-6">
              {/* Etiquetas Novidade e Destaque */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNew(!isNew)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer ${
                    isNew
                      ? "bg-ivory border border-stone text-ink shadow-2xs"
                      : "bg-sand/40 text-taupe/60 hover:text-ink border border-transparent"
                  }`}
                  title="Clique para ativar/desativar etiqueta Novidade"
                >
                  {isNew ? "✓ Novidade na vitrine" : "+ Marcar como Novidade"}
                </button>

                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer ${
                    featured
                      ? "bg-ink text-gold-light shadow-2xs"
                      : "bg-sand/40 text-taupe/60 hover:text-ink border border-transparent"
                  }`}
                  title="Clique para ativar/desativar etiqueta Destaque"
                >
                  {featured ? "★ Em Destaque" : "+ Marcar Destaque"}
                </button>
              </div>

              {/* Título da Bolsa (Editável diretamente) */}
              <div className="group">
                <label className="text-[10px] font-bold uppercase tracking-wider text-taupe block mb-1 group-hover:text-gold-dark transition">
                  Nome da Bolsa (clique para digitar)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da bolsa..."
                  className="heading-display text-3xl sm:text-4xl text-ink font-medium bg-transparent border-b border-stone/50 hover:border-gold focus:border-gold outline-none w-full py-1 transition"
                  required
                />
              </div>

              {/* Frase de Destaque / Descrição Curta (Editável) */}
              <div className="group">
                <label className="text-[10px] font-bold uppercase tracking-wider text-taupe block mb-1 group-hover:text-gold-dark transition">
                  Frase de destaque (subtítulo)
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Frase curta sobre a peça..."
                  className="text-sm text-taupe bg-transparent border-b border-stone/50 hover:border-gold focus:border-gold outline-none w-full py-1 resize-none transition"
                />
              </div>

              {/* Bloco de Preço e Parcelamento (Idêntico ao da tela do produto) */}
              <div className="border-y border-stone/60 py-5 space-y-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-taupe block">
                      Preço de Venda
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold text-ink">R$</span>
                      <input
                        type="number"
                        step="0.10"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                        className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-sans bg-transparent border-b border-stone/50 hover:border-gold focus:border-gold outline-none w-36 py-0.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-taupe block">
                      Preço De (riscado)
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-taupe">R$</span>
                      <input
                        type="number"
                        step="0.10"
                        value={compareAtPrice ?? ""}
                        onChange={(e) =>
                          setCompareAtPrice(
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        placeholder="Ex: 459.90"
                        className="text-sm text-taupe line-through bg-transparent border-b border-stone/50 hover:border-gold focus:border-gold outline-none w-28 py-0.5"
                      />
                    </div>
                  </div>

                  {discount && (
                    <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold-dark self-end mb-1">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Parcelas geradas automaticamente */}
                {installments && (
                  <p className="text-xs text-taupe leading-tight pt-1">
                    ou <span className="font-medium text-ink">{installments}</span>
                  </p>
                )}
                <p className="text-xs text-taupe leading-tight">
                  ou <span className="font-medium text-ink">à vista no Pix</span> com aprovação imediata
                </p>
              </div>

              {/* Seletor de Cor e Estoque */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                {/* Cor */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-taupe mb-1.5">
                    Cor: <span className="text-ink font-bold">{colorName}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-8 w-8 rounded-full border-2 border-ivory ring-1 ring-ink shadow-xs"
                      style={{ backgroundColor: colorHex }}
                    />
                    <input
                      type="text"
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      placeholder="Nome da cor"
                      className="input text-xs py-1.5 px-3 w-32 bg-white"
                    />
                  </div>
                </div>

                {/* Seletor de Estoque (com estilo do QuantitySelector da loja) */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-taupe mb-1.5">
                    Unidades em estoque
                  </p>
                  <div className="inline-flex items-center rounded-full border border-stone bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setStock(Math.max(0, stock - 1))}
                      className="h-9 w-9 flex items-center justify-center rounded-full text-ink hover:bg-sand transition cursor-pointer"
                      title="Diminuir"
                    >
                      <MinusIcon size={14} />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                      className="w-12 text-center text-sm font-semibold tabular-nums bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setStock(stock + 1)}
                      className="h-9 w-9 flex items-center justify-center rounded-full text-ink hover:bg-sand transition cursor-pointer"
                      title="Aumentar"
                    >
                      <PlusIcon size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Botões de Ação Principais da Peça (no lugar do 'Comprar agora') */}
              <div className="grid gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary w-full py-4 rounded-full text-sm font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BagIcon size={18} />
                  <span>{isEditing ? "Salvar alterações da peça" : "Publicar bolsa na loja"}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline w-full py-3.5 rounded-full text-sm font-semibold cursor-pointer"
                >
                  Cancelar e voltar
                </button>
              </div>

              {/* Seção Descrição Completa */}
              <div className="pt-4 border-t border-stone/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="eyebrow">História & Inspiração da Peça</h2>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Conte a história, os materiais, ocasiões de uso e diferenciais..."
                  className="text-sm leading-relaxed text-ink/80 bg-sand/30 p-4 rounded-2xl border border-stone/60 hover:border-gold focus:border-gold outline-none w-full transition resize-none"
                />
              </div>

              {/* Seção Detalhes e Especificações (Lista interativa) */}
              <div className="pt-4 border-t border-stone/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="eyebrow">Especificações Técnicas</h2>
                  <button
                    type="button"
                    onClick={handleAddDetail}
                    className="text-xs font-semibold text-ink hover:text-gold-dark transition flex items-center gap-1 cursor-pointer"
                  >
                    <PlusIcon size={13} />
                    <span>Adicionar item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-stone/60 group"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => handleDetailChange(index, e.target.value)}
                        className="text-xs text-ink/90 bg-transparent flex-1 outline-none"
                        placeholder="Ex: Dimensões: 26 x 15 x 7 cm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(index)}
                        className="p-1 text-taupe/50 hover:text-danger transition cursor-pointer"
                        title="Remover este detalhe"
                      >
                        <CloseIcon size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
