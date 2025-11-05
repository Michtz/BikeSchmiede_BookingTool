'use client';

import React, { useEffect, useState } from 'react';
import AddressStep from '@/components/section/checkout/AddressStep';
import PaymentStep from '../section/checkout/PaymentStep';
import ConfirmationStep from '@/components/section/checkout/ConfirmationStep';
import { Container } from '@/components/system/Container';
import ReviewStep from '@/components/section/checkout/ReviewStep';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/system/Button.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import MaterialIcon from '@/components/system/MaterialIcon';

interface View {
  view: 'address' | 'paymentInfo' | 'confirmation' | 'review';
}
type CheckoutSteps =
  | 'address'
  | 'review'
  | 'paymentInformation'
  | 'paymentInfo';

const CheckoutContainer: React.FC<View> = ({ view }) => {
  const { t } = useTranslation();
  const router: AppRouterInstance = useRouter();
  const pathname: string = usePathname();
  const step = pathname.split('/').pop();
  const [progressAddress, setProgressAddress] = useState<string | null>(null);
  const [progressPayment, setProgressPayment] = useState<string | null>(null);

  useEffect(() => {
    // Nur im Browser ausführen
    const storedAddress = localStorage.getItem('checkoutAddress');
    const storedPayment = localStorage.getItem('checkoutPayment');

    if (storedAddress === null) {
      localStorage.setItem('checkoutAddress', 'pending');
      setProgressAddress('pending');
    } else {
      setProgressAddress(storedAddress);
    }

    if (storedPayment === null) {
      localStorage.setItem('checkoutPayment', 'pending');
      setProgressPayment('pending');
    } else {
      setProgressPayment(storedPayment);
    }
  }, []);

  const isValidCheckoutStep = (
    step: string | undefined,
  ): step is CheckoutSteps => {
    return step === 'address' || step === 'paymentInfo' || step === 'review';
  };

  const [activeTab, setActiveTab] = useState<CheckoutSteps | null>(
    isValidCheckoutStep(step) ? step : null,
  );

  const handleGoToAddress = () => {
    router.push('/checkout/address');
    setActiveTab('address');
  };
  // const handleGoToPayment = () => {
  //   router.push('/checkout/paymentInfo');
  //   setActiveTab('paymentInformation');
  // };
  // const handleGoToReview = () => {
  //   router.push('/checkout/review');
  //   setActiveTab('review');
  // };

  const options = [
    {
      label: t(t('userProfile.orderInformation')),
      onClick: handleGoToAddress,
      active: progressAddress !== 'pending' || progressAddress !== 'pending',
    },
    {
      label: t('checkout.paymentInformation'),
      onClick: () => null, // because of errors will get fixed
      active: progressPayment !== 'pending',
    },
    // {
    //   label: t('checkout.reviewOrder'),
    //   onClick: handleGoToReview,
    //   active: progressPayment !== 'pending',
    // },
  ];

  const ProgressButtons = () => (
    <ul className={styles.progressContainer}>
      {options.map((obj, index: number) => {
        return (
          <li
            key={obj.label}
            onClick={() => obj.onClick()}
            className={styles.listItem}
            data-done={index === 1} // remove when fixed
          >
            {obj.label}
            <span className={styles.icon} data-done={obj.active}>
              <MaterialIcon icon={'check'} />
            </span>
          </li>
        );
      })}
    </ul>
  );
  return (
    <Container
      padding={false}
      justifyContent={'center'}
      flow="column"
      alignItems="center"
    >
      <div style={{ marginTop: '4rem' }}></div>
      {activeTab && <ProgressButtons />}
      <CheckoutContent view={view} />
    </Container>
  );
};

const CheckoutContent: React.FC<View> = ({ view }) => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'address':
        return <AddressStep />;
      case 'paymentInfo':
        return <PaymentStep />;
      case 'review':
        return <ReviewStep />;
      case 'confirmation':
        return <ConfirmationStep />;
      default:
        return <></>;
    }
  };

  return (
    <Container justifyContent={'center'} padding={false}>
      {getCurrentView()}
    </Container>
  );
};

export default CheckoutContainer;
