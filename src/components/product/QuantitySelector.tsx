"use client";

import { MinusIcon, PlusIcon } from "@/components/ui/Icons";

export default function QuantitySelector({
  value,
  onChange,
  max = 99,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  size?: "sm" | "md";
}) {
  const btn = size === "sm" ? "h-8 w-8" : "h-12 w-12";
  return (
    <div className="inline-flex items-center rounded-full border border-stone bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className={`${btn} flex items-center justify-center rounded-full text-ink transition hover:bg-sand disabled:opacity-30`}
        aria-label="Diminuir quantidade"
      >
        <MinusIcon size={size === "sm" ? 14 : 16} />
      </button>
      <span className={`${size === "sm" ? "w-6 text-sm" : "w-8"} text-center font-semibold tabular-nums`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btn} flex items-center justify-center rounded-full text-ink transition hover:bg-sand disabled:opacity-30`}
        aria-label="Aumentar quantidade"
      >
        <PlusIcon size={size === "sm" ? 14 : 16} />
      </button>
    </div>
  );
}
