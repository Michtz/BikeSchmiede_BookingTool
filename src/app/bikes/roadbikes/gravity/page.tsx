import { Metadata } from 'next';
import ProductContainer from '@/components/containers/ProductContainer';

export const metadata: Metadata = {
  title: 'Roadbike Gravity',
  description: 'OdinBike Roadbike Gravity - Maximale Kontrolle bei jeder Abfahrt.',
};

export default function GravityPage() {
  return <ProductContainer view={'gravity'} />;
}
