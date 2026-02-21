import { Metadata } from 'next';
import ProductContainer from '@/components/containers/ProductContainer';

export const metadata: Metadata = {
  title: 'Gravelbike Reaction',
  description: 'Das OdinBike Reaction Gravelbike - Agilität und Speed für deine Abenteuer.',
};

export default function ReactionPage() {
  return <ProductContainer view={'reaction'} />;
}
