import { Container, Title } from '@/components/system/Container';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface DateSelectorProps {}

const MainBooking: FC<DateSelectorProps> = () => {
  const { t } = useTranslation();

  return (
    <Container flow={'column'}>
      <Title>{t('cart.main_Booking')}</Title>
    </Container>
  );
};

export default MainBooking;
