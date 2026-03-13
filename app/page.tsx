import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/odoo";
import { Wrench, Truck, ShieldCheck, Package, ArrowRight, Phone } from "lucide-react";

export default async function HomePage() {
  let featuredProducts: Awaited<ReturnType<typeof getProducts>>["products"] = [];
  try {
    const data = await getProducts({ page: 1, limit: 8 });
    featuredProducts = data.products;
  } catch {
    // Products will be empty, homepage still renders
  }

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative bg-murrsa-blue overflow-hidden min-h-[600px] lg:min-h-[700px]">
        {/* Dot texture overlay */}
        <div className="absolute inset-0 retro-dots pointer-events-none z-10" />

        {/* Truck background image — right side on desktop, full on mobile */}
        <div className="absolute inset-0 lg:left-[45%]">
          <Image
            src="/hero-truck.png"
            alt="Camión diesel imponente"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3A5C] via-[#1B3A5C]/95 to-[#1B3A5C]/40 lg:from-[#1B3A5C] lg:via-[#1B3A5C]/80 lg:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-20">
          <div className="max-w-2xl">
            <div className="inline-block bg-murrsa-red text-white text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 mb-6">
              El catálogo más grande de México
            </div>

            <h1 className="font-[var(--font-display)] text-white text-5xl sm:text-6xl md:text-8xl leading-[0.9] tracking-wider mb-6">
              REFACCIONES
              <br />
              <span className="text-murrsa-red">DIESEL</span>
              <br />
              DE CONFIANZA
            </h1>

            <p className="text-white/80 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
              Más de <strong className="text-murrsa-gold">4,000 partes</strong> en inventario.
              Empaques, accesorios, componentes — todo lo que tu motor necesita.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 bg-murrsa-red hover:bg-murrsa-red-light text-white font-semibold text-sm uppercase tracking-wider px-8 py-4 transition-colors group"
              >
                Ver Catálogo
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white/30 hover:border-white text-white font-semibold text-sm uppercase tracking-wider px-8 py-4 transition-colors"
              >
                <Phone size={16} />
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST BADGES ============ */}
      <section className="bg-murrsa-cream-dark border-y-4 border-murrsa-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Package,
                title: "+4,000",
                subtitle: "Refacciones en catálogo",
              },
              {
                icon: Truck,
                title: "Envíos",
                subtitle: "A toda la República",
              },
              {
                icon: ShieldCheck,
                title: "Garantía",
                subtitle: "Piezas originales",
              },
              {
                icon: Wrench,
                title: "Soporte",
                subtitle: "Asesoría técnica",
              },
            ].map((badge) => (
              <div
                key={badge.title}
                className="flex items-center gap-3 md:gap-4"
              >
                <div className="bg-murrsa-blue p-2.5 shrink-0">
                  <badge.icon size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-[var(--font-display)] text-murrsa-blue text-lg md:text-xl tracking-wider leading-none">
                    {badge.title}
                  </p>
                  <p className="text-xs text-murrsa-steel uppercase tracking-wider mt-0.5">
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs text-murrsa-red uppercase tracking-[0.3em] font-semibold">
                  Nuestro catálogo
                </span>
                <h2 className="font-[var(--font-display)] text-murrsa-blue text-4xl md:text-5xl tracking-wider mt-1">
                  PRODUCTOS DESTACADOS
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="hidden md:inline-flex items-center gap-2 text-murrsa-red hover:text-murrsa-red-dark font-semibold text-sm uppercase tracking-wider transition-colors group"
              >
                Ver todos
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group bg-murrsa-white border-2 border-murrsa-charcoal/10 hover:border-murrsa-red/50 transition-all duration-300 flex flex-col"
                >
                  <Link
                    href={`/catalogo/${product.id}`}
                    className="block relative overflow-hidden bg-murrsa-cream-dark aspect-square"
                  >
                    {product.hasImage && product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-murrsa-steel/40">
                        <Wrench size={48} />
                        <span className="text-xs mt-2 uppercase tracking-wider">
                          Sin imagen
                        </span>
                      </div>
                    )}
                    {product.defaultCode && (
                      <div className="absolute top-2 left-2 bg-murrsa-blue text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                        {product.defaultCode}
                      </div>
                    )}
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/catalogo/${product.id}`}>
                      <h3 className="font-semibold text-sm text-murrsa-charcoal leading-snug line-clamp-2 group-hover:text-murrsa-red transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-auto pt-4">
                      <Link
                        href={`/catalogo/${product.id}`}
                        className="block text-center bg-murrsa-red hover:bg-murrsa-red-light text-white text-xs font-semibold uppercase tracking-wider px-3 py-2.5 transition-colors"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 text-center md:hidden">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 bg-murrsa-blue hover:bg-murrsa-blue-light text-white font-semibold text-sm uppercase tracking-wider px-8 py-3 transition-colors"
              >
                Ver todo el catálogo
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ CTA BANNER ============ */}
      <section className="relative bg-murrsa-blue overflow-hidden">
        <div className="absolute inset-0 retro-dots pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-[var(--font-display)] text-white text-3xl md:text-4xl tracking-wider">
                ¿NO ENCUENTRAS TU PIEZA?
              </h2>
              <p className="text-white/60 mt-2 text-lg">
                Nuestro equipo de expertos te ayuda a localizar la refacción
                exacta que necesitas.
              </p>
            </div>
            <Link
              href="/contacto"
              className="shrink-0 inline-flex items-center gap-2 bg-murrsa-gold hover:bg-murrsa-gold-dark text-murrsa-charcoal font-semibold text-sm uppercase tracking-wider px-8 py-4 transition-colors"
            >
              <Phone size={16} />
              Hablar con un experto
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ABOUT PREVIEW ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs text-murrsa-red uppercase tracking-[0.3em] font-semibold">
                Sobre nosotros
              </span>
              <h2 className="font-[var(--font-display)] text-murrsa-blue text-4xl md:text-5xl tracking-wider mt-1 mb-6">
                EXPERTOS EN<br />MOTORES DIESEL
              </h2>
              <p className="text-murrsa-charcoal/80 leading-relaxed mb-4">
                MURRSA es el distribuidor líder de refacciones para motores
                diesel en México. Con años de experiencia en el mercado, hemos
                construido el catálogo más extenso del país.
              </p>
              <p className="text-murrsa-charcoal/80 leading-relaxed mb-8">
                Trabajamos con las marcas más reconocidas para garantizar la
                calidad de cada pieza que distribuimos. Nuestro compromiso es
                ofrecerte las refacciones que necesitas, cuando las necesitas.
              </p>
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 text-murrsa-red hover:text-murrsa-red-dark font-semibold text-sm uppercase tracking-wider transition-colors group"
              >
                Conocer más
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-murrsa-blue p-8 md:p-12">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { number: "4,000+", label: "Partes en catálogo" },
                    { number: "25+", label: "Años de experiencia" },
                    { number: "100%", label: "Piezas originales" },
                    { number: "500+", label: "Clientes satisfechos" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="font-[var(--font-display)] text-murrsa-gold text-3xl md:text-4xl tracking-wider">
                        {stat.number}
                      </p>
                      <p className="text-white/60 text-xs uppercase tracking-wider mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative corner */}
              <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-murrsa-red -z-10" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
