'use client';

import React, { FC, useState } from 'react';
import { Container } from '@/components/system/Container';
import ServiceList from '@/components/section/booking/ServiceList';
import { IService } from '@/types/service.types';
import BookingPage from '@/components/section/booking/BookingPage';

type BookingView = 'services' | 'booking';
interface BookingContainerProps {
  view: BookingView;
}

const BookingContainer: FC<BookingContainerProps> = ({ view: initialView }) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [selectedService, setSelectedService] = useState<IService | null>(null);

  const handleServiceSelect = (service: IService) => {
    setSelectedService(service);
    setCurrentView('booking');
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
  view: BookingView;
  onSelectService: (service: IService) => void;
  selectedService: IService | null;
  onBack: () => void;
}
const BookingContent: React.FC<BookingContentProps> = ({
  view,
}): React.ReactElement => {
  const [currentView, setCurrentView] = useState<BookingView>(view);

  const [selectedService, setSelectedService] = useState<IService | null>(null);

  const handleServiceSelect = (service: IService) => {
    setSelectedService(service);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToServices = () => {
    setSelectedService(null);
    setCurrentView('services');
  };

  const getCurrentView = (): React.ReactElement => {
    switch (currentView) {
      case 'services':
        return <ServiceList onSelectService={handleServiceSelect} />;

      case 'booking':
        if (!selectedService)
          return <ServiceList onSelectService={handleServiceSelect} />;
        return (
          <BookingPage
            selectedService={selectedService}
            onBack={handleBackToServices}
          />
        );
      default:
        return <ServiceList onSelectService={handleServiceSelect} />;
    }
  };

  return (
    <Container justifyContent={'center'} padding={false}>
      {getCurrentView()}
    </Container>
  );
};
export default BookingContainer;
