export function PixBadge() {
  return (
    <span
      title="Pix"
      className="inline-flex h-7 items-center justify-center rounded overflow-hidden shadow-xs hover:scale-105 transition-transform"
    >
      <img
        src="/payments/pix.svg"
        alt="Pix"
        className="h-7 w-auto object-contain rounded"
        loading="lazy"
      />
    </span>
  );
}

export function VisaBadge() {
  return (
    <span
      title="Visa"
      className="inline-flex h-7 items-center justify-center rounded overflow-hidden shadow-xs hover:scale-105 transition-transform"
    >
      <img
        src="/payments/visa.svg"
        alt="Visa"
        className="h-7 w-auto object-contain rounded"
        loading="lazy"
      />
    </span>
  );
}

export function MastercardBadge() {
  return (
    <span
      title="Mastercard"
      className="inline-flex h-7 items-center justify-center rounded overflow-hidden shadow-xs hover:scale-105 transition-transform"
    >
      <img
        src="/payments/mastercard.svg"
        alt="Mastercard"
        className="h-7 w-auto object-contain rounded"
        loading="lazy"
      />
    </span>
  );
}

export function EloBadge() {
  return (
    <span
      title="Elo"
      className="inline-flex h-7 items-center justify-center rounded overflow-hidden shadow-xs hover:scale-105 transition-transform"
    >
      <img
        src="/payments/elo.svg"
        alt="Elo"
        className="h-7 w-auto object-contain rounded"
        loading="lazy"
      />
    </span>
  );
}

export function AmexBadge() {
  return (
    <span
      title="American Express"
      className="inline-flex h-7 items-center justify-center rounded overflow-hidden shadow-xs hover:scale-105 transition-transform"
    >
      <img
        src="/payments/amex.svg"
        alt="American Express"
        className="h-7 w-auto object-contain rounded"
        loading="lazy"
      />
    </span>
  );
}

export function HipercardBadge() {
  return (
    <span
      title="Hipercard"
      className="inline-flex h-7 items-center justify-center rounded overflow-hidden shadow-xs hover:scale-105 transition-transform"
    >
      <img
        src="/payments/hipercard.svg"
        alt="Hipercard"
        className="h-7 w-auto object-contain rounded"
        loading="lazy"
      />
    </span>
  );
}

export function PaymentBadgesGroup({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <PixBadge />
      <VisaBadge />
      <MastercardBadge />
      <EloBadge />
      <AmexBadge />
      <HipercardBadge />
    </div>
  );
}
