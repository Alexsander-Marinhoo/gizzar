"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import AddToCartButton from "./AddToCartButton";
import QuantitySelector from "./QuantitySelector";
import ShippingCalculator from "@/components/shipping/ShippingCalculator";
import { formatPrice, installmentLabel } from "@/lib/format";

export default function PurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const soldOut = product.stock <= 0;

  return (
    <div className="space-y-6">
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

      {/* Barra fixa de compra — mobile */}
      {!soldOut && (
        <div className="fixed inset-x-0 bottom-0 z-30 animate-[slide-up_0.4s_ease_both] border-t border-stone/60 bg-ivory/95 px-4 py-2.5 pb-[calc(0.65rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-taupe">{product.name}</p>
              <p className="text-base font-semibold leading-tight text-ink">{formatPrice(product.price)}</p>
              <p className="text-[11px] text-taupe leading-tight">{installmentLabel(product.price)}</p>
            </div>
            <div className="shrink-0">
              <AddToCartButton productId={product.id} quantity={quantity} buyNow variant="compact" className="px-5! py-3! text-xs font-semibold whitespace-nowrap" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
