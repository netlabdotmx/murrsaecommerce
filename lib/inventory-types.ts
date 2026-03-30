export interface InventoryProduct {
  id: number;
  name: string;
  defaultCode: string;
  barcode: string;
  categoryName: string;
  description: string;
  price: number;
  hasImage: boolean;
  imageUrl: string | null;
}

export interface StockQuant {
  id: number;
  productId: number;
  locationId: number;
  locationName: string;
  warehouseId: number;
  warehouseName: string;
  quantity: number;
  reservedQty: number;
  availableQty: number;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  type: string;
}

export interface Location {
  id: number;
  fullLocation: string;
  warehouseId: number;
  warehouseName: string;
  pasillo: string;
  anaquel: string;
  charola: string;
  caja: string;
}

export interface StockEdit {
  quantId: number | null; // null = new location
  locationId: number;
  locationName: string;
  warehouseName: string;
  currentQty: number;
  newQty: number;
}

export interface SessionUser {
  uid: number;
  name: string;
  username: string;
  sessionId: string;
}

export interface CaptureHistoryItem {
  productName: string;
  defaultCode: string;
  changesCount: number;
  timestamp: Date;
}
