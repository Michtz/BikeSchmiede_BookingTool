'use client';

import style from '@/styles/system/CartListItem.module.scss';
import React, { useState } from 'react';
import Image from 'next/image';
import { deleteCartItem, updateCartItem } from '@/requests/cart.request';
import NumberStepper from '@/components/system/NumberStepper';
import { useContentTranslate } from '@/hooks/ContentTranslationHook';
import { useAuth } from '@/hooks/AuthHook';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useTranslation } from 'react-i18next';
import { Logger } from '@/utils/Logger.class';

interface CartListItemProp {
  item: any;
  mutate: () => void;
  onClick?: () => void;
  review?: boolean;
  isMax?: boolean;
  stockLow?: boolean;
  noImage?: boolean;
}

const CartListItem: React.FC<CartListItemProp> = ({
  item,
  mutate,
  review = false,
  isMax = false,
  stockLow = false,
  noImage = false,
  onClick,
}) => {
  const { t } = useTranslation([]);
  const { sessionData, userSessionData, isSessionReady } = useAuth();
  const { translate } = useContentTranslate();
  const { showFeedback } = useFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = sessionData?.sessionId as string;
  const userId = userSessionData?.user?.id;

  const handleDeleteItem = async (productId: string) => {
    try {
      setIsLoading(true);
      await deleteCartItem(sessionId, productId, userId);
      mutate();
    } catch (error) {
      Logger.warn('Failed to delete item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number,
  ) => {
    setIsLoading(true);
    try {
      if (!isSessionReady || !sessionData?.sessionId) {
        showFeedback(t('feedback.session-not-ready'), 'error');
        return;
      }

      await updateCartItem(
        sessionData.sessionId,
        productId,
        newQuantity,
        userSessionData?.user?.id || '',
      );

      mutate();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const itemTotal = item.quantity * item.price;

  return (
    <div key={item._id} className={style.cartItemContainer}>
      <div
        className={style.productInfo}
        onClick={() => (!!onClick ? onClick() : null)}
      >
        <div className={style.productImage}>
          {item && !noImage && (
            <Image
              src={item.product.imageUrl || '/placeholder-image.jpg'}
              alt={translate(item.product.name)}
              width={60}
              height={60}
            />
          )}
        </div>
        <div className={style.productDetails}>
          <div className={style.brand}>
            {item.product.brand || t('product.brand_placeholder')}
          </div>
          <h3 className={style.productName}>{translate(item.product.name)}</h3>
          <div className={style.unitPrice}>
            {t('currency.chf')} {item.price?.toFixed(2)}.-
          </div>
        </div>
      </div>

      <div className={style.productControls}>
        {!review && (
          <NumberStepper
            quantity={item.quantity}
            onQuantityChange={(newQuantity) =>
              handleQuantityChange(item.productId, newQuantity)
            }
            onDelete={() => handleDeleteItem(item.productId)}
            disabled={isLoading}
            min={1}
            max={999}
            isMax={isMax}
          />
        )}
        <div className={style.totalPrice}>
          {review && t('cart.review_total', { quantity: item.quantity })}{' '}
          {t('currency.chf')} {itemTotal.toFixed(2)}.-
        </div>
        <div className={style.warningStock}>
          {stockLow && t('cart.stock_warning', { quantity: item.quantity })}
        </div>
      </div>
    </div>
  );
};

export default CartListItem;
