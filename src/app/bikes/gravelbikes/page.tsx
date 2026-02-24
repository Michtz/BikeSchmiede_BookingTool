import { Metadata } from 'next';
import CategoriesContainer from '@/components/containers/CategoriesContainer';

export const metadata: Metadata = {
  title: 'Gravelbikes',
  description: 'Entdecke unsere High-End Gravelbikes für jedes Terrain. Performance trifft auf Abenteuer.',
};

export default function GravelPage() {
  return <CategoriesContainer />;
}
