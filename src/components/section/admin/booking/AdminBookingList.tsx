import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import style from '@/styles/admin/AdminProductList.module.scss';
import {
  IBooking,
  BookingStatus,
  CreateBlockerRequest,
} from '@/types/booking.types';
import { BookingTable } from './BookingTable';
import MaterialIcon from '@/components/system/MaterialIcon';
import Button, { ButtonContainer } from '@/components/system/Button';
import Input from '@/components/system/Input';

interface AdminBookingListProps {
  bookings: IBooking[];
  isLoading: boolean;
  onStatusChange: (id: string, status: BookingStatus) => void;
  onCreateBlocker: (data: CreateBlockerRequest) => void;
}

const AdminBookingList: React.FC<AdminBookingListProps> = ({
  bookings,
  isLoading,
  onStatusChange,
}) => {
  const { t } = useTranslation();
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IBooking | null;
    direction: 'asc' | 'desc';
  }>({
    key: 'start',
    direction: 'asc',
  });

  const sortedBookings = useMemo(() => {
    let items = [...bookings];

    if (filterText) {
      const lower = filterText.toLowerCase();
      items = items.filter(
        (b) =>
          b.bookingNumber.toLowerCase().includes(lower) ||
          (typeof b.userId === 'object' &&
            b.userId?.email.toLowerCase().includes(lower)) ||
          b.userEmail?.toLowerCase().includes(lower),
      );
    }

    if (sortConfig.key !== null) {
      items.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        if (!aValue || !bValue) return 0;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [bookings, sortConfig, filterText]);

  const handleSort = (key: keyof IBooking) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof IBooking) => {
    if (sortConfig.key !== key) return 'unfold_more';
    return sortConfig.direction === 'asc'
      ? 'keyboard_arrow_up'
      : 'keyboard_arrow_down';
  };

  if (isLoading) {
    return (
      <div className={style.productList}>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className={style.productList}>
      <div className={style.listHeader}>
        <div className={style.headerActions}>
          <h2>{t('adminBookings.title', { count: bookings.length })}</h2>
          <div style={{ width: '300px' }}>
            <Input
              placeholder={t('adminBookings.searchPlaceholder')}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <ButtonContainer>
            <Button
              variant="primary"
              icon="block"
              onClick={() => {
                console.log('Open Blocker Modal');
              }}
            >
              {t('adminBookings.createBlocker')}
            </Button>
          </ButtonContainer>
        </div>
      </div>

      <div className={style.tableContainer}>
        {bookings.length > 0 ? (
          <BookingTable
            bookings={sortedBookings}
            handleSort={handleSort}
            getSortIcon={getSortIcon}
            onStatusChange={onStatusChange}
          />
        ) : (
          <div className={style.emptyState}>
            <MaterialIcon icon="event_busy" iconSize="huge" />
            <h3>{t('adminBookings.noBookings')}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingList;
