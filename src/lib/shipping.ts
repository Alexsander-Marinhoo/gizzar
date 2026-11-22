/**
 * ============================================================
 *  CÁLCULO DE FRETE CORREIOS (PAC / SEDEX)
 *
 *  Como funciona:
 *   1. Consulta o CEP do cliente no ViaCEP para obter Rua, Bairro,
 *      Cidade e UF reais.
 *   2. Calcula o peso físico total (kg), as dimensões consolidadas da
 *      embalagem (cm) e o Peso Cubado oficial dos Correios:
 *      (Comprimento x Largura x Altura) / 6000.
 *   3. Se houver token de API configurado nas variáveis de ambiente
 *      (`SUPERFRETE_TOKEN` ou `MELHOR_ENVIO_TOKEN`), consulta em tempo
 *      real a tabela oficial dos Correios (PAC e SEDEX) para o trecho
 *      CEP de origem -> CEP de destino com peso e medidas exatas.
 *   4. Caso nenhum token externo esteja configurado (ou se a API externa
 *      oscilar), utiliza a Matriz Tarifária de Balcão dos Correios
 *      diferenciando Mesma Cidade/Região Metropolitana, Interior do
 *      Mesmo Estado, Capitais vs. Interior de outras regiões, Peso
 *      Cubado e taxa de embalagem — evitando prejuízo no guichê.
 * ============================================================
 */

import { siteConfig } from "@/config/site";
import { getProductById, type Product } from "@/data/products";
import { onlyDigits } from "@/lib/format";
import { fetchSupabaseProductById } from "@/lib/supabase";

export type ShippingOption = {
  id: "pac" | "sedex";
  name: string;
  price: number;
  /** Prazo em dias úteis. */
  days: number;
  free?: boolean;
};

export type ShippingQuote = {
  cep: string;
  address: { street: string; neighborhood: string; city: string; state: string };
  options: ShippingOption[];
  packageInfo?: {
    physicalWeightKg: number;
    cubicWeightKg: number;
    chargeableWeightKg: number;
    dimensionsCm: { length: number; width: number; height: number };
    source: "correios-api" | "correios-matrix";
  };
};

export type ShippingItem = { productId: string; quantity: number };

export type PackageItemDetail = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  weightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
};

export type PackageMetrics = {
  subtotal: number;
  physicalWeightKg: number;
  cubicWeightKg: number;
  chargeableWeightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  detailedItems: PackageItemDetail[];
};

const REGIONS: Record<string, string[]> = {
  sudeste: ["SP", "RJ", "MG", "ES"],
  sul: ["PR", "SC", "RS"],
  centroOeste: ["DF", "GO", "MT", "MS"],
  nordeste: ["BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA"],
  norte: ["AM", "PA", "AC", "RO", "RR", "AP", "TO"],
};

/**
 * Identifica a UF a partir do primeiro/segundo dígito do CEP (padrão Correios),
 * permitindo descobrir automaticamente o estado do `originCep` configurado em `site.ts`.
 */
export function ufFromCep(cep: string): string {
  const digits = onlyDigits(cep);
  if (digits.length < 2) return "RJ";
  const prefix2 = Number(digits.slice(0, 2));
  const prefix3 = Number(digits.slice(0, 3));

  if (prefix2 >= 1 && prefix2 <= 19) return "SP";
  if (prefix2 >= 20 && prefix2 <= 28) return "RJ";
  if (prefix2 === 29) return "ES";
  if (prefix2 >= 30 && prefix2 <= 39) return "MG";
  if (prefix2 >= 40 && prefix2 <= 48) return "BA";
  if (prefix2 === 49) return "SE";
  if (prefix2 >= 50 && prefix2 <= 56) return "PE";
  if (prefix2 === 57) return "AL";
  if (prefix2 === 58) return "PB";
  if (prefix2 === 59) return "RN";
  if (prefix2 >= 60 && prefix2 <= 63) return "CE";
  if (prefix2 === 64) return "PI";
  if (prefix2 === 65) return "MA";
  if (prefix3 >= 660 && prefix3 <= 688) return "PA";
  if (prefix3 === 689) return "AP";
  if (prefix3 >= 690 && prefix3 <= 692) return "AM";
  if (prefix3 === 693) return "RR";
  if (prefix3 >= 694 && prefix3 <= 698) return "AM";
  if (prefix3 === 699) return "AC";
  if (prefix2 >= 70 && prefix2 <= 73) return "DF";
  if (prefix3 >= 740 && prefix3 <= 767) return "GO";
  if (prefix3 >= 768 && prefix3 <= 769) return "RO";
  if (prefix2 === 77) return "TO";
  if (prefix2 === 78) return "MT";
  if (prefix2 === 79) return "MS";
  if (prefix2 >= 80 && prefix2 <= 87) return "PR";
  if (prefix2 >= 88 && prefix2 <= 89) return "SC";
  if (prefix2 >= 90 && prefix2 <= 99) return "RS";
  return "RJ";
}

