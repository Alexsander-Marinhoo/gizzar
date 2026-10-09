"use client";

import { useState } from "react";
import { TruckIcon } from "@/components/ui/Icons";
import { formatCep, formatPrice } from "@/lib/format";
import type { ShippingItem, ShippingOption, ShippingQuote } from "@/lib/shipping";

type Props = {
  items: ShippingItem[];
  /** Se informado, as opções viram selecionáveis (carrinho/checkout). */
  selectedId?: string;
  onQuote?: (quote: ShippingQuote | null) => void;
  onSelect?: (option: ShippingOption) => void;
  initialCep?: string;
  compact?: boolean;
};

export async function fetchShippingQuote(cep: string, items: ShippingItem[]) {
  const res = await fetch("/api/frete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cep, items }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Erro ao calcular o frete.");
  return data as ShippingQuote;
}

export default function ShippingCalculator({ items, selectedId, onQuote, onSelect, initialCep = "", compact }: Props) {
  const [cep, setCep] = useState(initialCep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<ShippingQuote | null>(null);

  async function calculate(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const q = await fetchShippingQuote(cep, items);
      setQuote(q);
      onQuote?.(q);
      if (onSelect) onSelect(q.options.find((o) => o.id === selectedId) ?? q.options[0]);
    } catch (err) {
      setQuote(null);
      onQuote?.(null);
      setError(err instanceof Error ? err.message : "Erro ao calcular o frete.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={compact ? "" : "rounded-2xl border border-stone/70 bg-white/60 p-5"}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <TruckIcon size={18} className="text-gold-dark" />
        Calcular frete e prazo
      </div>
      <form onSubmit={calculate} className="flex gap-2">
        <input
          id="shipping-cep-input"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          className="input py-3"
          aria-label="CEP"
        />
        <button id="shipping-calc-button" type="submit" disabled={loading || cep.length < 9} className="btn-primary shrink-0 px-5 py-3">
          {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" /> : "OK"}
        </button>
      </form>
      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-xs text-taupe underline-offset-2 hover:underline"
      >
        Não sei meu CEP
      </a>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      {quote && (
        <div className="mt-4 animate-fade-up space-y-2">
          <p className="text-xs text-taupe">
            Entrega para <span className="font-medium text-ink">{quote.address.city} — {quote.address.state}</span>
          </p>
          {quote.options.map((opt) => {
            const selectable = Boolean(onSelect);
            const selected = selectable && opt.id === selectedId;
            const Tag = selectable ? "button" : "div";
            return (
              <Tag
                key={opt.id}
                type={selectable ? "button" : undefined}
                onClick={selectable ? () => onSelect?.(opt) : undefined}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selected ? "border-ink bg-ink/[0.03] ring-1 ring-ink" : "border-stone/70 bg-white"
                } ${selectable ? "hover:border-ink/60" : ""}`}
              >
                <span className="flex items-center gap-3">
                  {selectable && (
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${selected ? "border-ink" : "border-stone"}`}>
                      {selected && <span className="h-2 w-2 rounded-full bg-ink" />}
                    </span>
                  )}
                  <span>
                    <span className="block font-medium text-ink">{opt.name}</span>
                    <span className="text-xs text-taupe">Até {opt.days} dias úteis</span>
                  </span>
                </span>
                <span className={`font-semibold ${opt.free ? "text-success" : "text-ink"}`}>
                  {opt.free ? "Grátis" : formatPrice(opt.price)}
                </span>
              </Tag>
            );
          })}
          <p className="pt-1 text-[11px] leading-snug text-taupe/80">*Valores e prazos estimados. Prazo começa a contar após a confirmação do pagamento.</p>
        </div>
      )}
    </div>
  );
}
