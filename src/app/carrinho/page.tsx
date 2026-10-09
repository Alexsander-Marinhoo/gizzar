import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Sacola",
  description: "Revise os itens da sua sacola GIZZAR e finalize sua compra com Pix ou cartão.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="container-page pt-10 sm:pt-16">
      <h1 className="heading-display mb-8 text-5xl sm:text-6xl">Sua sacola</h1>
      <CartView />
    </div>
  );
}
