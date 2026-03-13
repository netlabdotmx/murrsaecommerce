import type React from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans, Bebas_Neue } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MURRSA — Partes para Motores Diesel",
  description:
    "El distribuidor más grande de refacciones para motores diesel en México. Más de 4,000 partes disponibles. Solicita tu cotización hoy.",
  keywords: [
    "refacciones diesel",
    "partes motor diesel",
    "MURRSA",
    "Perkins",
    "Cummins",
    "piezas diesel México",
  ],
  openGraph: {
    title: "MURRSA — Partes para Motores Diesel",
    description:
      "El distribuidor más grande de refacciones para motores diesel en México.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" dir="ltr">
      <body
        className={`${ibmPlexSans.variable} ${bebasNeue.variable} antialiased`}
      >
        <CartProvider>
          <a href="#main-content" className="skip-to-content">
            Saltar al contenido principal
          </a>
          <Header />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
