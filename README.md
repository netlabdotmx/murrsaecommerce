# MURRSA — Ecommerce de Refacciones Diesel

El distribuidor más grande de refacciones para motores diesel en México. Más de 4,000 partes disponibles.

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **TailwindCSS 4** — Custom retro design system
- **Odoo 19** — Backend para productos y pedidos (JSON-RPC)
- **Vercel** — Deployment

## Design

Estilo **American Corporate Modernism** (1970s–80s) con los colores de marca MURRSA: rojo y azul sobre fondos color crema. Tipografía industrial con Bebas Neue + IBM Plex Sans.

## Estructura

```
app/
  page.tsx               # Homepage
  catalogo/page.tsx      # Catálogo de productos
  catalogo/[id]/page.tsx # Detalle de producto
  cotizacion/page.tsx    # Carrito de cotización
  nosotros/page.tsx      # Página de nosotros
  contacto/page.tsx      # Página de contacto
  api/
    products/route.ts    # API productos
    products/[id]/route.ts
    categories/route.ts  # API categorías
    quote/route.ts       # API cotización (crea orden en Odoo)
components/
  header.tsx             # Navegación retro
  footer.tsx             # Footer corporativo
  product-card.tsx       # Tarjeta de producto
lib/
  odoo.ts                # Cliente JSON-RPC para Odoo
  types.ts               # Interfaces TypeScript
  utils.ts               # Utilidades
  cart-context.tsx        # Estado del carrito de cotización
```

## Setup

```bash
npm install
cp .env.local.example .env.local  # Configurar credenciales Odoo
npm run dev
```

## Deploy

Conectar el repo a Vercel y configurar las variables de entorno:
- `ODOO_URL`
- `ODOO_DB`
- `ODOO_USER`
- `ODOO_API_KEY`

---

Diseñado por [Netlab](https://netlab.mx)
