"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AdminBannerConfig,
  saveBannerConfig,
  DEFAULT_BANNER_CONFIG,
} from "@/lib/admin-store";
import { CheckIcon, SparkleIcon } from "@/components/ui/Icons";
import { ExternalLinkIcon, EyeIcon } from "./AdminIcons";

interface AdminBannerEditorProps {
  banner: AdminBannerConfig;
  onBannerSaved: (newBanner: AdminBannerConfig) => void;
}

const BANNER_PRESETS = [
  {
    name: "Banner Frete Grátis Original (Anexo)",
    url: "/brand/sem titulo.jpg",
    description: "Bolsa acolchoada preta, corrente dourada e texto Frete Grátis a partir de R$ 499,90",
  },
  {
    name: "Banner Campanha Especial",
    url: "/brand/banner-frete-gratis.jpg",
    description: "Layout alternativo editorial",
  },
  {
    name: "Banner Editorial Sofisticado",
    url: "/brand/hero-frete.jpg",
    description: "Composição elegante em tons neutros",
  },
  {
    name: "Banner Clássico Gizzar",
    url: "/brand/hero.jpg",
    description: "Conceito atemporal da marca",
  },
];

export default function AdminBannerEditor({
  banner,
  onBannerSaved,
}: AdminBannerEditorProps) {
  const [form, setForm] = useState<AdminBannerConfig>({ ...banner });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveBannerConfig(form);
    onBannerSaved(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleResetToDefault = () => {
    if (confirm("Restaurar o banner original do anexo?")) {
      const updated = saveBannerConfig(DEFAULT_BANNER_CONFIG);
      setForm({ ...DEFAULT_BANNER_CONFIG });
      onBannerSaved(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const isDirectImage =
    form.imageUrl === "/brand/sem titulo.jpg" ||
    form.imageUrl === "/brand/banner-frete-gratis.jpg" ||
    form.imageUrl === "/brand/banner-promocional.jpg";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone/50">
        <div>
          <p className="eyebrow">Campanha & Vitrine Principal</p>
          <h2 className="heading-display mt-1 text-3xl font-medium text-ink">
            Banner Promocional
          </h2>
          <p className="text-sm text-taupe mt-1">
            Ajuste a imagem, texto promocional e links da campanha exibida no topo da loja.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="btn-outline rounded-full px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-2"
        >
          <EyeIcon size={14} />
          <span>Ver na home</span>
          <ExternalLinkIcon size={12} />
        </Link>
      </div>

      {/* Alerta de Sucesso com Pílula Suave */}
      {savedSuccess && (
        <div className="rounded-2xl border border-stone/80 bg-white p-4 text-sm font-medium text-ink flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
              <CheckIcon size={14} />
            </span>
            <span>Banner atualizado com sucesso. As alterações já estão ao vivo na página inicial.</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold text-ink underline hover:text-gold-dark"
          >
            Abrir loja →
          </Link>
        </div>
      )}

      {/* Grid: Preview à Esquerda / Formulário à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado Esquerdo: Preview Real */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-taupe flex items-center gap-1.5">
              <SparkleIcon size={13} className="text-gold-dark" /> Pré-visualização
            </span>

            {/* Alternador Desktop / Mobile no estilo do seletor de quantidade */}
            <div className="inline-flex rounded-full border border-stone bg-white p-1 text-xs">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={`rounded-full px-4 py-1 font-semibold transition ${
                  previewMode === "desktop"
                    ? "bg-ink text-ivory shadow-xs"
                    : "text-taupe hover:text-ink"
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={`rounded-full px-4 py-1 font-semibold transition ${
                  previewMode === "mobile"
                    ? "bg-ink text-ivory shadow-xs"
                    : "text-taupe hover:text-ink"
                }`}
              >
                Mobile
              </button>
            </div>
          </div>

          {/* Moldura do Banner */}
          <div
            className={`rounded-2xl border border-stone/70 bg-white p-5 sm:p-6 transition-all duration-300 ${
              previewMode === "mobile" ? "max-w-sm mx-auto" : "w-full"
            }`}
          >
            <div className="text-xs text-taupe font-medium mb-3 flex items-center justify-between">
              <span>Como o cliente enxerga na Home:</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  form.active ? "bg-gold/15 text-gold-dark" : "bg-sand text-taupe"
                }`}
              >
                {form.active ? "Ativo" : "Pausado"}
              </span>
            </div>

            <div
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-sand shadow-xs transition duration-300 aspect-[16/7] sm:aspect-[16/6] lg:aspect-[16/5.2] max-h-[380px] w-full ${
                !form.active ? "opacity-40 grayscale" : ""
              }`}
            >
              <Image
                src={form.imageUrl || "/brand/sem titulo.jpg"}
                alt={form.headline}
                fill
                priority
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover object-center"
              />

              {!isDirectImage && (form.headline || form.subheadline) && (
                <div className="absolute inset-0 bg-gradient-to-r from-sand/90 via-sand/70 to-transparent p-5 sm:p-8 flex flex-col justify-center max-w-sm">
                  {form.tag && (
                    <span className="eyebrow mb-1 text-gold-dark font-semibold text-[10px]">
                      {form.tag}
                    </span>
                  )}
                  {form.headline && (
                    <h3 className="heading-display text-xl sm:text-3xl text-ink font-medium">
                      {form.headline}
                    </h3>
                  )}
                  {form.subheadline && (
                    <p className="mt-1 text-xs sm:text-sm font-medium uppercase tracking-wider text-ink/80">
                      {form.subheadline}
                    </p>
                  )}
                  {form.showButton && (
                    <div className="mt-3">
                      <span className="btn-primary rounded-full text-xs py-2 px-5">
                        {form.buttonText || "Aproveitar"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-taupe pt-3 border-t border-stone/40">
              <span>Link de destino:</span>
              <span className="font-mono text-ink font-semibold">{form.linkUrl}</span>
            </div>
          </div>

          {/* Modelos da Marca */}
          <div className="rounded-2xl border border-stone/70 bg-white p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-taupe mb-3">
              Modelos de banner do projeto
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BANNER_PRESETS.map((preset) => {
                const isSelected = form.imageUrl === preset.url;
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: preset.url })}
                    className={`text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? "border-ink bg-sand/40 ring-1 ring-ink"
                        : "border-stone/60 hover:bg-sand/20"
                    }`}
                  >
                    <div className="relative h-14 w-20 rounded-lg overflow-hidden bg-sand shrink-0 border border-stone/50">
                      <Image
                        src={preset.url}
                        alt={preset.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink leading-snug">
                        {preset.name}
                      </p>
                      <p className="text-[10px] text-taupe line-clamp-2 mt-0.5">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário com inputs e botões oficiais */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-stone/70 bg-white p-6 sm:p-7 space-y-5"
          >
            <div className="pb-4 border-b border-stone/40">
              <p className="eyebrow">Configurações</p>
              <h3 className="text-xl font-bold text-ink mt-1">
                Editar conteúdo do banner
              </h3>
            </div>

            {/* Ativar/Desativar */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-sand/30 border border-stone/60">
              <div>
                <p className="text-sm font-semibold text-ink">Exibição na home</p>
                <p className="text-xs text-taupe mt-0.5">
                  {form.active ? "Banner visível no topo da loja" : "Banner ocultado"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone/70 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ink"></div>
              </label>
            </div>

            {/* Imagem */}
            <div>
              <label className="label" htmlFor="banner-img-url">
                Caminho da imagem
              </label>
              <input
                id="banner-img-url"
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="/brand/sem titulo.jpg"
                className="input text-xs font-mono"
                required
              />
            </div>

            {/* Título */}
            <div>
              <label className="label" htmlFor="banner-headline">
                Título principal
              </label>
              <input
                id="banner-headline"
                type="text"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="Ex: FRETE GRÁTIS"
                className="input text-sm font-semibold"
                required
              />
            </div>

            {/* Subtítulo */}
            <div>
              <label className="label" htmlFor="banner-subheadline">
                Condição / Subtítulo
              </label>
              <input
                id="banner-subheadline"
                type="text"
                value={form.subheadline}
                onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
                placeholder="Ex: A PARTIR DE R$ 499,90"
                className="input text-sm"
              />
            </div>

            {/* Tag */}
            <div>
              <label className="label" htmlFor="banner-tag">
                Etiqueta superior (Eyebrow)
              </label>
              <input
                id="banner-tag"
                type="text"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="Ex: CAMPANHA ESPECIAL"
                className="input text-sm"
              />
            </div>

            {/* Link */}
            <div>
              <label className="label" htmlFor="banner-link">
                Página de destino
              </label>
              <input
                id="banner-link"
                type="text"
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                placeholder="/catalogo"
                className="input text-sm font-mono"
                required
              />
            </div>

            {/* Botões formato exato do anexo */}
            <div className="pt-4 border-t border-stone/40 space-y-3">
              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-sm font-semibold rounded-full cursor-pointer shadow-xs"
              >
                Salvar alterações
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="btn-outline w-full py-3 text-xs font-semibold rounded-full cursor-pointer"
              >
                Restaurar banner original
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
