"use client";

/**
 * Carrinho salvo no localStorage do navegador.
 * Usa useSyncExternalStore para evitar erros de hidratação.
 */

import { useSyncExternalStore } from "react";
import { getProductById, type Product } from "@/data/products";

export type CartLine = { productId: string; quantity: number };
export type CartLineWithProduct = CartLine & { product: Product };

const STORAGE_KEY = "gizzar-cart-v1";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: CartLine[] = raw ? JSON.parse(raw) : [];
    lines = parsed.filter((l) => getProductById(l.productId) && l.quantity > 0);
  } catch {
    lines = EMPTY;
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* modo privado: ignora */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      loaded = false;
      load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return lines;
}

function getServerSnapshot() {
  return EMPTY;
}

export const cartActions = {
  add(productId: string, quantity = 1) {
    load();
    const product = getProductById(productId);
    if (!product) return;
    const existing = lines.find((l) => l.productId === productId);
    const max = product.stock;
    if (existing) {
      commit(
        lines.map((l) =>
          l.productId === productId ? { ...l, quantity: Math.min(max, l.quantity + quantity) } : l,
        ),
      );
    } else {
      commit([...lines, { productId, quantity: Math.min(max, quantity) }]);
    }
  },
  setQuantity(productId: string, quantity: number) {
    load();
    if (quantity <= 0) return cartActions.remove(productId);
    const max = getProductById(productId)?.stock ?? quantity;
    commit(lines.map((l) => (l.productId === productId ? { ...l, quantity: Math.min(max, quantity) } : l)));
  },
  remove(productId: string) {
    load();
    commit(lines.filter((l) => l.productId !== productId));
  },
  clear() {
    commit([]);
  },
};

export function useCart() {
  const cartLines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items: CartLineWithProduct[] = cartLines
    .map((l) => ({ ...l, product: getProductById(l.productId)! }))
    .filter((l) => l.product);
  const count = items.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = items.reduce((sum, l) => sum + l.quantity * l.product.price, 0);
  return { items, count, subtotal, ...cartActions };
}
