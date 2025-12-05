import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthHook';
import { Container } from '@/components/system/Container';
import styles from '@/styles/admin/AdminMain.module.scss';

const AdminOverview: React.FC = () => {
  const router = useRouter();
  const { userInformation } = useAuth();

  if (userInformation?.role !== 'admin') {
    if (!userInformation) return <div>You are not logged in </div>;
    router.push('/login');
    return <div>You are no admin or not logged in</div>;
  }

  const adminSections = [
    {
      title: 'Product Management',
      description: 'Manage your product catalog, inventory, and pricing',
      href: '/admin/products',
      icon: '📦',
    },
    {
      title: 'Blog Management',
      description: 'Create and manage blog posts, articles, and content',
      href: '/admin/blog',
      icon: '📝',
    },
    {
      title: 'BikeSchmiede Booking Management',
      description: 'Create and manage Services',
      href: '/admin/bookings',
      icon: '🚲',
    },
    {
      title: 'BikeSchmiede Service Management',
      description: 'Create and manage Services',
      href: '/admin/services',
      icon: '🚲',
    },
    {
      title: 'BikeSchmiede Schedules Management',
      description: 'Create and manage Services',
      href: '/admin/schedules',
      icon: '🚲',
    },
  ];

  return (
    <Container flow="column" alignItems="center">
      <div className={styles.adminMain}>
        <div className={styles.header}>
          <h1>{'Admin Panel'}</h1>
          <p className={styles.subtitle}>
            {'Manage your store content and settings'}
          </p>
        </div>

        <div className={styles.sectionsGrid}>
          {adminSections.map((section) => (
            <div
              key={section.href}
              className={styles.sectionCard}
              onClick={() => router.push(section.href)}
            >
              <div className={styles.sectionIcon}>{section.icon}</div>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <p className={styles.sectionDescription}>{section.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default AdminOverview;
