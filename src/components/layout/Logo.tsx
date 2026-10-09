import Link from "next/link";

export default function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" aria-label="GIZZAR — página inicial" className={`inline-flex flex-col items-center ${className}`}>
      <span
        className={`font-display text-[34px] sm:text-[42px] font-medium leading-none tracking-[0.32em] pl-[0.32em] transition-colors ${
          light ? "text-ivory" : "text-ink"
        } hover:text-gold-dark`}
      >
        GIZZAR
      </span>
      <span className="mt-1.5 h-px w-10 bg-gold" />
    </Link>
  );
}

