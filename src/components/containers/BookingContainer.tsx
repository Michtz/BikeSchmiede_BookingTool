'use client';

import React, { FC } from 'react';
import { Container } from '@/components/system/Container';
import MainBooking from '@/components/section/booking/MainBooking';
import DateSelector from '@/components/section/booking/DateSelector';
import BookingCalendar from '@/components/section/booking/DateSelector';
import BookingPage from '@/components/section/booking/BookingPage';

interface BookingContainerProps {
  view: 'booking_main' | 'date_selector';
}

const BookingContainer: FC<BookingContainerProps> = ({ view }) => {
  return (
    <Container padding={false} flow={'column'}>
      <BookingContent view={view} />
    </Container>
  );
};

const BookingContent: React.FC<BookingContainerProps> = ({
  view,
}): React.ReactElement => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'booking_main':
        return <BookingPage />;
      case 'date_selector':
        return <BookingPage />;
      default:
        return <></>;
    }
  };
  return <Container justifyContent={'center'}>{getCurrentView()}</Container>;
};

export default BookingContainer;
