"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/data/products";
import AddToCartButton from "./AddToCartButton";
import QuantitySelector from "./QuantitySelector";
import ShippingCalculator from "@/components/shipping/ShippingCalculator";
import { formatPrice, installmentLabel } from "@/lib/format";

export default function PurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const soldOut = product.stock <= 0;

  useEffect(() => {
    setMounted(true);

    function handleScroll() {
      if (!panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      // Ativa a barra fixa apenas após o container de compra passar da parte superior da tela
      setShowStickyBar(rect.bottom < 80);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={panelRef} className="space-y-6">
      {product.colors && (
        <div>
          <p className="label">Cor: <span className="normal-case tracking-normal text-ink">{product.colors[0].name}</span></p>
          <div className="flex gap-2">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-9 w-9 rounded-full border-2 border-ivory ring-1 ring-ink"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {!soldOut && (
        <div className="flex items-center gap-4">
          <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
          {product.stock <= 8 && (
            <p className="text-xs font-medium text-gold-dark">Restam apenas {product.stock} unidades</p>
          )}
        </div>
      )}

      <div className="grid gap-3">
        <AddToCartButton id="buy-now-button" productId={product.id} quantity={quantity} buyNow disabled={soldOut} className="w-full py-4" />
        <AddToCartButton id="add-to-cart-button" productId={product.id} quantity={quantity} disabled={soldOut} />
      </div>

      <ShippingCalculator items={[{ productId: product.id, quantity }]} />

      {/* Barra fixa de compra — mobile (ativa somente após passar do container de compra) */}
      {!soldOut && mounted && typeof document !== "undefined" &&
        createPortal(
          <div
            className={`fixed inset-x-0 bottom-0 z-50 border-t border-stone/80 bg-ivory px-4 py-2.5 pb-[calc(0.65rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out md:hidden ${
              showStickyBar
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "translate-y-full opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-taupe">{product.name}</p>
                <p className="text-base font-semibold leading-tight text-ink">{formatPrice(product.price)}</p>
                <p className="text-[11px] text-taupe leading-tight">{installmentLabel(product.price)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <AddToCartButton
                  productId={product.id}
                  quantity={quantity}
                  variant="icon"
                  className="h-10 w-10 border border-stone/70 bg-white text-ink shadow-xs"
                />
                <AddToCartButton
                  productId={product.id}
                  quantity={quantity}
                  buyNow
                  variant="compact"
                  className="px-5! py-3! text-xs font-semibold whitespace-nowrap"
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
