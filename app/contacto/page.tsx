"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactoPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSent(true);
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-murrsa-cream">
      {/* Hero */}
      <div className="bg-murrsa-blue border-b-4 border-murrsa-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="font-[var(--font-display)] text-white text-4xl md:text-5xl tracking-wider">
            CONTÁCTANOS
          </h1>
          <p className="text-white/60 mt-2">
            Estamos aquí para ayudarte a encontrar la pieza que necesitas
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Contact info */}
          <div>
            <h2 className="font-[var(--font-display)] text-murrsa-blue text-2xl tracking-wider mb-6">
              INFORMACIÓN
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="bg-murrsa-red p-2 shrink-0">
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-murrsa-charcoal uppercase tracking-wider">
                    Teléfono
                  </h3>
                  <p className="text-murrsa-charcoal/70 text-sm mt-1">
                    +52 (55) 1234-5678
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-murrsa-red p-2 shrink-0">
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-murrsa-charcoal uppercase tracking-wider">
                    Email
                  </h3>
                  <p className="text-murrsa-charcoal/70 text-sm mt-1">
                    ventas@murrsa.com.mx
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-murrsa-red p-2 shrink-0">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-murrsa-charcoal uppercase tracking-wider">
                    Dirección
                  </h3>
                  <p className="text-murrsa-charcoal/70 text-sm mt-1">
                    Ciudad de México, MX
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-600 p-2 shrink-0">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-murrsa-charcoal uppercase tracking-wider">
                    WhatsApp
                  </h3>
                  <a
                    href="https://wa.me/5215512345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 text-sm mt-1 font-semibold hover:underline"
                  >
                    Enviar mensaje
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="mt-8 border-2 border-murrsa-charcoal/10 bg-murrsa-white p-4">
              <h3 className="font-[var(--font-display)] text-murrsa-blue text-lg tracking-wider mb-3">
                HORARIO
              </h3>
              <div className="space-y-1 text-sm text-murrsa-charcoal/70">
                <div className="flex justify-between">
                  <span>Lunes a Viernes</span>
                  <span className="font-semibold text-murrsa-charcoal">
                    9:00 - 18:00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado</span>
                  <span className="font-semibold text-murrsa-charcoal">
                    9:00 - 14:00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span className="text-murrsa-red font-semibold">
                    Cerrado
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-green-600 text-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h2 className="font-[var(--font-display)] text-murrsa-blue text-3xl tracking-wider mb-3">
                  ¡MENSAJE ENVIADO!
                </h2>
                <p className="text-murrsa-charcoal/70">
                  Nos pondremos en contacto contigo a la brevedad.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="border-2 border-murrsa-charcoal/10 bg-murrsa-white"
              >
                <div className="bg-murrsa-blue px-6 py-4">
                  <h2 className="font-[var(--font-display)] text-white text-xl tracking-wider">
                    ENVÍANOS UN MENSAJE
                  </h2>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1.5">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full border-2 border-murrsa-charcoal/20 px-4 py-2.5 text-sm bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full border-2 border-murrsa-charcoal/20 px-4 py-2.5 text-sm bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1.5">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full border-2 border-murrsa-charcoal/20 px-4 py-2.5 text-sm bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1.5">
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) =>
                          setForm({ ...form, company: e.target.value })
                        }
                        className="w-full border-2 border-murrsa-charcoal/20 px-4 py-2.5 text-sm bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-murrsa-steel uppercase tracking-wider mb-1.5">
                      Mensaje *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Cuéntanos qué pieza necesitas o cómo podemos ayudarte..."
                      className="w-full border-2 border-murrsa-charcoal/20 px-4 py-2.5 text-sm bg-murrsa-cream focus:border-murrsa-red outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center justify-center gap-2 bg-murrsa-red hover:bg-murrsa-red-light text-white font-semibold text-sm uppercase tracking-wider px-8 py-3 transition-colors disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
