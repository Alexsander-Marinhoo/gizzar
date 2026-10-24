"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAdminSession,
  setAdminSession,
  AdminSession,
} from "@/lib/admin-store";
import { LockIcon, MailIcon, ArrowRightIcon } from "@/components/ui/Icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@gizzar.com.br");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingSession, setExistingSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    const session = getAdminSession();
    if (session) {
      setExistingSession(session);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Por favor, preencha o e-mail e a senha de administrador.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        setAdminSession(email.trim(), "Alexsander Marinho");
        router.push("/admin/dashboard");
      } catch {
        setError("Erro ao autenticar. Tente novamente.");
        setLoading(false);
      }
    }, 400);
  };

  const handleQuickDemo = () => {
    setEmail("admin@gizzar.com.br");
    setPassword("admin123");
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setAdminSession("admin@gizzar.com.br", "Alexsander Marinho");
      router.push("/admin/dashboard");
    }, 350);
  };

  return (
    <div className="min-h-screen bg-ivory text-ink flex flex-col justify-between py-8 px-4 sm:px-6 relative">
      {/* Topo: Logo Gizzar original */}
      <header className="container-page flex items-center justify-between">
        <Link href="/" className="inline-flex flex-col items-start group">
          <span className="font-display text-[26px] sm:text-[32px] font-medium leading-none tracking-[0.32em] pl-[0.32em] text-ink group-hover:text-gold-dark transition-colors">
            GIZZAR
          </span>
          <span className="mt-1 h-px w-8 bg-gold transition-all group-hover:w-12" />
        </Link>

        <Link
          href="/"
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-taupe hover:text-ink transition flex items-center gap-2"
        >
          <span>Ir para a loja</span>
          <ArrowRightIcon size={14} />
        </Link>
      </header>

      {/* Centro: Card de Acesso */}
      <main className="w-full max-w-md mx-auto my-auto py-10">
        {existingSession && (
          <div className="mb-6 rounded-2xl border border-stone/80 bg-sand/60 p-4 text-center backdrop-blur-sm animate-fade-in">
            <p className="text-xs text-taupe">
              Sessão iniciada como <strong className="text-ink">{existingSession.email}</strong>
            </p>
            <div className="mt-2.5 flex items-center justify-center gap-4">
              <Link
                href="/admin/dashboard"
                className="btn-primary text-xs py-2 px-5"
              >
                Continuar para o Painel
              </Link>
              <button
                type="button"
                onClick={() => {
                  setExistingSession(null);
                  setEmail("");
                  setPassword("");
                }}
                className="text-xs text-taupe underline hover:text-ink transition"
              >
                Trocar conta
              </button>
            </div>
          </div>
        )}

        <div className="card p-8 sm:p-10 shadow-[0_8px_30px_rgba(22,20,18,0.04)]">
          {/* Cabeçalho */}
          <div className="text-center">
            <p className="eyebrow">Acesso Restrito</p>
            <h1 className="heading-display mt-2 text-3xl sm:text-4xl text-ink font-medium">
              Painel de Controle
            </h1>
            <div className="gold-line mx-auto mt-3" />
            <p className="mt-3 text-xs text-taupe leading-relaxed">
              Gestão da vitrine, inventário e pedidos do atelier.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs font-semibold text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <div>
              <label className="label" htmlFor="admin-email">
                E-mail
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-taupe/60">
                  <MailIcon size={16} />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gizzar.com.br"
                  className="input pl-11 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0" htmlFor="admin-password">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-semibold text-taupe hover:text-ink transition uppercase tracking-wider"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-taupe/60">
                  <LockIcon size={16} />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-11 text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-stone text-ink focus:ring-gold/30 accent-[#161412]"
                />
                <span className="text-xs text-taupe">Manter conectado</span>
              </label>
              <span className="text-[11px] text-taupe/70 font-mono">admin123</span>
            </div>

            <button
              id="admin-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-3 py-3.5 text-sm font-semibold rounded-full cursor-pointer shadow-xs"
            >
              {loading ? "Acessando..." : "Entrar no painel"}
            </button>
          </form>

          {/* Acesso Demo em 1 clique */}
          <div className="mt-6 pt-5 border-t border-stone/50 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="btn-outline w-full py-2.5 px-4 text-xs font-semibold rounded-full cursor-pointer"
            >
              Entrar com 1 clique (Administrador Master)
            </button>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="text-center text-[11px] uppercase tracking-[0.2em] text-taupe/70">
        GIZZAR &bull; Atelier & Gestão
      </footer>
    </div>
  );
}
