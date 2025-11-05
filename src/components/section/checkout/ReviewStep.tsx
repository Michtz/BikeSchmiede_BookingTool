'use client';

import React, { useState } from 'react';
import { Container, Title } from '@/components/system/Container';
import Button, { ButtonContainer } from '@/components/system/Button';
import { useAuth } from '@/hooks/AuthHook';
import { confirmPayment } from '@/requests/payment.request';
import { useRouter } from 'next/navigation';
import { useFeedback } from '@/hooks/FeedbackHook';
import CartList from '@/components/section/cart/CartList';
import { useTranslation } from 'react-i18next';
import { Logger } from '@/utils/Logger.class';
import useProducts from '@/hooks/ProductsHook';
import useCart, { CartItem } from '@/hooks/CartHook';
import { validateCartStock } from '@/functions/common';

const ReviewForm = () => {
  const { t } = useTranslation();
  const { sessionData } = useAuth();
  const { cartItems } = useCart();
  const { products } = useProducts();
  const { showFeedback } = useFeedback();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Will get integrated soon but not before presentation
  // useEffect(() => {
  //   const paymentId = localStorage.getItem('paymentIntentId');
  //   if (!paymentId) return;
  //   const result = getPaymentInfo(paymentId);
  //   console.log(result);
  // }, []);
  //
  // const getPaymentInfo = async (paymentId: string) => {
  //   const result = await getPaymentMethode(paymentId);
  //   console.log(result, paymentId);
  //   setPaymentMethode(result);
  // };

  const handleFinalPayment = async () => {
    if (!sessionData?.sessionId) {
      showFeedback(t('feedback.session-not-available'), 'error');
      return;
    }
    const isOrderStockValid = validateCartStock(
      products,
      cartItems as CartItem[],
    );

    if (isOrderStockValid.errors.length > 0) {
      showFeedback(t('feedback.cart-stock-not-valid'), 'error');

      throw isOrderStockValid.errors;
    }

    setIsProcessing(true);

    const paymentMethodId = localStorage.getItem('paymentMethodId');
    if (!paymentMethodId) {
      showFeedback(t('feedback.payment-method-not-found'), 'error');
      setIsProcessing(false);
      return;
    }

    // Get the payment intent ID from local storage (set during payment step)
    const paymentIntentId =
      localStorage.getItem('paymentIntentId') || 'will_be_retrieved';
    const confirmResult = await confirmPayment(
      sessionData.sessionId,
      paymentIntentId,
      paymentMethodId,
    );
    localStorage.removeItem('checkoutPayment');
    localStorage.removeItem('checkoutAddress');
    localStorage.removeItem('paymentMethodId');
    localStorage.removeItem('paymentIntentId');

    if (confirmResult && confirmResult.success) {
      const orderNumber =
        confirmResult.order?.orderNumber ||
        confirmResult.data?.orderNumber ||
        confirmResult.data?.order?.orderNumber ||
        confirmResult.orderNumber;
      if (orderNumber) {
        showFeedback(t('checkout.orderPlacedSuccess'), 'success');
        router.push(`/checkout/${orderNumber}`);
      } else {
        showFeedback(t('feedback.order-number-missing'), 'error');
      }
    } else {
      showFeedback(t('checkout.orderCreationFailed'), 'error');
    }
    try {
    } catch (e) {
      showFeedback(t('checkout.paymentProcessingFailed'), 'error');
      Logger.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ButtonContainer styles={{ width: '66%', flexDirection: 'row-reverse' }}>
      <Button
        style={{ width: '66%', marginTop: '4rem' }}
        onClick={handleFinalPayment}
        disabled={isProcessing}
      >
        {isProcessing
          ? t('checkout.processingPayment')
          : t('checkout.placeOrderAndPay')}
      </Button>
    </ButtonContainer>
  );
};

const ReviewStep: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container flow={'column'} padding={false} alignItems={'center'}>
      <Title>{t('checkout.reviewOrder')}</Title>
      <CartList review />
      <ReviewForm />
    </Container>
  );
};

export default ReviewStep;
