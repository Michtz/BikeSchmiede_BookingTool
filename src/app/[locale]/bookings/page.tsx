'use client';
import { FC } from 'react';
import MainContainer from '@/components/containers/MainContainer';
import BookingContainer from '@/components/containers/BookingContainer';

const BookingsPage: FC = () => <BookingContainer view={'booking_main'} />;
export default BookingsPage;
