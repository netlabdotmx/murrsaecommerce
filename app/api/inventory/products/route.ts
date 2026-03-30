import { searchProducts } from "@/lib/odoo-inventory";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { SessionUser } from "@/lib/inventory-types";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("inv_session");
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user: SessionUser = JSON.parse(session.value);
    const query = req.nextUrl.searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const products = await searchProducts(user.sessionId, query);
    return NextResponse.json(products);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error buscando productos";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
