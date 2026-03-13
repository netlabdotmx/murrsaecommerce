import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/odoo";
import { Wrench, ArrowLeft, Hash, Tag, Box } from "lucide-react";
import { AddToQuoteButton } from "./add-to-quote-button";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) notFound();

  const product = await getProductById(productId);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-murrsa-cream">
      {/* Breadcrumb */}
      <div className="bg-murrsa-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-white/50">
            <Link
              href="/catalogo"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              Catálogo
            </Link>
            <span>/</span>
            <span className="text-white/80 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <div className="bg-murrsa-white border-2 border-murrsa-charcoal/10 aspect-square flex items-center justify-center relative">
            {product.hasImage && product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-murrsa-steel/30">
                <Wrench size={96} />
                <span className="text-sm mt-4 uppercase tracking-wider">
                  Imagen no disponible
                </span>
              </div>
            )}
            {product.defaultCode && (
              <div className="absolute top-4 left-4 bg-murrsa-blue text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5">
                {product.defaultCode}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <h1 className="font-[var(--font-display)] text-murrsa-blue text-3xl md:text-4xl tracking-wider leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Specs table */}
            <div className="border-2 border-murrsa-charcoal/10 mb-8">
              <div className="bg-murrsa-blue px-4 py-2">
                <h2 className="font-[var(--font-display)] text-white text-sm tracking-wider">
                  ESPECIFICACIONES
                </h2>
              </div>
              <div className="divide-y divide-murrsa-charcoal/10">
                {product.defaultCode && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-murrsa-white">
                    <Hash size={16} className="text-murrsa-red shrink-0" />
                    <span className="text-sm text-murrsa-steel w-36 shrink-0 uppercase tracking-wider">
                      No. de Parte
                    </span>
                    <span className="text-sm font-semibold text-murrsa-charcoal">
                      {product.defaultCode}
                    </span>
                  </div>
                )}
                {product.categoryName && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-murrsa-cream">
                    <Tag size={16} className="text-murrsa-red shrink-0" />
                    <span className="text-sm text-murrsa-steel w-36 shrink-0 uppercase tracking-wider">
                      Categoría
                    </span>
                    <span className="text-sm font-semibold text-murrsa-charcoal">
                      {product.categoryName}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 px-4 py-3 bg-murrsa-white">
                  <Box size={16} className="text-murrsa-red shrink-0" />
                  <span className="text-sm text-murrsa-steel w-36 shrink-0 uppercase tracking-wider">
                    Tipo
                  </span>
                  <span className="text-sm font-semibold text-murrsa-charcoal">
                    {product.type === "consu"
                      ? "Consumible"
                      : product.type === "product"
                      ? "Almacenable"
                      : product.type}
                  </span>
                </div>
                {product.barcode && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-murrsa-cream">
                    <Hash size={16} className="text-murrsa-red shrink-0" />
                    <span className="text-sm text-murrsa-steel w-36 shrink-0 uppercase tracking-wider">
                      Código de barras
                    </span>
                    <span className="text-sm font-semibold text-murrsa-charcoal font-mono">
                      {product.barcode}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="font-[var(--font-display)] text-murrsa-blue text-lg tracking-wider mb-3">
                  DESCRIPCIÓN
                </h2>
                <div
                  className="text-sm text-murrsa-charcoal/80 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Price & CTA */}
            <div className="border-t-2 border-murrsa-charcoal/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-murrsa-steel uppercase tracking-wider">
                    Precio
                  </span>
                  <p className="font-[var(--font-display)] text-3xl text-murrsa-charcoal tracking-wider">
                    {product.price > 0
                      ? `$${product.price.toFixed(2)} MXN`
                      : "SOLICITAR COTIZACIÓN"}
                  </p>
                </div>
              </div>

              <AddToQuoteButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
