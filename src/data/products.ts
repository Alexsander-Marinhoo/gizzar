/**
 * ============================================================
 *  CATÁLOGO DE PRODUTOS
 *
 *  Como trocar/adicionar produtos:
 *  1. Coloque as fotos em /public/products/ (ex.: minha-bolsa-1.jpg).
 *     Recomendado: proporção 3:4 (ex.: 1200x1600), fundo claro.
 *  2. Copie um bloco de produto abaixo e altere os campos.
 *  3. O "slug" vira a URL: /produto/<slug> (sem espaços/acentos).
 *  4. "images": a primeira imagem é a capa; adicione mais para a galeria.
 *
 *  Para uma nova categoria (ex.: cintos), adicione em `categories`
 *  e use o mesmo id no campo `category` dos produtos.
 * ============================================================
 */

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category["id"];
  /** Preço em reais. */
  price: number;
  /** Preço "de" (riscado). Opcional. */
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  details: string[];
  colors?: { name: string; hex: string }[];
  images: string[];
  /** Peso em kg (usado no cálculo de frete). */
  weightKg: number;
  /** Dimensões da embalagem em cm (usado no cálculo de frete). */
  dimensionsCm: { length: number; width: number; height: number };
  stock: number;
  featured?: boolean;
  isNew?: boolean;
};

export const categories: Category[] = [
  {
    id: "bolsas",
    name: "Bolsas",
    description: "Modelos atemporais para todos os momentos.",
  },
  // Próximas categorias:
  // { id: "acessorios", name: "Acessórios", description: "..." },
];

