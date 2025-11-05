'use client';

import React, { FC } from 'react';
import CartList from '@/components/section/cart/CartList';
import useCart from '@/hooks/CartHook';
import { Container } from '@/components/system/Container';
import EmptyCart from '@/components/section/cart/EmptyCart';

const CartContainer: FC = () => {
  const { error, cartItems } = useCart();

  const showEmpty: boolean = !!error || !cartItems || cartItems.length === 0;

  return (
    <Container padding={false} flow={'column'}>
      {showEmpty ? <EmptyCart /> : <CartList />}
    </Container>
  );
};

export default CartContainer;
