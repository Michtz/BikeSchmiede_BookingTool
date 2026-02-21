import { Metadata } from 'next';
import CategoriesContainer from '@/components/containers/CategoriesContainer';

export const metadata: Metadata = {
  title: 'Roadbikes',
  description: 'Unsere High-End Rennräder für maximale Performance auf der Straße.',
};

export default function RoadPage() {
  return <CategoriesContainer />;
}
