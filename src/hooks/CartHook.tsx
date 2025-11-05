'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import useSWR from 'swr';
import { getCart, updateCartItem } from '@/requests/cart.request';
import { RequestError } from '@/types/request.types';
import { useAuth } from '@/hooks/AuthHook';
import useSocket from '@/hooks/SocketHook';
import { CartSocketData } from '@/types/socket.types';
import { IProduct } from '@/types/product.types';
import { validateCartStock } from '@/functions/common';
import useProducts from '@/hooks/ProductsHook';

export interface CartAPIResponse {
  success: boolean;
  data: any;
}

export interface Cart {
  createdAt: string;
  items: CartItem[];
  sessionId: string;
  total: number;
  userId: string;
  _id: string;
}
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  product?: IProduct[];
  stockLowAt?: number;
}

interface CartResponse {
  cart: Cart | null;
  cartItems: CartItem[] | null;
  reviewedCartItems: CartItem[] | null;
  isLoading: boolean;
  error: string | null;
  mutate: any;
  isConnected: boolean;
  cartCount: { [productId: string]: number };
}

const useCart = (): CartResponse => {
  const { sessionData, userSessionData } = useAuth();
  const { products } = useProducts();
  const { isConnected } = useSocket();
  const [socketData] = useState<CartSocketData>({
    cartCount: {},
    stockConflicts: [],
  });
  const [processedItems, setProcessedItems] = useState<Set<string>>(new Set());
  const [stockIssues, setStockIssues] = useState<Map<string, number>>(
    new Map(),
  );
  const lastErrorsRef = useRef<string>('');

  const sessionId = sessionData?.sessionId as string;
  const userId = userSessionData?.user?.id;

  const { data, error, isLoading, mutate } = useSWR<
    CartAPIResponse,
    RequestError
  >(
    userId ? `cart-${userId}` : `cart-${sessionId}`,
    () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      return getCart(sessionData?.sessionId!, userSessionData?.user?.id);
    },
    {
      suspense: false,
    },
  );

  const processCartItems = (): CartItem[] | null => {
    const items: CartItem[] = data?.data?.data.items || [];
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    return items;
  };

  const cartItems = processCartItems();

  useEffect(() => {
    if (!cartItems || !products || products.length === 0) return;
    const validation = validateCartStock(products, cartItems);
    const errorMap = new Map(validation.errors.map((e) => [e.productId, e]));
    const currentErrors = Array.from(errorMap.keys()).sort().join(',');

    if (currentErrors !== lastErrorsRef.current) {
      lastErrorsRef.current = currentErrors;

      if (errorMap.size > 0) {
        setStockIssues((prev) => {
          const newMap = new Map(prev);
          errorMap.forEach((error, productId) => {
            if (!prev.has(productId)) {
              newMap.set(productId, Date.now());
            }
          });
          return newMap;
        });
      }
    }
  }, [cartItems, products]);

  const reviewedCartItems = useMemo(() => {
    if (!cartItems || !products || products.length === 0) return null;

    const validation = validateCartStock(products, cartItems);
    const errorMap = new Map(validation.errors.map((e) => [e.productId, e]));

    return cartItems
      .map((item) => {
        const error = errorMap.get(item.productId);
        const stockLowAt =
          stockIssues.get(item.productId) || (error ? Date.now() : undefined);

        return error
          ? { ...item, quantity: error.available, stockLowAt }
          : { ...item, stockLowAt };
      })
      .filter((item) => item.quantity > 0);
  }, [cartItems, products, stockIssues]);

  useEffect(() => {
    if (!reviewedCartItems || !sessionData?.sessionId) return;

    const itemsWithStockIssues = reviewedCartItems.filter(
      (item) =>
        item.stockLowAt &&
        !processedItems.has(`${item.productId}-${item.quantity}`),
    );

    if (itemsWithStockIssues.length === 0) return;
    itemsWithStockIssues.forEach(async (item) => {
      const key = `${item.productId}-${item.quantity}`;

      try {
        await updateCartItem(
          sessionData.sessionId,
          item.productId,
          item.quantity,
          userSessionData?.user?.id || '',
        );

        setProcessedItems((prev) => new Set([...prev, key]));
      } catch (error) {
        console.error(`Failed to update cart item ${item.productId}:`, error);
      }
    });

    setTimeout(() => mutate(), 500);
  }, [
    reviewedCartItems,
    sessionData?.sessionId,
    userSessionData?.user?.id,
    processedItems,
    mutate,
  ]);

  useEffect(() => {
    setProcessedItems(new Set());
  }, [cartItems?.length]);

  useEffect(() => {
    if (stockIssues.size === 0) return;

    const timer = setTimeout(() => {
      setStockIssues(new Map());
      lastErrorsRef.current = '';
    }, 30000);

    return () => clearTimeout(timer);
  }, [stockIssues.size]);

  useEffect(() => {
    if (!data?.data?.items) return;
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data?.items, userSessionData]);

  return {
    cart: data?.data || null,
    cartItems: cartItems,
    reviewedCartItems,
    error: error?.message ? error.message : null,
    mutate: mutate,
    isConnected,
    isLoading,
    cartCount: socketData.cartCount,
  };
};

export default useCart;
