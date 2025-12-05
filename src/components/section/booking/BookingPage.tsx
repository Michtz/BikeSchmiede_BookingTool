'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import style from '@/styles/booking/BookingCalendar.module.scss';
import { IService } from '@/types/service.types';
import DateSelector from './DateSelector';
import TimeSlotPicker from './TimeSlotPicker';
import Button, { ButtonContainer } from '@/components/system/Button';
import MaterialIcon from '@/components/system/MaterialIcon';
import { createBooking } from '@/requests/booking.request';
import { useFeedback } from '@/hooks/FeedbackHook';
import { Container } from '@/components/system/Container';
import Input from '@/components/system/Input';

interface BookingPageProps {
  selectedService: IService | null;
  onBack: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({
  selectedService,
  onBack,
}) => {
  const { t } = useTranslation();
  const { showFeedback } = useFeedback();
  const router = useRouter();

  // State
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [customerNotes, setCustomerNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Wenn kein Service gewählt ist (sollte durch Container verhindert werden), zurück
  if (!selectedService) {
    return (
      <Container>
        <p>
          Kein Service gewählt.{' '}
          <span
            onClick={onBack}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Zurück
          </span>
        </p>
      </Container>
    );
  }

  const handleBookNow = async () => {
    if (!selectedSlot || !selectedService) return;

    setIsBooking(true);
    try {
      // Backend erwartet start, end, services[] und notes
      // Wir berechnen das Ende basierend auf der Service-Dauer
      const durationMs = selectedService.durationTotalMinutes * 60000;
      const endDate = new Date(selectedSlot.getTime() + durationMs);

      const bookingData = {
        start: selectedSlot.toISOString(),
        end: endDate.toISOString(),
        services: [
          {
            name: selectedService.name,
            price: selectedService.price,
            durationMinutes: selectedService.durationTotalMinutes,
          },
        ],
        customerNotes: customerNotes,
        // userId wird im Backend aus dem Token geholt (falls eingeloggt)
        // Falls Gast-Buchung erlaubt sein soll, müsstest du hier Name/Email Felder ergänzen
      };

      const result = await createBooking(bookingData);

      if (result.success) {
        showFeedback(
          t('booking.success', 'Termin erfolgreich gebucht!'),
          'success',
        );
        // Weiterleitung zum Profil oder eine Success-Page
        // router.push('/profile');
        // Oder Reset:
        onBack();
      }
    } catch (error) {
      showFeedback(t('booking.error', 'Fehler bei der Buchung.'), 'error');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Container backgroundColor padding={false}>
      <div className={style.bookingPage}>
        <div className={style.header}>
          <Button
            appearance="icon"
            variant="ghost"
            icon="arrow_back"
            onClick={onBack}
          />
          <div>
            <h2>{selectedService.name}</h2>
            <p className={style.subtitle}>
              {selectedService.durationTotalMinutes} Min • CHF{' '}
              {selectedService.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Schritt 1: Datum wählen */}
        <div>
          <h3>1. Datum wählen</h3>
          <DateSelector
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedSlot(null); // Slot resetten wenn Datum wechselt
            }}
          />
        </div>

        {/* Schritt 2: Zeit wählen (Nur wenn Datum da) */}
        {selectedDate && (
          <div>
            <h3>2. Uhrzeit wählen</h3>
            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />
          </div>
        )}

        {/* Schritt 3: Abschluss / Zusammenfassung */}
        {selectedSlot && (
          <div className={style.summary}>
            <h3>3. Abschluss</h3>
            <p>
              <strong>Termin:</strong>{' '}
              {selectedSlot.toLocaleDateString('de-DE')} um{' '}
              {selectedSlot.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>

            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <Input
                label={t('booking.notes', 'Anmerkungen (optional)')}
                placeholder="Z.B. Fahrrad-Modell, spezielle Wünsche..."
                fullWidth
                multiline
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
              />
            </div>

            <ButtonContainer>
              <Button
                variant="primary"
                onClick={handleBookNow}
                loading={isBooking}
                disabled={isBooking}
              >
                <MaterialIcon icon="check_circle" /> Kostenpflichtig buchen
              </Button>
            </ButtonContainer>
          </div>
        )}
      </div>
    </Container>
  );
};

export default BookingPage;
