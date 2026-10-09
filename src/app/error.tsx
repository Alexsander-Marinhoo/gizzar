"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappLink } from "@/config/site";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Erro na aplicação]:", error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger shadow-inner">
        <RefreshIcon size={32} />
      </span>

      <span className="eyebrow mt-6 text-danger">Ops! Algo deu errado</span>
      <h1 className="heading-display mt-2 text-3xl sm:text-5xl text-ink">
        Problema ao carregar esta página
      </h1>

      <p className="mt-4 max-w-md text-sm sm:text-base text-taupe leading-relaxed">
        Não conseguimos carregar essas informações no momento. Pode ser uma oscilação passageira de conexão.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="btn-primary"
        >
          <RefreshIcon size={16} /> Tentar novamente
        </button>
        <Link href="/" className="btn-outline">
          Voltar para o início
        </Link>
        <a
          href={whatsappLink("Olá! Ocorreu um problema ao carregar uma página no site da GIZZAR e preciso de ajuda.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-white"
        >
          <WhatsAppIcon size={18} /> Suporte no WhatsApp
        </a>
      </div>
    </div>
  );
}
