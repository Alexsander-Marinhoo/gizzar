"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { fetchShippingQuote } from "@/components/shipping/ShippingCalculator";
import { ArrowLeftIcon, CardIcon, LockIcon, PixIcon, ShieldIcon } from "@/components/ui/Icons";
import { useCart } from "@/lib/cart";
import { formatCep, formatPhone, formatPrice, installmentLabel, onlyDigits } from "@/lib/format";
import type { ShippingOption, ShippingQuote } from "@/lib/shipping";
import { siteConfig } from "@/config/site";

type Form = {
  name: string;
  email: string;
  phone: string;
  cep: string;
  number: string;
  complement: string;
};

export default function CheckoutView() {
  const { items, subtotal } = useCart();
  const [form, setForm] = useState<Form>({ name: "", email: "", phone: "", cep: "", number: "", complement: "" });
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [shipping, setShipping] = useState<ShippingOption | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const total = subtotal + (shipping?.price ?? 0);
  const lineItems = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));

  function update<K extends keyof Form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleCep(value: string) {
    const cep = formatCep(value);
    update("cep", cep);
    setCepError(null);
    if (onlyDigits(cep).length !== 8) {
      setQuote(null);
      setShipping(null);
      return;
    }
    setCepLoading(true);
    try {
      const q = await fetchShippingQuote(cep, lineItems);
      setQuote(q);
      setShipping((prev) => q.options.find((o) => o.id === prev?.id) ?? q.options[0]);
    } catch (err) {
      setQuote(null);
      setShipping(null);
      setCepError(err instanceof Error ? err.message : "Erro ao consultar CEP.");
    } finally {
      setCepLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!quote || !shipping) {
      setError("Informe um CEP válido para calcular o frete.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lineItems,
          shippingOptionId: shipping.id,
          customer: { name: form.name, email: form.email, phone: form.phone },
          address: { cep: form.cep, number: form.number, complement: form.complement },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Não foi possível iniciar o pagamento.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="heading-display text-3xl">Sua sacola está vazia</h2>
        <Link href="/catalogo" className="btn-primary mt-8">Ver bolsas</Link>
      </div>
    );
  }

  const summary = (
    <div className="space-y-5">
      <ul className="space-y-4">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex items-center gap-4">
            <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
              <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
              <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-lg bg-ink px-1 text-[10px] font-bold text-ivory">
                {quantity}
              </span>
            </div>
            <p className="flex-1 text-sm font-medium">{product.name}</p>
            <p className="text-sm">{formatPrice(product.price * quantity)}</p>
          </li>
        ))}
      </ul>
      <dl className="space-y-2.5 border-t border-stone/60 pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-taupe">Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-taupe">Frete {shipping && `(${shipping.id.toUpperCase()})`}</dt>
          <dd className={shipping?.free ? "font-medium text-success" : ""}>
            {shipping ? (shipping.free ? "Grátis" : formatPrice(shipping.price)) : "—"}
          </dd>
        </div>
      </dl>
      <div className="border-t border-stone/60 pt-5">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-semibold">{formatPrice(total)}</span>
        </div>
        {installmentLabel(total) && <p className="mt-1 text-right text-xs text-taupe">ou {installmentLabel(total)}</p>}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-14">
      {/* Resumo mobile colapsável */}
      <div className="card overflow-hidden lg:hidden">
        <button type="button" onClick={() => setSummaryOpen((o) => !o)} className="flex w-full items-center justify-between p-5 text-sm">
          <span className="font-medium">{summaryOpen ? "Ocultar" : "Ver"} resumo do pedido</span>
          <span className="font-semibold">{formatPrice(total)}</span>
        </button>
        {summaryOpen && <div className="animate-fade-in border-t border-stone/60 p-5">{summary}</div>}
      </div>

      <div className="space-y-10">
        {/* 1. Contato */}
        <fieldset>
          <legend className="flex items-center gap-3 font-display text-2xl">
            <Step n={1} /> Seus dados
          </legend>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="checkout-name">Nome completo</label>
              <input id="checkout-name" required autoComplete="name" className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="checkout-email">E-mail</label>
              <input id="checkout-email" required type="email" autoComplete="email" inputMode="email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="checkout-phone">WhatsApp</label>
              <input id="checkout-phone" required autoComplete="tel" inputMode="tel" placeholder="(11) 99999-9999" className="input" value={form.phone} onChange={(e) => update("phone", formatPhone(e.target.value))} />
            </div>
          </div>
        </fieldset>

        {/* 2. Entrega */}
        <fieldset>
          <legend className="flex items-center gap-3 font-display text-2xl">
            <Step n={2} /> Entrega
          </legend>
          <div className="mt-5 grid gap-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="checkout-cep">CEP</label>
              <div className="relative">
                <input id="checkout-cep" required inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" className="input" value={form.cep} onChange={(e) => handleCep(e.target.value)} />
                {cepLoading && <span className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-stone border-t-ink" />}
              </div>
            </div>
            {quote && (
              <div className="animate-fade-in rounded-xl bg-sand/60 px-4 py-3 text-sm sm:col-span-4 sm:self-end">
                <p className="font-medium">{quote.address.street || "Endereço"}</p>
                <p className="text-xs text-taupe">{[quote.address.neighborhood, `${quote.address.city} — ${quote.address.state}`].filter(Boolean).join(", ")}</p>
              </div>
            )}
            {cepError && <p className="text-sm text-danger sm:col-span-6">{cepError}</p>}
            <div className="sm:col-span-2">
              <label className="label" htmlFor="checkout-number">Número</label>
              <input id="checkout-number" required autoComplete="address-line2" className="input" value={form.number} onChange={(e) => update("number", e.target.value)} />
            </div>
            <div className="sm:col-span-4">
              <label className="label" htmlFor="checkout-complement">Complemento (opcional)</label>
              <input id="checkout-complement" placeholder="Apto, bloco, referência" className="input" value={form.complement} onChange={(e) => update("complement", e.target.value)} />
            </div>
          </div>

          {quote && (
            <div className="mt-5 grid animate-fade-up gap-3 sm:grid-cols-2">
              {quote.options.map((opt) => {
                const selected = shipping?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    id={`shipping-option-${opt.id}`}
                    onClick={() => setShipping(opt)}
                    className={`flex items-center justify-between rounded-2xl border bg-white p-4 text-left transition ${
                      selected ? "border-ink ring-1 ring-ink" : "border-stone hover:border-ink/50"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-semibold">{opt.name}</span>
                      <span className="text-xs text-taupe">Até {opt.days} dias úteis</span>
                    </span>
                    <span className={`text-sm font-semibold ${opt.free ? "text-success" : ""}`}>{opt.free ? "Grátis" : formatPrice(opt.price)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </fieldset>

        {/* 3. Pagamento */}
        <fieldset>
          <legend className="flex items-center gap-3 font-display text-2xl">
            <Step n={3} /> Pagamento
          </legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone bg-white p-5">
              <PixIcon size={24} className="text-[#32BCAD]" />
              <p className="mt-3 font-semibold">Pix</p>
              <p className="mt-1 text-xs text-taupe">Aprovação imediata. QR Code e copia-e-cola.</p>
            </div>
            <div className="rounded-2xl border border-stone bg-white p-5">
              <CardIcon size={24} className="text-gold-dark" />
              <p className="mt-3 font-semibold">Cartão de crédito</p>
              <p className="mt-1 text-xs text-taupe">
                Em até {siteConfig.payment.maxInstallments}x{siteConfig.payment.interestFree ? " sem juros" : ""}. Todas as bandeiras.
              </p>
            </div>
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-taupe">
            <ShieldIcon size={16} className="mt-0.5 shrink-0 text-success" />
            Ao continuar, você será levada ao ambiente seguro da InfinitePay para escolher Pix ou cartão e concluir o pagamento. Não armazenamos dados do seu cartão.
          </p>
        </fieldset>

        {error && <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}

        <div className="lg:hidden">
          <SubmitButton submitting={submitting} total={total} />
        </div>

        <Link href="/carrinho" className="inline-flex items-center gap-2 text-sm text-taupe hover:text-ink">
          <ArrowLeftIcon size={16} /> Voltar para a sacola
        </Link>
      </div>

      <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <div className="card p-7">
          <h2 className="mb-6 font-display text-2xl">Seu pedido</h2>
          {summary}
          <div className="mt-6">
            <SubmitButton submitting={submitting} total={total} />
          </div>
        </div>
      </aside>
    </form>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-sans text-sm font-semibold text-ivory">{n}</span>
  );
}

function SubmitButton({ submitting, total }: { submitting: boolean; total: number }) {
  return (
    <button id="checkout-submit" type="submit" disabled={submitting} className="btn-primary w-full py-4 text-[15px]">
      {submitting ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" /> Redirecionando…
        </>
      ) : (
        <>
          <LockIcon size={18} /> Ir para pagamento · {formatPrice(total)}
        </>
      )}
    </button>
  );
}
