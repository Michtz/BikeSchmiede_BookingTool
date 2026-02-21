import { Metadata } from 'next';
import ConfiguratorContainer from '@/components/containers/ConfiguratorContainer';

export const metadata: Metadata = {
  title: 'Bike Konfigurator',
  description: 'Stelle dir dein individuelles OdinBike zusammen. Wähle Rahmen, Schaltung, Laufräder und mehr.',
};

export default function ConfiguratorPage() {
  return <ConfiguratorContainer />;
}
