'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getProducts } from '@/requests/products.request';
import { RequestError } from '@/types/request.types';
import { IProduct, ProductResponse } from '@/types/product.types';
import useSocket from '@/hooks/SocketHook';
import { Params } from 'next/dist/server/request/params';
import { useParams } from 'next/navigation';
import { getCategoryName } from '@/functions/common';

/*
 * this hook is used to handle data of all products
 */

interface ProductsResponse {
  products: IProduct[];
  allProducts: IProduct[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  totalCartCount: number;
}

const filteredProducts = (
  items: IProduct[],
  category: string | undefined,
): IProduct[] => {
  if (!category) return items;
  return items.filter((product) => product.category === category);
};

const useProducts = (): ProductsResponse => {
  const { isConnected } = useSocket();
  const [cartCounts] = useState<{ [productId: string]: number }>({});
  const params: Params = useParams();

  const category: string | undefined = getCategoryName(
    params?.category as string,
  );

  const { data, error, isLoading } = useSWR<ProductResponse, RequestError>(
    'products',
    () => getProducts(),
    {
      suspense: false,
      refreshInterval: 60000,
    },
  );

  const processAvailableProducts = (): IProduct[] => {
    if (!data?.data) return [];

    return (data.data as IProduct[])
      .filter((product) => product.isActive)
      .filter((product) => product.stockQuantity > 0)

      .map((product) => {
        const availableStock = product.stockQuantity ?? 0;
        const isLowStock = availableStock > 0 && availableStock <= 5;
        const isOutOfStock = availableStock <= 0;
        return {
          ...product,
          cartCount: cartCounts[product._id] || 0,
          isLowStock,
          isOutOfStock,
          lastStockUpdate: new Date(),
        };
      });
  };
  const processProducts = (): IProduct[] => {
    if (!data?.data) return [];

    return (data.data as IProduct[]).map((product) => {
      const availableStock = product.stockQuantity ?? 0;
      const isLowStock = availableStock > 0 && availableStock <= 5;
      const isOutOfStock = availableStock <= 0;

      return {
        ...product,
        cartCount: cartCounts[product._id] || 0,
        isLowStock,
        isOutOfStock,
        lastStockUpdate: new Date(),
      };
    });
  };

  const processedProductsAll = processProducts();
  const processedProducts = processAvailableProducts();
  const totalCartCount = Object.values(cartCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  const errorMessage: string | null =
    error?.message ||
    (data && !data.success ? data.error || 'unknown error' : null);

  return {
    products: filteredProducts(processedProducts, category),
    allProducts: processedProductsAll,
    isLoading,
    error: errorMessage,
    isConnected,
    totalCartCount,
  };
};

export default useProducts;