/**
 * Verifica se o CEP pertence a uma capital ou região metropolitana principal,
 * pois nos Correios o frete entre capitais é mais barato e rápido do que para o interior.
 */
function isCapitalOrMetroCep(cep: string): boolean {
  const digits = onlyDigits(cep);
  if (digits.length < 5) return false;
  const p2 = Number(digits.slice(0, 2));
  const p3 = Number(digits.slice(0, 3));

  // Faixas metropolitanas/capitais dos Correios
  if (p2 >= 1 && p2 <= 9) return true; // Grande SP
  if (p2 >= 20 && p2 <= 26) return true; // Grande RJ
  if (p3 >= 290 && p3 <= 291) return true; // Grande Vitória
  if (p3 >= 300 && p3 <= 349) return true; // Grande BH
  if (p3 >= 400 && p3 <= 428) return true; // Grande Salvador
  if (p3 === 490) return true; // Aracaju
  if (p3 >= 500 && p3 <= 549) return true; // Grande Recife
  if (p3 === 570) return true; // Maceió
  if (p3 === 580) return true; // João Pessoa
  if (p3 === 590 || p3 === 591) return true; // Natal
  if (p3 >= 600 && p3 <= 619) return true; // Grande Fortaleza
  if (p3 === 640) return true; // Teresina
  if (p3 === 650 || p3 === 651) return true; // São Luís
  if (p3 >= 660 && p3 <= 671) return true; // Grande Belém
  if (p3 === 689) return true; // Macapá
  if (p3 >= 690 && p3 <= 690) return true; // Manaus
  if (p3 === 693) return true; // Boa Vista
  if (p3 === 699) return true; // Rio Branco
  if (p2 >= 70 && p2 <= 72) return true; // Brasília / DF
  if (p3 >= 740 && p3 <= 749) return true; // Grande Goiânia
  if (p3 === 768) return true; // Porto Velho
  if (p3 === 770) return true; // Palmas
  if (p3 >= 780 && p3 <= 781) return true; // Cuiabá / Várzea Grande
  if (p3 === 790 || p3 === 791) return true; // Campo Grande
  if (p3 >= 800 && p3 <= 838) return true; // Grande Curitiba
  if (p3 >= 880 && p3 <= 881) return true; // Grande Florianópolis
  if (p3 >= 900 && p3 <= 949) return true; // Grande Porto Alegre
  return false;
}

function isSameMetroArea(originCep: string, destCep: string, originUf: string, destUf: string): boolean {
  if (originUf !== destUf) return false;
  const oDigits = onlyDigits(originCep);
  const dDigits = onlyDigits(destCep);
  // Mesmo prefixo de sub-região postal (2 primeiros dígitos iguais, ou ambos na capital do mesmo estado)
  if (oDigits.slice(0, 2) === dDigits.slice(0, 2)) return true;
  if (isCapitalOrMetroCep(oDigits) && isCapitalOrMetroCep(dDigits)) return true;
  return false;
}

function regionOf(uf: string) {
  return Object.entries(REGIONS).find(([, ufs]) => ufs.includes(uf))?.[0];
}

type TariffBand =
  | "local_metro"
  | "estadual_interior"
  | "regional_capital"
  | "regional_interior"
  | "nacional_capital"
  | "nacional_interior"
  | "remota";

/**
 * Matriz Tarifária de Balcão dos Correios (até 1kg):
 * [preço PAC (R$), prazo PAC (dias), preço SEDEX (R$), prazo SEDEX (dias), adicional PAC/kg, adicional SEDEX/kg]
 */
