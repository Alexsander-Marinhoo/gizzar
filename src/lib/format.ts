import { siteConfig } from "@/config/site";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(value: number) {
  return brl.format(value);
}

/** Calcula o melhor parcelamento respeitando o valor mínimo da parcela. */
export function getInstallments(total: number) {
  const { maxInstallments, minInstallmentValue } = siteConfig.payment;
  const count = Math.max(1, Math.min(maxInstallments, Math.floor(total / minInstallmentValue)));
  return { count, value: total / count };
}

export function installmentLabel(total: number) {
  const { count, value } = getInstallments(total);
  if (count <= 1) return null;
  return `${count}x de ${formatPrice(value)}${siteConfig.payment.interestFree ? " sem juros" : ""}`;
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCep(value: string) {
  const d = onlyDigits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function formatPhone(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function formatCpf(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
