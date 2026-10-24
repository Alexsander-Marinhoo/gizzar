import { products as defaultProducts, Product, Category, categories as defaultCategories } from "@/data/products";

export interface AdminProduct extends Product {
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminOrderItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

export interface AdminCustomer {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface AdminShippingAddress {
  recipientName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface AdminOrder {
  id: string;
  date: string;
  status: OrderStatus;
  customer: AdminCustomer;
  shippingAddress: AdminShippingAddress;
  shippingMethod: string;
  shippingCost: number;
  trackingCode?: string;
  items: AdminOrderItem[];
  paymentMethod: "pix" | "credit_card";
  paymentDetails?: {
    installments?: number;
    last4?: string;
  };
  subtotal: number;
  total: number;
  notes?: string;
}

export interface AdminBannerConfig {
  id: string;
  active: boolean;
  headline: string;
  subheadline: string;
  tag: string;
  imageUrl: string;
  linkUrl: string;
  buttonText: string;
  showButton: boolean;
  altText: string;
  overlayDarkness?: number;
  updatedAt: string;
}

export interface AdminSession {
  email: string;
  name: string;
  role: string;
  token: string;
  loggedInAt: string;
}

const STORAGE_KEYS = {
  PRODUCTS: "gizzar_admin_products",
  ORDERS: "gizzar_admin_orders",
  BANNER: "gizzar_admin_banner",
  SESSION: "gizzar_admin_session",
};

export const DEFAULT_BANNER_CONFIG: AdminBannerConfig = {
  id: "banner-home-frete",
  active: true,
  headline: "FRETE GRÁTIS",
  subheadline: "A PARTIR DE R$ 499,90",
  tag: "CAMPANHA ESPECIAL",
  imageUrl: "/brand/sem titulo.jpg",
  linkUrl: "/catalogo",
  buttonText: "Ver Bolsas",
  showButton: false,
  altText: "GIZZAR — Frete Grátis a partir de R$ 499,90",
  updatedAt: "2026-10-24T12:00:00.000Z",
};

export const DEFAULT_ORDERS: AdminOrder[] = [
  {
    id: "GZ-1048",
    date: "2026-10-24T12:45:00.000Z",
    status: "paid",
    customer: {
      name: "Mariana Alencar Ferreira",
      email: "mariana.alencar@gmail.com",
      phone: "(11) 98765-4321",
      cpf: "342.128.948-12",
    },
    shippingAddress: {
      recipientName: "Mariana Alencar Ferreira",
      street: "Alameda dos Anapurus",
      number: "1420",
      complement: "Apto 82 - Bloco B",
      neighborhood: "Moema",
      city: "São Paulo",
      state: "SP",
      cep: "04087-004",
    },
    shippingMethod: "SEDEX Expresso",
    shippingCost: 28.5,
    items: [
      {
        id: "gz-001",
        slug: "bolsa-tote-noir",
        name: "Bolsa Tote Noir",
        price: 459.9,
        quantity: 1,
        image: "/products/tote-noir.jpg",
        color: "Preto",
      },
      {
        id: "gz-006",
        slug: "clutch-dourada",
        name: "Clutch Dourada",
        price: 199.9,
        quantity: 1,
        image: "/products/clutch-dourada.jpg",
        color: "Dourado",
      },
    ],
    paymentMethod: "credit_card",
    paymentDetails: {
      installments: 3,
      last4: "8841",
    },
    subtotal: 659.8,
    total: 688.3,
    notes: "Embalar para presente se possível.",
  },
  {
    id: "GZ-1047",
    date: "2026-10-24T09:30:00.000Z",
    status: "paid",
    customer: {
      name: "Alexsander Marinho",
      email: "alexsander.marinho@hotmail.com",
      phone: "(21) 99123-4567",
      cpf: "128.459.782-33",
    },
    shippingAddress: {
      recipientName: "Alexsander Marinho",
      street: "Avenida Atlântica",
      number: "3100",
      complement: "Cobertura 01",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      cep: "22070-000",
    },
    shippingMethod: "Frete Grátis Especial",
    shippingCost: 0,
    items: [
      {
        id: "gz-008",
        slug: "bolsa-satchel-terracota",
        name: "Satchel Terracota",
        price: 429.9,
        quantity: 1,
        image: "/products/satchel-terracota.jpg",
        color: "Terracota",
      },
    ],
    paymentMethod: "pix",
    subtotal: 429.9,
    total: 429.9,
    notes: "Cliente VIP. Enviar brinde perfume.",
  },
  {
    id: "GZ-1046",
    date: "2026-10-23T15:20:00.000Z",
    status: "shipped",
    trackingCode: "NL819283719BR",
    customer: {
      name: "Beatriz Helena Costa",
      email: "beatriz.costa@outlook.com",
      phone: "(31) 97321-9876",
      cpf: "089.431.226-55",
    },
    shippingAddress: {
      recipientName: "Beatriz Helena Costa",
      street: "Rua Santa Catarina",
      number: "895",
      neighborhood: "Lourdes",
      city: "Belo Horizonte",
      state: "MG",
      cep: "30170-081",
    },
    shippingMethod: "PAC Correios",
    shippingCost: 22.0,
    items: [
      {
        id: "gz-002",
        slug: "bolsa-transversal-caramelo",
        name: "Transversal Caramelo",
        price: 289.9,
        quantity: 1,
        image: "/products/crossbody-caramelo.jpg",
        color: "Caramelo",
      },
    ],
    paymentMethod: "credit_card",
    paymentDetails: {
      installments: 2,
      last4: "3109",
    },
    subtotal: 289.9,
    total: 311.9,
  },
  {
    id: "GZ-1045",
    date: "2026-10-22T11:00:00.000Z",
    status: "delivered",
    trackingCode: "BR992384712SP",
    customer: {
      name: "Camila Rodrigues Rocha",
      email: "camila.rocha@uol.com.br",
      phone: "(41) 98877-6655",
      cpf: "512.981.449-70",
    },
    shippingAddress: {
      recipientName: "Camila Rodrigues Rocha",
      street: "Rua Bispo Dom José",
      number: "2090",
      complement: "Casa 3",
      neighborhood: "Batel",
      city: "Curitiba",
      state: "PR",
      cep: "80440-080",
    },
    shippingMethod: "SEDEX Expresso",
    shippingCost: 34.0,
    items: [
      {
        id: "gz-009",
        slug: "bolsa-flap-croco-noir",
        name: "Flap Croco Noir",
        price: 379.9,
        quantity: 1,
        image: "/products/flap-croco-noir.jpg",
        color: "Preto Croco",
      },
    ],
    paymentMethod: "pix",
    subtotal: 379.9,
    total: 413.9,
  },
  {
    id: "GZ-1044",
    date: "2026-10-21T16:15:00.000Z",
    status: "delivered",
    trackingCode: "BR771239841RJ",
    customer: {
      name: "Juliana Mendes Paiva",
      email: "juliana.mendes@gmail.com",
      phone: "(19) 99654-3210",
      cpf: "219.784.651-09",
    },
    shippingAddress: {
      recipientName: "Juliana Mendes Paiva",
      street: "Avenida Coronel Silva Telles",
      number: "450",
      neighborhood: "Cambuí",
      city: "Campinas",
      state: "SP",
      cep: "13024-000",
    },
    shippingMethod: "SEDEX Expresso",
    shippingCost: 19.9,
    items: [
      {
        id: "gz-003",
        slug: "mini-bag-perola",
        name: "Mini Bag Pérola",
        price: 249.9,
        quantity: 1,
        image: "/products/mini-perola.jpg",
        color: "Pérola",
      },
      {
        id: "gz-007",
        slug: "bolsa-baguette-oliva",
        name: "Baguete Oliva",
        price: 349.9,
        quantity: 1,
        image: "/products/baguette-oliva.jpg",
        color: "Verde Oliva",
      },
    ],
    paymentMethod: "credit_card",
    paymentDetails: {
      installments: 5,
      last4: "4920",
    },
    subtotal: 599.8,
    total: 619.7,
  },
];

/* ---------------- Helper functions for browser local storage ---------------- */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// PRODUCTS
export function getStoredProducts(): AdminProduct[] {
  if (!isBrowser()) return defaultProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    return JSON.parse(raw);
  } catch {
    return defaultProducts;
  }
}

export function saveProduct(product: AdminProduct): AdminProduct[] {
  if (!isBrowser()) return defaultProducts;
  const current = getStoredProducts();
  const existingIdx = current.findIndex((p) => p.id === product.id);

  let updated: AdminProduct[];
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...product, updatedAt: now };
  } else {
    updated = [{ ...product, createdAt: now, updatedAt: now }, ...current];
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  window.dispatchEvent(new Event("gizzar_products_updated"));
  return updated;
}

export function deleteProduct(productId: string): AdminProduct[] {
  if (!isBrowser()) return defaultProducts;
  const current = getStoredProducts();
  const filtered = current.filter((p) => p.id !== productId);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  window.dispatchEvent(new Event("gizzar_products_updated"));
  return filtered;
}

// BANNER
export function getStoredBannerConfig(): AdminBannerConfig {
  if (!isBrowser()) return DEFAULT_BANNER_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BANNER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(DEFAULT_BANNER_CONFIG));
      return DEFAULT_BANNER_CONFIG;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BANNER_CONFIG;
  }
}

