"use client";

import Image from "next/image";
import { AdminOrder, AdminProduct, AdminBannerConfig } from "@/lib/admin-store";
import { AdminTab } from "./AdminNavbar";
import { formatPrice } from "@/lib/format";
import { ArrowRightIcon, PlusIcon, BagIcon } from "@/components/ui/Icons";
import { EditIcon, MapPinIcon, TruckIcon } from "./AdminIcons";

interface AdminOverviewCardsProps {
  orders: AdminOrder[];
  products: AdminProduct[];
  banner: AdminBannerConfig;
  setActiveTab: (tab: AdminTab) => void;
  onNewProduct: () => void;
}

export default function AdminOverviewCards({
  orders,
  products,
  banner,
  setActiveTab,
  onNewProduct,
}: AdminOverviewCardsProps) {
  const recentOrders = orders.slice(0, 3);
  const recentProducts = products.slice(0, 3);

  const getStatusBadge = (status: AdminOrder["status"]) => {
    switch (status) {
      case "paid":
        return (
          <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold-dark">
            Aguardando envio
          </span>
        );
      case "shipped":
        return (
          <span className="rounded-full bg-ink text-gold-light px-2.5 py-0.5 text-xs font-semibold">
            Em trânsito
          </span>
        );
      case "delivered":
        return (
          <span className="rounded-full bg-sand text-ink border border-stone px-2.5 py-0.5 text-xs font-semibold">
            Entregue
          </span>
        );
      case "cancelled":
        return (
          <span className="rounded-full bg-sand text-taupe/60 line-through px-2.5 py-0.5 text-xs font-semibold">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-sand text-taupe px-2.5 py-0.5 text-xs font-semibold">
            Pendente
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* CARD 1: VENDAS RECENTES */}
      <div className="rounded-2xl border border-stone/70 bg-white p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between pb-4 border-b border-stone/40">
            <div>
              <p className="eyebrow">Expedição</p>
              <h2 className="text-xl font-bold text-ink mt-1">
                Vendas recentes
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className="text-xs font-semibold text-ink hover:text-gold-dark transition flex items-center gap-1.5 pt-1 cursor-pointer"
            >
              <span>Ver todas</span>
              <ArrowRightIcon size={13} />
            </button>
          </div>

          <div className="mt-5 divide-y divide-stone/30 space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setActiveTab("orders")}
                className="pt-3 first:pt-0 group cursor-pointer hover:bg-sand/30 -mx-2 px-2.5 py-2.5 rounded-xl transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate group-hover:text-gold-dark transition">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-taupe truncate mt-0.5 flex items-center gap-1">
                      <MapPinIcon size={12} className="text-taupe/80 shrink-0" />
                      {order.shippingAddress.city} - {order.shippingAddress.state}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {getStatusBadge(order.status)}
                    <p className="text-sm font-bold text-ink mt-1">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-xs text-taupe truncate bg-sand/40 px-2.5 py-1 rounded-lg">
                  {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão idêntico ao 'Adicionar à sacola' */}
        <div className="mt-6 pt-4 border-t border-stone/40">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className="btn-outline w-full rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <TruckIcon size={16} />
            <span>Consultar todas as vendas</span>
          </button>
        </div>
      </div>

      {/* CARD 2: CATÁLOGO */}
      <div className="rounded-2xl border border-stone/70 bg-white p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between pb-4 border-b border-stone/40">
            <div>
              <p className="eyebrow">Inventário</p>
              <h2 className="text-xl font-bold text-ink mt-1">
                Bolsas em linha
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className="text-xs font-semibold text-ink hover:text-gold-dark transition flex items-center gap-1.5 pt-1 cursor-pointer"
            >
              <span>Gerenciar</span>
              <ArrowRightIcon size={13} />
            </button>
          </div>

          <div className="mt-5 divide-y divide-stone/30 space-y-3">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setActiveTab("products")}
                className="pt-3 first:pt-0 group cursor-pointer hover:bg-sand/30 -mx-2 px-2.5 py-2.5 rounded-xl transition flex items-center gap-3.5"
              >
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-sand border border-stone/60 shrink-0">
                  <Image
                    src={product.images[0] || "/brand/hero.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink truncate group-hover:text-gold-dark transition">
                    {product.name}
                  </p>
                  <p className="text-xs text-taupe capitalize">
                    {product.category}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-ink">
                    {formatPrice(product.price)}
                  </p>
                  <span className="inline-block mt-0.5 rounded-full bg-sand px-2 py-0.5 text-xs text-taupe font-medium">
                    {product.stock} em estoque
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão idêntico ao 'Adicionar à sacola' */}
        <div className="mt-6 pt-4 border-t border-stone/40">
          <button
            type="button"
            onClick={onNewProduct}
            className="btn-outline w-full rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusIcon size={16} />
            <span>Cadastrar nova bolsa</span>
          </button>
        </div>
      </div>

      {/* CARD 3: BANNER DA HOME */}
      <div className="rounded-2xl border border-stone/70 bg-white p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between pb-4 border-b border-stone/40">
            <div>
              <p className="eyebrow">Vitrine da home</p>
              <h2 className="text-xl font-bold text-ink mt-1">
                Banner promocional
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("banner")}
              className="text-xs font-semibold text-ink hover:text-gold-dark transition flex items-center gap-1.5 pt-1 cursor-pointer"
            >
              <span>Editar</span>
              <EditIcon size={13} />
            </button>
          </div>

          <div className="mt-5">
            <div
              onClick={() => setActiveTab("banner")}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-sand border border-stone/80 aspect-[16/7] w-full shadow-xs hover:shadow-md transition"
            >
              <Image
                src={banner.imageUrl || "/brand/sem titulo.jpg"}
                alt={banner.headline}
                fill
                className="object-cover object-center group-hover:scale-102 transition duration-500"
              />
              <div className="absolute top-2.5 right-2.5">
                <span className="rounded-full bg-white/95 text-ink text-[11px] font-semibold px-2.5 py-0.5 border border-stone/60 shadow-xs">
                  {banner.active ? "Ativo na home" : "Pausado"}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-taupe">
                <span className="font-medium">Campanha:</span>
                <span className="font-semibold text-ink">{banner.headline}</span>
              </div>
              <div className="flex justify-between items-center text-taupe">
                <span className="font-medium">Condição:</span>
                <span className="font-semibold text-ink">{banner.subheadline}</span>
              </div>
              <div className="flex justify-between items-center text-taupe">
                <span className="font-medium">Destino:</span>
                <span className="font-mono text-gold-dark font-medium underline">
                  {banner.linkUrl}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão idêntico ao 'Adicionar à sacola' */}
        <div className="mt-6 pt-4 border-t border-stone/40">
          <button
            type="button"
            onClick={() => setActiveTab("banner")}
            className="btn-outline w-full rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <EditIcon size={15} />
            <span>Personalizar banner</span>
          </button>
        </div>
      </div>
    </div>
  );
}
