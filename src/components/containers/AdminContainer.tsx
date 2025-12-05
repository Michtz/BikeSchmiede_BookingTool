'use client';

import React, { FC, useEffect, useState } from 'react';
import { Container } from '@/components/system/Container';
import { useAuth } from '@/hooks/AuthHook';
import Login from '@/components/section/user/Login';
import AdminProductsContainer from '@/components/section/admin/product/AdminProductsContainer';
import AdminBlogContainer from '@/components/section/admin/blog/AdminBlogContainer';
import AdminBookingsContainer from '@/components/section/admin/booking/AdminBookingsContainer'; // Neuer Import
import AdminOverview from '@/components/section/admin/AdminOverview';
import { getAdminUsers } from '@/requests/session.request';
import { Logger } from '@/utils/Logger.class';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import AdminServicesContainer from '@/components/section/admin/service/AdminServicesContainer';
import AdminScheduleContainer from '@/components/section/admin/schedule/AdminScheduleContainer';

interface AdminContainerProps {
  view:
    | 'overview'
    | 'login'
    | 'products'
    | 'blog'
    | 'bookings'
    | 'services'
    | 'schedules';
}

const AdminContainer: FC<AdminContainerProps> = ({ view }) => {
  const { userInformation } = useAuth();
  const router: AppRouterInstance = useRouter();
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAdminUsers();
        setIsValidToken(result.success);
      } catch (err: any) {
        setIsValidToken(false);
        Logger.warn('Admin access granted:', err);
        if (err.message === 'Authentication required') {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (!loading && !isValidToken) router.push('/');
  if (!userInformation) view = 'login';
  return (
    <Container padding={false} alignItems={'center'} flow={'column'}>
      <AdminContent view={view} />
    </Container>
  );
};

const AdminContent: React.FC<AdminContainerProps> = ({
  view,
}): React.ReactElement => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'login':
        return <Login goTo={null} />;
      case 'overview':
        return <AdminOverview />;
      case 'products':
        return <AdminProductsContainer />;
      case 'blog':
        return <AdminBlogContainer />;
      case 'bookings':
        return <AdminBookingsContainer />;
      case 'services':
        return <AdminServicesContainer />;
      case 'schedules':
        return <AdminScheduleContainer />;
      default:
        return <></>;
    }
  };
  return <Container justifyContent={'center'}>{getCurrentView()}</Container>;
};

export default AdminContainer;
