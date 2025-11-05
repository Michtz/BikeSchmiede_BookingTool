import { useRouter } from 'next/navigation';
import { Container, Title } from '@/components/system/Container';
import Button, { ButtonContainer } from '@/components/system/Button';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSideCart } from '@/hooks/SideCartHook';

interface EmptyCartProps {
  transparent?: boolean;
}
const EmptyCart: FC<EmptyCartProps> = ({ transparent = false }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { closeSideCart } = useSideCart();
  const handleClick = () => {
    if (transparent) {
      closeSideCart();
    } else {
      router.replace('/');
    }
  };
  return (
    <Container transparent={transparent} flow={'column'}>
      <Title>{t('cart.emptyTitle')}</Title>
      <ButtonContainer>
        <Button onClick={() => handleClick()}>
          {t('cart.continueShopping')}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default EmptyCart;
