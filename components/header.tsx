"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, FileText } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-murrsa-blue border-b-4 border-murrsa-red">
      {/* Top bar — retro stripe */}
      <div className="bg-murrsa-red h-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div>
              <h1 className="font-[var(--font-display)] text-white text-2xl md:text-3xl tracking-widest leading-none">
                MURRSA
              </h1>
              <p className="text-murrsa-steel-light text-[10px] uppercase tracking-[0.3em] leading-none mt-0.5">
                Partes para Motor
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white font-medium text-sm uppercase tracking-wider px-4 py-2 hover:bg-white/10 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 transition-all"
              aria-label="Buscar productos"
            >
              <Search size={20} />
            </button>

            {/* Quote cart */}
            <Link
              href="/cotizacion"
              className="relative text-white/80 hover:text-white p-2 hover:bg-white/10 transition-all"
              aria-label={`Cotización (${totalItems} productos)`}
            >
              <FileText size={20} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-murrsa-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/80 hover:text-white p-2"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar (slide-down) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-murrsa-blue-dark border-t border-white/10"
          >
            <form
              action="/catalogo"
              method="GET"
              className="max-w-3xl mx-auto px-4 py-3"
            >
              <div className="flex items-center bg-white/10 border-2 border-white/20 focus-within:border-murrsa-gold">
                <Search size={18} className="text-white/50 ml-3" />
                <input
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o número de parte..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 px-3 py-2.5 text-sm outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-murrsa-red hover:bg-murrsa-red-light text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors"
                >
                  Buscar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-murrsa-blue-dark border-t border-white/10"
            aria-label="Navegación móvil"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-white/80 hover:text-white font-medium text-sm uppercase tracking-wider px-4 py-3 hover:bg-white/10 border-l-2 border-transparent hover:border-murrsa-red transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
