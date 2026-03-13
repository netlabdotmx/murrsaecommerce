import Link from "next/link";
import { Wrench, Truck, ShieldCheck, Users, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Nosotros — MURRSA | Partes para Motores Diesel",
  description:
    "Conoce MURRSA, el distribuidor más grande de refacciones para motores diesel en México. Más de 25 años de experiencia.",
};

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-murrsa-cream">
      {/* Hero */}
      <section className="relative bg-murrsa-blue overflow-hidden">
        <div className="absolute inset-0 retro-dots pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <span className="text-xs text-murrsa-gold uppercase tracking-[0.3em] font-semibold">
            Nuestra historia
          </span>
          <h1 className="font-[var(--font-display)] text-white text-5xl md:text-7xl tracking-wider mt-2">
            SOBRE MURRSA
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mt-4">
            Más de dos décadas dedicados a ser el puente entre los motores
            diesel y las refacciones que los mantienen funcionando.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-[var(--font-display)] text-murrsa-blue text-3xl md:text-4xl tracking-wider mb-6">
                EL DISTRIBUIDOR LÍDER<br />EN REFACCIONES DIESEL
              </h2>
              <div className="space-y-4 text-murrsa-charcoal/80 leading-relaxed">
                <p>
                  MURRSA nació de la pasión por los motores diesel y la
                  necesidad de un distribuidor confiable en el mercado
                  mexicano. Desde nuestros inicios, nos enfocamos en construir
                  el catálogo más extenso de refacciones diesel del país.
                </p>
                <p>
                  Hoy, con más de <strong>4,000 partes en inventario</strong>,
                  somos el referente en la industria. Empaques, accesorios,
                  componentes de motor — si existe, lo tenemos o lo
                  conseguimos.
                </p>
                <p>
                  Nuestra filosofía es simple:{" "}
                  <strong>calidad garantizada, servicio excepcional</strong>.
                  Cada pieza que distribuimos cumple con los estándares más
                  exigentes de la industria.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Wrench,
                  title: "Experiencia",
                  desc: "Más de 25 años en el mercado de refacciones diesel.",
                },
                {
                  icon: ShieldCheck,
                  title: "Calidad",
                  desc: "Solo trabajamos con piezas originales y de alta calidad.",
                },
                {
                  icon: Truck,
                  title: "Alcance",
                  desc: "Envíos a toda la República Mexicana.",
                },
                {
                  icon: Users,
                  title: "Servicio",
                  desc: "Asesoría técnica especializada para cada cliente.",
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="bg-murrsa-white border-2 border-murrsa-charcoal/10 p-6"
                >
                  <div className="bg-murrsa-red p-2 inline-block mb-3">
                    <value.icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-[var(--font-display)] text-murrsa-blue text-lg tracking-wider mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-murrsa-charcoal/70">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-murrsa-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "4,000+", label: "Partes en catálogo" },
              { number: "25+", label: "Años de experiencia" },
              { number: "500+", label: "Clientes activos" },
              { number: "32", label: "Estados con cobertura" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-[var(--font-display)] text-murrsa-gold text-4xl md:text-5xl tracking-wider">
                  {stat.number}
                </p>
                <p className="text-white/60 text-xs uppercase tracking-wider mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[var(--font-display)] text-murrsa-blue text-3xl md:text-4xl tracking-wider mb-4">
            ¿LISTO PARA ENCONTRAR TU PIEZA?
          </h2>
          <p className="text-murrsa-charcoal/70 mb-8">
            Explora nuestro catálogo de más de 4,000 refacciones o contáctanos
            para asesoría personalizada.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-murrsa-red hover:bg-murrsa-red-light text-white font-semibold text-sm uppercase tracking-wider px-8 py-4 transition-colors group"
            >
              Ver Catálogo
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 border-2 border-murrsa-blue text-murrsa-blue hover:bg-murrsa-blue hover:text-white font-semibold text-sm uppercase tracking-wider px-8 py-4 transition-colors"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
