import React from 'react';
import style from '@/styles/CartSummaryContainer.module.scss';
import Button from '@/components/system/Button';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Title } from '@/components/system/Container';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  vatRate?: number;
  checkoutButton?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shipping,
  total,
  vatRate = 8.1,
  checkoutButton = false,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  // Calculate net total and VAT
  const netTotal = total / (1 + vatRate / 100);
  const vatAmount = total - netTotal;

  const handleStartCheckout = () => {
    router.push(`/checkout/address`);
  };

  return (
    <div className={style.summaryContainerContainer}>
      <div className={style.summaryContainer}>
        <Title>{t('cart.summary')}</Title>

        <div className={style.summaryRow}>
          <span>{t('cart.subtotal')}</span>
          <span>{subtotal.toFixed(2)} CHF*</span>
        </div>

        <div className={style.summaryRow}>
          <span>{t('cart.shipping')}</span>
          <span>{shipping.toFixed(2)} CHF*</span>
        </div>

        <hr className={style.divider} />

        <div className={style.summaryRow}>
          <span>{t('cart.total')}</span>
          <span>{total.toFixed(2)} CHF*</span>
        </div>

        <div className={style.totalRow}>
          <span>{t('cart.totalRounded')}</span>
          <span className={style.totalAmount}>{total.toFixed(2)} CHF*</span>
        </div>

        <div className={style.vatBreakdown}>
          <div className={style.summaryRow}>
            <span>{t('cart.netTotal')}</span>
            <span>{netTotal.toFixed(2)} CHF</span>
          </div>

          <div className={style.summaryRow}>
            <span>{t('cart.vatIncluded', { vatRate })}</span>
            <span>{vatAmount.toFixed(2)} CHF</span>
          </div>
        </div>

        <p className={style.disclaimer}>{t('cart.priceDisclaimer')}</p>
      </div>
      {checkoutButton && (
        <Button onClick={handleStartCheckout} className={style.checkoutButton}>
          {t('cart.checkout')}
        </Button>
      )}
    </div>
  );
};

export default CartSummary;
