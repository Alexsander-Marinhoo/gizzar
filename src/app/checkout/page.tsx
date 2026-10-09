import type { Metadata } from "next";
import CheckoutView from "@/components/checkout/CheckoutView";
import { LockIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalize sua compra GIZZAR com segurança. Pix ou cartão de crédito parcelado.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-page pt-10 sm:pt-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="heading-display text-5xl sm:text-6xl">Finalizar compra</h1>
        <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-taupe">
          <LockIcon size={14} /> Ambiente seguro
        </p>
      </div>
      <CheckoutView />
    </div>
  );
}
