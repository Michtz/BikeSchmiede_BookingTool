'use client';

import React from 'react';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { getAllServices } from '@/requests/service.request';
import ProductCard, { CartsContainer } from '@/components/system/ProductCard';
import { IService } from '@/types/service.types';
import { Container } from '@/components/system/Container';
import bikefitting_triatlon from '@/assets/bikeFiting_triatlon.jpg';
import bikefitting_adv from '@/assets/bikefiting_adv.avif';
import bikefitting_pro from '@/assets/bikefiting_pro.avif';

interface ServiceListProps {
  onSelectService: (service: IService) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ onSelectService }) => {
  const { t } = useTranslation();
  const {
    data: response,
    isLoading,
    error,
  } = useSWR('/api/services', getAllServices);
  const services =
    response?.data && Array.isArray(response.data) ? response.data : [];

  if (isLoading) {
    return (
      <Container>
        <p>{t('common.loading', 'Lade Services...')}</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <p>{t('common.error', 'Fehler beim Laden der Services.')}</p>
      </Container>
    );
  }
  console.log(services);

  if (services.length === 0) {
    return (
      <Container>
        <p>{t('booking.noServices', 'Aktuell keine Services verfügbar.')}</p>
      </Container>
    );
  }

  const getImageUrl = (url?: string) => {
    if (!url) return;
    switch (url) {
      case 'bikefitting_triatlon':
        return bikefitting_triatlon;
      case 'bikefitting_adv':
        return bikefitting_adv;
      case 'bikefitting_pro':
        return bikefitting_pro;
      default:
        return bikefitting_triatlon;
    }
  };

  return (
    <Container backgroundColor flow="column" alignItems="center">
      <h1 style={{ marginBottom: '2rem' }}>
        {t('booking.selectService', 'Wähle einen Service')}
      </h1>

      <CartsContainer>
        {services.map((service) => {
          return (
            <ProductCard
              key={service._id}
              id={service._id}
              title={service.name}
              description={service.description}
              image={getImageUrl(service?.imageUrl)}
              price={service.price}
              onCardClick={() => onSelectService(service)}
            />
          );
        })}
      </CartsContainer>
    </Container>
  );
};

export default ServiceList;
