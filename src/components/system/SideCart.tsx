import React from 'react';
import style from '@/styles/system/SideCart.module.scss';
import CartList from '@/components/section/cart/CartList';
import MaterialIcon from '@/components/system/MaterialIcon';
import useCart from '@/hooks/CartHook';
import EmptyCart from '@/components/section/cart/EmptyCart';

interface SideCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideCart: React.FC<SideCartProps> = ({ isOpen, onClose }) => {
  const { error, cartItems } = useCart();
  const showEmpty: boolean = !!error || !cartItems || cartItems.length === 0;

  return (
    <>
      <div
        className={`${style.backdrop} ${isOpen ? style.backdropVisible : ''}`}
        onClick={onClose}
      />
      <nav className={`${style.sideCart} ${isOpen ? style.sideCartOpen : ''}`}>
        <MaterialIcon
          onClick={onClose}
          style={{ margin: '1rem 0 0 1rem', cursor: 'pointer' }}
          icon={'close'}
          color={'gray'}
        />

        {showEmpty ? <EmptyCart transparent /> : <CartList sideNav />}
      </nav>
    </>
  );
};

export default SideCart;
