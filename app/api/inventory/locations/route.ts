import { getWarehouses, getLocations } from "@/lib/odoo-inventory";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { SessionUser } from "@/lib/inventory-types";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("inv_session");
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user: SessionUser = JSON.parse(session.value);
    const warehouseId = req.nextUrl.searchParams.get("warehouseId");

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
