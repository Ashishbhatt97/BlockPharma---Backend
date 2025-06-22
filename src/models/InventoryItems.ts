export interface InventoryItemData {
  name: string;
  brand: string;
  category: string;
  image?: string;
  stock: number;
  threshold: number;
  unit: string;
  price: number;
  expiry: string;
  batchNumber?: string;
  productId: string;
  pharmacyOutletId: string;
}

export interface RestockInventoryData {
  productId: string;
  pharmacyOutletId: string;
  quantity: number;
  batchNumber?: string;
  expiry?: string;
  price?: number;
}

export interface InventoryResponse {
  id: string;
  name: string;
  brand: string;
  category: string;
  image?: string;
  stock: number;
  threshold: number;
  unit: string;
  price: number;
  expiry: string;
  batchNumber?: string;
  productId: string;
  pharmacyOutletId: string;
  createdAt: Date;
  updatedAt: Date;
}
