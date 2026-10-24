"use client";

import { AdminTab } from "./AdminNavbar";
import {
  OrdersIcon,
  ProductsIcon,
  BannerIcon,
  TruckIcon,
  ChevronRightIcon,
} from "./AdminIcons";
import { formatPrice } from "@/lib/format";

interface AdminStatsGridProps {
  totalRevenue: number;
  totalOrdersCount: number;
  pendingOrdersCount: number;
  productsCount: number;
  bannerActive: boolean;
  setActiveTab: (tab: AdminTab) => void;
}

export default function AdminStatsGrid({
  totalRevenue,
  totalOrdersCount,
  pendingOrdersCount,
  productsCount,
  bannerActive,
  setActiveTab,
}: AdminStatsGridProps) {
  const stats = [
    {
      id: "sales",
      title: "Vendas totais",
      value: formatPrice(totalRevenue),
      subtitle: `${totalOrdersCount} pedidos confirmados`,
      icon: OrdersIcon,
      actionText: "Consultar",
      onClick: () => setActiveTab("orders"),
    },
    {
      id: "products",
      title: "Produtos ativos",
      value: `${productsCount} bolsas`,
      subtitle: "Disponíveis na vitrine",
      icon: ProductsIcon,
      actionText: "Consultar",
      onClick: () => setActiveTab("products"),
    },
    {
      id: "pending",
      title: "Aguardando envio",
      value: `${pendingOrdersCount}`,
      subtitle: "Prontos para despacho",
      icon: TruckIcon,
      actionText: "Consultar",
      onClick: () => setActiveTab("orders"),
      badge: pendingOrdersCount > 0 ? "Pendente" : undefined,
    },
    {
      id: "banner",
      title: "Banner principal",
      value: bannerActive ? "Ativo" : "Pausado",
      subtitle: "Campanha Frete Grátis",
      icon: BannerIcon,
      actionText: "Configurar",
      onClick: () => setActiveTab("banner"),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            onClick={stat.onClick}
            className="group cursor-pointer rounded-2xl border border-stone/70 bg-white p-5 sm:p-6 transition-all duration-300 hover:border-gold hover:shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Topo do Card com Ícone e Badge no estilo da loja */}
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-stone/80 bg-sand/50 text-ink">
                  <Icon size={18} />
                </div>
                {stat.badge && (
                  <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold-dark">
                    {stat.badge}
                  </span>
                )}
              </div>

              {/* Número grande em sans-serif bold idêntico ao preço dos produtos */}
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-sans">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-taupe mt-1.5">
                  {stat.title}
                </p>
                <p className="text-xs text-taupe/80 mt-0.5">
                  {stat.subtitle}
                </p>
              </div>
            </div>

            {/* Linha inferior de consulta */}
            <div className="mt-5 pt-3.5 border-t border-stone/40 flex items-center justify-between text-xs font-semibold text-ink transition group-hover:text-gold-dark">
              <span>{stat.actionText}</span>
              <ChevronRightIcon
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
