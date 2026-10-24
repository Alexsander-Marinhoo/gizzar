"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminOrder, updateOrderStatus, updateOrderTracking } from "@/lib/admin-store";
import { formatPrice } from "@/lib/format";
import { CloseIcon, CheckIcon, WhatsAppIcon } from "@/components/ui/Icons";
import {
  MapPinIcon,
  TruckIcon,
  PrinterIcon,
  CopyIcon,
  UserIcon,
} from "./AdminIcons";

interface AdminOrderDetailsModalProps {
  order: AdminOrder;
  onClose: () => void;
  onOrderUpdated: () => void;
}

export default function AdminOrderDetailsModal({
  order,
  onClose,
  onOrderUpdated,
}: AdminOrderDetailsModalProps) {
  const [status, setStatus] = useState<AdminOrder["status"]>(order.status);
  const [tracking, setTracking] = useState(order.trackingCode || "");
  const [copied, setCopied] = useState(false);
  const [savingTracking, setSavingTracking] = useState(false);

  const formattedAddress = `${order.shippingAddress.recipientName}
${order.shippingAddress.street}, ${order.shippingAddress.number}${
    order.shippingAddress.complement ? ` - ${order.shippingAddress.complement}` : ""
  }
${order.shippingAddress.neighborhood}
${order.shippingAddress.city} - ${order.shippingAddress.state}
CEP: ${order.shippingAddress.cep}
Tel: ${order.customer.phone}
CPF: ${order.customer.cpf}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(formattedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleStatusChange = (newStatus: AdminOrder["status"]) => {
    setStatus(newStatus);
    updateOrderStatus(order.id, newStatus);
    onOrderUpdated();
  };

  const handleSaveTracking = () => {
    setSavingTracking(true);
    updateOrderTracking(order.id, tracking.trim());
    setTimeout(() => {
      setSavingTracking(false);
      onOrderUpdated();
    }, 350);
  };

  const cleanPhone = order.customer.phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(
    order.customer.name
  )}!%20Aqui%20%C3%A9%20da%20GIZZAR%20sobre%20o%20seu%20pedido%20%23${order.id}.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-ivory p-6 sm:p-10 shadow-2xl border border-stone/80 z-10 animate-fade-up my-auto">
        {/* Topo do Modal */}
        <div className="flex items-start justify-between pb-5 border-b border-stone/50">
          <div>
            <p className="eyebrow">Ficha de expedição</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-sans">
                Pedido #{order.id}
              </span>
              <span className="rounded-full bg-sand border border-stone/80 text-taupe px-3 py-0.5 text-xs font-semibold">
                {new Date(order.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-taupe hover:bg-sand transition cursor-pointer"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Status e Rastreio */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-sand/40 border border-stone/60">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-taupe block mb-1.5">
              Status do pedido
            </label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as AdminOrder["status"])}
              className="w-full rounded-full border border-stone bg-white px-4 py-2.5 text-xs font-semibold text-ink focus:border-gold outline-none cursor-pointer"
            >
              <option value="paid">Pago — Aguardando envio</option>
              <option value="shipped">Enviado / Em trânsito</option>
              <option value="delivered">Entregue ao cliente</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-taupe block mb-1.5">
              Código de rastreamento
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Ex: NL819283719BR"
                className="flex-1 rounded-full border border-stone bg-white px-4 py-2 text-xs font-mono uppercase text-ink focus:border-gold outline-none"
              />
              <button
                type="button"
                onClick={handleSaveTracking}
                disabled={savingTracking}
                className="btn-primary rounded-full py-2 px-5 text-xs font-semibold"
              >
                {savingTracking ? "..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div className="mt-6">
          <p className="eyebrow mb-3 flex items-center gap-1.5">
            <UserIcon size={14} /> Dados do comprador
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-5 rounded-2xl border border-stone/60 bg-sand/20">
            <div>
              <p className="text-taupe uppercase tracking-wider text-[11px] font-semibold">Nome completo:</p>
              <p className="font-bold text-ink mt-0.5 text-sm">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-taupe uppercase tracking-wider text-[11px] font-semibold">CPF:</p>
              <p className="font-mono font-semibold text-ink mt-0.5">{order.customer.cpf}</p>
            </div>
            <div>
              <p className="text-taupe uppercase tracking-wider text-[11px] font-semibold">E-mail:</p>
              <p className="font-semibold text-ink mt-0.5">{order.customer.email}</p>
            </div>
            <div>
              <p className="text-taupe uppercase tracking-wider text-[11px] font-semibold">WhatsApp:</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-ink">{order.customer.phone}</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/15 text-[#128C7E] px-2.5 py-0.5 text-xs font-semibold hover:bg-[#25D366]/25 transition"
                >
                  <WhatsAppIcon size={12} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Endereço de Envio */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="eyebrow flex items-center gap-1.5">
              <MapPinIcon size={14} /> Endereço de entrega
            </p>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="text-xs font-semibold text-taupe hover:text-ink transition flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckIcon size={13} className="text-gold-dark" />
                  <span className="text-gold-dark font-bold">Copiado</span>
                </>
              ) : (
                <>
                  <CopyIcon size={13} />
                  <span>Copiar endereço</span>
                </>
              )}
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-stone/80 bg-white shadow-2xs space-y-1.5 text-xs">
            <p className="text-base font-bold text-ink">
              {order.shippingAddress.recipientName}
            </p>
            <p className="text-ink text-sm">
              {order.shippingAddress.street}, {order.shippingAddress.number}
              {order.shippingAddress.complement ? ` — ${order.shippingAddress.complement}` : ""}
            </p>
            <p className="text-taupe">
              Bairro: <span className="text-ink font-semibold">{order.shippingAddress.neighborhood}</span>
            </p>
            <p className="text-taupe">
              Cidade / UF:{" "}
              <span className="text-ink font-bold">
                {order.shippingAddress.city} - {order.shippingAddress.state}
              </span>
            </p>
            <p className="text-taupe pt-1">
              CEP:{" "}
              <span className="font-mono font-bold text-ink text-sm">
                {order.shippingAddress.cep}
              </span>
            </p>
            <div className="pt-3 mt-2 border-t border-stone/40 flex items-center justify-between text-xs">
              <span className="text-taupe">Frete contratado:</span>
              <span className="font-semibold text-ink flex items-center gap-1.5">
                <TruckIcon size={14} className="text-gold-dark" />
                {order.shippingMethod} ({formatPrice(order.shippingCost)})
              </span>
            </div>
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="mt-6">
          <p className="eyebrow mb-3">
            Peças do pedido ({order.items.length})
          </p>
          <div className="divide-y divide-stone/40 border border-stone/60 rounded-2xl overflow-hidden bg-white">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-3.5">
                <div className="relative h-14 w-11 rounded-lg overflow-hidden bg-sand border border-stone/60 shrink-0">
                  <Image
                    src={item.image || "/brand/hero.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="text-sm font-semibold text-ink">{item.name}</p>
                  {item.color && (
                    <p className="text-xs text-taupe">Cor: {item.color}</p>
                  )}
                  <p className="text-xs text-taupe mt-0.5">
                    {item.quantity} un x {formatPrice(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-ink font-sans">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total e Pagamento idêntico ao estilo da loja */}
        <div className="mt-6 p-5 rounded-2xl bg-sand/40 border border-stone/60 space-y-2 text-xs">
          <div className="flex justify-between text-taupe">
            <span>Subtotal:</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-taupe">
            <span>Frete ({order.shippingMethod}):</span>
            <span>{formatPrice(order.shippingCost)}</span>
          </div>
          <div className="pt-2 border-t border-stone/50 flex justify-between text-base font-bold text-ink">
            <span>Total:</span>
            <span className="text-2xl font-bold text-ink font-sans">
              {formatPrice(order.total)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-taupe pt-1">
            <span>Forma de pagamento:</span>
            <span className="font-semibold text-ink">
              {order.paymentMethod === "pix" ? "Pix Instantâneo" : "Cartão de Crédito"}
              {order.paymentDetails?.installments
                ? ` (${order.paymentDetails.installments}x)`
                : ""}
            </span>
          </div>
        </div>

        {/* Observações */}
        {order.notes && (
          <div className="mt-4 p-4 rounded-xl bg-sand/60 border border-stone/70 text-xs text-ink">
            <strong>Observações:</strong> {order.notes}
          </div>
        )}

        {/* Rodapé com botões idênticos ao anexo 3 */}
        <div className="mt-7 pt-5 border-t border-stone/50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-outline rounded-full py-3 px-6 text-sm font-semibold"
          >
            <PrinterIcon size={16} />
            <span>Imprimir romaneio</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-primary rounded-full py-3 px-8 text-sm font-semibold"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
