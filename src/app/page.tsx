import { Metadata } from 'next';
import HomeContainer from '@/components/containers/HomeContainer';

export const metadata: Metadata = {
  title: 'Home',
  description: 'OdinBikes - Individuelle Rennräder und Gravelbikes aus der Schweiz.',
};

export default function Home() {
  return <HomeContainer />;
}