const CORREIOS_COUNTER_MATRIX: Record<TariffBand, [number, number, number, number, number, number]> = {
  local_metro: [23.9, 3, 28.9, 1, 4.5, 6.5],
  estadual_interior: [28.9, 5, 39.9, 2, 6.0, 10.5],
  regional_capital: [31.9, 6, 46.9, 2, 7.0, 13.0],
  regional_interior: [36.9, 7, 54.9, 3, 8.5, 15.5],
  nacional_capital: [41.9, 8, 66.9, 3, 10.0, 18.0],
  nacional_interior: [48.9, 10, 78.9, 5, 12.0, 21.0],
  remota: [58.9, 13, 94.9, 6, 15.0, 26.0],
};

function resolveTariffBand(originCep: string, destCep: string, destUf: string): TariffBand {
  const originUf = ufFromCep(originCep);
  if (destUf === originUf) {
    return isSameMetroArea(originCep, destCep, originUf, destUf)
      ? "local_metro"
      : "estadual_interior";
  }

  const originRegion = regionOf(originUf);
  const destRegion = regionOf(destUf);
  const destIsCapital = isCapitalOrMetroCep(destCep);

  if (destRegion === originRegion) {
    return destIsCapital ? "regional_capital" : "regional_interior";
  }

  if (destRegion === "norte") {
    return "remota";
  }

  return destIsCapital ? "nacional_capital" : "nacional_interior";
}

/**
 * Calcula peso físico, dimensões da embalagem consolidada e Peso Cubado dos Correios.
 * Fórmula oficial dos Correios: (C x L x A) / 6000.
 */
export function buildPackageMetrics(
  items: ShippingItem[],
  resolvedProducts?: Map<string, Product>
): PackageMetrics {
  let subtotal = 0;
  let physicalWeightKg = 0;
  let totalVolumeCm3 = 0;
  let maxLength = 20;
  let maxWidth = 15;
  let stackedHeight = 0;
  const detailedItems: PackageItemDetail[] = [];

  for (const item of items) {
    const product =
      resolvedProducts?.get(item.productId) ?? getProductById(item.productId);
    if (!product || item.quantity <= 0) continue;

    const qty = Math.max(1, Math.floor(item.quantity));
    const dims = product.dimensionsCm ?? { length: 28, width: 20, height: 10 };
    const weight = product.weightKg ?? 0.6;

    subtotal += product.price * qty;
    physicalWeightKg += weight * qty;

    const itemVolume = dims.length * dims.width * dims.height * qty;
    totalVolumeCm3 += itemVolume;

    if (dims.length > maxLength) maxLength = dims.length;
    if (dims.width > maxWidth) maxWidth = dims.width;
    stackedHeight += dims.height * qty;

    detailedItems.push({
      id: product.id,
      name: product.name,
      quantity: qty,
      price: product.price,
      weightKg: weight,
      dimensionsCm: dims,
    });
  }

  // Consolida as dimensões da caixa respeitando os mínimos e máximos dos Correios
  // Para múltiplas bolsas, usa a raiz cúbica/volume real para não inflar artificialmente a altura
  const equivalentHeight =
    detailedItems.length > 0
      ? Math.max(8, Math.min(stackedHeight, Math.ceil(totalVolumeCm3 / (maxLength * maxWidth))))
      : 10;

  const dimensionsCm = {
    length: Math.max(16, Math.min(70, maxLength)),
    width: Math.max(11, Math.min(70, maxWidth)),
    height: Math.max(4, Math.min(70, equivalentHeight)),
  };

  // Peso cubado oficial dos Correios: (C * L * A) / 6000
  const cubicWeightKg = Number(
    ((dimensionsCm.length * dimensionsCm.width * dimensionsCm.height) / 6000).toFixed(2)
  );

  const safePhysical = Number(Math.max(0.3, physicalWeightKg).toFixed(2));
  // Os Correios consideram o maior entre peso físico e peso cubado para caixas volumosas
  const chargeableWeightKg = Number(Math.max(safePhysical, cubicWeightKg).toFixed(2));

  return {
    subtotal,
    physicalWeightKg: safePhysical,
    cubicWeightKg,
    chargeableWeightKg,
    dimensionsCm,
    detailedItems,
  };
}

export function cartTotals(items: ShippingItem[]) {
  const metrics = buildPackageMetrics(items);
  return { subtotal: metrics.subtotal, weight: metrics.chargeableWeightKg };
}

