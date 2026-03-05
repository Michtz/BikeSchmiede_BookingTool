import { Metadata } from 'next';
import LegalContainer from '@/components/containers/legalContainer/LegalContainer';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'OdinBikes - Individuelle Rennräder und Gravelbikes aus der Schweiz.',
};

export default function LegalPage() {
  return <LegalContainer />;
}
