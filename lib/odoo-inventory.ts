// -------------------------------------------------
// Odoo Inventory Client — Session-based auth
// Used by /super-inventarios routes
// -------------------------------------------------

const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;

// --- Low-level JSON-RPC with session ---

async function jsonRpcWithSession(
  url: string,
  params: Record<string, unknown>,
  sessionId?: string
) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionId) headers["Cookie"] = `session_id=${sessionId}`;

  const res = await fetch(`${ODOO_URL}${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params,
      id: Date.now(),
    }),
  });

  // Extract session_id from Set-Cookie if present
  const setCookie = res.headers.get("set-cookie");
  let newSessionId: string | null = null;
  if (setCookie) {
    const match = setCookie.match(/session_id=([^;]+)/);
    if (match) newSessionId = match[1];
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.data?.message || data.error.message || "Odoo error");
  }

  return { result: data.result, sessionId: newSessionId };
}

async function callKw(
  sessionId: string,
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {}
) {
  const { result } = await jsonRpcWithSession(
    "/web/dataset/call_kw",
    { model, method, args, kwargs },
    sessionId
  );
  return result;
}

// --- Authentication ---

export async function authenticateUser(login: string, password: string) {
  const { result, sessionId } = await jsonRpcWithSession(
    "/web/session/authenticate",
    { db: ODOO_DB, login, password }
  );

  if (!result?.uid) throw new Error("Credenciales inválidas");

  return {
    uid: result.uid as number,
    name: result.name as string,
    username: result.username as string,
    sessionId: sessionId || "",
  };
}

// --- Product Search (SMART — multi-field) ---

export async function searchProducts(sessionId: string, query: string, limit = 15) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Split into words for broader matching
  const words = trimmed.split(/\s+/).filter(Boolean);

  // Build domain: each word must match at least one field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const domain: any[] = [];

  for (const word of words) {
    // Each word: match name OR default_code OR barcode OR description
    domain.push("|", "|", "|");
    domain.push(["name", "ilike", word]);
    domain.push(["default_code", "ilike", word]);
    domain.push(["barcode", "ilike", word]);
    domain.push(["description_sale", "ilike", word]);
  }

  const products = await callKw(sessionId, "product.product", "search_read", [domain], {
    fields: [
      "id", "name", "default_code", "barcode", "image_128",
      "categ_id", "description_sale", "list_price",
    ],
    limit,
    order: "default_code asc, name asc",
  });

  return (products as Record<string, unknown>[]).map((p) => ({
    id: p.id as number,
    name: p.name as string,
    defaultCode: (p.default_code as string) || "",
    barcode: (p.barcode as string) || "",
    categoryName: p.categ_id ? (p.categ_id as [number, string])[1] : "",
    description: (p.description_sale as string) || "",
    price: p.list_price as number,
    hasImage: !!(p.image_128 as string),
    imageUrl: p.image_128
      ? `${ODOO_URL}/web/image/product.product/${p.id}/image_128`
      : null,
  }));
}

// --- Stock (murr.stock.quant) ---

export async function getProductStock(sessionId: string, productId: number) {
  const quants = await callKw(
    sessionId,
    "murr.stock.quant",
    "search_read",
    [[["product_id", "=", productId]]],
    {
      fields: [
        "id", "product_id", "location_id", "warehouse_id",
        "quantity", "reserved_qty", "available_qty",
      ],
    }
  );

  return (quants as Record<string, unknown>[]).map((q) => ({
    id: q.id as number,
    productId: (q.product_id as [number, string])[0],
    locationId: (q.location_id as [number, string])[0],
    locationName: (q.location_id as [number, string])[1],
    warehouseId: (q.warehouse_id as [number, string])[0],
    warehouseName: (q.warehouse_id as [number, string])[1],
    quantity: q.quantity as number,
    reservedQty: q.reserved_qty as number,
    availableQty: q.available_qty as number,
  }));
}

// --- Warehouses ---

export async function getWarehouses(sessionId: string) {
  const warehouses = await callKw(
    sessionId,
    "murr.warehouse",
    "search_read",
    [[["active", "=", true]]],
    {
      fields: ["id", "name", "code", "type"],
      order: "sequence asc",
    }
  );

  return (warehouses as Record<string, unknown>[]).map((w) => ({
    id: w.id as number,
    name: w.name as string,
    code: w.code as string,
    type: w.type as string,
  }));
}

// --- Locations ---

export async function getLocations(sessionId: string, warehouseId?: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const domain: any[] = [["active", "=", true]];
  if (warehouseId) domain.push(["warehouse_id", "=", warehouseId]);

  const locations = await callKw(
    sessionId,
    "murr.location",
    "search_read",
    [domain],
    {
      fields: ["id", "full_location", "warehouse_id", "pasillo", "anaquel", "charola", "caja"],
      order: "warehouse_id, pasillo, anaquel, charola, caja",
    }
  );

  return (locations as Record<string, unknown>[]).map((l) => ({
    id: l.id as number,
    fullLocation: l.full_location as string,
    warehouseId: (l.warehouse_id as [number, string])[0],
    warehouseName: (l.warehouse_id as [number, string])[1],
    pasillo: (l.pasillo as string) || "",
    anaquel: (l.anaquel as string) || "",
    charola: (l.charola as string) || "",
    caja: (l.caja as string) || "",
  }));
}

// --- Stock Moves ---

export async function createAndConfirmMove(
  sessionId: string,
  data: {
    productId: number;
    sourceLocationId?: number;
    destLocationId?: number;
    quantity: number;
    moveType: "in" | "out" | "transfer" | "adjustment";
    reference?: string;
    notes?: string;
  }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const moveData: Record<string, any> = {
    product_id: data.productId,
    quantity: data.quantity,
    move_type: data.moveType,
    reference: data.reference || "CAPTURA-APP",
    notes: data.notes || "Inventario desde Super Inventarios",
  };

  if (data.sourceLocationId) moveData.source_location_id = data.sourceLocationId;
  if (data.destLocationId) moveData.dest_location_id = data.destLocationId;

  const moveId = await callKw(sessionId, "murr.stock.move", "create", [moveData]);
  await callKw(sessionId, "murr.stock.move", "action_confirm", [[moveId]]);

  return moveId as number;
}
