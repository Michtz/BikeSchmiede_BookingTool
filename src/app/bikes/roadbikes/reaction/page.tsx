import { Metadata } from 'next';
import ProductContainer from '@/components/containers/ProductContainer';

export const metadata: Metadata = {
  title: 'Roadbike Reaction',
  description: 'OdinBike Roadbike Reaction - Pure Kraftübertragung und Sprintfähigkeit.',
};

export default function ReactionPage() {
  return <ProductContainer view={'reaction'} />;
}
