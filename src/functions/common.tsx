import { IProduct } from '@/types/product.types';
import { CartItem } from '@/hooks/CartHook';

export const getCategoryName = (category: string): string | undefined => {
  switch (category) {
    case 'tampers':
      return 'Tampers';
    case 'milk-jugs':
      return 'Milk Jugs';
    case 'tools':
      return 'Tools';
    case 'coffee-cups':
      return 'Coffee Cups';
    case 'cleaning-tools':
      return 'Cleaning Tools';
    case 'scales':
      return 'Scales';
    default:
      return undefined;
  }
};

export const getCategoryIndex = (category: string): number => {
  switch (category) {
    case 'tampers':
      return 1;
    case 'milk-jugs':
      return 2;
    case 'tools':
      return 3;
    case 'coffee-cups':
      return 4;
    case 'cleaning-tools':
      return 5;
    case 'scales':
      return 6;
    default:
      return 0;
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export interface StockValidationResult {
  isValid: boolean;
  errors: Array<{
    productId: string;
    productName?: string;
    requested: number;
    available: number;
    shortage: number;
  }>;
}
export const validateCartStock = (
  products: IProduct[],
  cartItems: CartItem[],
): StockValidationResult => {
  const errors: StockValidationResult['errors'] = [];

  for (const cartItem of cartItems) {
    const product = products.find(
      (p) => p._id === cartItem.productId || p.id === cartItem.productId,
    );

    if (!product) {
      errors.push({
        productId: cartItem.productId,
        requested: cartItem.quantity,
        available: 0,
        shortage: cartItem.quantity,
      });
      continue;
    }

    if (product.stockQuantity < cartItem.quantity) {
      errors.push({
        productId: cartItem.productId,
        productName: product.name.inv,
        requested: cartItem.quantity,
        available: product.stockQuantity,
        shortage: cartItem.quantity - product.stockQuantity,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
