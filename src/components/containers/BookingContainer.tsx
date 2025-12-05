'use client';

import React, { FC, useState } from 'react';
import { Container } from '@/components/system/Container';
import ServiceList from '@/components/section/booking/ServiceList'; // Neuer Import
import { IService } from '@/types/service.types';

interface BookingContainerProps {
  view: 'services' | 'booking_main';
}

const BookingContainer: FC<BookingContainerProps> = ({ view: initialView }) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [selectedService, setSelectedService] = useState<IService | null>(null);

  const handleServiceSelect = (service: IService) => {
    setSelectedService(service);
    setCurrentView('booking_main');
  };

  const handleBackToServices = () => {
    setSelectedService(null);
    setCurrentView('services');
  };

  return (
    <Container padding={false} flow={'column'}>
      <BookingContent
        view={currentView}
        onSelectService={handleServiceSelect}
        selectedService={selectedService}
        onBack={handleBackToServices}
      />
    </Container>
  );
};

interface BookingContentProps {
  view: 'services' | 'booking_main';
  onSelectService: (service: IService) => void;
  selectedService: IService | null;
  onBack: () => void;
}

const BookingContent: React.FC<BookingContentProps> = ({
  view,
  onSelectService,
  selectedService,
  onBack,
}): React.ReactElement => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'services':
        return <ServiceList onSelectService={onSelectService} />;
      default:
        return <></>;
    }
  };

  return <Container justifyContent={'center'}>{getCurrentView()}</Container>;
};

export default BookingContainer;
