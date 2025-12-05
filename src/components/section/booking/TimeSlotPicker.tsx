'use client';

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getAvailability } from '@/requests/booking.request';
import style from '@/styles/booking/BookingCalendar.module.scss';
import LoadingSpinner from '@/components/system/LoadingSpinner';

interface TimeSlotPickerProps {
  selectedDate: Date;
  onSelectSlot: (date: Date) => void;
  selectedSlot: Date | null;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  onSelectSlot,
  selectedSlot,
}) => {
  // Wir laden immer Slots für den ganzen Tag (00:00 bis 23:59)
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  // SWR Key ändert sich mit dem Datum -> automatischer Refetch
  const {
    data: response,
    isLoading,
    error,
  } = useSWR(['/bookings/availability', startOfDay.toISOString()], () =>
    getAvailability(startOfDay.toISOString(), endOfDay.toISOString()),
  );

  if (isLoading)
    return (
      <div className={style.loader}>
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <p className={style.error}>Fehler beim Laden der Zeiten.</p>;

  const slots = response?.success ? response.data : [];

  if (slots.length === 0) {
    return (
      <div className={style.noSlots}>Keine freien Termine an diesem Tag.</div>
    );
  }

  return (
    <div className={style.slotGrid}>
      {slots.map((slotIsoString) => {
        const slotDate = new Date(slotIsoString);
        const timeLabel = slotDate.toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const isSelected =
          selectedSlot && selectedSlot.toISOString() === slotIsoString;

        return (
          <button
            key={slotIsoString}
            className={`${style.slotButton} ${isSelected ? style.selected : ''}`}
            onClick={() => onSelectSlot(slotDate)}
          >
            {timeLabel}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotPicker;
