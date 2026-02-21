import { Metadata } from 'next';
import ProductContainer from '@/components/containers/ProductContainer';

export const metadata: Metadata = {
  title: 'Gravelbike Flow',
  description: 'OdinBike Gravelbike Flow - Performance auf jedem Untergrund. Dein perfekter Begleiter für Schotter und Asphalt.',
};

export default function FlowPage() {
  return <ProductContainer view={'flow'} />;
}
