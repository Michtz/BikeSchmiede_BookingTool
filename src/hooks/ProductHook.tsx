'use client';

import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getProduct } from '@/requests/products.request';
import { RequestError } from '@/types/request.types';
import { useParams } from 'next/navigation';
import { IProduct, ProductResponse } from '@/types/product.types';
import useSocket from '@/hooks/SocketHook';
import { ProductSocketData } from '@/types/socket.types';

/*
 * this hook is used to handle data of one product
 */

export interface SingleProductResponse {
  product: IProduct | null;
  isLoading: boolean;
  error: string | null;
  refreshProduct: () => void;
  isConnected: boolean;
  availableStock: number;
  cartCount: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  lastStockUpdate: Date | null;
}

const useProduct = (): SingleProductResponse => {
  const params = useParams();
  const uuid = params?.id as string;
  const { isConnected } = useSocket();

  const [socketData] = useState<ProductSocketData>({
    availableStock: 0,
    cartCount: 0,
    lastStockUpdate: new Date(),
  });

  const { data, error, isLoading } = useSWR<
    ProductResponse | undefined,
    RequestError
  >(uuid, () => getProduct(uuid), {
    suspense: false,
    refreshInterval: 60000,
  });

  const refreshProduct = () => mutate(uuid);

  const extractProduct = (): IProduct | null => {
    if (!data || !data.success || !data.data) return null;
    return Array.isArray(data.data) ? data.data[0] : data.data;
  };

  const product = extractProduct();
  let availableStock = product?.stockQuantity ?? 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;
  const isOutOfStock = availableStock <= 0;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    availableStock = product?.stockQuantity ?? 0;
  }, [data]);

  return {
    product,
    isLoading,
    error:
      error?.message ||
      (data && !data.success ? data.error || 'Unknown error' : null),
    refreshProduct,
    isConnected,
    availableStock,
    cartCount: socketData.cartCount,
    isLowStock,
    isOutOfStock,
    lastStockUpdate: socketData.lastStockUpdate,
  };
};

export default useProduct;
