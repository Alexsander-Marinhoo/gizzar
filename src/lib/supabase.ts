/**
 * ============================================================
 *  CLIENTE SUPABASE (Auth JWT + PostgREST + Storage) — GIZZAR
 *  Projeto: ffqbjycwxlsiwetszepk (sa-east-1)
 * ============================================================
 */

import type { Product } from "@/data/products";
import type {
  AdminBannerConfig,
  AdminOrder,
  AdminProduct,
  AdminSession,
  OrderStatus,
} from "@/lib/admin-store";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ffqbjycwxlsiwetszepk.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmcWJqeWN3eGxzaXdldHN6ZXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzNTcyNDAsImV4cCI6MjExMDkzMzI0MH0.XOaU-k_akj69AKlZFqDLq2-xFCF0V2N9NrxWydcpfIQ";

const REST_URL = `${SUPABASE_URL}/rest/v1`;
const AUTH_URL = `${SUPABASE_URL}/auth/v1`;
const STORAGE_URL = `${SUPABASE_URL}/storage/v1`;
const BUCKET_NAME = "product-images";
const SESSION_STORAGE_KEY = "gizzar_admin_session_v2";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const DEFAULT_BANNER_UUID = "00000000-0000-4000-8000-000000000100";

export function ensureUuid(value?: string): string {
  if (value && UUID_REGEX.test(value)) return value;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Obtém o JWT de autenticação do Supabase Auth salvo na sessão do administrador,
 * caso esteja no navegador. Operações de escrita (INSERT, UPDATE, DELETE) exigem
 * este token devido às políticas de RLS (`TO authenticated`).
 */
function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    return parsed?.token || null;
  } catch {
    return null;
  }
}

function getHeaders(
  options?: { requireAuth?: boolean; extra?: Record<string, string> }
): Record<string, string> {
  const accessToken = getStoredAccessToken();
  const bearer =
    options?.requireAuth && accessToken ? accessToken : accessToken || SUPABASE_ANON_KEY;

  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${bearer}`,
    "Content-Type": "application/json",
    ...options?.extra,
  };
}

/* ---------------- SUPABASE AUTH (GoTrue JWT) ---------------- */

export interface SupabaseAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
  refresh_token: string;
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      name?: string;
      role?: string;
    };
    app_metadata?: {
      role?: string;
    };
  };
}

/**
 * Realiza login oficial no Supabase Auth (`/auth/v1/token?grant_type=password`).
 * Retorna a sessão com o JWT real assinado pelo Supabase (`authenticated`).
 */
export async function signInWithSupabaseAuth(
  email: string,
  password: string
): Promise<AdminSession> {
  const res = await fetch(`${AUTH_URL}/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    const msg =
      data?.msg ||
      data?.error_description ||
      data?.error ||
      "E-mail ou senha inválidos.";
    throw new Error(
      msg === "Invalid login credentials"
        ? "E-mail ou senha incorretos."
        : msg
    );
  }

  const authData = data as SupabaseAuthResponse;
  const session: AdminSession = {
    userId: authData.user.id,
    email: authData.user.email || email.trim().toLowerCase(),
    name: authData.user.user_metadata?.name || "Administrador GIZZAR",
    role:
      authData.user.user_metadata?.role ||
      authData.user.app_metadata?.role ||
      "Administrador Master",
    token: authData.access_token,
    refreshToken: authData.refresh_token,
    expiresAt:
      authData.expires_at ||
      Math.floor(Date.now() / 1000) + (authData.expires_in || 3600),
    loggedInAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  return session;
}

/**
 * Renova o token JWT no Supabase Auth usando o `refresh_token`.
 */
