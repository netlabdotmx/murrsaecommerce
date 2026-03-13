export interface Product {
  id: number;
  name: string;
  price: number;
  defaultCode: string;
  categoryId: number | null;
  categoryName: string | null;
  description: string;
  type: string;
  barcode: string | null;
  hasImage: boolean;
  imageUrl: string | null;
  variantCount: number;
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  children: number[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface QuoteRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  items: { productId: number; quantity: number }[];
  notes?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
