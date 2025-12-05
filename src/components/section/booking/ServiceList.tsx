'use client';

import React from 'react';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { getAllServices } from '@/requests/service.request';
import ProductCard, { CartsContainer } from '@/components/system/ProductCard';
import { IService } from '@/types/service.types';
import style from '@/styles/ProductCard.module.scss'; // Reuse styles
import { Container } from '@/components/system/Container';

interface ServiceListProps {
  onSelectService: (service: IService) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ onSelectService }) => {
  const { t } = useTranslation();

  // Fetch services
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

  if (services.length === 0) {
    return (
      <Container>
        <p>{t('booking.noServices', 'Aktuell keine Services verfügbar.')}</p>
      </Container>
    );
  }

  return (
    <Container flow="column" alignItems="center">
      <h1 style={{ marginBottom: '2rem' }}>
        {t('booking.selectService', 'Wähle einen Service')}
      </h1>

      <CartsContainer>
        {services.map((service) => (
          <ProductCard
            key={service._id}
            id={service._id}
            title={service.name}
            description={service.description}
            // Fallback Bild oder das echte Bild aus der DB
            image={service.imageUrl || '/assets/tools_icon.svg'}
            price={service.price}
            onCardClick={() => onSelectService(service)}
            // Optional: Icon Click (z.B. direkt buchen)
            onIconClick={async () => onSelectService(service)}
          />
        ))}
      </CartsContainer>
    </Container>
  );
};

export default ServiceList;
