'use client';

import React, { useState, useEffect } from 'react';
import style from '@/styles/booking/BookingCalendar.module.scss';
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
  // Wir tracken nicht mehr einen simplen Offset, sondern das Datum des ersten angezeigten Montags
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());

  // Hilfsfunktion: Finde den Montag eines beliebigen Datums
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay(); // 0=Sonntag, 1=Montag, ...
    // Wenn Sonntag (0), dann ziehe 6 Tage ab, sonst (Tag - 1)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  // Initialisierung beim ersten Laden
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Wir setzen den Startpunkt auf den Montag dieser Woche
    setCurrentWeekStart(getMonday(today));
  }, []);

  // Generierung der Tage, wenn sich der Wochen-Start ändert
  useEffect(() => {
    const nextDays = [];
    const baseDate = new Date(currentWeekStart);
    baseDate.setHours(0, 0, 0, 0);

    // Wir generieren 14 Tage (2 saubere Reihen à 7 Tage)
    // Du kannst hier auch 21 nehmen für 3 Reihen
    for (let i = 0; i < 35; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      nextDays.push(d);
    }
    setDays(nextDays);
  }, [currentWeekStart]);

  const handlePrev = () => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      // 1. Einen Monat zurückgehen
      newDate.setMonth(newDate.getMonth() - 1);

      // 2. WICHTIG: Wieder auf den Montag dieser Woche korrigieren
      // Damit das Grid nicht verrutscht
      const correctedDate = getMonday(newDate);

      // Optional: Verhindern, dass man vor "Heute" springt
      const today = new Date();
      const thisMonday = getMonday(today);
      if (correctedDate < thisMonday) return thisMonday;

      return correctedDate;
    });
  };

  const handleNext = () => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      // 1. Einen Monat weitergehen
      newDate.setMonth(newDate.getMonth() + 1);

      // 2. Auf den Montag der neuen Woche korrigieren
      return getMonday(newDate);
    });
  };

  const isSameDay = (d1: Date, d2: Date | null) => {
    if (!d2) return false;
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // Hilfsfunktion: Ist das Datum in der Vergangenheit?
  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Vergleiche Zeitstempel
    return date.getTime() < today.getTime();
  };

  return (
    <div className={style.dateSelectorContainer}>
      <div className={style.navigation}>
        <Button
          appearance="icon"
          variant="ghost"
          icon="chevron_left"
          onClick={handlePrev}
        />
        <span className={style.monthLabel}>
          {days[10]?.toLocaleDateString('de-DE', {
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
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isPast = isDateInPast(date);
          return (
            <button
              key={date.toISOString()}
              className={`
                ${style.dayButton} 
                ${isSelected ? style.selected : ''} 
                ${isWeekend ? style.weekend : ''} 
                ${isPast ? style.past : ''}
              `}
              onClick={() => !isPast && onSelectDate(date)}
              disabled={isPast} // Button deaktivieren
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
