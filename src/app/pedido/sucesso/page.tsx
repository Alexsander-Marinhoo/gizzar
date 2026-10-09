"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckIcon, WhatsAppIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { useCart } from "@/lib/cart";
import { siteConfig, whatsappLink } from "@/config/site";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNsu = searchParams.get("order_nsu") || "GZ-PEDIDO";
  const isDemo = searchParams.get("demo") === "1";
  const { clear } = useCart();

  useEffect(() => {
    // Limpa a sacola após concluir o pedido
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-xl text-center py-12 px-4 sm:px-6">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sand text-gold-dark shadow-inner">
        <CheckIcon size={40} className="animate-pop" />
      </div>

      <span className="eyebrow">Pedido Recebido</span>
      <h1 className="heading-display mt-3 text-4xl sm:text-5xl">Obrigada pela sua compra!</h1>

      <p className="mt-4 text-base text-taupe leading-relaxed">
        Seu pedido foi registrado com sucesso. Enviamos os detalhes de acompanhamento para o seu e-mail e você também pode acompanhar diretamente com nosso suporte.
      </p>

      <div className="mt-8 rounded-2xl border border-stone/70 bg-white/80 p-6 shadow-xs text-left">
        <div className="flex items-center justify-between border-b border-stone/40 pb-4">
          <span className="text-xs uppercase tracking-wider text-taupe">Identificador do Pedido</span>
          <span className="font-mono text-base font-bold text-ink">{orderNsu}</span>
        </div>

        {isDemo && (
          <div className="mt-4 rounded-xl bg-sand/50 p-3.5 text-xs text-taupe leading-relaxed">
            <span className="font-semibold text-gold-dark block mb-1">ℹ️ Modo Demonstração</span>
            Este pedido foi concluído em modo de simulação, pois a conta oficial da InfinitePay ainda não foi configurada nas variáveis de ambiente.
          </div>
        )}

        <div className="mt-4 space-y-2 text-xs text-taupe">
          <p>• <strong>Pagamento:</strong> Processado via InfinitePay (Pix / Cartão).</p>
          <p>• <strong>Envio:</strong> Embalagem premium com rastreamento Correios.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={whatsappLink(`Olá! Acabei de fazer o pedido ${orderNsu} no site da GIZZAR e gostaria de acompanhar o envio.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-[#25D366] text-white hover:brightness-105"
        >
          <WhatsAppIcon size={18} /> Confirmar pelo WhatsApp
        </a>
        <Link href="/catalogo" className="btn-outline">
          Continuar Comprando <ArrowRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="container-page pt-10 sm:pt-16 pb-20">
      <Suspense fallback={<div className="text-center py-24 text-taupe">Carregando detalhes do pedido...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
