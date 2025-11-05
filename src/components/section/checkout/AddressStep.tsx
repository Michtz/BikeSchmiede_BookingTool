import React, { useEffect, useState } from 'react';
import { ButtonGroup } from '@/components/system/Button';
import { Container } from '@/components/system/Container';
import Login from '@/components/section/user/Login';
import UserInformationForm, {
  UserProfileFormData,
} from '@/components/section/user/UserInformationForm';
import { updateCartUser } from '@/requests/cart.request';
import { useAuth } from '@/hooks/AuthHook';
import { Logger } from '@/utils/Logger.class';
import { IAddress, UserInformation } from '@/types/auth';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const AddressStep: React.FC = () => {
  const { t } = useTranslation();
  const { sessionData, userInformation } = useAuth();
  const { showFeedback } = useFeedback();
  const router = useRouter();

  const [userData, setUserData] = useState<UserInformation>();
  const [activeTab, setActiveTab] = useState<'login' | 'gast'>('login');

  useEffect(() => {
    if (userInformation) setUserData(userInformation);
  }, [userInformation]);

  const handleWriteAdresseInCart = async (data?: UserProfileFormData) => {
    try {
      const userInfo: IAddress = {
        street: data?.street || userData?.addresses?.[0]?.street || '',
        houseNumber:
          data?.houseNumber || userData?.addresses?.[0]?.houseNumber || '',
        city: data?.city || userData?.addresses?.[0]?.city || '',
        zipCode: data?.zipCode || userData?.addresses?.[0]?.zipCode || '',
        country: 'ch',
        isDefault: true,
      };

      const guestInfo: UserInformation = {
        email: data?.email || userData?.email,
        firstName: data?.firstName || userData?.firstName,
        lastName: data?.lastName || userData?.lastName,
        phoneNumber: data?.phoneNumber || userData?.phoneNumber,
      };

      await updateCartUser(
        sessionData?.sessionId as string,
        userInfo,
        guestInfo,
      );

      localStorage.setItem('checkoutAddress', 'done');
      router.replace('/checkout/paymentInfo');
      showFeedback(t('checkout.cartUserUpdated'), 'success');
    } catch (e) {
      Logger.error(e);
    }
  };

  const options = [
    {
      label: t('checkout.alreadyCustomer'),
      onClick: () => setActiveTab('login'),
      active: activeTab === 'login',
    },
    {
      label: t('checkout.guestCheckout'),
      onClick: () => setActiveTab('gast'),
      active: activeTab === 'gast',
    },
  ];

  return (
    <Container justifyContent={'center'} padding={false} flow={'column'}>
      <ButtonGroup options={options} />
      {activeTab === 'login' ? (
        !!userData ? (
          <UserInformationForm
            key="logedIn"
            onCheckout={handleWriteAdresseInCart}
          />
        ) : (
          <Login goTo={null} />
        )
      ) : (
        <UserInformationForm
          key="guest"
          noDefaultValue
          onCheckout={handleWriteAdresseInCart}
        />
      )}
    </Container>
  );
};

export default AddressStep;
