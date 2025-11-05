export interface transKey {
  inv: string;
  en: string;
  fr: string;
  de: string;
  [key: string]: string | undefined;
}

export interface IProduct {
  _id: string;
  id: string;
  name: transKey;
  description: transKey;
  price: number;
  stockQuantity: number;
  category: ProductCategoryOptions;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategoryOptions =
  | 'Tamper'
  | 'Milk'
  | 'Tools'
  | 'Coffee Cups'
  | 'Scales'
  | '';

export interface ProductResponse {
  success: boolean;
  data?: IProduct[] | null;
  error?: string;
}

export interface CreateProductRequest {
  name: transKey;
  description: transKey;
  price: number;
  stockQuantity: number;
  category: string;
}

export interface UpdateProductRequest {
  name?: transKey;
  description?: transKey;
  price?: number;
  stockQuantity?: number;
  category?: string;
}
