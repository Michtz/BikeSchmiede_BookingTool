'use client';

import React, { useState, useEffect } from 'react';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { Container, Title } from '@/components/system/Container';
import Button from '@/components/system/Button';
import { useAuth } from '@/hooks/AuthHook';
import {
  confirmPayment,
  createPaymentIntent,
} from '@/requests/payment.request';
import { useRouter } from 'next/navigation';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { StripeElementLocale } from '@stripe/stripe-js';
import { validateCartStock } from '@/functions/common';
import useCart, { CartItem } from '@/hooks/CartHook';
import { Logger } from '@/utils/Logger.class';
import useProducts from '@/hooks/ProductsHook';

const PaymentForm = ({
  onPaymentMethodReady,
}: {
  onPaymentMethodReady: () => void;
}) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Submit Payment Method to Payment Intent
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error('Submit error:', submitError);
        setIsProcessing(false);
        return;
      }

      // Confirm Payment Intent WITHOUT completing payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin },
        redirect: 'if_required',
      });

      if (!error && paymentIntent) {
        // Store Payment Method ID and Payment Intent ID for ReviewStep
        const paymentMethodId = paymentIntent.payment_method as string;
        const paymentIntentId = paymentIntent.id;

        if (paymentMethodId) {
          localStorage.setItem('paymentMethodId', paymentMethodId);
        }
        if (paymentIntentId) {
          localStorage.setItem('paymentIntentId', paymentIntentId);
        }

        // Payment Method is now attached, proceed to review
        onPaymentMethodReady();
      } else {
        console.error('Confirm error:', error);
      }
    } catch (error) {
      console.error('Payment setup error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        style={{ width: '84%', margin: '0', marginTop: '1rem' }}
      >
        {isProcessing
          ? t('checkout.processingPayment')
          : t('checkout.placeOrderAndPay')}
      </Button>
    </form>
  );
};

const PaymentStep: React.FC = () => {
  const { t } = useTranslation();
  const { sessionData } = useAuth();
  const { showFeedback } = useFeedback();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState('');

  const { cartItems } = useCart();
  const { products } = useProducts();
  const [language, setLanguage] = useState<StripeElementLocale>('de');

  useEffect(() => {
    const cookieLanguage = Cookies.get('language') || 'de';
    setLanguage(cookieLanguage as StripeElementLocale);
  }, []);

  useEffect(() => {
    if (sessionData?.sessionId) {
      createPaymentIntent(sessionData.sessionId)
        .then((result) => {
          // Handle nested response structure
          const data = result?.data || result;
          const clientSecret = data?.clientSecret || data?.client_secret;
          localStorage.setItem('paymentIntentId', data.paymentIntentId);
          if (
            clientSecret &&
            clientSecret.startsWith('pi_') &&
            clientSecret.includes('_secret_')
          ) {
            setClientSecret(clientSecret);
          } else {
            showFeedback(t('checkout.paymentInitFailed'), 'error');
          }
        })
        .catch(() => {
          showFeedback(t('checkout.paymentInitFailed'), 'error');
        });
    } else {
    }
  }, [sessionData?.sessionId, t, showFeedback]);

  // const handlePaymentMethodReady = () => {
  //   showFeedback(t('checkout.paymentMethodValidated'), 'success');
  //   localStorage.setItem('checkoutPayment', 'done');
  //   router.push('/checkout/');
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

    const paymentMethodId = localStorage.getItem('paymentMethodId');
    if (!paymentMethodId) {
      showFeedback(t('feedback.payment-method-not-found'), 'error');
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
    }
  };

  if (!clientSecret) {
    return (
      <Container flow={'column'}>
        <Title>{t('checkout.paymentInformation')}</Title>
        <div>{t('checkout.loadingPayment')}</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          {sessionData?.sessionId
            ? `Session ID: ${sessionData.sessionId}`
            : 'Warte auf Session...'}
        </div>
      </Container>
    );
  }

  // Todo: remove inline styles
  return (
    <div
      style={{
        width: '100%',
        margin: '0 auto',
        padding: '0 20px',
        maxWidth: '800px',
      }}
    >
      <Title>{t('checkout.paymentInformation')}</Title>
      <div
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: 'red',
          marginTop: '8px',
          marginBottom: '8px',
        }}
      >
        Use 4242 4242 4242 4242 as card number to test
      </div>
      <Elements
        key={clientSecret}
        stripe={stripePromise}
        options={{
          clientSecret,
          locale: language,
          appearance: {
            theme: 'flat',
            variables: {
              colorPrimary: '#c7bda9',
              colorBackground: '#ffffff',
              colorText: '#333230',
              colorDanger: '#dc2626',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px',
            },
            rules: {
              '.Input': {
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                width: '100%',
              },
              '.Input:focus': {
                border: '1px solid #efe5d3',
                boxShadow: '0 0 0 2px rgba(239, 229, 211, 0.2)',
              },
              '.Label': {
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              },
            },
          },
        }}
      >
        <PaymentForm onPaymentMethodReady={handleFinalPayment} />
      </Elements>
    </div>
  );
};

export default PaymentStep;
