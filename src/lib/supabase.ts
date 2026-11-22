/**
 * ============================================================
 *  CLIENTE SUPABASE (PostgREST + Storage) — GIZZAR
 *  Projeto: ffqbjycwxlsiwetszepk (sa-east-1)
 * ============================================================
 */

import type { Product } from "@/data/products";
import type {
  AdminBannerConfig,
  AdminOrder,
  AdminProduct,
  OrderStatus,
} from "@/lib/admin-store";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ffqbjycwxlsiwetszepk.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmcWJqeWN3eGxzaXdldHN6ZXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzNTcyNDAsImV4cCI6MjExMDkzMzI0MH0.XOaU-k_akj69AKlZFqDLq2-xFCF0V2N9NrxWydcpfIQ";

const REST_URL = `${SUPABASE_URL}/rest/v1`;
const STORAGE_URL = `${SUPABASE_URL}/storage/v1`;
const BUCKET_NAME = "product-images";

function getHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/* ---------------- Mapeadores Postgres (snake_case <-> camelCase) ---------------- */

interface DbProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number | string;
  compare_at_price: number | string | null;
  short_description: string;
  description: string;
  details: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  weight_kg: number | string;
  dimensions_cm: { length: number; width: number; height: number };
  stock: number;
  featured: boolean;
  is_new: boolean;
  created_at?: string;
  updated_at?: string;
}

export function mapDbRowToProduct(row: DbProductRow): AdminProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category || "bolsas",
    price: Number(row.price),
    compareAtPrice:
      row.compare_at_price !== null && row.compare_at_price !== undefined
        ? Number(row.compare_at_price)
        : undefined,
    shortDescription: row.short_description || "",
    description: row.description || "",
    details: Array.isArray(row.details) ? row.details : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    images:
      Array.isArray(row.images) && row.images.length > 0
        ? row.images
        : ["/brand/hero.jpg"],
    weightKg: Number(row.weight_kg) || 0.6,
    dimensionsCm: row.dimensions_cm || { length: 28, width: 20, height: 10 },
    stock: Number(row.stock ?? 0),
    featured: Boolean(row.featured),
    isNew: Boolean(row.is_new),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProductToDbRow(product: AdminProduct | Product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category || "bolsas",
    price: product.price,
    compare_at_price: product.compareAtPrice ?? null,
    short_description: product.shortDescription || "",
    description: product.description || "",
    details: product.details || [],
    colors: product.colors || [],
    images: product.images || [],
    weight_kg: product.weightKg ?? 0.6,
    dimensions_cm: product.dimensionsCm || { length: 28, width: 20, height: 10 },
    stock: product.stock ?? 0,
    featured: Boolean(product.featured),
    is_new: Boolean(product.isNew),
    updated_at: new Date().toISOString(),
  };
}

interface DbBannerRow {
  id: string;
  active: boolean;
  headline: string;
  subheadline: string;
  tag: string;
  image_url: string;
  link_url: string;
  button_text: string;
  show_button: boolean;
  alt_text: string;
  overlay_darkness?: number | null;
  updated_at: string;
}

