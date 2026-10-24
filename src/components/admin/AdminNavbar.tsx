"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAdminSession, AdminSession } from "@/lib/admin-store";
import { useState } from "react";
import { MenuIcon, CloseIcon } from "@/components/ui/Icons";
import { LogoutIcon } from "./AdminIcons";

export type AdminTab = "overview" | "products" | "banner" | "orders";

interface AdminNavbarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  session: AdminSession | null;
  ordersCount?: number;
  productsCount?: number;
}

export default function AdminNavbar({
  activeTab,
  setActiveTab,
  session,
  ordersCount = 0,
  productsCount = 0,
}: AdminNavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAdminSession();
    router.push("/admin");
  };

  const navItems = [
    { id: "overview" as AdminTab, label: "Visão Geral" },
    {
      id: "products" as AdminTab,
      label: "Produtos",
      badge: productsCount > 0 ? productsCount : undefined,
    },
    {
      id: "orders" as AdminTab,
      label: "Vendas & Pedidos",
      badge: ordersCount > 0 ? ordersCount : undefined,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 border-b border-stone/60 backdrop-blur-xl">
      <div className="container-page flex h-[74px] sm:h-[82px] items-center justify-between gap-6">
        {/* Esquerda: Menu mobile + Logo GIZZAR idêntico ao storefront */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-ml-2 rounded-full p-2 text-ink hover:bg-sand lg:hidden transition"
            aria-label="Abrir menu"
          >
            <MenuIcon size={22} />
          </button>

          <Link
            href="/admin/dashboard"
            onClick={() => setActiveTab("overview")}
            className="inline-flex flex-col items-start group"
          >
            <div className="flex items-center gap-2.5">
              <span className="font-display text-[24px] sm:text-[28px] font-medium leading-none tracking-[0.3em] pl-[0.3em] text-ink group-hover:text-gold-dark transition-colors">
                GIZZAR
              </span>
              <span className="rounded-full bg-sand/80 border border-stone px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-taupe">
                Painel
              </span>
            </div>
            <span className="mt-1 h-px w-8 bg-gold transition-all group-hover:w-12" />
          </Link>
        </div>

        {/* Centro: Links de Navegação com tipografia editorial da Gizzar */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Navegação administrativa">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative py-1 text-[12px] font-medium uppercase tracking-[0.18em] transition cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "text-ink font-semibold after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:bg-gold"
                    : "text-ink/70 hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full"
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                      isActive ? "bg-ink text-gold-light" : "bg-sand text-taupe"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Direita: Perfil e Sair */}
        <div className="flex items-center gap-3">
          {/* Perfil */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sand border border-stone text-ink font-serif font-bold text-xs">
              {session?.name ? session.name.slice(0, 2).toUpperCase() : "AM"}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-ink leading-tight">
                {session?.name || "Alexsander Marinho"}
              </p>
              <p className="text-[10px] text-taupe uppercase tracking-wider">Gestão</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-8 w-8 items-center justify-center rounded-full text-taupe hover:text-ink hover:bg-sand transition cursor-pointer"
            title="Sair do painel"
            aria-label="Sair"
          >
            <LogoutIcon size={16} />
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-ivory p-6 shadow-2xl flex flex-col justify-between border-r border-stone">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone/60">
                <span className="font-display text-xl font-medium tracking-[0.25em] text-ink uppercase">
                  GIZZAR
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full p-1.5 text-taupe hover:bg-sand"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              <div className="mt-8 space-y-2">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs uppercase tracking-[0.18em] transition ${
                        isActive
                          ? "bg-ink text-ivory font-semibold"
                          : "text-ink/80 hover:bg-sand hover:text-ink font-medium"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="rounded-full bg-sand text-ink px-2 py-0.5 text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-stone/60 space-y-3">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-taupe hover:text-ink hover:bg-sand rounded-xl transition"
              >
                Sair do Painel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
