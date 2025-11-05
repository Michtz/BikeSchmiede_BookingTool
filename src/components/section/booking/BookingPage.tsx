// pages/booking/index.tsx
import BookingCalendar from '@/components/section/booking/DateSelector';
import { useTranslation } from 'react-i18next';

export default function BookingPage() {
  const { i18n } = useTranslation();

  const handleSlotSelection = async (date: Date, slot: any) => {
    // API Call zum Buchen
    const booking = {
      date: date.toISOString(),
      time: slot.time,
      duration: slot.duration,
      service: 'barista-consultation', // oder andere Services
    };

    // Socket.io für Real-time Updates
    // socket.emit('booking:create', booking);
  };

  return (
    <div className="container">
      <h1>Barista Beratungstermine</h1>
      <BookingCalendar
        locale={i18n.language as 'de' | 'en' | 'fr'}
        onSlotSelect={handleSlotSelection}
      />
    </div>
  );
}
