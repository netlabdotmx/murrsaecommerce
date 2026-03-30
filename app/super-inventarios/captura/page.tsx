"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Camera, LogOut, Package, MapPin, Save,
  Loader2, CheckCircle, AlertCircle, Plus, X, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  InventoryProduct, StockQuant, StockEdit, CaptureHistoryItem, Warehouse, Location
} from "@/lib/inventory-types";

export default function CapturaPage() {
  const router = useRouter();

  // User
  const [userName, setUserName] = useState("");

  // Search
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<InventoryProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Selected product
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [stockData, setStockData] = useState<StockQuant[]>([]);
  const [edits, setEdits] = useState<StockEdit[]>([]);
  const [loadingStock, setLoadingStock] = useState(false);

  // Adding location
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Save
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // History
  const [history, setHistory] = useState<CaptureHistoryItem[]>([]);

  // Scanner
  const [scannerOpen, setScannerOpen] = useState(false);

  // Init
  useEffect(() => {
    const user = sessionStorage.getItem("inv_user");
    if (!user) { router.push("/super-inventarios"); return; }
    const parsed = JSON.parse(user);
    setUserName(parsed.name);
  }, [router]);

  // Click outside search results
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // --- Smart Search ---
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/inventory/products?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setShowResults(true);
      }
    } catch { /* ignore */ }
    setSearching(false);
  }, []);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => doSearch(value), 300);
  }

  // --- Select Product ---
  async function selectProduct(product: InventoryProduct) {
    setSelectedProduct(product);
    setShowResults(false);
    setQuery(product.defaultCode || product.name);
    setSaveSuccess(false);
    setLoadingStock(true);

    try {
      const res = await fetch(`/api/inventory/stock?productId=${product.id}`);
      if (res.ok) {
        const data: StockQuant[] = await res.json();
        setStockData(data);
        setEdits(data.map((q) => ({
          quantId: q.id,
          locationId: q.locationId,
          locationName: q.locationName,
          warehouseName: q.warehouseName,
          currentQty: q.quantity,
          newQty: q.quantity,
        })));
      }
    } catch { /* ignore */ }
    setLoadingStock(false);
  }

  // --- Edit Quantity ---
  function updateEdit(index: number, newQty: number) {
    setEdits((prev) => prev.map((e, i) => (i === index ? { ...e, newQty: Math.max(0, newQty) } : e)));
  }

  // --- Add Location ---
  async function openLocationPicker() {
    setShowLocationPicker(true);
    setLoadingLocations(true);
    try {
      const res = await fetch("/api/inventory/locations");
      if (res.ok) {
        const data = await res.json();
        setWarehouses(data.warehouses || []);
      }
    } catch { /* ignore */ }
    setLoadingLocations(false);
  }

  async function selectWarehouse(whId: number) {
    setSelectedWarehouse(whId);
    setLoadingLocations(true);
    try {
      const res = await fetch(`/api/inventory/locations?warehouseId=${whId}`);
      if (res.ok) {
        const data = await res.json();
        setLocations(data.locations || []);
      }
    } catch { /* ignore */ }
    setLoadingLocations(false);
  }

  function addLocation(loc: Location) {
    // Don't add if already exists
    if (edits.some((e) => e.locationId === loc.id)) return;
    setEdits((prev) => [
      ...prev,
      {
        quantId: null,
        locationId: loc.id,
        locationName: loc.fullLocation,
        warehouseName: loc.warehouseName,
        currentQty: 0,
        newQty: 0,
      },
    ]);
    setShowLocationPicker(false);
    setSelectedWarehouse(null);
    setLocations([]);
  }

  // --- Save Changes ---
  const changedEdits = edits.filter((e) => e.newQty !== e.currentQty);
  const hasChanges = changedEdits.length > 0;

  async function saveChanges() {
    if (!selectedProduct || !hasChanges) return;
    setSaving(true);
    try {
      const res = await fetch("/api/inventory/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          changes: changedEdits.map((e) => ({
            locationId: e.locationId,
            currentQty: e.currentQty,
            newQty: e.newQty,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSaveSuccess(true);
        // Vibration feedback
        if (navigator.vibrate) navigator.vibrate(200);

        // Add to history
        setHistory((prev) => [{
          productName: selectedProduct.name,
          defaultCode: selectedProduct.defaultCode,
          changesCount: data.count,
          timestamp: new Date(),
        }, ...prev].slice(0, 20));

        // Update edits to reflect saved state
        setEdits((prev) => prev.map((e) => ({ ...e, currentQty: e.newQty })));

        // Auto-clear after 2s
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch { /* ignore */ }
    setSaving(false);
  }

  // --- Logout ---
  async function logout() {
    await fetch("/api/inventory/auth", { method: "DELETE" });
    sessionStorage.removeItem("inv_user");
    router.push("/super-inventarios");
  }

  // --- Barcode Scan ---
  async function handleScan(code: string) {
    setScannerOpen(false);
    setQuery(code);
    await doSearch(code);
  }

  const totalStock = edits.reduce((a, e) => a + e.newQty, 0);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-murrsa-blue border-b-4 border-murrsa-red shrink-0">
        <div className="bg-murrsa-red h-1" />
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-[var(--font-display)] text-white text-xl tracking-wider">
              SUPER INVENTARIOS
            </h1>
            <p className="text-white/50 text-[10px] uppercase tracking-wider">
              {userName}
            </p>
          </div>
          <button onClick={logout} className="text-white/60 hover:text-white p-2" aria-label="Cerrar sesión">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full space-y-4">
        {/* === SEARCH BAR === */}
        <div ref={searchRef} className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-murrsa-steel" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Buscar por nombre, código, barcode..."
                className="w-full pl-10 pr-4 py-4 text-base border-2 border-murrsa-charcoal/20 bg-murrsa-white focus:border-murrsa-red outline-none transition-colors"
                autoFocus
              />
              {searching && (
                <Loader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-murrsa-steel animate-spin" />
              )}
            </div>
            <button
              onClick={() => setScannerOpen(true)}
              className="bg-murrsa-blue hover:bg-murrsa-blue-light text-white px-4 transition-colors shrink-0 flex items-center gap-1"
              aria-label="Escanear código de barras"
            >
              <Camera size={20} />
              <span className="hidden sm:inline text-xs uppercase tracking-wider font-semibold">Scan</span>
            </button>
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute z-30 top-full left-0 right-0 mt-1 bg-murrsa-white border-2 border-murrsa-charcoal/20 shadow-lg max-h-80 overflow-y-auto"
              >
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectProduct(p)}
                    className="w-full text-left px-4 py-3 hover:bg-murrsa-cream border-b border-murrsa-charcoal/10 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-murrsa-charcoal truncate">
                          {p.name}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {p.defaultCode && (
                            <span className="text-xs text-murrsa-blue font-mono font-bold">
                              {p.defaultCode}
                            </span>
                          )}
                          {p.barcode && (
                            <span className="text-xs text-murrsa-steel">
                              BC: {p.barcode}
                            </span>
                          )}
                          {p.categoryName && (
                            <span className="text-[10px] text-murrsa-steel uppercase">
                              {p.categoryName}
                            </span>
                          )}
                        </div>
                      </div>
                      <Package size={16} className="text-murrsa-steel/40 shrink-0 ml-2" />
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {showResults && query.trim() && searchResults.length === 0 && !searching && (
            <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-murrsa-white border-2 border-murrsa-charcoal/20 px-4 py-6 text-center">
              <p className="text-murrsa-steel text-sm">Sin resultados para &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>

        {/* === SELECTED PRODUCT === */}
        <AnimatePresence mode="wait">
          {selectedProduct && (
            <motion.div
              key={selectedProduct.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Product Card */}
              <div className="bg-murrsa-white border-2 border-murrsa-charcoal/10">
                <div className="bg-murrsa-blue px-4 py-2 flex items-center justify-between">
                  <span className="text-white text-xs uppercase tracking-wider font-semibold">
                    Producto seleccionado
                  </span>
                  <button
                    onClick={() => { setSelectedProduct(null); setEdits([]); setQuery(""); }}
                    className="text-white/60 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-murrsa-charcoal text-base leading-snug">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {selectedProduct.defaultCode && (
                      <span className="bg-murrsa-blue text-white text-xs font-mono font-bold px-2 py-0.5">
                        {selectedProduct.defaultCode}
                      </span>
                    )}
                    {selectedProduct.barcode && (
                      <span className="text-xs text-murrsa-steel">
                        Barcode: {selectedProduct.barcode}
                      </span>
                    )}
                    <span className="text-xs text-murrsa-steel">
                      {selectedProduct.categoryName}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Package size={16} className="text-murrsa-gold" />
                    <span className="font-[var(--font-display)] text-murrsa-blue text-2xl tracking-wider">
                      {totalStock}
                    </span>
                    <span className="text-xs text-murrsa-steel uppercase">unidades total</span>
                  </div>
                </div>
              </div>

              {/* Stock Table */}
              {loadingStock ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="text-murrsa-steel animate-spin" />
                </div>
              ) : (
                <div className="bg-murrsa-white border-2 border-murrsa-charcoal/10">
                  {/* Table Header */}
                  <div className="bg-murrsa-blue text-white px-3 py-2 grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wider font-semibold">
                    <span className="col-span-5">Ubicación</span>
                    <span className="col-span-2 text-center">Actual</span>
                    <span className="col-span-3 text-center">Nuevo</span>
                    <span className="col-span-2 text-center">Dif.</span>
                  </div>

                  {/* Rows */}
                  {edits.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <MapPin size={24} className="text-murrsa-steel/30 mx-auto mb-2" />
                      <p className="text-sm text-murrsa-steel">Sin stock registrado</p>
                    </div>
                  ) : (
                    edits.map((edit, i) => {
                      const diff = edit.newQty - edit.currentQty;
                      return (
                        <div
                          key={`${edit.locationId}-${i}`}
                          className="grid grid-cols-12 gap-2 items-center px-3 py-3 border-b border-murrsa-charcoal/10 last:border-b-0"
                        >
                          <div className="col-span-5 min-w-0">
                            <p className="text-xs font-semibold text-murrsa-charcoal truncate">
                              {edit.locationName}
                            </p>
                            <p className="text-[10px] text-murrsa-steel">{edit.warehouseName}</p>
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="text-sm text-murrsa-steel font-mono">
                              {edit.currentQty}
                            </span>
                          </div>
                          <div className="col-span-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={edit.newQty}
                              onChange={(e) => updateEdit(i, parseFloat(e.target.value) || 0)}
                              className="w-full text-center text-base font-bold border-2 border-murrsa-charcoal/20 focus:border-murrsa-red bg-murrsa-cream py-2 outline-none transition-colors font-mono"
                            />
                          </div>
                          <div className="col-span-2 text-center">
                            {diff !== 0 && (
                              <span
                                className={`inline-block text-xs font-bold px-2 py-1 ${
                                  diff > 0
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {diff > 0 ? `+${diff}` : diff}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Add Location Button */}
                  <button
                    onClick={openLocationPicker}
                    className="w-full flex items-center justify-center gap-2 text-murrsa-red hover:bg-murrsa-cream text-sm font-semibold uppercase tracking-wider px-4 py-3 transition-colors border-t border-murrsa-charcoal/10"
                  >
                    <Plus size={16} />
                    Agregar ubicación
                  </button>
                </div>
              )}

              {/* Save Button */}
              <AnimatePresence>
                {saveSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold text-sm uppercase tracking-wider px-6 py-4"
                  >
                    <CheckCircle size={20} />
                    ¡Cambios guardados!
                  </motion.div>
                ) : (
                  hasChanges && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={saveChanges}
                      disabled={saving}
                      className="w-full flex items-center justify-center gap-2 bg-murrsa-red hover:bg-murrsa-red-light disabled:opacity-50 text-white font-semibold text-sm uppercase tracking-wider px-6 py-4 transition-colors"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Guardar {changedEdits.length} cambio{changedEdits.length > 1 ? "s" : ""}
                        </>
                      )}
                    </motion.button>
                  )
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === history === */}
        {history.length > 0 && (
          <div className="bg-murrsa-white border-2 border-murrsa-charcoal/10">
            <div className="bg-murrsa-charcoal/5 px-4 py-2 border-b border-murrsa-charcoal/10">
              <h3 className="text-xs text-murrsa-steel uppercase tracking-wider font-semibold">
                Capturas recientes ({history.length})
              </h3>
            </div>
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 border-b border-murrsa-charcoal/5 last:border-b-0">
                <CheckCircle size={14} className="text-green-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-murrsa-charcoal truncate">
                    {h.defaultCode || h.productName}
                  </p>
                  <p className="text-[10px] text-murrsa-steel">
                    {h.changesCount} movimiento{h.changesCount > 1 ? "s" : ""} · {h.timestamp.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Placeholder when no product selected */}
        {!selectedProduct && (
          <div className="text-center py-12">
            <Search size={48} className="text-murrsa-steel/20 mx-auto mb-3" />
            <p className="font-[var(--font-display)] text-murrsa-blue text-xl tracking-wider mb-1">
              BUSCA UN PRODUCTO
            </p>
            <p className="text-sm text-murrsa-steel">
              Escribe el nombre, código de parte o escanea el barcode
            </p>
          </div>
        )}
      </main>

      {/* === BARCODE SCANNER MODAL === */}
      <AnimatePresence>
        {scannerOpen && (
          <ScannerModal onScan={handleScan} onClose={() => setScannerOpen(false)} />
        )}
      </AnimatePresence>

      {/* === LOCATION PICKER MODAL === */}
      <AnimatePresence>
        {showLocationPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center"
            onClick={() => { setShowLocationPicker(false); setSelectedWarehouse(null); setLocations([]); }}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-murrsa-white w-full max-w-lg max-h-[80vh] flex flex-col sm:rounded-t-none"
            >
              <div className="bg-murrsa-blue px-4 py-3 flex items-center justify-between shrink-0">
                <h3 className="font-[var(--font-display)] text-white text-lg tracking-wider">
                  {selectedWarehouse ? "SELECCIONAR UBICACIÓN" : "SELECCIONAR ALMACÉN"}
                </h3>
                <button onClick={() => { setShowLocationPicker(false); setSelectedWarehouse(null); setLocations([]); }} className="text-white/60 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-2">
                {loadingLocations ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="text-murrsa-steel animate-spin" />
                  </div>
                ) : !selectedWarehouse ? (
                  <div className="space-y-1">
                    {warehouses.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => selectWarehouse(w.id)}
                        className="w-full text-left px-4 py-3 hover:bg-murrsa-cream transition-colors flex items-center justify-between border-b border-murrsa-charcoal/10"
                      >
                        <div>
                          <span className="text-sm font-semibold text-murrsa-charcoal">{w.name}</span>
                          <span className="text-xs text-murrsa-steel ml-2">({w.code})</span>
                        </div>
                        <ChevronDown size={16} className="text-murrsa-steel -rotate-90" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <button
                      onClick={() => { setSelectedWarehouse(null); setLocations([]); }}
                      className="w-full text-left px-4 py-2 text-murrsa-red text-sm font-semibold hover:bg-murrsa-cream transition-colors"
                    >
                      ← Volver a almacenes
                    </button>
                    {locations.map((l) => {
                      const alreadyAdded = edits.some((e) => e.locationId === l.id);
                      return (
                        <button
                          key={l.id}
                          onClick={() => !alreadyAdded && addLocation(l)}
                          disabled={alreadyAdded}
                          className={`w-full text-left px-4 py-3 transition-colors border-b border-murrsa-charcoal/10 ${
                            alreadyAdded
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:bg-murrsa-cream"
                          }`}
                        >
                          <span className="text-sm text-murrsa-charcoal">{l.fullLocation}</span>
                          {alreadyAdded && <span className="text-[10px] text-murrsa-steel ml-2">(ya agregada)</span>}
                        </button>
                      );
                    })}
                    {locations.length === 0 && (
                      <p className="text-center text-sm text-murrsa-steel py-6">Sin ubicaciones en este almacén</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Barcode Scanner Modal ---
function ScannerModal({ onScan, onClose }: { onScan: (code: string) => void; onClose: () => void }) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [manualCode, setManualCode] = useState("");

  useEffect(() => {
    let scanner: import("html5-qrcode").Html5Qrcode | null = null;

    async function startScanner() {
      if (!scannerRef.current) return;
      const { Html5Qrcode } = await import("html5-qrcode");
      scanner = new Html5Qrcode("scanner-region");

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 280, height: 120 } },
          (decodedText) => {
            if (scanner) scanner.stop().catch(() => {});
            onScan(decodedText);
          },
          () => {} // ignore errors during scanning
        );
      } catch {
        // Camera not available - user can enter manually
      }
    }

    startScanner();

    return () => {
      if (scanner) scanner.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      <div className="bg-murrsa-blue px-4 py-3 flex items-center justify-between shrink-0">
        <h3 className="font-[var(--font-display)] text-white text-lg tracking-wider">
          ESCANEAR CÓDIGO
        </h3>
        <button onClick={onClose} className="text-white/60 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div ref={scannerRef} id="scanner-region" className="w-full max-w-sm" />
      </div>

      {/* Manual fallback */}
      <div className="bg-murrsa-blue-dark px-4 py-4 shrink-0">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-2 text-center">
          O ingresa el código manualmente
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Código de barras..."
            className="flex-1 bg-white/10 border-2 border-white/20 text-white px-4 py-3 text-base outline-none focus:border-murrsa-gold placeholder:text-white/30"
            onKeyDown={(e) => { if (e.key === "Enter" && manualCode.trim()) onScan(manualCode.trim()); }}
          />
          <button
            onClick={() => { if (manualCode.trim()) onScan(manualCode.trim()); }}
            className="bg-murrsa-red text-white px-4 font-semibold text-sm uppercase tracking-wider"
          >
            Buscar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