export function saveBannerConfig(config: Partial<AdminBannerConfig>): AdminBannerConfig {
  if (!isBrowser()) return DEFAULT_BANNER_CONFIG;
  const current = getStoredBannerConfig();
  const updated: AdminBannerConfig = {
    ...current,
    ...config,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(updated));
  window.dispatchEvent(new Event("gizzar_banner_updated"));
  return updated;
}

// ORDERS
export function getStoredOrders(): AdminOrder[] {
  if (!isBrowser()) return DEFAULT_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ORDERS;
  }
}

export function updateOrderStatus(orderId: string, status: OrderStatus): AdminOrder[] {
  if (!isBrowser()) return DEFAULT_ORDERS;
  const current = getStoredOrders();
  const updated = current.map((order) => {
    if (order.id === orderId) {
      return { ...order, status };
    }
    return order;
  });
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  window.dispatchEvent(new Event("gizzar_orders_updated"));
  return updated;
}

export function updateOrderTracking(orderId: string, trackingCode: string): AdminOrder[] {
  if (!isBrowser()) return DEFAULT_ORDERS;
  const current = getStoredOrders();
  const updated = current.map((order) => {
    if (order.id === orderId) {
      return {
        ...order,
        trackingCode,
        status: order.status === "paid" ? ("shipped" as OrderStatus) : order.status,
      };
    }
    return order;
  });
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  window.dispatchEvent(new Event("gizzar_orders_updated"));
  return updated;
}

// AUTH SESSION
export function getAdminSession(): AdminSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAdminSession(email: string, name = "Alexsander Marinho"): AdminSession {
  const session: AdminSession = {
    email,
    name,
    role: "Administrador Master",
    token: `session_${Date.now()}`,
    loggedInAt: new Date().toISOString(),
  };
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  }
  return session;
}

export function clearAdminSession(): void {
  if (isBrowser()) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}
