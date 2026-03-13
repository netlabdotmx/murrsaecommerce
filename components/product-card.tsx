"use client";

import { Wrench } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-murrsa-white border-2 border-murrsa-charcoal/10 hover:border-murrsa-red/50 transition-all duration-300 flex flex-col"
    >
      {/* Image area */}
      <Link href={`/catalogo/${product.id}`} className="block relative overflow-hidden bg-murrsa-cream-dark aspect-square">
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
            <span className="text-xs mt-2 uppercase tracking-wider">Sin imagen</span>
          </div>
        )}

        {/* Part number badge */}
        {product.defaultCode && (
          <div className="absolute top-2 left-2 bg-murrsa-blue text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
            {product.defaultCode}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/catalogo/${product.id}`}>
          <h3 className="font-semibold text-sm text-murrsa-charcoal leading-snug line-clamp-2 group-hover:text-murrsa-red transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {product.categoryName && (
          <span className="text-xs text-murrsa-steel mt-1 uppercase tracking-wider">
            {product.categoryName}
          </span>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <span
            className={cn(
              "font-[var(--font-display)] text-xl tracking-wider",
              product.price > 0
                ? "text-murrsa-charcoal"
                : "text-murrsa-red"
            )}
          >
            {product.price > 0
              ? `$${product.price.toFixed(2)}`
              : "COTIZAR"}
          </span>

          <button
            onClick={() => addItem(product)}
            className="bg-murrsa-red hover:bg-murrsa-red-light text-white text-xs font-semibold uppercase tracking-wider px-3 py-2 transition-colors shrink-0"
            aria-label={`Agregar ${product.name} a cotización`}
          >
            + Cotizar
          </button>
        </div>
      </div>
    </motion.article>
  );
}
