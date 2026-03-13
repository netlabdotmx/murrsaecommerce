import { NextRequest, NextResponse } from "next/server";
import { createQuoteRequest } from "@/lib/odoo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { customerName, customerEmail, customerPhone, customerCompany, items, notes } = body;

    if (!customerName || !customerEmail || !customerPhone || !items?.length) {
      return NextResponse.json(
        { error: "Datos incompletos. Se requiere nombre, email, teléfono y al menos un producto." },
        { status: 400 }
      );
    }

    const result = await createQuoteRequest({
      customerName,
      customerEmail,
      customerPhone,
      customerCompany,
      items,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: "Cotización solicitada exitosamente",
      orderId: result.orderId,
    });
  } catch (error) {
    console.error("[API] Quote error:", error);
    return NextResponse.json(
      { error: "Error al crear cotización" },
      { status: 500 }
    );
  }
}
