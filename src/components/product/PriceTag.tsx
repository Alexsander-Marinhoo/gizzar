import { formatPrice, installmentLabel } from "@/lib/format";

export default function PriceTag({
  price,
  compareAtPrice,
  size = "md",
}: {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
}) {
  const installments = installmentLabel(price);
  const discount = compareAtPrice ? Math.round((1 - price / compareAtPrice) * 100) : 0;
  const priceClass = { sm: "text-sm sm:text-base", md: "text-base sm:text-lg", lg: "text-2xl sm:text-3xl" }[size];

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2.5 gap-y-0.5">
        <span className={`${priceClass} font-semibold tracking-tight text-ink`}>{formatPrice(price)}</span>
        {compareAtPrice && (
          <>
            <span className="text-xs sm:text-sm text-taupe line-through">{formatPrice(compareAtPrice)}</span>
            {size === "lg" && (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold-dark">-{discount}%</span>
            )}
          </>
        )}
      </div>
      {installments && (
        <p className={`${size === "lg" ? "mt-1.5 text-sm" : "mt-0.5 text-[11px] sm:text-xs"} text-taupe leading-tight`}>
          ou <span className="font-medium text-ink/80">{installments}</span>
        </p>
      )}
    </div>
  );
}