export const products: Product[] = [
  {
    id: "gz-001",
    slug: "bolsa-tote-noir",
    name: "Bolsa Tote Noir",
    category: "bolsas",
    price: 459.9,
    compareAtPrice: 529.9,
    shortDescription: "Tote estruturada em couro sintético premium com fecho dourado.",
    description:
      "A Tote Noir é a parceira ideal para o dia a dia: espaçosa, estruturada e sofisticada. Comporta notebook de até 13\", com divisória interna e bolso com zíper. O fecho dourado traz o toque de elegância que é a assinatura GIZZAR.",
    details: [
      "Material: couro sintético premium",
      "Ferragens douradas antioxidantes",
      "Forro interno em tecido",
      "Dimensões: 38 x 29 x 13 cm",
      "Alças de ombro: 26 cm de queda",
    ],
    colors: [{ name: "Preto", hex: "#141210" }],
    images: [
      "/products/tote-noir.jpg",
      "/products/angles/tote-noir-side.jpg",
      "/products/angles/tote-noir-detail.jpg",
      "/products/angles/tote-noir-back.jpg",
    ],
    weightKg: 0.9,
    dimensionsCm: { length: 40, width: 32, height: 15 },
    stock: 12,
    featured: true,
  },
  {
    id: "gz-002",
    slug: "bolsa-transversal-caramelo",
    name: "Transversal Caramelo",
    category: "bolsas",
    price: 289.9,
    shortDescription: "Transversal com corrente dourada e couro texturizado.",
    description:
      "Compacta e versátil, a Transversal Caramelo vai do dia para a noite. A corrente dourada pode ser usada no ombro ou transversal, e o tom caramelo combina com todas as estações.",
    details: [
      "Material: couro sintético texturizado",
      "Corrente dourada removível",
      "Fecho frontal com trava",
      "Dimensões: 22 x 14 x 7 cm",
      "Cabe celular, carteira e chaves",
    ],
    colors: [{ name: "Caramelo", hex: "#A8642F" }],
    images: [
      "/products/crossbody-caramelo.jpg",
      "/products/angles/crossbody-caramelo-side.jpg",
      "/products/angles/crossbody-caramelo-detail.jpg",
      "/products/angles/crossbody-caramelo-back.jpg",
    ],
    weightKg: 0.5,
    dimensionsCm: { length: 25, width: 18, height: 10 },
    stock: 20,
    featured: true,
    isNew: true,
  },
  {
    id: "gz-003",
    slug: "mini-bag-perola",
    name: "Mini Bag Pérola",
    category: "bolsas",
    price: 249.9,
    shortDescription: "Mini bag de mão em tom pérola com argola dourada.",
    description:
      "Delicada e marcante, a Mini Bag Pérola é perfeita para eventos e para dar um toque refinado ao look. Alça de mão estruturada e argola dourada como detalhe principal.",
    details: [
      "Material: couro sintético liso",
      "Argola dourada decorativa",
      "Fecho magnético",
      "Dimensões: 18 x 14 x 8 cm",
    ],
    colors: [{ name: "Pérola", hex: "#EDE6DA" }],
    images: [
      "/products/mini-perola.jpg",
    ],
    weightKg: 0.4,
    dimensionsCm: { length: 22, width: 18, height: 12 },
    stock: 8,
    featured: true,
    isNew: true,
  },
  {
    id: "gz-004",
    slug: "bucket-palha-natural",
    name: "Bucket Palha Natural",
    category: "bolsas",
    price: 219.9,
    shortDescription: "Bucket em palha trançada com alças em couro.",
    description:
      "Leve e cheia de personalidade, a Bucket Palha Natural é a escolha certa para dias de sol, viagens e passeios. Trama artesanal, forro interno e fechamento com cordão.",
    details: [
      "Material: palha sintética trançada",
      "Alças em couro sintético caramelo",
      "Fechamento com cordão",
      "Dimensões: 24 x 26 x 18 cm",
    ],
    colors: [{ name: "Natural", hex: "#D2B48C" }],
    images: [
      "/products/bucket-palha.jpg",
    ],
    weightKg: 0.5,
    dimensionsCm: { length: 28, width: 28, height: 20 },
    stock: 15,
  },
  {
    id: "gz-005",
    slug: "bolsa-hobo-bordo",
    name: "Hobo Bordô",
    category: "bolsas",
    price: 389.9,
    compareAtPrice: 439.9,
    shortDescription: "Hobo de ombro com formato meia-lua em couro macio.",
    description:
      "Macia, espaçosa e com caimento perfeito no ombro. A Hobo Bordô tem formato meia-lua, alça ajustável e fechamento por zíper — elegância sem esforço para o dia a dia.",
    details: [
      "Material: couro sintético macio",
      "Alça regulável",
      "Fechamento com zíper dourado",
      "Dimensões: 34 x 26 x 10 cm",
    ],
    colors: [{ name: "Bordô", hex: "#4A1520" }],
    images: [
      "/products/hobo-bordo.jpg",
    ],
    weightKg: 0.7,
    dimensionsCm: { length: 36, width: 30, height: 12 },
    stock: 10,
    featured: true,
  },
  {
    id: "gz-006",
    slug: "clutch-dourada",
    name: "Clutch Dourada",
    category: "bolsas",
    price: 199.9,
    shortDescription: "Clutch de festa em cetim dourado com fecho de strass.",
    description:
      "Para as noites especiais. A Clutch Dourada é estruturada, em cetim acetinado, com fecho cravejado de strass e corrente interna para usar a tiracolo.",
    details: [
      "Material: cetim e metal",
      "Fecho com strass",
      "Corrente interna removível",
      "Dimensões: 20 x 12 x 5 cm",
    ],
    colors: [{ name: "Dourado", hex: "#C9A961" }],
    images: [
      "/products/clutch-dourada.jpg",
    ],
    weightKg: 0.3,
    dimensionsCm: { length: 24, width: 16, height: 8 },
    stock: 6,
  },
  {
    id: "gz-007",
    slug: "bolsa-baguette-oliva",
    name: "Baguete Oliva",
    category: "bolsas",
    price: 349.9,
    compareAtPrice: 399.9,
    shortDescription: "Baguete de ombro em couro verde oliva com fecho dourado.",
    description:
      "A Baguete Oliva traz a elegância contemporânea com sua silhueta alongada e tom terroso exclusivo. Alça de ombro confortável e fecho magnético em banho dourado de alta durabilidade.",
    details: [
      "Material: couro sintético premium verde oliva",
      "Fecho magnético com acabamento dourado fosco",
      "Forro interno acetinado",
      "Dimensões: 26 x 14 x 6 cm",
      "Alça de ombro anatômica",
    ],
    colors: [{ name: "Verde Oliva", hex: "#556B2F" }],
    images: [
      "/products/baguette-oliva.jpg",
    ],
    weightKg: 0.45,
    dimensionsCm: { length: 28, width: 16, height: 8 },
    stock: 14,
    featured: true,
    isNew: true,
  },
  {
    id: "gz-008",
    slug: "bolsa-satchel-terracota",
    name: "Satchel Terracota",
    category: "bolsas",
    price: 429.9,
    shortDescription: "Satchel estruturada em couro terracota com fecho torniquete dourado.",
    description:
      "A Satchel Terracota é clássica e marcante. Possui alça de mão estruturada e alça transversal removível para total versatilidade do dia a dia a ocasiões executivas.",
    details: [
      "Material: couro sintético estruturado",
      "Fecho frontal torniquete dourado",
      "Acompanha alça transversal regulável e removível",
      "Divisórias internas com zíper",
      "Dimensões: 28 x 22 x 11 cm",
    ],
    colors: [{ name: "Terracota", hex: "#B85D36" }],
    images: [
      "/products/satchel-terracota.jpg",
    ],
    weightKg: 0.8,
    dimensionsCm: { length: 32, width: 25, height: 14 },
    stock: 9,
    featured: true,
    isNew: true,
  },
  {
    id: "gz-009",
    slug: "bolsa-flap-croco-noir",
    name: "Flap Croco Noir",
    category: "bolsas",
    price: 379.9,
    compareAtPrice: 429.9,
    shortDescription: "Bolsa de ombro com relevo croco premium e corrente dourada.",
    description:
      "Sofisticação pura. A Flap Croco Noir tem textura croco em alto relevo, fecho lapela de precisão e corrente dourada delicada que pode ser usada dupla no ombro ou longa na transversal.",
    details: [
      "Material: couro sintético com textura croco brilhante",
      "Corrente dourada com protetor de ombro em couro",
      "Fecho de encaixe frontal",
      "Dimensões: 24 x 16 x 7 cm",
    ],
    colors: [{ name: "Preto Croco", hex: "#121212" }],
    images: [
      "/products/flap-croco-noir.jpg",
    ],
    weightKg: 0.6,
    dimensionsCm: { length: 26, width: 18, height: 10 },
    stock: 11,
    featured: true,
    isNew: true,
  },
];

/* ---------- Helpers de consulta (troque por API/CMS no futuro) ---------- */

export function getAllProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}
