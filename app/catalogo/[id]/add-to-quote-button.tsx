"use client";

import { useState } from "react";
import { FileText, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export function AddToQuoteButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Quantity */}
      <div className="flex items-center border-2 border-murrsa-charcoal/20">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="px-4 py-3 text-lg font-bold text-murrsa-charcoal hover:bg-murrsa-cream transition-colors"
        >
          −
        </button>
        <span className="px-4 py-3 text-sm font-semibold text-murrsa-charcoal min-w-[48px] text-center">
          {qty}
        </span>
        <button
          onClick={() => setQty(qty + 1)}
          className="px-4 py-3 text-lg font-bold text-murrsa-charcoal hover:bg-murrsa-cream transition-colors"
        >
          +
        </button>
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        className={`flex-1 flex items-center justify-center gap-2 font-semibold text-sm uppercase tracking-wider px-6 py-3 transition-all ${
          added
            ? "bg-green-600 text-white"
            : "bg-murrsa-red hover:bg-murrsa-red-light text-white"
        }`}
      >
        {added ? (
          <>
            <Check size={18} />
            Agregado a cotización
          </>
        ) : (
          <>
            <FileText size={18} />
            Agregar a cotización
          </>
        )}
      </button>
    </div>
  );
}
