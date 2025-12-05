'use client';

import React, { useState, useEffect } from 'react';
import style from '@/styles/booking/BookingCalendar.module.scss'; // Wir erstellen gleich das CSS
import Button from '@/components/system/Button';
import MaterialIcon from '@/components/system/MaterialIcon';

interface DateSelectorProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const [days, setDays] = useState<Date[]>([]);
  const [startOffset, setStartOffset] = useState(0);

  useEffect(() => {
    // Generiere die nächsten 14 Tage basierend auf startOffset
    const nextDays = [];
    const today = new Date();
    // Reset time to midnight for comparison
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 5; i++) {
      // Zeige 5 Tage auf einmal an (Mobile friendly)
      const d = new Date(today);
      d.setDate(today.getDate() + startOffset + i);
      nextDays.push(d);
    }
    setDays(nextDays);
  }, [startOffset]);

  const handlePrev = () => {
    if (startOffset > 0) setStartOffset((prev) => prev - 5);
  };

  const handleNext = () => {
    setStartOffset((prev) => prev + 5);
  };

  const isSameDay = (d1: Date, d2: Date | null) => {
    if (!d2) return false;
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <div className={style.dateSelectorContainer}>
      <div className={style.navigation}>
        <Button
          appearance="icon"
          variant="ghost"
          icon="chevron_left"
          onClick={handlePrev}
          disabled={startOffset === 0}
        />
        <span className={style.monthLabel}>
          {days[0]?.toLocaleDateString('de-DE', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <Button
          appearance="icon"
          variant="ghost"
          icon="chevron_right"
          onClick={handleNext}
        />
      </div>

      <div className={style.daysGrid}>
        {days.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6; // So=0, Sa=6

          return (
            <button
              key={date.toISOString()}
              className={`${style.dayButton} ${isSelected ? style.selected : ''} ${isWeekend ? style.weekend : ''}`}
              onClick={() => onSelectDate(date)}
            >
              <span className={style.dayName}>
                {date.toLocaleDateString('de-DE', { weekday: 'short' })}
              </span>
              <span className={style.dayNumber}>{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
