"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, LogIn, Loader2, AlertCircle } from "lucide-react";

export default function InventoryLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/inventory/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error de autenticación");
        return;
      }

      // Store user name for display
      sessionStorage.setItem("inv_user", JSON.stringify(data));
      router.push("/super-inventarios/captura");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-murrsa-blue p-4 mb-4">
            <Wrench size={32} className="text-murrsa-gold" />
          </div>
          <h1 className="font-[var(--font-display)] text-murrsa-blue text-3xl tracking-wider">
            SUPER INVENTARIOS
          </h1>
          <p className="text-murrsa-steel text-sm mt-1">
            Sistema de captura rápida — MURRSA
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-murrsa-white border-2 border-murrsa-charcoal/10">
          <div className="bg-murrsa-blue px-4 py-3">
            <h2 className="font-[var(--font-display)] text-white text-lg tracking-wider">
              INICIAR SESIÓN
            </h2>
          </div>

          <div className="p-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1 font-semibold">
                Usuario / Email
              </label>
              <input
                type="text"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="username"
                className="w-full border-2 border-murrsa-charcoal/20 px-4 py-3 text-base bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1 font-semibold">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border-2 border-murrsa-charcoal/20 px-4 py-3 text-base bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-murrsa-red hover:bg-murrsa-red-light disabled:opacity-50 text-white font-semibold text-sm uppercase tracking-wider px-6 py-4 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Entrar
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-[10px] text-murrsa-steel/50 mt-6 uppercase tracking-wider">
          Usa tus credenciales de Odoo
        </p>
      </div>
    </div>
  );
}
