"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminProduct, saveProduct } from "@/lib/admin-store";
import { installmentLabel } from "@/lib/format";
import {
  CloseIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  BagIcon,
} from "@/components/ui/Icons";
import { EditIcon } from "./AdminIcons";

interface AdminProductModalProps {
  product?: AdminProduct | null;
  onClose: () => void;
  onSaved: () => void;
}

export interface ProductColor {
  name: string;
  hex: string;
}

const PRESET_PALETTES: ProductColor[] = [
  { name: "Preto", hex: "#161412" },
  { name: "Caramelo", hex: "#A8642F" },
  { name: "Pérola", hex: "#EDE6DA" },
  { name: "Terracota", hex: "#B85D36" },
  { name: "Bordô", hex: "#4A1520" },
  { name: "Oliva", hex: "#556B2F" },
  { name: "Areia", hex: "#D8CEBF" },
  { name: "Dourado", hex: "#C5A059" },
  { name: "Café", hex: "#3E2723" },
  { name: "Marinho", hex: "#1A2B4C" },
];


/**
 * Converte e otimiza imagens locais da máquina para Base64 leve,
 * permitindo persistência imediata e visualização WYSIWYG perfeita.
 */
function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => resolve(e.target?.result as string);
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.88));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function AdminProductModal({
  product,
  onClose,
  onSaved,
}: AdminProductModalProps) {
  const isEditing = Boolean(product);

  // Campos limpos para cadastro fácil de pessoas leigas (sem dados fake pré-preenchidos)
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [price, setPrice] = useState<number | "">(product?.price ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState<number | "">(
    product?.compareAtPrice ?? ""
  );
  const [category, setCategory] = useState(product?.category || "bolsas");
  const [stock, setStock] = useState<number>(product?.stock ?? 1);
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription || ""
  );
  const [description, setDescription] = useState(product?.description || "");

  // FOTOS: Para novo produto, começa SEM FOTO ALGUMA
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  // CORES: Começa limpo com campo "Cor aqui" para o usuário digitar
  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors && product.colors.length > 0
      ? product.colors
      : [{ name: "", hex: "#161412" }]
  );
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [showAddColor, setShowAddColor] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#A8642F");

  // Detalhes da bolsa: começa vazio para novos produtos
  const [details, setDetails] = useState<string[]>(product?.details || []);

  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [error, setError] = useState<string | null>(null);

  // Cor atualmente selecionada para edição
  const activeColor =
    colors[selectedColorIndex] ||
    colors[0] || { name: "", hex: "#161412" };

  // Imagem atualmente em exibição
  const currentImage = images[activeImageIndex] || images[0] || null;

  // Cálculos numéricos para parcelas e desconto
  const numericPrice = typeof price === "number" ? price : parseFloat(price) || 0;
  const numericCompareAt =
    typeof compareAtPrice === "number"
      ? compareAtPrice
      : parseFloat(compareAtPrice || "") || 0;

  const installments = numericPrice > 0 ? installmentLabel(numericPrice) : null;
  const discount =
    numericCompareAt && numericCompareAt > numericPrice && numericPrice > 0
      ? Math.round((1 - numericPrice / numericCompareAt) * 100)
      : null;

  // Processar arquivos enviados da máquina
  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessingImages(true);
    try {
      const promises = Array.from(fileList).map((file) => processImageFile(file));
      const newUrls = await Promise.all(promises);
      setImages((prev) => [...prev, ...newUrls]);
      if (images.length === 0 && newUrls.length > 0) {
        setActiveImageIndex(0);
      }
    } catch (err) {
      console.error("Erro ao carregar imagens da máquina:", err);
      setError("Não foi possível carregar as imagens selecionadas.");
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (activeImageIndex >= next.length) {
        setActiveImageIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  // Gerenciamento de cores
  const handleUpdateColorName = (index: number, val: string) => {
    setColors((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], name: val };
      }
      return updated;
    });
  };

  const handleUpdateColorHex = (index: number, hexVal: string) => {
    setColors((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], hex: hexVal };
      }
      return updated;
    });
  };

  const handleAddNewColor = () => {
    if (!newColorName.trim()) return;
    const addedColor: ProductColor = {
      name: newColorName.trim(),
      hex: newColorHex,
    };
    setColors((prev) => [...prev, addedColor]);
    setSelectedColorIndex(colors.length);
    setNewColorName("");
    setShowAddColor(false);
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length <= 1) return;
    setColors((prev) => prev.filter((_, i) => i !== index));
    setSelectedColorIndex((prev) => Math.max(0, prev - 1));
  };

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
    setDetails([...details, ""]);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Por favor, digite o nome da bolsa no campo 'Nome da bolsa aqui'.");
      return;
    }
    if (!numericPrice || numericPrice <= 0) {
      setError("Por favor, digite o valor de venda no campo 'Valor aqui'.");
      return;
    }
    if (images.length === 0) {
      setError(
        "Por favor, adicione ao menos uma foto do produto da sua máquina."
      );
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

    // Garante que haja ao menos uma cor com nome preenchido
    const cleanedColors = colors.map((c) => ({
      name: c.name.trim() || "Padrão",
      hex: c.hex || "#161412",
    }));

    const newProduct: AdminProduct = {
      id: product?.id || `gz-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      slug: generatedSlug,
      category,
      price: numericPrice,
      compareAtPrice: numericCompareAt > 0 ? numericCompareAt : undefined,
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      details: details.filter((d) => d.trim().length > 0),
      images,
      colors: cleanedColors.length > 0 ? cleanedColors : [{ name: "Padrão", hex: "#161412" }],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Fundo escurecido suave */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Janela Modal estilo Página do Produto (WYSIWYG Live Preview) - Ampla e espaçosa */}
      <div className="relative w-full max-w-6xl xl:max-w-7xl max-h-[96vh] overflow-y-auto rounded-3xl bg-ivory shadow-2xl border border-stone/80 z-10 animate-fade-up my-auto flex flex-col">
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
                Preencha os campos nos locais indicados para publicar sua bolsa com facilidade.
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
            <span className="text-ink font-semibold truncate max-w-[240px]">
              {name.trim() || "Nome da bolsa aqui"}
            </span>
          </div>

          {/* Grid de 2 colunas igualzinho à tela do produto */}
          <div className="grid gap-10 md:grid-cols-2 lg:gap-14 items-start">
            {/* ============================================================
                COLUNA ESQUERDA: FOTOS DA BOLSA (SEM FOTO INICIAL, COM UPLOAD)
               ============================================================ */}
            <div>
              {images.length === 0 ? (
                /* ÁREA VAZIA CONFORME SOLICITADO: SEM FOTO ALGUMA E SEM ÍCONE, SOMENTE PARÁGRAFO */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`relative aspect-[3/4] w-full rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer group ${
                    isDragging
                      ? "border-gold bg-gold/10 scale-101"
                      : "border-stone/90 bg-sand/40 hover:border-gold hover:bg-sand/70 shadow-2xs"
                  }`}
                >
                  <h3 className="font-display text-xl sm:text-2xl font-medium text-ink">
                    Adicionar imagens da máquina
                  </h3>

                  {/* Parágrafo explicativo para Supabase */}
                  <p className="mt-3 text-xs sm:text-sm text-taupe leading-relaxed max-w-sm">
                    Clique ou arraste imagens da sua máquina para adicionar ao produto. As fotos serão salvas e enviadas para o bucket de armazenamento no Supabase posteriormente.
                  </p>

                  <div className="mt-6">
                    <span className="btn-primary rounded-full px-6 py-3 text-xs font-semibold shadow-xs inline-flex items-center gap-2 group-hover:bg-gold-dark transition">
                      <span>{isProcessingImages ? "Carregando fotos..." : "Selecionar fotos do computador"}</span>
                    </span>
                  </div>

                  <p className="mt-4 text-[11px] text-taupe/70">
                    JPG, PNG, WEBP (permite selecionar múltiplas fotos)
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isProcessingImages}
                    onChange={handleFileInputChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    title="Clique ou arraste imagens da sua máquina aqui"
                  />
                </div>
              ) : (
                /* ÁREA COM FOTOS: MOSTRA A FOTO ATIVA E PERMITE ADICIONAR MAIS */
                <div>
                  <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-sand border border-stone/70 group shadow-xs">
                    {currentImage && (
                      <Image
                        src={currentImage}
                        alt={name || "Foto da bolsa"}
                        fill
                        priority
                        unoptimized={
                          currentImage.startsWith("data:") ||
                          currentImage.startsWith("blob:")
                        }
                        className="object-cover object-center transition duration-500 group-hover:scale-102"
                      />
                    )}

                    {/* Contador de fotos */}
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white shadow-xs">
                        Foto {activeImageIndex + 1} de {images.length}
                      </span>
                    </div>

                    {/* Botão de remover foto atual */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(activeImageIndex)}
                      className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-md p-2 text-taupe hover:text-danger hover:bg-white transition cursor-pointer shadow-xs"
                      title="Remover esta foto"
                    >
                      <TrashIcon size={15} />
                    </button>

                    {/* Botão para carregar mais fotos da máquina sobre a imagem */}
                    <label className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 backdrop-blur-md p-3 text-xs font-semibold text-ink shadow-md border border-stone/60 flex items-center justify-center gap-2 hover:bg-ink hover:text-ivory transition cursor-pointer">
                      <span>Adicionar mais fotos da máquina</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isProcessingImages}
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Fita de miniaturas com fotos adicionadas */}
                  <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className={`relative aspect-[3/4] w-14 shrink-0 rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                          i === activeImageIndex
                            ? "border-gold ring-2 ring-gold/40 scale-102"
                            : "border-stone/60 opacity-60 hover:opacity-100"
                        }`}
                        onClick={() => setActiveImageIndex(i)}
                      >
                        <Image
                          src={img}
                          alt=""
                          fill
                          unoptimized={
                            img.startsWith("data:") || img.startsWith("blob:")
                          }
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(i);
                          }}
                          className="absolute top-0.5 right-0.5 rounded-full bg-black/70 p-0.5 text-white hover:bg-danger transition"
                          title="Excluir foto"
                        >
                          <CloseIcon size={10} />
                        </button>
                      </div>
                    ))}

                    {/* Botão + para carregar mais fotos da máquina */}
                    <label className="relative aspect-[3/4] w-14 shrink-0 rounded-xl border-2 border-dashed border-stone/80 bg-sand/30 hover:border-gold hover:bg-sand/60 flex flex-col items-center justify-center text-taupe hover:text-ink cursor-pointer transition">
                      <PlusIcon size={16} />
                      <span className="text-[9px] font-semibold mt-0.5">Mais</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isProcessingImages}
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </label>
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
                  className={`rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer ${
                    isNew
                      ? "bg-ivory border border-stone text-ink shadow-2xs"
                      : "bg-sand/40 text-taupe/70 hover:text-ink border border-transparent"
                  }`}
                  title="Clique para ativar/desativar etiqueta Novidade"
                >
                  {isNew ? "✓ Novidade na vitrine" : "+ Marcar como Novidade"}
                </button>

                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer ${
                    featured
                      ? "bg-ink text-gold-light shadow-2xs"
                      : "bg-sand/40 text-taupe/70 hover:text-ink border border-transparent"
                  }`}
                  title="Clique para ativar/desativar etiqueta Destaque"
                >
                  {featured ? "★ Em Destaque" : "+ Marcar Destaque"}
                </button>
              </div>

              {/* Título da Bolsa (Nome da bolsa aqui) */}
              <div className="group">
                <label className="text-[11px] font-bold uppercase tracking-wider text-taupe block mb-1 group-hover:text-gold-dark transition">
                  Nome da Bolsa (clique para digitar)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da bolsa aqui"
                  className="heading-display text-3xl sm:text-4xl text-ink font-medium bg-transparent border-b border-stone/50 hover:border-gold focus:border-gold outline-none w-full py-1 transition placeholder:text-stone/90 placeholder:italic placeholder:font-serif"
                  required
                />
              </div>

              {/* Frase de Destaque / Descrição Curta (Subtítulo) */}
              <div className="group">
                <label className="text-[11px] font-bold uppercase tracking-wider text-taupe block mb-1 group-hover:text-gold-dark transition">
                  Frase de destaque (subtítulo)
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Frase curta de destaque aqui (ex: Elegante e espaçosa para o seu dia a dia)..."
                  className="text-sm text-ink bg-transparent border-b border-stone/50 hover:border-gold focus:border-gold outline-none w-full py-1 resize-none transition placeholder:text-stone/90 placeholder:italic"
                />
              </div>

              {/* Bloco de Preço e Parcelamento (Valor aqui) */}
              <div className="border-y border-stone/60 py-5 space-y-2">
                <div className="flex flex-wrap items-baseline gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-taupe block mb-1">
                      Preço de Venda
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-bold text-ink">R$</span>
                      <input
                        type="number"
                        step="0.10"
                        value={price}
                        onChange={(e) =>
                          setPrice(
                            e.target.value === "" ? "" : parseFloat(e.target.value)
                          )
                        }
                        placeholder="Valor aqui"
                        className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-sans bg-transparent border-b border-stone/50 hover:border-gold focus:border-gold outline-none w-44 py-0.5 placeholder:text-stone/90 placeholder:font-normal placeholder:text-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-taupe block mb-1">
                      Preço De (riscado - opcional)
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-taupe">R$</span>
                      <input
                        type="number"
                        step="0.10"
                        value={compareAtPrice}
                        onChange={(e) =>
                          setCompareAtPrice(
                            e.target.value === ""
                              ? ""
                              : parseFloat(e.target.value)
                          )
                        }
                        placeholder="Preço antigo aqui"
                        className="text-sm text-taupe line-through bg-transparent border-b border-stone/50 hover:border-gold focus:border-gold outline-none w-36 py-0.5 placeholder:no-underline placeholder:text-stone/90"
                      />
                    </div>
                  </div>

                  {discount && (
                    <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold-dark self-end mb-1">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Parcelas geradas automaticamente ou mensagem instrutiva */}
                {numericPrice > 0 ? (
                  <>
                    {installments && (
                      <p className="text-xs text-taupe leading-tight pt-1">
                        ou <span className="font-medium text-ink">{installments}</span>
                      </p>
                    )}
                    <p className="text-xs text-taupe leading-tight">
                      ou <span className="font-medium text-ink">à vista no Pix</span> com aprovação imediata
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-taupe/80 italic pt-1">
                    Digite o valor da bolsa no campo acima para calcular o parcelamento automaticamente.
                  </p>
                )}
              </div>

              {/* ============================================================
                  SELETOR DE CORES: "COR AQUI" LIMPO PARA FÁCIL PREENCHIMENTO
                 ============================================================ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Cabeçalho: COR: NOME DA COR AQUI */}
                  <p className="text-xs font-bold uppercase tracking-wider text-taupe">
                    COR:{" "}
                    <span className="text-ink font-extrabold">
                      {activeColor.name.trim()
                        ? activeColor.name.toUpperCase()
                        : "COR AQUI"}
                    </span>
                  </p>

                  {colors.length > 1 && (
                    <span className="text-[11px] text-taupe font-medium">
                      {colors.length} cores adicionadas
                    </span>
                  )}
                </div>

                {/* Linha da Cor Ativa com o Círculo e o Input Pill */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Círculo com a tonalidade atual + input color nativo embutido */}
                  <div className="relative group/swatch">
                    <button
                      type="button"
                      className="relative h-10 w-10 rounded-full border-2 border-ivory ring-2 ring-ink shadow-xs transition-transform hover:scale-105 flex items-center justify-center cursor-pointer"
                      style={{ backgroundColor: activeColor.hex }}
                      title={`Clique para escolher a tonalidade na paleta de cores`}
                    >
                      <input
                        type="color"
                        value={activeColor.hex}
                        onChange={(e) =>
                          handleUpdateColorHex(selectedColorIndex, e.target.value)
                        }
                        className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                        title="Escolher tonalidade da cor"
                      />
                    </button>
                  </div>

                  {/* Input Pill com o nome da cor */}
                  <div className="relative">
                    <input
                      type="text"
                      value={activeColor.name}
                      onChange={(e) =>
                        handleUpdateColorName(selectedColorIndex, e.target.value)
                      }
                      placeholder="Cor aqui (ex: Preto, Caramelo...)"
                      className="rounded-full border border-stone/80 bg-white px-4 py-2 text-xs font-semibold text-ink outline-none hover:border-gold focus:border-gold focus:ring-1 focus:ring-gold transition shadow-2xs min-w-[160px] sm:min-w-[200px] placeholder:text-stone/90 placeholder:font-normal placeholder:italic"
                    />
                  </div>

                  {/* Se houver mais de uma cor cadastrada, permite remover a cor ativa */}
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(selectedColorIndex)}
                      className="rounded-full p-2 text-taupe hover:text-danger hover:bg-danger/10 transition cursor-pointer"
                      title={`Remover esta cor`}
                    >
                      <TrashIcon size={14} />
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-taupe">
                  Clique na bolinha para trocar o tom ou escreva o nome da cor na caixinha ao lado.
                </p>

                {/* Variações de cores: Exibe todas as cores cadastradas para o produto */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-taupe uppercase tracking-wider">
                      Cores deste produto:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddColor(!showAddColor)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gold-dark hover:text-ink transition cursor-pointer"
                    >
                      <PlusIcon size={12} />
                      <span>{showAddColor ? "Fechar" : "+ Adicionar outra cor"}</span>
                    </button>
                  </div>

                  {/* Mini-círculos de todas as cores cadastradas */}
                  <div className="flex flex-wrap items-center gap-2">
                    {colors.map((c, idx) => {
                      const isSelected = idx === selectedColorIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColorIndex(idx)}
                          className={`relative h-8 w-8 rounded-full border-2 border-ivory transition-all cursor-pointer ${
                            isSelected
                              ? "ring-2 ring-ink ring-offset-2 scale-110 shadow-xs"
                              : "ring-1 ring-stone opacity-70 hover:opacity-100 hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={`Selecionar ${c.name || "Cor sem nome"}`}
                        >
                          {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-white shadow-xs" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Drawer/Painel para cadastrar nova cor */}
                  {showAddColor && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-white border border-stone/80 shadow-xs animate-fade-in space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink">
                        Adicionar outra cor para esta mesma bolsa:
                      </p>

                      {/* Sugestões de cores prontas */}
                      <div>
                        <p className="text-[10px] text-taupe uppercase tracking-wider mb-1.5">
                          Cores prontas para escolher:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_PALETTES.map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              onClick={() => {
                                setNewColorName(preset.name);
                                setNewColorHex(preset.hex);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full border border-stone/60 bg-sand/30 hover:bg-sand px-2.5 py-1 text-[11px] font-medium text-ink transition cursor-pointer"
                            >
                              <span
                                className="h-3 w-3 rounded-full border border-stone/80"
                                style={{ backgroundColor: preset.hex }}
                              />
                              <span>{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Campos para confirmar nova cor */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone/30">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value)}
                            className="h-8 w-8 rounded-full border border-stone cursor-pointer bg-transparent"
                            title="Escolher tonalidade"
                          />
                          <input
                            type="text"
                            value={newColorName}
                            onChange={(e) => setNewColorName(e.target.value)}
                            placeholder="Nome da nova cor (ex: Caramelo)..."
                            className="input text-xs py-1.5 px-3 w-44 bg-sand/30"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddNewColor}
                          disabled={!newColorName.trim()}
                          className="btn-primary rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer disabled:opacity-40"
                        >
                          Adicionar cor
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seletor de Estoque */}
              <div className="pt-2 border-t border-stone/40">
                <p className="text-xs font-semibold uppercase tracking-wider text-taupe mb-1.5">
                  Quantas unidades dessa bolsa você tem para vender:
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

              {/* Botões de Ação Principais da Peça */}
              <div className="grid gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary w-full py-4 rounded-full text-sm font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BagIcon size={18} />
                  <span>
                    {isEditing ? "Salvar alterações da peça" : "Publicar bolsa na loja"}
                  </span>
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
                  placeholder="Escreva a descrição e história da peça aqui para suas clientes lerem..."
                  className="text-sm leading-relaxed text-ink/80 bg-sand/30 p-4 rounded-2xl border border-stone/60 hover:border-gold focus:border-gold outline-none w-full transition resize-none placeholder:text-stone/90 placeholder:italic"
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

                {details.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-stone/80 bg-sand/30 p-4 text-center">
                    <p className="text-xs font-medium text-ink">Nenhuma especificação adicionada ainda</p>
                    <p className="text-[11px] text-taupe mt-1 max-w-sm mx-auto">
                      Clique no botão <strong>"+ Adicionar item"</strong> acima para colocar medidas, tipo de material, alça, forro, etc.
                    </p>
                  </div>
                ) : (
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
                          placeholder="Detalhe aqui (ex: Dimensões: 26 x 15 x 7 cm, Couro sintético...)"
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