export async function refreshSupabaseAuthSession(
  refreshToken: string
): Promise<AdminSession | null> {
  try {
    const res = await fetch(`${AUTH_URL}/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    const authData = (await res.json()) as SupabaseAuthResponse;
    if (!authData.access_token) return null;

    const session: AdminSession = {
      userId: authData.user.id,
      email: authData.user.email || "admin@gizzar.com.br",
      name: authData.user.user_metadata?.name || "Administrador GIZZAR",
      role:
        authData.user.user_metadata?.role ||
        authData.user.app_metadata?.role ||
        "Administrador Master",
      token: authData.access_token,
      refreshToken: authData.refresh_token,
      expiresAt:
        authData.expires_at ||
        Math.floor(Date.now() / 1000) + (authData.expires_in || 3600),
      loggedInAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Valida se o JWT atual ainda é aceito pelo servidor do Supabase Auth (`/auth/v1/user`).
 * Se estiver expirado e houver `refreshToken`, tenta renovar automaticamente.
 */
export async function verifySupabaseAuthSession(
  session: AdminSession | null
): Promise<AdminSession | null> {
  if (!session?.token) return null;

  const nowSec = Math.floor(Date.now() / 1000);
  if (session.expiresAt && session.expiresAt - nowSec < 60 && session.refreshToken) {
    const refreshed = await refreshSupabaseAuthSession(session.refreshToken);
    if (refreshed) return refreshed;
  }

  try {
    const res = await fetch(`${AUTH_URL}/user`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.token}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const user = await res.json();
      if (user?.id) return session;
    }

    if (session.refreshToken) {
      return await refreshSupabaseAuthSession(session.refreshToken);
    }
    return null;
  } catch {
    return session;
  }
}

/**
 * Encerra a sessão no Supabase Auth (`/auth/v1/logout`).
 */
export async function signOutFromSupabaseAuth(token?: string): Promise<void> {
  const jwt = token || getStoredAccessToken();
  if (jwt) {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${jwt}`,
        },
      });
    } catch {
      // ignore network error on logout
    }
  }
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
    id: ensureUuid(product.id),
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
    id: UUID_REGEX.test(banner.id) ? banner.id : DEFAULT_BANNER_UUID,
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
    id: ensureUuid(order.id),
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
        requireAuth: true,
        extra: {
          Prefer: "resolution=merge-duplicates,return=representation",
        },
      }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("[Supabase] Erro ao salvar produto (verifique login Auth):", await res.text());
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
        headers: getHeaders({ requireAuth: true }),
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
    const res = await fetch(`${REST_URL}/banner_config?select=*&limit=1`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
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
        requireAuth: true,
        extra: {
          Prefer: "resolution=merge-duplicates,return=representation",
        },
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
        requireAuth: true,
        extra: {
          Prefer: "resolution=merge-duplicates,return=representation",
        },
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
        headers: getHeaders({ requireAuth: true }),
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
 * Faz upload de uma imagem (convertida em WebP leve) para o bucket `product-images`
 * dentro da pasta com o ID do produto (`<productId>/<nome>.webp`),
 * autenticada com o JWT do administrador logado (`TO authenticated`).
 */
export async function uploadImageToSupabaseStorage(
  dataUrl: string,
  productId: string,
  fileLabel = "foto"
): Promise<string> {
  try {
    const { blob, ext, mime } = dataUrlToBlob(dataUrl);
    const folderId = ensureUuid(productId);
    const cleanLabel =
      fileLabel
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || "foto";
    const filePath = `${folderId}/${cleanLabel}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)}.${ext}`;

    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      throw new Error(
        "Sessão expirada. Faça login novamente no painel para enviar imagens ao bucket."
      );
    }

    const res = await fetch(`${STORAGE_URL}/object/${BUCKET_NAME}/${filePath}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": mime,
        "x-upsert": "true",
      },
      body: blob,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Supabase Storage] Erro de permissão RLS no upload:", errText);
      throw new Error("Não foi possível salvar a imagem no bucket do Supabase.");
    }

    return `${STORAGE_URL}/object/public/${BUCKET_NAME}/${filePath}`;
  } catch (err) {
    console.error("[Supabase Storage] Erro no upload:", err);
    throw err;
  }
}
