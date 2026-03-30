import { getProductStock, createAndConfirmMove } from "@/lib/odoo-inventory";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { SessionUser } from "@/lib/inventory-types";

// GET — get stock for a product
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("inv_session");
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user: SessionUser = JSON.parse(session.value);
    const productId = Number(req.nextUrl.searchParams.get("productId"));

    if (!productId) {
      return NextResponse.json({ error: "productId requerido" }, { status: 400 });
    }

    const stock = await getProductStock(user.sessionId, productId);
    return NextResponse.json(stock);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error consultando stock";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST — save stock changes (create moves)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("inv_session");
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user: SessionUser = JSON.parse(session.value);
    const { productId, changes } = await req.json();

    const results: number[] = [];

    for (const change of changes) {
      const diff = change.newQty - change.currentQty;
      if (diff === 0) continue;

      const moveId = await createAndConfirmMove(user.sessionId, {
        productId,
        sourceLocationId: diff < 0 ? change.locationId : undefined,
        destLocationId: diff > 0 ? change.locationId : undefined,
        quantity: Math.abs(diff),
        moveType: "adjustment",
        reference: `SUPER-INV/${new Date().toISOString().slice(0, 10)}`,
        notes: `Ajuste desde Super Inventarios por ${user.name}`,
      });

      results.push(moveId);
    }

    return NextResponse.json({ ok: true, moveIds: results, count: results.length });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error guardando cambios";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
