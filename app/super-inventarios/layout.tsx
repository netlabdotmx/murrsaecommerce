import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Inventarios — MURRSA",
  description: "Sistema de captura rápida de inventario para MURRSA",
  robots: "noindex, nofollow",
};

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-murrsa-cream">
      {children}
    </div>
  );
}
