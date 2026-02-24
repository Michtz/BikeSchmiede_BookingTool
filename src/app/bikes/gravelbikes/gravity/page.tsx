import { Metadata } from 'next';
import ProductContainer from '@/components/containers/ProductContainer';

export const metadata: Metadata = {
  title: 'Gravelbike Gravity',
  description: 'Das OdinBike Gravity Gravelbike - maximale Stabilität auf jedem Untergrund.',
};

export default function GravityPage() {
  return <ProductContainer view={'gravity'} />;
}
