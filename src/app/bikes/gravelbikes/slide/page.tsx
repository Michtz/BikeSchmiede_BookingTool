import { Metadata } from 'next';
import ProductContainer from '@/components/containers/ProductContainer';

export const metadata: Metadata = {
  title: 'Gravelbike Slide',
  description: 'Das OdinBike Slide Gravelbike - Komfort trifft auf Vielseitigkeit.',
};

export default function SlidePage() {
  return <ProductContainer view={'slide'} />;
}
