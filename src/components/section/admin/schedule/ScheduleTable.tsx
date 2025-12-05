import React from 'react';
import style from '@/styles/admin/AdminProductList.module.scss';
import { ISchedule } from '@/types/schedule.types';
import MaterialIcon from '@/components/system/MaterialIcon';
import Button from '@/components/system/Button';

interface ScheduleTableProps {
  schedules: ISchedule[];
  handleSort: (key: keyof ISchedule) => void;
  getSortIcon: (key: keyof ISchedule) => string;
  onEdit: (schedule: ISchedule) => void;
  onDelete: (schedule: ISchedule) => void;
  onActivate: (schedule: ISchedule) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  handleSort,
  getSortIcon,
  onEdit,
  onDelete,
  onActivate,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  return (
    <table className={style.productTable}>
      <thead>
        <tr>
          <th onClick={() => handleSort('name')}>
            <div className={style.thContent}>
              Name <MaterialIcon icon={getSortIcon('name')} />
            </div>
          </th>
          <th onClick={() => handleSort('validFrom')}>
            <div className={style.thContent}>
              Gültig ab <MaterialIcon icon={getSortIcon('validFrom')} />
            </div>
          </th>
          <th>Gültig bis</th>
          <th>Taktung</th>
          <th>Status</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((schedule) => (
          <tr
            key={schedule._id}
            style={schedule.isActive ? { backgroundColor: '#f0fdf4' } : {}}
          >
            <td className={style.nameColumn}>
              <div style={{ fontWeight: 'bold' }}>{schedule.name}</div>
            </td>
            <td>{formatDate(schedule.validFrom)}</td>
            <td>{formatDate(schedule.validUntil)}</td>
            <td>{schedule.slotDurationMinutes} min</td>
            <td>
              {schedule.isActive ? (
                <span className={`${style.stockStatus} ${style.available}`}>
                  AKTIV
                </span>
              ) : (
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => onActivate(schedule)}
                  title="Diesen Plan aktivieren"
                >
                  Aktivieren
                </Button>
              )}
            </td>
            <td>
              <div className={style.actions}>
                <Button
                  appearance="icon"
                  variant="ghost"
                  icon="edit"
                  onClick={() => onEdit(schedule)}
                />
                {!schedule.isActive && (
                  <Button
                    appearance="icon"
                    variant="ghost"
                    icon="delete"
                    onClick={() => onDelete(schedule)}
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
