import { getWarehouses, getLocations, searchLocations } from "@/lib/odoo-inventory";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { SessionUser } from "@/lib/inventory-types";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("inv_session");
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user: SessionUser = JSON.parse(session.value);
    const query = req.nextUrl.searchParams.get("q");
    const warehouseId = req.nextUrl.searchParams.get("warehouseId");

    // Search mode: search across all locations
    if (query && query.trim()) {
      const locations = await searchLocations(user.sessionId, query);
      return NextResponse.json({ locations });
    }

    // Browse mode: warehouse → locations
    if (warehouseId) {
      const locations = await getLocations(user.sessionId, Number(warehouseId));
      return NextResponse.json({ locations });
    }

    const warehouses = await getWarehouses(user.sessionId);
    return NextResponse.json({ warehouses });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error consultando ubicaciones";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
