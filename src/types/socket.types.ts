export interface StockConflictData {
  productId: string;
  productName: string;
  requestedQuantity: number;
  availableStock: number;
  conflictType:
    | 'insufficient_stock'
    | 'product_unavailable'
    | 'reservation_expired';
}

export interface CartSocketData {
  cartCount: { [productId: string]: number };
  stockConflicts: StockConflictData[];
}

export interface ProductSocketData {
  availableStock: number;
  cartCount: number;
  lastStockUpdate: Date;
}
