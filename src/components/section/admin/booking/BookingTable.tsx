import React from 'react';
import { useTranslation } from 'react-i18next';
import style from '@/styles/admin/AdminProductList.module.scss'; // Recycle Style
import { IBooking, BookingStatus } from '@/types/booking.types';
import MaterialIcon from '@/components/system/MaterialIcon';
import Button from '@/components/system/Button';

interface BookingTableProps {
  bookings: IBooking[];
  handleSort: (key: keyof IBooking) => void;
  getSortIcon: (key: keyof IBooking) => string;
  onStatusChange: (id: string, status: BookingStatus) => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  handleSort,
  getSortIcon,
  onStatusChange,
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    let colorClass = '';
    switch (status) {
      case 'confirmed':
        colorClass = 'available';
        break; // Grün (aus deinem CSS)
      case 'completed':
        colorClass = 'low';
        break; // Gelb/Orange
      case 'cancelled':
        colorClass = 'out';
        break; // Rot
      default:
        colorClass = '';
    }

    // Wir nutzen hier Klassen, die wir aus AdminProductList kennen (stock status styles)
    // Idealerweise erstellst du eigene Klassen für Booking Status
    return (
      <span className={`${style.stockStatus} ${style[colorClass]}`}>
        {t(`booking.status.${status}`)}
      </span>
    );
  };

  return (
    <table className={style.productTable}>
      <thead>
        <tr>
          <th onClick={() => handleSort('bookingNumber')}>
            <div className={style.thContent}>
              Nr. <MaterialIcon icon={getSortIcon('bookingNumber')} />
            </div>
          </th>
          <th onClick={() => handleSort('start')}>
            <div className={style.thContent}>
              {t('booking.date')} <MaterialIcon icon={getSortIcon('start')} />
            </div>
          </th>
          <th>{t('booking.customer')}</th>
          <th>{t('booking.service')}</th>
          <th onClick={() => handleSort('totalPrice')}>
            <div className={style.thContent}>
              {t('booking.price')}{' '}
              <MaterialIcon icon={getSortIcon('totalPrice')} />
            </div>
          </th>
          <th onClick={() => handleSort('status')}>
            <div className={style.thContent}>
              Status <MaterialIcon icon={getSortIcon('status')} />
            </div>
          </th>
          <th>{t('common.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <tr key={booking._id}>
            <td className={style.nameColumn}>{booking.bookingNumber}</td>
            <td>
              <div>{formatDate(booking.start)}</div>
              <div style={{ fontSize: '0.8em', color: '#666' }}>
                bis{' '}
                {new Date(booking.end).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </td>
            <td>
              {typeof booking.userId === 'object'
                ? `${booking.userId?.firstName} ${booking.userId?.lastName}`
                : booking.userEmail || 'Gast'}
            </td>
            <td>
              {booking.type === 'blocker' ? (
                <em>Blocker ({booking.adminNotes})</em>
              ) : (
                booking.services.map((s) => s.name).join(', ')
              )}
            </td>
            <td>CHF {booking.totalPrice?.toFixed(2)}</td>
            <td>{getStatusBadge(booking.status)}</td>
            <td>
              <div className={style.actions}>
                {booking.status != 'confirmed' && (
                  <Button
                    appearance="icon"
                    variant="ghost"
                    icon="check_circle"
                    title="Abschließen"
                    onClick={() => onStatusChange(booking._id, 'completed')}
                  />
                )}
                {booking.status !== 'cancelled' && (
                  <Button
                    appearance="icon"
                    variant="ghost"
                    icon="cancel"
                    title="Stornieren"
                    onClick={() => onStatusChange(booking._id, 'cancelled')}
                  />
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
