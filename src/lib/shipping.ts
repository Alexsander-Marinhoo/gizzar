/**
 * ============================================================
 *  FRETE (versão simplificada — estimativa Correios PAC/SEDEX)
 *
 *  Como funciona hoje:
 *   - Consulta o CEP no ViaCEP (gratuito) para descobrir cidade/UF.
 *   - Estima o valor por zona (mesmo estado / mesma região /
 *     outras regiões) + adicional por peso.
 *
 *  Para usar valores REAIS dos Correios no futuro, substitua a
 *  função `estimateByZone` por uma chamada à API oficial dos
 *  Correios (contrato CWS) ou a um agregador (Melhor Envio,
 *  Frenet etc.). O restante da loja continua funcionando igual.
 * ============================================================
 */

import { siteConfig } from "@/config/site";
import { getProductById } from "@/data/products";
import { onlyDigits } from "@/lib/format";

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
};

export type ShippingItem = { productId: string; quantity: number };

const REGIONS: Record<string, string[]> = {
  sudeste: ["SP", "RJ", "MG", "ES"],
  sul: ["PR", "SC", "RS"],
  centroOeste: ["DF", "GO", "MT", "MS"],
  nordeste: ["BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA"],
  norte: ["AM", "PA", "AC", "RO", "RR", "AP", "TO"],
};

/** Tabela base: [preço PAC, prazo PAC, preço SEDEX, prazo SEDEX] */
const ZONE_TABLE = {
  local: [19.9, 4, 29.9, 1],
  regional: [26.9, 6, 42.9, 2],
  nacional: [34.9, 9, 59.9, 4],
  remota: [44.9, 12, 79.9, 6],
} as const;

const EXTRA_PER_KG = { pac: 6, sedex: 12 };

const ORIGIN_UF = "SP"; // UF do CEP de origem em siteConfig.shipping.originCep

function regionOf(uf: string) {
  return Object.entries(REGIONS).find(([, ufs]) => ufs.includes(uf))?.[0];
}

function zoneFor(destUf: string): keyof typeof ZONE_TABLE {
  if (destUf === ORIGIN_UF) return "local";
  const dest = regionOf(destUf);
  if (dest === regionOf(ORIGIN_UF)) return "regional";
  if (dest === "norte") return "remota";
  return "nacional";
}

function estimateByZone(destUf: string, weightKg: number): ShippingOption[] {
  const [pacPrice, pacDays, sedexPrice, sedexDays] = ZONE_TABLE[zoneFor(destUf)];
  const extraKg = Math.max(0, Math.ceil(weightKg) - 1);
  const handling = siteConfig.shipping.handlingDays;
  return [
    { id: "pac", name: "PAC — Correios", price: pacPrice + extraKg * EXTRA_PER_KG.pac, days: pacDays + handling },
    { id: "sedex", name: "SEDEX — Correios", price: sedexPrice + extraKg * EXTRA_PER_KG.sedex, days: sedexDays + handling },
  ];
}

export class ShippingError extends Error {}

export async function lookupCep(cep: string) {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) throw new ShippingError("CEP inválido. Digite os 8 números.");
  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
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

export function cartTotals(items: ShippingItem[]) {
  let subtotal = 0;
  let weight = 0;
  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) continue;
    subtotal += product.price * item.quantity;
    weight += product.weightKg * item.quantity;
  }
  return { subtotal, weight };
}

export async function quoteShipping(cep: string, items: ShippingItem[]): Promise<ShippingQuote> {
  const address = await lookupCep(cep);
  const { subtotal, weight } = cartTotals(items);
  const options = estimateByZone(address.state, Math.max(weight, 0.3));

  const threshold = siteConfig.shipping.freeShippingThreshold;
  if (threshold > 0 && subtotal >= threshold) {
    options[0] = { ...options[0], price: 0, free: true };
  }

  return { cep: onlyDigits(cep), address, options };
}