function mapDbRowToBanner(row: DbBannerRow): AdminBannerConfig {
  return {
    id: row.id,
    active: Boolean(row.active),
    headline: row.headline || "",
    subheadline: row.subheadline || "",
    tag: row.tag || "",
    imageUrl: row.image_url || "/brand/sem titulo.jpg",
    linkUrl: row.link_url || "/catalogo",
    buttonText: row.button_text || "Ver Bolsas",
    showButton: Boolean(row.show_button),
    altText: row.alt_text || "",
    overlayDarkness: row.overlay_darkness ?? undefined,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function mapBannerToDbRow(banner: AdminBannerConfig) {
  return {
    id: banner.id || "banner-home-frete",
    active: banner.active,
    headline: banner.headline,
    subheadline: banner.subheadline,
    tag: banner.tag,
    image_url: banner.imageUrl,
    link_url: banner.linkUrl,
    button_text: banner.buttonText,
    show_button: banner.showButton,
    alt_text: banner.altText,
    overlay_darkness: banner.overlayDarkness ?? 0,
    updated_at: new Date().toISOString(),
  };
}

interface DbOrderRow {
  id: string;
  date: string;
  status: OrderStatus;
  customer: AdminOrder["customer"];
  shipping_address: AdminOrder["shippingAddress"];
  shipping_method: string;
  shipping_cost: number | string;
  tracking_code?: string | null;
  items: AdminOrder["items"];
  payment_method: "pix" | "credit_card";
  payment_details?: AdminOrder["paymentDetails"] | null;
  subtotal: number | string;
  total: number | string;
  notes?: string | null;
}

function mapDbRowToOrder(row: DbOrderRow): AdminOrder {
  return {
    id: row.id,
    date: row.date,
    status: row.status,
    customer: row.customer,
    shippingAddress: row.shipping_address,
    shippingMethod: row.shipping_method,
    shippingCost: Number(row.shipping_cost),
    trackingCode: row.tracking_code ?? undefined,
    items: Array.isArray(row.items) ? row.items : [],
    paymentMethod: row.payment_method,
    paymentDetails: row.payment_details ?? undefined,
    subtotal: Number(row.subtotal),
    total: Number(row.total),
    notes: row.notes ?? undefined,
  };
}

function mapOrderToDbRow(order: AdminOrder) {
  return {
    id: order.id,
    date: order.date,
    status: order.status,
    customer: order.customer,
    shipping_address: order.shippingAddress,
    shipping_method: order.shippingMethod,
    shipping_cost: order.shippingCost,
    tracking_code: order.trackingCode ?? null,
    items: order.items,
    payment_method: order.paymentMethod,
    payment_details: order.paymentDetails ?? null,
    subtotal: order.subtotal,
    total: order.total,
    notes: order.notes ?? null,
    updated_at: new Date().toISOString(),
  };
}

/* ---------------- PRODUTOS (Supabase Database) ---------------- */

export async function fetchSupabaseProducts(): Promise<AdminProduct[] | null> {
  try {
    const res = await fetch(`${REST_URL}/products?select=*&order=created_at.desc`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as DbProductRow[];
    return rows.map(mapDbRowToProduct);
  } catch (err) {
    console.warn("[Supabase] Erro ao buscar produtos:", err);
    return null;
  }
}

export async function fetchSupabaseProductBySlug(slug: string): Promise<AdminProduct | null> {
  try {
    const res = await fetch(
      `${REST_URL}/products?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
      {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as DbProductRow[];
    return rows[0] ? mapDbRowToProduct(rows[0]) : null;
  } catch {
    return null;
  }
}

export async function fetchSupabaseProductById(id: string): Promise<AdminProduct | null> {
  try {
    const res = await fetch(
      `${REST_URL}/products?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
      {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as DbProductRow[];
    return rows[0] ? mapDbRowToProduct(rows[0]) : null;
  } catch {
    return null;
  }
}

export async function upsertSupabaseProduct(product: AdminProduct): Promise<AdminProduct | null> {
  try {
    const payload = mapProductToDbRow(product);
    const res = await fetch(`${REST_URL}/products?on_conflict=id`, {
      method: "POST",
      headers: getHeaders({
        Prefer: "resolution=merge-duplicates,return=representation",
      }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("[Supabase] Erro ao salvar produto:", await res.text());
      return null;
    }
    const rows = (await res.json()) as DbProductRow[];
    return rows[0] ? mapDbRowToProduct(rows[0]) : product;
  } catch (err) {
    console.error("[Supabase] Falha de conexão ao salvar produto:", err);
    return null;
  }
}

export async function deleteSupabaseProduct(productId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${REST_URL}/products?id=eq.${encodeURIComponent(productId)}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );
    return res.ok;
  } catch (err) {
    console.error("[Supabase] Erro ao excluir produto:", err);
    return false;
  }
}

/* ---------------- BANNER PROMOCIONAL (Supabase Database) ---------------- */

export async function fetchSupabaseBanner(): Promise<AdminBannerConfig | null> {
  try {
    const res = await fetch(
      `${REST_URL}/banner_config?id=eq.banner-home-frete&select=*&limit=1`,
      {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as DbBannerRow[];
    return rows[0] ? mapDbRowToBanner(rows[0]) : null;
  } catch {
    return null;
  }
}

export async function upsertSupabaseBanner(
  banner: AdminBannerConfig
): Promise<AdminBannerConfig | null> {
  try {
    const payload = mapBannerToDbRow(banner);
    const res = await fetch(`${REST_URL}/banner_config?on_conflict=id`, {
      method: "POST",
      headers: getHeaders({
        Prefer: "resolution=merge-duplicates,return=representation",
      }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as DbBannerRow[];
    return rows[0] ? mapDbRowToBanner(rows[0]) : banner;
  } catch {
    return null;
  }
}

/* ---------------- PEDIDOS (Supabase Database) ---------------- */

export async function fetchSupabaseOrders(): Promise<AdminOrder[] | null> {
  try {
    const res = await fetch(`${REST_URL}/orders?select=*&order=date.desc`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as DbOrderRow[];
    return rows.map(mapDbRowToOrder);
  } catch {
    return null;
  }
}

export async function upsertSupabaseOrder(order: AdminOrder): Promise<AdminOrder | null> {
  try {
    const payload = mapOrderToDbRow(order);
    const res = await fetch(`${REST_URL}/orders?on_conflict=id`, {
      method: "POST",
      headers: getHeaders({
        Prefer: "resolution=merge-duplicates,return=representation",
      }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as DbOrderRow[];
    return rows[0] ? mapDbRowToOrder(rows[0]) : order;
  } catch {
    return null;
  }
}

export async function patchSupabaseOrder(
  orderId: string,
  patch: Partial<{ status: OrderStatus; tracking_code: string }>
): Promise<boolean> {
  try {
    const res = await fetch(
      `${REST_URL}/orders?id=eq.${encodeURIComponent(orderId)}`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          ...patch,
          updated_at: new Date().toISOString(),
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

/* ---------------- AUTENTICAÇÃO ADMIN (Supabase Database) ---------------- */

export async function verifySupabaseAdminCredentials(
  email: string,
  password: string
): Promise<{ email: string; name: string; role: string } | null> {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const res = await fetch(
      `${REST_URL}/admin_users?email=eq.${encodeURIComponent(cleanEmail)}&select=email,name,password_hash,role&limit=1`,
      {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      }
    );
    if (res.ok) {
      const rows = (await res.json()) as Array<{
        email: string;
        name: string;
        password_hash: string;
        role: string;
      }>;
      if (rows[0]) {
        if (rows[0].password_hash === password) {
          return {
            email: rows[0].email,
            name: rows[0].name,
            role: rows[0].role,
          };
        }
        return null;
      }
    }
  } catch {
    // Fallback local se offline
  }

  if (cleanEmail === "admin@gizzar.com.br" && password === "admin123") {
    return {
      email: "admin@gizzar.com.br",
      name: "Alexsander Marinho",
      role: "Administrador Master",
    };
  }

  return null;
}

/* ---------------- STORAGE DE FOTOS (Supabase Bucket product-images) ---------------- */

function dataUrlToBlob(dataUrl: string): { blob: Blob; ext: string; mime: string } {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const ext = mime.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return { blob: new Blob([array], { type: mime }), ext, mime };
}

/**
 * Faz upload de uma imagem (DataURL otimizado ou File) para o bucket `product-images`
 * no Supabase Storage e retorna a URL pública permanente.
 */
export async function uploadImageToSupabaseStorage(
  dataUrl: string,
  prefix = "bolsa"
): Promise<string> {
  try {
    const { blob, ext, mime } = dataUrlToBlob(dataUrl);
    const cleanPrefix = prefix
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "bolsa";
    const filePath = `catalog/${cleanPrefix}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}.${ext}`;

    const res = await fetch(`${STORAGE_URL}/object/${BUCKET_NAME}/${filePath}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": mime,
        "x-upsert": "true",
      },
      body: blob,
    });

    if (!res.ok) {
      console.warn("[Supabase Storage] Fallback para Base64:", await res.text());
      return dataUrl;
    }

    return `${STORAGE_URL}/object/public/${BUCKET_NAME}/${filePath}`;
  } catch (err) {
    console.warn("[Supabase Storage] Erro no upload, mantendo Base64:", err);
    return dataUrl;
  }
}
