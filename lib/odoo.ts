// -------------------------------------------------
// Odoo JSON-RPC Client — Server-side only
// -------------------------------------------------

const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;
const ODOO_USER = process.env.ODOO_USER!;
const ODOO_API_KEY = process.env.ODOO_API_KEY!;

let cachedUid: number | null = null;

async function jsonRpc(service: string, method: string, args: unknown[]) {
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: { service, method, args },
      id: Date.now(),
    }),
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.data?.message || data.error.message || "Odoo RPC Error");
  }
  return data.result;
}

async function getUid(): Promise<number> {
  if (cachedUid) return cachedUid;
  cachedUid = await jsonRpc("common", "authenticate", [
    ODOO_DB,
    ODOO_USER,
    ODOO_API_KEY,
    {},
  ]);
  if (!cachedUid) throw new Error("Odoo authentication failed");
  return cachedUid;
}

async function call(
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {}
) {
  const uid = await getUid();
  return jsonRpc("object", "execute_kw", [
    ODOO_DB,
    uid,
    ODOO_API_KEY,
    model,
    method,
    args,
    kwargs,
  ]);
}

// ---- Product operations ----

const PRODUCT_FIELDS = [
  "id",
  "name",
  "list_price",
  "default_code",
  "categ_id",
  "description_sale",
  "description",
  "type",
  "barcode",
  "image_1920",
  "product_variant_count",
  "attribute_line_ids",
  "active",
];

export async function getProducts(options: {
  page?: number;
  limit?: number;
  search?: string;
  category?: number;
} = {}) {
  const { page = 1, limit = 24, search, category } = options;
  const offset = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const domain: any[] = [["sale_ok", "=", true], ["active", "=", true]];
  if (search) {
    domain.push("|");
    domain.push(["name", "ilike", search]);
    domain.push(["default_code", "ilike", search]);
  }
  if (category) {
    domain.push(["categ_id", "=", category]);
  }

  const [products, total] = await Promise.all([
    call("product.template", "search_read", [domain], {
      fields: PRODUCT_FIELDS,
      limit,
      offset,
      order: "name asc",
    }),
    call("product.template", "search_count", [domain]),
  ]);

  // Deduplicate by default_code
  const seen = new Set<string>();
  const unique = (products as Record<string, unknown>[]).filter((p) => {
    const code = p.default_code as string;
    if (!code || seen.has(code)) return false;
    seen.add(code);
    return true;
  });

  return {
    products: unique.map(formatProduct),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: number) {
  const products = await call("product.template", "read", [[id]], {
    fields: PRODUCT_FIELDS,
  });
  if (!products || (products as unknown[]).length === 0) return null;
  return formatProduct((products as Record<string, unknown>[])[0]);
}

export async function searchProducts(query: string, limit = 10) {
  const domain = [
    ["sale_ok", "=", true],
    ["active", "=", true],
    "|",
    ["name", "ilike", query],
    ["default_code", "ilike", query],
  ];

  const products = await call("product.template", "search_read", [domain], {
    fields: ["id", "name", "default_code", "list_price"],
    limit,
    order: "name asc",
  });

  const seen = new Set<string>();
  return (products as Record<string, unknown>[])
    .filter((p) => {
      const code = p.default_code as string;
      if (!code || seen.has(code)) return false;
      seen.add(code);
      return true;
    })
    .map((p) => ({
      id: p.id as number,
      name: p.name as string,
      defaultCode: p.default_code as string,
      price: p.list_price as number,
    }));
}

// ---- Category operations ----

export async function getCategories() {
  const categories = await call("product.category", "search_read", [[]], {
    fields: ["id", "name", "parent_id", "child_id"],
    order: "name asc",
  });

  return (categories as Record<string, unknown>[]).map((c) => ({
    id: c.id as number,
    name: c.name as string,
    parentId: c.parent_id
      ? (c.parent_id as [number, string])[0]
      : null,
    children: c.child_id as number[],
  }));
}

// ---- Quote / Sale Order ----

export async function createQuoteRequest(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  items: { productId: number; quantity: number }[];
  notes?: string;
}) {
  // Create a partner (or find existing)
  const partnerId = await call("res.partner", "create", [
    {
      name: data.customerName,
      email: data.customerEmail,
      phone: data.customerPhone,
      company_name: data.customerCompany || "",
    },
  ]);

  // Create sale order lines
  const orderLines = data.items.map((item) => [
    0,
    0,
    {
      product_id: item.productId,
      product_uom_qty: item.quantity,
    },
  ]);

  // Create draft sale order (quotation)
  const orderId = await call("sale.order", "create", [
    {
      partner_id: partnerId,
      order_line: orderLines,
      note: data.notes || `Cotización solicitada desde ecommerce - ${data.customerName}`,
    },
  ]);

  return { orderId, partnerId };
}

// ---- Helpers ----

function formatProduct(p: Record<string, unknown>) {
  return {
    id: p.id as number,
    name: p.name as string,
    price: p.list_price as number,
    defaultCode: (p.default_code as string) || "",
    categoryId: p.categ_id ? (p.categ_id as [number, string])[0] : null,
    categoryName: p.categ_id ? (p.categ_id as [number, string])[1] : null,
    description: (p.description_sale as string) || (p.description as string) || "",
    type: p.type as string,
    barcode: (p.barcode as string) || null,
    hasImage: !!(p.image_1920 as string),
    imageUrl: p.image_1920
      ? `${ODOO_URL}/web/image/product.template/${p.id}/image_1920`
      : null,
    variantCount: p.product_variant_count as number,
  };
}
