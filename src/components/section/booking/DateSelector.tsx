import React, { useState, useEffect } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCalendar,
} from 'react-icons/fi';
import styles from '@/styles/booking/BookingCalendar.module.scss';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  duration: number; // in minutes
}

interface DayAvailability {
  date: Date;
  hasSlots: boolean;
  slots?: TimeSlot[];
}

interface BookingCalendarProps {
  onSlotSelect?: (date: Date, slot: TimeSlot) => void;
  locale?: 'de' | 'en' | 'fr';
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onSlotSelect,
  locale = 'de',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);

  // Translations
  const translations = {
    de: {
      months: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ],
      weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      selectTime: 'Verfügbare Termine',
      noSlots: 'Keine Termine verfügbar',
      selectDate: 'Bitte wählen Sie ein Datum',
      duration: 'Dauer',
      minutes: 'Min.',
      book: 'Termin buchen',
      loading: 'Laden...',
    },
    en: {
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      selectTime: 'Available Appointments',
      noSlots: 'No appointments available',
      selectDate: 'Please select a date',
      duration: 'Duration',
      minutes: 'min',
      book: 'Book Appointment',
      loading: 'Loading...',
    },
    fr: {
      months: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
      ],
      weekdays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      selectTime: 'Rendez-vous disponibles',
      noSlots: 'Aucun rendez-vous disponible',
      selectDate: 'Veuillez sélectionner une date',
      duration: 'Durée',
      minutes: 'min',
      book: 'Réserver',
      loading: 'Chargement...',
    },
  };

  const t = translations[locale];

  // Mock data - replace with API call
  const fetchAvailableSlots = async (date: Date) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock slots - replace with real data
    const mockSlots: TimeSlot[] = [
      { id: '1', time: '09:00', available: true, duration: 30 },
      { id: '2', time: '09:30', available: true, duration: 30 },
      { id: '3', time: '10:00', available: false, duration: 30 },
      { id: '4', time: '10:30', available: true, duration: 30 },
      { id: '5', time: '11:00', available: true, duration: 30 },
      { id: '6', time: '14:00', available: true, duration: 60 },
      { id: '7', time: '15:00', available: false, duration: 60 },
      { id: '8', time: '16:00', available: true, duration: 60 },
    ];

    setAvailableSlots(mockSlots);
    setLoading(false);
  };

  // Check if a date has available slots (mock function)
  const hasAvailableSlots = (date: Date): boolean => {
    const day = date.getDay();
    // Example: No appointments on Sundays
    if (day === 0) return false;
    // Example: No appointments in the past
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return false;
    return true;
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() || 7; // Convert Sunday (0) to 7

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 1; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const handleDateClick = (date: Date) => {
    if (hasAvailableSlots(date)) {
      setSelectedDate(date);
      setSelectedSlot(null);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
      if (onSlotSelect && selectedDate) {
        onSlotSelect(selectedDate, slot);
      }
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}. ${t.months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className={styles.bookingCalendar}>
      <div className={styles.calendarSection}>
        <div className={styles.calendarHeader}>
          <button
            className={styles.navButton}
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <FiChevronLeft />
          </button>
          <h2 className={styles.currentMonth}>
            {t.months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            className={styles.navButton}
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <FiChevronRight />
          </button>
        </div>

        <div className={styles.weekdays}>
          {t.weekdays.map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {days.map((date, index) => {
            if (!date) {
              return (
                <div key={`empty-${index}`} className={styles.emptyDay}></div>
              );
            }

            const available = hasAvailableSlots(date);
            const today = isToday(date);
            const selected = isSelected(date);

            return (
              <button
                key={date.toISOString()}
                className={`
                  ${styles.day} 
                  ${available ? styles.available : styles.unavailable}
                  ${today ? styles.today : ''}
                  ${selected ? styles.selected : ''}
                `}
                onClick={() => handleDateClick(date)}
                disabled={!available}
                aria-label={`${formatDate(date)} ${available ? 'available' : 'unavailable'}`}
              >
                <span className={styles.dayNumber}>{date.getDate()}</span>
                {available && <span className={styles.dot}></span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.slotsSection}>
        {selectedDate ? (
          <>
            <div className={styles.slotsHeader}>
              <FiCalendar className={styles.icon} />
              <h3>{formatDate(selectedDate)}</h3>
            </div>

            <h4 className={styles.slotsTitle}>{t.selectTime}</h4>

            {loading ? (
              <div className={styles.loading}>{t.loading}</div>
            ) : availableSlots.length > 0 ? (
              <div className={styles.slotsGrid}>
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    className={`
                      ${styles.slot} 
                      ${!slot.available ? styles.unavailable : ''}
                      ${selectedSlot?.id === slot.id ? styles.selected : ''}
                    `}
                    onClick={() => handleSlotClick(slot)}
                    disabled={!slot.available}
                  >
                    <div className={styles.slotTime}>
                      <FiClock className={styles.slotIcon} />
                      <span>{slot.time}</span>
                    </div>
                    <div className={styles.slotDuration}>
                      {slot.duration} {t.minutes}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className={styles.noSlots}>{t.noSlots}</p>
            )}

            {selectedSlot && (
              <button className={styles.bookButton}>{t.book}</button>
            )}
          </>
        ) : (
          <div className={styles.placeholder}>
            <FiCalendar className={styles.placeholderIcon} />
            <p>{t.selectDate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;
