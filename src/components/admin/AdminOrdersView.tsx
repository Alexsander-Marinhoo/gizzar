"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminOrder, updateOrderStatus } from "@/lib/admin-store";
import { formatPrice } from "@/lib/format";
import { SearchIcon, MapPinIcon, TruckIcon, EyeIcon, CopyIcon } from "./AdminIcons";
import { WhatsAppIcon, CheckIcon } from "@/components/ui/Icons";
import AdminOrderDetailsModal from "./AdminOrderDetailsModal";

interface AdminOrdersViewProps {
  orders: AdminOrder[];
  onOrdersUpdated: () => void;
}

export default function AdminOrdersView({
  orders,
  onOrdersUpdated,
}: AdminOrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.cep.includes(searchTerm) ||
      order.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ? true : order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AdminOrder["status"]) => {
    switch (status) {
      case "paid":
        return (
          <span className="rounded-full bg-gold/15 text-gold-dark px-3 py-0.5 text-xs font-semibold">
            Aguardando envio
          </span>
        );
      case "shipped":
        return (
          <span className="rounded-full bg-ink text-gold-light px-3 py-0.5 text-xs font-semibold">
            Em trânsito
          </span>
        );
      case "delivered":
        return (
          <span className="rounded-full bg-sand text-ink border border-stone px-3 py-0.5 text-xs font-semibold">
            Entregue
          </span>
        );
      case "cancelled":
        return (
          <span className="rounded-full bg-sand text-taupe/60 line-through px-3 py-0.5 text-xs font-semibold">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-sand text-taupe px-3 py-0.5 text-xs font-semibold">
            Pendente
          </span>
        );
    }
  };

  const handleCopyAddress = (order: AdminOrder) => {
    const text = `${order.shippingAddress.recipientName}
${order.shippingAddress.street}, ${order.shippingAddress.number}${
      order.shippingAddress.complement ? ` - ${order.shippingAddress.complement}` : ""
    }
${order.shippingAddress.neighborhood}
${order.shippingAddress.city} - ${order.shippingAddress.state}
CEP: ${order.shippingAddress.cep}`;

    navigator.clipboard.writeText(text);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const counts = {
    all: orders.length,
    paid: orders.filter((o) => o.status === "paid").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone/50">
        <div>
          <p className="eyebrow">Expedição & Vendas</p>
          <h2 className="heading-display mt-1 text-3xl font-medium text-ink">
            Vendas & Pedidos
          </h2>
          <p className="text-sm text-taupe mt-1">
            Dados cadastrais dos clientes, peças adquiridas, endereços para envio e etiquetas de despacho.
          </p>
        </div>
        <div className="text-xs font-semibold text-taupe bg-sand/60 px-4 py-2 rounded-full border border-stone">
          {orders.length} pedidos no atelier
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Campo de Busca */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-taupe/60">
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, e-mail, pedido ou CEP..."
            className="input pl-11 text-sm py-3"
          />
        </div>

        {/* Abas de Status com Estilo Pílula */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {[
            { id: "all", label: "Todos", count: counts.all },
            { id: "paid", label: "Aguardando envio", count: counts.paid },
            { id: "shipped", label: "Em trânsito", count: counts.shipped },
            { id: "delivered", label: "Entregues", count: counts.delivered },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-ink text-ivory shadow-xs"
                    : "bg-white text-taupe border border-stone/70 hover:bg-sand/60 hover:text-ink"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Vendas em Cartões com cantos rounded-2xl idênticos aos do anexo */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-stone/70 bg-white p-12 text-center">
          <p className="text-lg font-bold text-ink">Nenhuma venda encontrada</p>
          <p className="text-xs text-taupe mt-1.5">
            Ajuste os filtros de status ou o termo pesquisado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredOrders.map((order) => {
            const cleanPhone = order.customer.phone.replace(/\D/g, "");
            const whatsappUrl = `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(
              order.customer.name
            )}!%20Aqui%20%C3%A9%20da%20GIZZAR%20sobre%20o%20seu%20pedido%20%23${order.id}.`;

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-stone/70 bg-white p-6 transition-all hover:border-gold"
              >
                {/* Linha 1: ID, Data, Status e Ação */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone/40">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-ink font-sans">
                      Pedido #{order.id}
                    </span>
                    <span className="text-xs text-taupe font-medium">
                      {new Date(order.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="btn-outline rounded-full py-1.5 px-4 text-xs font-semibold cursor-pointer"
                    >
                      <EyeIcon size={14} />
                      <span>Ficha de envio</span>
                    </button>
                  </div>
                </div>

                {/* Linha 2: Grid Cliente, Endereço e Produtos */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                  {/* Dados do Cliente */}
                  <div className="md:col-span-4 p-4 rounded-xl bg-sand/30 border border-stone/50 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-taupe">
                      Cliente comprador
                    </p>
                    <p className="font-bold text-ink text-sm">
                      {order.customer.name}
                    </p>
                    <p className="text-taupe">E-mail: <strong className="text-ink font-medium">{order.customer.email}</strong></p>
                    <p className="text-taupe">CPF: <strong className="text-ink font-mono font-medium">{order.customer.cpf}</strong></p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-taupe">{order.customer.phone}</span>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/15 text-[#128C7E] px-2.5 py-0.5 text-xs font-semibold hover:bg-[#25D366]/25 transition"
                      >
                        <WhatsAppIcon size={13} /> WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Endereço de Entrega */}
                  <div className="md:col-span-4 p-4 rounded-xl bg-sand/30 border border-stone/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-taupe flex items-center gap-1">
                        <MapPinIcon size={12} className="text-gold-dark" />
                        Destino da mercadoria
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopyAddress(order)}
                        className="text-xs text-taupe hover:text-ink flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        {copiedId === order.id ? (
                          <span className="text-gold-dark font-bold flex items-center gap-1">
                            <CheckIcon size={12} /> Copiado
                          </span>
                        ) : (
                          <>
                            <CopyIcon size={12} /> Copiar
                          </>
                        )}
                      </button>
                    </div>

                    <p className="font-bold text-ink">
                      {order.shippingAddress.street}, {order.shippingAddress.number}
                      {order.shippingAddress.complement ? ` (${order.shippingAddress.complement})` : ""}
                    </p>
                    <p className="text-taupe">
                      {order.shippingAddress.neighborhood} &bull; {order.shippingAddress.city} - {order.shippingAddress.state}
                    </p>
                    <p className="text-taupe">
                      CEP: <strong className="text-ink font-mono font-bold text-xs">{order.shippingAddress.cep}</strong>
                    </p>
                    <div className="pt-1.5 text-xs text-taupe flex items-center gap-1.5">
                      <TruckIcon size={13} className="text-taupe" />
                      <span>{order.shippingMethod}</span>
                      {order.trackingCode && (
                        <span className="font-mono font-bold text-ink ml-1 bg-white px-2 py-0.5 rounded border border-stone/60">
                          {order.trackingCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Produtos Comprados */}
                  <div className="md:col-span-4 p-4 rounded-xl bg-sand/30 border border-stone/50 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-taupe mb-2">
                        Bolsas compradas ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative h-11 w-9 rounded-lg overflow-hidden bg-sand border border-stone/60 shrink-0">
                              <Image
                                src={item.image || "/brand/hero.jpg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-ink truncate">
                                {item.quantity}x {item.name}
                              </p>
                              <p className="text-[11px] text-taupe">
                                {formatPrice(item.price)} cada
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preço total no formato do anexo 1 */}
                    <div className="mt-3 pt-2.5 border-t border-stone/40 flex items-center justify-between">
                      <span className="text-taupe text-xs font-medium">Total do pedido:</span>
                      <span className="text-lg font-bold tracking-tight text-ink font-sans">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Linha 3: Atualização de Status & Ações */}
                <div className="mt-5 pt-3.5 border-t border-stone/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-taupe">
                      Status do envio:
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => {
                        updateOrderStatus(order.id, e.target.value as AdminOrder["status"]);
                        onOrdersUpdated();
                      }}
                      className="rounded-full border border-stone bg-white px-3.5 py-1.5 text-xs font-semibold text-ink cursor-pointer focus:border-gold outline-none"
                    >
                      <option value="paid">Pago — Aguardando envio</option>
                      <option value="shipped">Em trânsito / Enviado</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyAddress(order)}
                      className="btn-outline rounded-full py-2 px-4 text-xs font-semibold cursor-pointer"
                    >
                      <CopyIcon size={13} />
                      <span>Copiar endereço</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="btn-primary rounded-full py-2 px-5 text-xs font-semibold cursor-pointer"
                    >
                      Detalhes do pedido
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Ficha de Envio */}
      {selectedOrder && (
        <AdminOrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={() => {
            onOrdersUpdated();
            const current = orders.find((o) => o.id === selectedOrder.id);
            if (current) setSelectedOrder(current);
          }}
        />
      )}
    </div>
  );
}
