"use client";

import { AdminTab } from "./AdminNavbar";
import { PlusIcon, BagIcon } from "@/components/ui/Icons";
import { BannerIcon, OrdersIcon, ExternalLinkIcon } from "./AdminIcons";
import Link from "next/link";

interface AdminHeaderProps {
  onNewProduct: () => void;
  setActiveTab: (tab: AdminTab) => void;
}

export default function AdminHeader({ onNewProduct, setActiveTab }: AdminHeaderProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between pb-6 pt-2 border-b border-stone/50">
      {/* Título & Descrição com a mesma tipografia do projeto */}
      <div>
        <p className="eyebrow">Painel do Atelier</p>
        <h1 className="heading-display mt-1 text-3xl sm:text-4xl font-medium text-ink tracking-tight">
          Painel de Controle
        </h1>
        <p className="mt-1.5 text-sm text-taupe max-w-xl">
          Gerenciamento em tempo real de produtos, vitrine, banner promocional e pedidos.
        </p>
      </div>

      {/* Botões no formato exato da loja: pílulas arredondadas, ícones sutis e texto sentence case */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Criar produto (btn-primary igual ao botão 'Comprar agora') */}
        <button
          id="admin-btn-create-product"
          type="button"
          onClick={onNewProduct}
          className="btn-primary rounded-full px-5 py-3 text-sm font-semibold cursor-pointer shadow-xs"
        >
          <PlusIcon size={16} />
          <span>Criar produto</span>
        </button>

        {/* Editar banner (btn-outline igual ao botão 'Adicionar à sacola') */}
        <button
          type="button"
          onClick={() => setActiveTab("banner")}
          className="btn-outline rounded-full px-5 py-3 text-sm font-semibold bg-white cursor-pointer"
        >
          <BannerIcon size={16} />
          <span>Editar banner</span>
        </button>

        {/* Ver vendas */}
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className="inline-flex items-center gap-2 rounded-full border border-stone bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-sand cursor-pointer"
        >
          <OrdersIcon size={16} />
          <span>Ver vendas</span>
        </button>

        {/* Ver loja */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full border border-stone bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-sand"
        >
          <span>Ver loja</span>
          <ExternalLinkIcon size={14} className="text-taupe" />
        </Link>
      </div>
    </div>
  );
}
