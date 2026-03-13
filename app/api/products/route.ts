import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/odoo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category")
      ? parseInt(searchParams.get("category")!, 10)
      : undefined;

    const data = await getProducts({ page, limit, search, category });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Products error:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
