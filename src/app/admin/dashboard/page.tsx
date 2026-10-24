"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  getAdminSession,
  getStoredProducts,
  getStoredOrders,
  getStoredBannerConfig,
  AdminProduct,
  AdminOrder,
  AdminBannerConfig,
  AdminSession,
  DEFAULT_BANNER_CONFIG,
  setAdminSession,
} from "@/lib/admin-store";
import AdminNavbar, { AdminTab } from "@/components/admin/AdminNavbar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatsGrid from "@/components/admin/AdminStatsGrid";
import AdminOverviewCards from "@/components/admin/AdminOverviewCards";
import AdminProductsView from "@/components/admin/AdminProductsView";
import AdminBannerEditor from "@/components/admin/AdminBannerEditor";
import AdminOrdersView from "@/components/admin/AdminOrdersView";
import AdminProductModal from "@/components/admin/AdminProductModal";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [session, setSession] = useState<AdminSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [banner, setBanner] = useState<AdminBannerConfig>(DEFAULT_BANNER_CONFIG);

  const [isGlobalProductModalOpen, setIsGlobalProductModalOpen] = useState(false);

  // Carregamento inicial de dados
  const refreshData = () => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setBanner(getStoredBannerConfig());
  };

  useEffect(() => {
    const currentSession = getAdminSession();
    if (!currentSession) {
      // Se não tiver sessão no storage, inicializa sessão demo para conveniência
      const demo = setAdminSession("admin@gizzar.com.br", "Alexsander Marinho");
      setSession(demo);
    } else {
      setSession(currentSession);
    }
    setLoadingSession(false);

    refreshData();

    const handleProductsUpdated = () => setProducts(getStoredProducts());
    const handleOrdersUpdated = () => setOrders(getStoredOrders());
    const handleBannerUpdated = () => setBanner(getStoredBannerConfig());

    window.addEventListener("gizzar_products_updated", handleProductsUpdated);
    window.addEventListener("gizzar_orders_updated", handleOrdersUpdated);
    window.addEventListener("gizzar_banner_updated", handleBannerUpdated);

    return () => {
      window.removeEventListener("gizzar_products_updated", handleProductsUpdated);
      window.removeEventListener("gizzar_orders_updated", handleOrdersUpdated);
      window.removeEventListener("gizzar_banner_updated", handleBannerUpdated);
    };
  }, [router]);

  // Totais e métricas
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === "paid").length;

  const handleTabChange = (tab: AdminTab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-gold" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-wider text-taupe">
            Carregando Painel Gizzar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-ink selection:bg-gold-light selection:text-ink flex flex-col">
      {/* 1. Navbar Superior com Identidade da Marca, Tabs e Perfil */}
      <AdminNavbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        session={session}
        ordersCount={orders.length}
        productsCount={products.length}
      />

      {/* 2. Conteúdo Principal */}
      <main className="flex-1 py-6 sm:py-8">
        <div className="container-page space-y-6 sm:space-y-8">
          {/* Cabeçalho do Painel com Botões de Ação Rápida no Formato Pílula */}
          <AdminHeader
            onNewProduct={() => setIsGlobalProductModalOpen(true)}
            setActiveTab={handleTabChange}
          />

          {/* Linha dos 5 Cards de Estatísticas / Métricas em Quadrados */}
          <AdminStatsGrid
            totalRevenue={totalRevenue}
            totalOrdersCount={orders.length}
            pendingOrdersCount={pendingOrdersCount}
            productsCount={products.length}
            bannerActive={banner.active}
            setActiveTab={handleTabChange}
          />

          {/* Abas e Visualizações Dinâmicas */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              {/* Seção dos 3 Cards Modulares Grandes (como no sistema de referência) */}
              <AdminOverviewCards
                orders={orders}
                products={products}
                banner={banner}
                setActiveTab={handleTabChange}
                onNewProduct={() => setIsGlobalProductModalOpen(true)}
              />
            </div>
          )}

          {activeTab === "products" && (
            <AdminProductsView
              products={products}
              onProductsUpdated={refreshData}
            />
          )}

          {activeTab === "banner" && (
            <AdminBannerEditor
              banner={banner}
              onBannerSaved={(updatedBanner) => {
                setBanner(updatedBanner);
              }}
            />
          )}

          {activeTab === "orders" && (
            <AdminOrdersView
              orders={orders}
              onOrdersUpdated={refreshData}
            />
          )}
        </div>
      </main>

      {/* Modal Global de Cadastro de Produto (+ CRIAR PRODUTO) */}
      {isGlobalProductModalOpen && (
        <AdminProductModal
          onClose={() => setIsGlobalProductModalOpen(false)}
          onSaved={() => {
            refreshData();
            setIsGlobalProductModalOpen(false);
          }}
        />
      )}

      {/* Rodapé Editorial do Painel */}
      <footer className="mt-auto border-t border-stone/50 bg-ivory py-6 text-center text-[11px] uppercase tracking-[0.2em] text-taupe">
        <p>GIZZAR &bull; Atelier & Gestão Administrativa</p>
      </footer>
    </div>
  );
}
