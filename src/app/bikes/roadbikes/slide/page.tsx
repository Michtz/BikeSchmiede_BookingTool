import { Metadata } from 'next';
import ProductContainer from '@/components/containers/ProductContainer';

export const metadata: Metadata = {
  title: 'Roadbike Slide',
  description: 'OdinBike Roadbike Slide - Langstreckenkomfort ohne Kompromisse.',
};

export default function SlidePage() {
  return <ProductContainer view={'slide'} />;
}
