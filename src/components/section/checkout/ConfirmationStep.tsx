'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@/components/system/Container';
import Button, { ButtonContainer } from '@/components/system/Button';
import { Logger } from '@/utils/Logger.class';
import { useTranslation } from 'react-i18next';
import CartListItem from '@/components/section/cart/CartListItem';
import { Hr } from '@/components/system/Hr';
import useCart from '@/hooks/CartHook';
import { OrderData } from '@/types/order.types';
import { getOrder } from '@/requests/cart.request';

// Todo: refactor completely
const ConfirmationStep: React.FC = () => {
  const { t } = useTranslation();
  const { orderNumber } = useParams();
  const { mutate } = useCart();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) fetchOrderDetails(orderNumber as string);
  }, [orderNumber]);

  const fetchOrderDetails = async (orderNum: string) => {
    try {
      const response = await getOrder(orderNum);
      const orderData = response.data?.data || response.data;
      if (orderData) setOrderData(orderData);
    } catch (error) {
      Logger.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container justifyContent="center" padding={true}>
        <div>{t('checkout.loadingOrderDetails')}</div>
      </Container>
    );
  }

  if (!orderData) {
    return (
      <Container justifyContent="center" padding={true}>
        <div>{t('checkout.orderNotFound')}</div>
        <Button onClick={() => router.push('/')}>
          {t('checkout.backToShop')}
        </Button>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-CH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container flow="column" alignItems="center" maxWidth="1150" padding={true}>
      {/* Success Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1>{t('checkout.orderConfirmed')}</h1>
        <p>{t('checkout.thankYou')}</p>
      </div>
      <span
        style={{
          width: '100%',
          padding: '1.5rem',
          backgroundColor: '#fdf3e3',
          borderRadius: '12px',
          marginBottom: '2rem',
        }}
      >
        {/* Delivery Information */}
        {orderData.customerInfo?.selectedAddress && (
          <div
            style={{
              marginBottom: '2rem',
            }}
          >
            <h3>{t('checkout.deliveryAddress')}</h3>
            <div>
              {orderData.customerInfo.guestInfo && (
                <div>
                  {orderData.customerInfo.guestInfo.firstName}{' '}
                  {orderData.customerInfo.guestInfo.lastName}
                </div>
              )}
              <div>
                {orderData.customerInfo.selectedAddress.street}{' '}
                {orderData.customerInfo.selectedAddress.houseNumber}
              </div>
              <div>
                {orderData.customerInfo.selectedAddress.zipCode}{' '}
                {orderData.customerInfo.selectedAddress.city}{' '}
                {orderData.customerInfo.selectedAddress.country.toUpperCase()}
              </div>
              <div></div>
            </div>
          </div>
        )}

        {/* Order Number */}
        <div>
          <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>
            {t('checkout.orderNumber')}
          </h3>
          <div>{orderData.orderNumber}</div>
          <p
            style={{
              margin: '0.5rem 0 0 0',
              fontSize: '0.9rem',
              color: '#666',
            }}
          >
            {t('checkout.orderPlacedOn')} {formatDate(orderData.paidAt)}
          </p>
        </div>
      </span>
      {/* Order Summary */}
      <span style={{ width: '100%', marginBottom: '5rem' }}>
        {orderData.items?.map((item: any) => (
          <React.Fragment key={item.productId}>
            <CartListItem item={item} mutate={mutate} review />
            <Hr />
          </React.Fragment>
        ))}
      </span>
      <ButtonContainer>
        <Button onClick={() => router.push('/')} style={{ flex: 1 }}>
          {t('checkout.continueShopping')}
        </Button>
      </ButtonContainer>
      <div
        style={{
          width: '100%',
          padding: '1.5rem',
          backgroundColor: '#fdf3e3',
          borderRadius: '12px',
          marginTop: '12rem',
        }}
      >
        <h4 style={{ margin: '0 0 1rem 0', color: '#383434' }}>
          {t('checkout.whatsNext')}
        </h4>
        <ul
          style={{
            textAlign: 'left',
            margin: 0,
            paddingLeft: '1.5rem',
            color: '#666',
          }}
        >
          <li>{t('checkout.emailConfirmation')}</li>
          <li>{t('checkout.shipNotification')}</li>
          <li>{t('checkout.expectedDelivery')}</li>
        </ul>
      </div>

      <p
        style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          color: '#999',
          textAlign: 'center',
        }}
      >
        {t('checkout.supportContact')}
      </p>
    </Container>
  );
};

export default ConfirmationStep;
