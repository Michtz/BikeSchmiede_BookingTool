import { Metadata } from 'next';
import ProductContainer from '@/components/containers/ProductContainer';

export const metadata: Metadata = {
  title: 'Roadbike Flow',
  description: 'OdinBike Roadbike Flow - Aerodynamik trifft auf Eleganz. Dein perfekter Begleiter für lange Ausfahrten.',
};

export default function FlowPage() {
  return <ProductContainer view={'flow'} />;
}
