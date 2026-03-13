"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, Loader2, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product, ProductsResponse } from "@/lib/types";

export function CatalogoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const limit = 24;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      if (search) params.set("search", search);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data: ProductsResponse = await res.json();
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function navigate(newPage: number, newSearch?: string) {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    const s = newSearch !== undefined ? newSearch : search;
    if (s) params.set("search", s);
    router.push(`/catalogo?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(1, searchInput);
  }

  return (
    <div className="min-h-screen bg-murrsa-cream">
      {/* Page header */}
      <div className="bg-murrsa-blue border-b-4 border-murrsa-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="font-[var(--font-display)] text-white text-4xl md:text-5xl tracking-wider">
            CATÁLOGO DE PRODUCTOS
          </h1>
          <p className="text-white/60 mt-2">
            Más de 4,000 refacciones para motores diesel
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-stretch border-2 border-murrsa-charcoal/20 bg-murrsa-white focus-within:border-murrsa-red transition-colors"
          >
            <div className="flex items-center pl-4">
              <Search size={18} className="text-murrsa-steel" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por nombre o número de parte..."
              className="flex-1 bg-transparent px-3 py-3 text-sm text-murrsa-charcoal placeholder:text-murrsa-steel outline-none"
            />
            <button
              type="submit"
              className="bg-murrsa-red hover:bg-murrsa-red-light text-white px-6 font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              Buscar
            </button>
          </form>

          <button className="flex items-center gap-2 border-2 border-murrsa-charcoal/20 bg-murrsa-white px-4 py-3 text-sm text-murrsa-charcoal hover:border-murrsa-blue transition-colors">
            <SlidersHorizontal size={16} />
            <span className="uppercase tracking-wider text-xs font-semibold">
              Filtros
            </span>
          </button>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-murrsa-steel">
            {loading ? (
              "Cargando..."
            ) : (
              <>
                Mostrando{" "}
                <strong className="text-murrsa-charcoal">
                  {products.length}
                </strong>{" "}
                de{" "}
                <strong className="text-murrsa-charcoal">{total}</strong>{" "}
                productos
                {search && (
                  <span>
                    {" "}
                    para{" "}
                    <strong className="text-murrsa-red">&quot;{search}&quot;</strong>
                    <button
                      onClick={() => {
                        setSearchInput("");
                        navigate(1, "");
                      }}
                      className="ml-2 text-murrsa-red underline hover:no-underline"
                    >
                      Limpiar
                    </button>
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2
              size={40}
              className="text-murrsa-red animate-spin"
            />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-[var(--font-display)] text-murrsa-blue text-2xl tracking-wider mb-2">
              NO SE ENCONTRARON PRODUCTOS
            </p>
            <p className="text-murrsa-steel">
              Intenta con otro término de búsqueda o{" "}
              <button
                onClick={() => {
                  setSearchInput("");
                  navigate(1, "");
                }}
                className="text-murrsa-red underline hover:no-underline"
              >
                ver todos los productos
              </button>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => navigate(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1 border-2 border-murrsa-charcoal/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider hover:border-murrsa-red text-murrsa-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => navigate(pageNum)}
                    className={`w-10 h-10 text-sm font-semibold transition-colors ${
                      pageNum === page
                        ? "bg-murrsa-red text-white"
                        : "border-2 border-murrsa-charcoal/10 text-murrsa-charcoal hover:border-murrsa-red"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => navigate(page + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-1 border-2 border-murrsa-charcoal/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider hover:border-murrsa-red text-murrsa-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
