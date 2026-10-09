"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { BagIcon, CloseIcon, MenuIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { useCart } from "@/lib/cart";
import { whatsappLink } from "@/config/site";

export const navLinks = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Bolsas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/sobre#contato", label: "Contato" },
];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-ivory/95 shadow-[0_4px_20px_rgba(22,20,18,0.06)] border-b border-stone/60 backdrop-blur-xl" : "bg-ivory border-b border-stone/20"
        }`}
      >
        <div className="container-page grid h-[74px] grid-cols-[1fr_auto_1fr] items-center sm:h-[86px]">
          {/* Esquerda: menu mobile / nav desktop */}
          <div className="flex items-center">
            <button
              id="mobile-menu-button"
              type="button"
              onClick={() => setOpen(true)}
              className="-ml-2 rounded-full p-2 text-ink transition hover:bg-sand md:hidden"
              aria-label="Abrir menu"
            >
              <MenuIcon size={24} />
            </button>
            <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
              {navLinks.slice(1).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="relative text-[13px] font-medium uppercase tracking-[0.18em] text-ink/80 transition hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Logo />

          {/* Direita: carrinho */}
          <div className="flex items-center justify-end gap-1">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full p-2.5 text-ink/80 transition hover:bg-sand hover:text-ink sm:inline-flex"
              aria-label="Fale conosco no WhatsApp"
            >
              <WhatsAppIcon size={20} />
            </a>
            <Link
              id="header-cart-link"
              href="/carrinho"
              className="relative -mr-2 rounded-full p-2.5 text-ink transition hover:bg-sand"
              aria-label={`Carrinho com ${count} ${count === 1 ? "item" : "itens"}`}
            >
              <BagIcon size={24} />
              {count > 0 && (
                <span
                  key={count}
                  className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] animate-pop items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink"
                >
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Drawer do menu mobile */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          />
          <div className="absolute inset-y-0 left-0 flex w-[84%] max-w-sm animate-[slide-in-left_0.35s_cubic-bezier(0.22,1,0.36,1)_both] flex-col bg-ivory p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-sand" aria-label="Fechar menu">
                <CloseIcon size={24} />
              </button>
            </div>
            <nav className="mt-12 flex flex-col" aria-label="Menu mobile">
              {navLinks.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{ animationDelay: `${80 + i * 60}ms` }}
                  className="animate-fade-up border-b border-stone/60 py-5 font-display text-3xl text-ink transition hover:pl-2 hover:text-gold-dark"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto space-y-3">
              <Link href="/carrinho" onClick={() => setOpen(false)} className="btn-primary w-full">
                <BagIcon size={18} /> Ver carrinho {count > 0 && `(${count})`}
              </Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
                <WhatsAppIcon size={18} /> Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
