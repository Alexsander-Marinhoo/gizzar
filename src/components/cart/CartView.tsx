"use client";

import Image from "next/image";
import Link from "next/link";
import QuantitySelector from "@/components/product/QuantitySelector";
import ShippingCalculator from "@/components/shipping/ShippingCalculator";
import { SecureBadges } from "@/components/ui/Trust";
import { ArrowLeftIcon, ArrowRightIcon, BagIcon, TrashIcon } from "@/components/ui/Icons";
import { useCart } from "@/lib/cart";
import { formatPrice, installmentLabel } from "@/lib/format";
import { siteConfig } from "@/config/site";

export default function CartView() {
  const { items, subtotal, count, setQuantity, remove } = useCart();
  const threshold = siteConfig.shipping.freeShippingThreshold;
  const missing = Math.max(0, threshold - subtotal);
  const progress = threshold > 0 ? Math.min(100, (subtotal / threshold) * 100) : 100;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-gold-dark">
          <BagIcon size={36} />
        </span>
        <h2 className="heading-display mt-6 text-3xl">Sua sacola está vazia</h2>
        <p className="mt-3 text-taupe">Que tal dar uma olhada nas nossas bolsas? Temos certeza de que alguma vai combinar com você.</p>
        <Link href="/catalogo" className="btn-primary mt-8">
          Explorar coleção <ArrowRightIcon size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
      <div>
        {threshold > 0 && (
          <div className="mb-6 rounded-2xl bg-sand/70 p-4">
            <p className="text-sm">
              {missing > 0 ? (
                <>Faltam <strong>{formatPrice(missing)}</strong> para você ganhar <strong>frete grátis</strong> (PAC).</>
              ) : (
                <>🎉 Parabéns! Você ganhou <strong>frete grátis</strong> (PAC).</>
              )}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone/60">
              <div className="h-full rounded-full bg-linear-to-r from-gold to-gold-dark transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <ul className="divide-y divide-stone/60 border-y border-stone/60">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-4 py-6 sm:gap-6">
              <Link href={`/produto/${product.slug}`} className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl bg-sand sm:w-28">
                <Image src={product.images[0]} alt={product.name} fill sizes="112px" className="object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/produto/${product.slug}`} className="font-display text-xl leading-tight hover:text-gold-dark">
                      {product.name}
                    </Link>
                    {product.colors && <p className="mt-1 text-xs text-taupe">Cor: {product.colors[0].name}</p>}
                  </div>
                  <button
                    onClick={() => remove(product.id)}
                    className="-mr-2 -mt-1 rounded-full p-2 text-taupe transition hover:bg-sand hover:text-danger"
                    aria-label={`Remover ${product.name}`}
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>
                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                  <QuantitySelector size="sm" value={quantity} max={product.stock} onChange={(q) => setQuantity(product.id, q)} />
                  <p className="font-semibold">{formatPrice(product.price * quantity)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link href="/catalogo" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-taupe hover:text-ink">
          <ArrowLeftIcon size={16} /> Continuar comprando
        </Link>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="card p-6 sm:p-7">
          <h2 className="font-display text-2xl">Resumo</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-taupe">Subtotal ({count} {count === 1 ? "item" : "itens"})</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-taupe">Frete</dt>
              <dd className="text-taupe">Calculado no checkout</dd>
            </div>
          </dl>
          <div className="mt-5 border-t border-stone/60 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-semibold">{formatPrice(subtotal)}</span>
            </div>
            {installmentLabel(subtotal) && <p className="mt-1 text-right text-xs text-taupe">ou {installmentLabel(subtotal)}</p>}
          </div>

          <Link href="/checkout" id="go-to-checkout" className="btn-primary mt-6 w-full py-4">
            Finalizar compra <ArrowRightIcon size={18} />
          </Link>
          <div className="mt-4 flex justify-center">
            <SecureBadges />
          </div>

          <div className="mt-6 border-t border-stone/60 pt-6">
            <ShippingCalculator compact items={items.map((i) => ({ productId: i.productId, quantity: i.quantity }))} />
          </div>
        </div>
      </aside>

      {/* Barra fixa mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone/60 bg-ivory/95 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-taupe">Total</p>
            <p className="font-semibold">{formatPrice(subtotal)}</p>
          </div>
          <Link href="/checkout" className="btn-primary px-6 py-3.5">
            Finalizar <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
