'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/system/Container';
import AdminBookingList from '@/components/section/admin/booking/AdminBookingList';
import {
  getAdminBookings,
  updateBookingStatus,
  createBlocker,
} from '@/requests/booking.request';
import {
  IBooking,
  BookingStatus,
  CreateBlockerRequest,
} from '@/types/booking.types';
import { useFeedback } from '@/hooks/FeedbackHook';
import { Logger } from '@/utils/Logger.class';

const AdminBookingsContainer = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showFeedback } = useFeedback();
  const { t } = useTranslation();

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // Optional: Hier könnten wir Datumsfilter aus einem State übergeben
      const response = await getAdminBookings();
      console.log(response);
      if (response.success && response.data) {
        setBookings(
          Array.isArray(response.data) ? response.data : [response.data],
        );
      }
    } catch (error) {
      Logger.error('Failed to fetch bookings', error);
      showFeedback(t('feedback.load-error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      const response = await updateBookingStatus(id, newStatus);
      if (response.success) {
        showFeedback(t('feedback.save-success'), 'success');
        fetchBookings(); // Reload list
      }
    } catch (error) {
      showFeedback(t('feedback.save-error'), 'error');
    }
  };

  const handleCreateBlocker = async (data: CreateBlockerRequest) => {
    try {
      const response = await createBlocker(data);
      if (response.success) {
        showFeedback(t('feedback.create-success'), 'success');
        fetchBookings();
      }
    } catch (error) {
      showFeedback(t('feedback.create-error'), 'error');
    }
  };

  return (
    <Container padding={false} maxWidth="100%">
      <AdminBookingList
        bookings={bookings}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onCreateBlocker={handleCreateBlocker}
      />
    </Container>
  );
};

export default AdminBookingsContainer;
