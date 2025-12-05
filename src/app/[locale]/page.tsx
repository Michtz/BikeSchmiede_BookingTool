'use client';
import { FC } from 'react';
import MainContainer from '@/components/containers/MainContainer';
import BookingContainer from '@/components/containers/BookingContainer';

const Home: FC = () => <BookingContainer view={'booking'} />;
export default Home;
