"use client";

import { useState } from "react";
import { Trash2, Minus, Plus, Send, ArrowLeft, Loader2, CheckCircle, FileText } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CotizacionPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setSending(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          customerCompany: form.company,
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          notes: form.notes,
        }),
      });

      if (res.ok) {
        setSent(true);
        clearCart();
      }
    } catch (err) {
      console.error("Quote error:", err);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-murrsa-cream flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="bg-green-600 text-white w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="font-[var(--font-display)] text-murrsa-blue text-4xl tracking-wider mb-4">
            ¡COTIZACIÓN ENVIADA!
          </h1>
          <p className="text-murrsa-charcoal/70 mb-8">
            Hemos recibido tu solicitud de cotización. Nuestro equipo se pondrá
            en contacto contigo a la brevedad con los precios y disponibilidad.
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 bg-murrsa-red hover:bg-murrsa-red-light text-white font-semibold text-sm uppercase tracking-wider px-8 py-4 transition-colors"
          >
            Seguir comprando
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-murrsa-cream">
      {/* Header */}
      <div className="bg-murrsa-blue border-b-4 border-murrsa-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="font-[var(--font-display)] text-white text-4xl md:text-5xl tracking-wider flex items-center gap-3">
            <FileText size={36} />
            MI COTIZACIÓN
          </h1>
          <p className="text-white/60 mt-2">
            {totalItems > 0
              ? `${totalItems} productos en tu cotización`
              : "Tu cotización está vacía"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={64} className="text-murrsa-steel/30 mx-auto mb-4" />
            <p className="font-[var(--font-display)] text-murrsa-blue text-2xl tracking-wider mb-2">
              TU COTIZACIÓN ESTÁ VACÍA
            </p>
            <p className="text-murrsa-steel mb-8">
              Agrega productos desde el catálogo para solicitar una cotización.
            </p>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-murrsa-red hover:bg-murrsa-red-light text-white font-semibold text-sm uppercase tracking-wider px-8 py-4 transition-colors"
            >
              <ArrowLeft size={16} />
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2">
              <div className="border-2 border-murrsa-charcoal/10 bg-murrsa-white">
                {/* Table header */}
                <div className="bg-murrsa-blue text-white px-4 py-3 grid grid-cols-12 gap-4 text-xs uppercase tracking-wider font-semibold">
                  <span className="col-span-6">Producto</span>
                  <span className="col-span-3 text-center">Cantidad</span>
                  <span className="col-span-3 text-right">Acciones</span>
                </div>

                {/* Items */}
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-12 gap-4 items-center px-4 py-4 border-b border-murrsa-charcoal/10 last:border-b-0"
                    >
                      <div className="col-span-6">
                        <p className="font-semibold text-sm text-murrsa-charcoal leading-snug">
                          {item.product.name}
                        </p>
                        {item.product.defaultCode && (
                          <span className="text-xs text-murrsa-steel mt-0.5 inline-block">
                            Parte: {item.product.defaultCode}
                          </span>
                        )}
                      </div>

                      <div className="col-span-3 flex items-center justify-center gap-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-murrsa-charcoal/20 hover:bg-murrsa-cream transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-murrsa-charcoal/20 hover:bg-murrsa-cream transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="col-span-3 text-right">
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-murrsa-steel hover:text-red-600 p-1 transition-colors"
                          aria-label={`Eliminar ${item.product.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button
                onClick={clearCart}
                className="mt-4 text-sm text-murrsa-steel hover:text-red-600 underline transition-colors"
              >
                Vaciar cotización
              </button>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-1">
              <form
                onSubmit={handleSubmit}
                className="border-2 border-murrsa-charcoal/10 bg-murrsa-white"
              >
                <div className="bg-murrsa-red px-4 py-3">
                  <h2 className="font-[var(--font-display)] text-white text-lg tracking-wider">
                    DATOS DE CONTACTO
                  </h2>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full border-2 border-murrsa-charcoal/20 px-3 py-2 text-sm bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full border-2 border-murrsa-charcoal/20 px-3 py-2 text-sm bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full border-2 border-murrsa-charcoal/20 px-3 py-2 text-sm bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      className="w-full border-2 border-murrsa-charcoal/20 px-3 py-2 text-sm bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1">
                      Notas
                    </label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      placeholder="Detalles adicionales..."
                      className="w-full border-2 border-murrsa-charcoal/20 px-3 py-2 text-sm bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 bg-murrsa-red hover:bg-murrsa-red-light text-white font-semibold text-sm uppercase tracking-wider px-6 py-3 transition-colors disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Solicitar cotización
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
