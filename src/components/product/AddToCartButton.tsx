"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BagIcon, CheckIcon } from "@/components/ui/Icons";
import { cartActions } from "@/lib/cart";

type Props = {
  productId: string;
  quantity?: number;
  variant?: "full" | "compact" | "icon";
  /** Se true, adiciona e vai direto para o carrinho. */
  buyNow?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export default function AddToCartButton({
  productId,
  quantity = 1,
  variant = "full",
  buyNow = false,
  disabled,
  className = "",
  id,
}: Props) {
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    cartActions.add(productId, quantity);
    if (buyNow) {
      router.push("/carrinho");
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  if (variant === "icon") {
    return (
      <button
        id={id}
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label="Adicionar ao carrinho"
        className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-ivory/95 text-ink shadow-sm backdrop-blur transition hover:bg-ink hover:text-ivory active:scale-90 ${className}`}
      >
        {added ? <CheckIcon size={14} className="animate-pop sm:h-[17px] sm:w-[17px]" /> : <BagIcon size={14} className="sm:h-[17px] sm:w-[17px]" />}
      </button>
    );
  }

  const label = disabled ? "Esgotado" : added ? "Adicionado!" : buyNow ? "Comprar agora" : "Adicionar à sacola";

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`${buyNow ? "btn-primary" : "btn-outline"} ${variant === "compact" ? "px-5 py-2.5 text-xs" : "w-full py-4"} ${
        added ? "border-success! bg-success! text-ivory!" : ""
      } ${className}`}
    >
      {added ? <CheckIcon size={18} className="animate-pop" /> : <BagIcon size={18} />}
      {label}
    </button>
  );
}
