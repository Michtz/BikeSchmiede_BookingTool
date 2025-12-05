'use client';

import React, { FC, useState } from 'react';
import { Container } from '@/components/system/Container';
import ServiceList from '@/components/section/booking/ServiceList'; // Neuer Import
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
  // State für den aktuellen View (Service-Auswahl vs. Kalender)
  const [currentView, setCurrentView] = useState<BookingView>(view);

  // State für den gewählten Service (wird an BookingPage übergeben)
  const [selectedService, setSelectedService] = useState<IService | null>(null);

  // Handler: Wenn ein Service in der Liste geklickt wird
  const handleServiceSelect = (service: IService) => {
    setSelectedService(service);
    setCurrentView('booking'); // Weiter zum Kalender
    // Optional: Scroll nach oben für bessere UX auf Mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Zurück zur Übersicht
  const handleBackToServices = () => {
    setSelectedService(null);
    setCurrentView('services');
  };

  const getCurrentView = (): React.ReactElement => {
    switch (currentView) {
      case 'services':
        return <ServiceList onSelectService={handleServiceSelect} />;

      case 'booking':
        // Hier prüfen wir zur Sicherheit, ob ein Service da ist.
        // Falls nicht (z.B. direkter Aufruf), gehen wir zurück oder zeigen Fehler.
        if (!selectedService) {
          // Fallback: Wenn kein Service gewählt ist, zeigen wir die Liste
          return <ServiceList onSelectService={handleServiceSelect} />;
        }

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
