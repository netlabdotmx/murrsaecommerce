import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-murrsa-blue text-white/80">
      {/* Top stripe */}
      <div className="h-1 bg-murrsa-red" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div>
                <h2 className="font-[var(--font-display)] text-white text-2xl tracking-widest leading-none">
                  MURRSA
                </h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mt-0.5">
                  Partes para Motor
                </p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              El distribuidor más grande de refacciones para motores diesel en
              México. Más de 12,000 partes en inventario.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-[var(--font-display)] text-white text-lg tracking-wider mb-4 border-b border-murrsa-red pb-2">
              Navegación
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Inicio" },
                { href: "/catalogo", label: "Catálogo de Productos" },
                { href: "/nosotros", label: "Nosotros" },
                { href: "/contacto", label: "Contacto" },
                { href: "/cotizacion", label: "Mi Cotización" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white hover:pl-1 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-[var(--font-display)] text-white text-lg tracking-wider mb-4 border-b border-murrsa-red pb-2">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Phone size={16} className="text-murrsa-red mt-0.5 shrink-0" />
                <span className="text-white/60">33 3689 1556</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Mail size={16} className="text-murrsa-red mt-0.5 shrink-0" />
                <span className="text-white/60">ventas@murrsa.com.mx</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="text-murrsa-red mt-0.5 shrink-0" />
                <span className="text-white/60">Las Granjas 28, La Capilla, 45690 Las Pintas, Jal.</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="font-[var(--font-display)] text-white text-lg tracking-wider mb-4 border-b border-murrsa-red pb-2">
              ¿Necesitas una pieza?
            </h3>
            <p className="text-sm text-white/60 mb-4">
              Con más de 12,000 refacciones en inventario, tenemos la pieza que
              necesitas para tu motor diesel.
            </p>
            <Link
              href="/catalogo"
              className="inline-block bg-murrsa-red hover:bg-murrsa-red-light text-white font-semibold text-sm uppercase tracking-wider px-6 py-3 transition-colors"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} MURRSA — Partes para Motor. Todos los
            derechos reservados.
          </p>
          <p className="text-xs text-white/30">
            Diseñado por{" "}
            <a
              href="https://netlab.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-murrsa-gold hover:text-murrsa-gold-dark transition-colors"
            >
              Netlab
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
