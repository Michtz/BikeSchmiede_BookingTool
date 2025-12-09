'use client';

import React, { useState, useEffect } from 'react';
import style from '@/styles/booking/BookingCalendar.module.scss';
import Button from '@/components/system/Button';

interface DateSelectorProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const [days, setDays] = useState<Date[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());

  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCurrentWeekStart(getMonday(today));
  }, []);

  useEffect(() => {
    const nextDays = [];
    const baseDate = new Date(currentWeekStart);
    baseDate.setHours(0, 0, 0, 0);
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
      newDate.setMonth(newDate.getMonth() - 1);
      const correctedDate = getMonday(newDate);
      const today = new Date();
      const thisMonday = getMonday(today);
      if (correctedDate < thisMonday) return thisMonday;

      return correctedDate;
    });
  };

  const handleNext = () => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);

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

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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
          const isWeekend = date.getDay() === 1 || date.getDay() === 0;
          const isPast = isDateInPast(date);
          console.log(days);
          return (
            <button
              key={date.toISOString()}
              className={`
                ${style.dayButton} 
                ${isSelected ? style.selected : ''} 
                ${isPast ? style.past : ''}
                
                ${isWeekend ? style.weekend : ''} 
              `}
              onClick={() => !isPast && onSelectDate(date)}
              disabled={isPast || isWeekend}
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