/**
 * Consulta cotação em tempo real na API do SuperFrete ou Melhor Envio (se configurado no .env).
 */
async function fetchLiveCorreiosApiQuote(
  originCep: string,
  destCep: string,
  metrics: PackageMetrics
): Promise<ShippingOption[] | null> {
  const superFreteToken = process.env.SUPERFRETE_TOKEN?.trim();
  const melhorEnvioToken = process.env.MELHOR_ENVIO_TOKEN?.trim();
  const handling = siteConfig.shipping.handlingDays ?? 1;
  const multiplier = siteConfig.shipping.counterRateMultiplier ?? 1;
  const packagingFee = siteConfig.shipping.packagingFee ?? 0;

  // 1. Tentativa via SuperFrete API (Correios PAC = 1, SEDEX = 2)
  if (superFreteToken) {
    try {
      const res = await fetch("https://api.superfrete.com/api/v0/calculator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${superFreteToken}`,
          "User-Agent": "GizzarStore/1.0 (contato@gizzar.com.br)",
        },
        body: JSON.stringify({
          from: { postal_code: onlyDigits(originCep) },
          to: { postal_code: onlyDigits(destCep) },
          services: "1,2",
          options: {
            own_hand: false,
            receipt: false,
            insurance_value: metrics.subtotal,
            use_insurance_value: false,
          },
          package: {
            weight: metrics.physicalWeightKg,
            height: metrics.dimensionsCm.height,
            width: metrics.dimensionsCm.width,
            length: metrics.dimensionsCm.length,
          },
        }),
        signal: AbortSignal.timeout(4500),
      });

      if (res.ok) {
        const data = (await res.json()) as Array<{
          id?: number;
          name?: string;
          price?: number | string;
          delivery_time?: number;
          has_error?: boolean;
        }>;
        const parsed = parseExternalServices(data, handling, multiplier, packagingFee);
        if (parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn("[shipping:superfrete] fallback para matriz local:", err);
    }
  }

  // 2. Tentativa via Melhor Envio API
  if (melhorEnvioToken) {
    const baseUrl =
      process.env.MELHOR_ENVIO_SANDBOX === "true"
        ? "https://sandbox.melhorenvio.com.br"
        : "https://melhorenvio.com.br";

    try {
      const res = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${melhorEnvioToken}`,
          "User-Agent": "GizzarStore/1.0 (contato@gizzar.com.br)",
        },
        body: JSON.stringify({
          from: { postal_code: onlyDigits(originCep) },
          to: { postal_code: onlyDigits(destCep) },
          products: metrics.detailedItems.map((item) => ({
            id: item.id,
            width: item.dimensionsCm.width,
            height: item.dimensionsCm.height,
            length: item.dimensionsCm.length,
            weight: item.weightKg,
            insurance_value: item.price,
            quantity: item.quantity,
          })),
          options: { receipt: false, own_hand: false },
          services: "1,2",
        }),
        signal: AbortSignal.timeout(4500),
      });

      if (res.ok) {
        const data = (await res.json()) as Array<{
          id?: number;
          name?: string;
          price?: number | string;
          custom_price?: number | string;
          delivery_time?: number;
          custom_delivery_time?: number;
          error?: string;
        }>;
        const parsed = parseExternalServices(data, handling, multiplier, packagingFee);
        if (parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn("[shipping:melhorenvio] fallback para matriz local:", err);
    }
  }

  return null;
}

function parseExternalServices(
  services: Array<{
    id?: number;
    name?: string;
    price?: number | string;
    custom_price?: number | string;
    delivery_time?: number;
    custom_delivery_time?: number;
    error?: string;
    has_error?: boolean;
  }>,
  handlingDays: number,
  multiplier: number,
  packagingFee: number
): ShippingOption[] {
  if (!Array.isArray(services)) return [];
  const options: ShippingOption[] = [];

  for (const svc of services) {
    if (svc.error || svc.has_error) continue;
    const rawPrice = Number(svc.custom_price ?? svc.price ?? 0);
    const rawDays = Number(svc.custom_delivery_time ?? svc.delivery_time ?? 0);
    if (!rawPrice || rawPrice <= 0) continue;

    const nameUpper = (svc.name ?? "").toUpperCase();
    const isPac = svc.id === 1 || nameUpper.includes("PAC");
    const isSedex = svc.id === 2 || nameUpper.includes("SEDEX");

    if (!isPac && !isSedex) continue;

    const finalPrice = Number((rawPrice * multiplier + packagingFee).toFixed(2));
    options.push({
      id: isPac ? "pac" : "sedex",
      name: isPac ? "PAC — Correios" : "SEDEX — Correios",
      price: finalPrice,
      days: Math.max(1, rawDays + handlingDays),
    });
  }

  return options.sort((a, b) => a.price - b.price);
}

/**
 * Calcula o valor de PAC e SEDEX usando a Matriz Tarifária de Balcão dos Correios
 * (Capital x Interior + Peso Cubado + Embalagem).
 */
function calculateFromCorreiosMatrix(
  originCep: string,
  destCep: string,
  destUf: string,
  metrics: PackageMetrics
): ShippingOption[] {
  const band = resolveTariffBand(originCep, destCep, destUf);
  const [pacBase, pacDays, sedexBase, sedexDays, pacExtraKg, sedexExtraKg] =
    CORREIOS_COUNTER_MATRIX[band];

  const extraKg = Math.max(0, Math.ceil(metrics.chargeableWeightKg) - 1);
  const handling = siteConfig.shipping.handlingDays ?? 1;
  const packagingFee = siteConfig.shipping.packagingFee ?? 0;

  const pacPrice = Number((pacBase + extraKg * pacExtraKg + packagingFee).toFixed(2));
  const sedexPrice = Number((sedexBase + extraKg * sedexExtraKg + packagingFee).toFixed(2));

  return [
    {
      id: "pac",
      name: "PAC — Correios",
      price: pacPrice,
      days: pacDays + handling,
    },
    {
      id: "sedex",
      name: "SEDEX — Correios",
      price: sedexPrice,
      days: sedexDays + handling,
    },
  ];
}

export class ShippingError extends Error {}

export async function lookupCep(cep: string) {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) throw new ShippingError("CEP inválido. Digite os 8 números.");
  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new ShippingError("Não foi possível consultar o CEP agora.");
  const data = await res.json();
  if (data.erro) throw new ShippingError("CEP não encontrado.");
  return {
    street: data.logradouro ?? "",
    neighborhood: data.bairro ?? "",
    city: data.localidade ?? "",
    state: data.uf ?? "",
  };
}

export async function quoteShipping(cep: string, items: ShippingItem[]): Promise<ShippingQuote> {
  const cleanDestCep = onlyDigits(cep);
  const address = await lookupCep(cleanDestCep);

  // Resolve produtos que eventualmente tenham sido criados no Supabase / Admin
  const resolvedMap = new Map<string, Product>();
  await Promise.all(
    items.map(async (item) => {
      const localProd = getProductById(item.productId);
      if (localProd) {
        resolvedMap.set(item.productId, localProd);
      } else {
        const remoteProd = await fetchSupabaseProductById(item.productId);
        if (remoteProd) resolvedMap.set(item.productId, remoteProd);
      }
    })
  );

  const metrics = buildPackageMetrics(items, resolvedMap);
  const originCep = siteConfig.shipping.originCep;

  // Tenta cotação em tempo real na API dos Correios (SuperFrete / Melhor Envio)
  const liveOptions = await fetchLiveCorreiosApiQuote(originCep, cleanDestCep, metrics);
  const source: "correios-api" | "correios-matrix" = liveOptions
    ? "correios-api"
    : "correios-matrix";

  const options =
    liveOptions ??
    calculateFromCorreiosMatrix(originCep, cleanDestCep, address.state, metrics);

  // Regra de Frete Grátis no PAC acima do valor configurado
  const threshold = siteConfig.shipping.freeShippingThreshold;
  if (threshold > 0 && metrics.subtotal >= threshold) {
    const pacIdx = options.findIndex((o) => o.id === "pac");
    if (pacIdx >= 0) {
      options[pacIdx] = { ...options[pacIdx], price: 0, free: true };
    }
  }

  return {
    cep: cleanDestCep,
    address,
    options,
    packageInfo: {
      physicalWeightKg: metrics.physicalWeightKg,
      cubicWeightKg: metrics.cubicWeightKg,
      chargeableWeightKg: metrics.chargeableWeightKg,
      dimensionsCm: metrics.dimensionsCm,
      source,
    },
  };
}
