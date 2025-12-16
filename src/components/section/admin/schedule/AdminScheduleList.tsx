import React, { useState, useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { useTranslation } from 'react-i18next';
import {
  getAllSchedules,
  deleteSchedule,
  activateSchedule,
} from '@/requests/schedule.request';
import { ISchedule } from '@/types/schedule.types';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useModal } from '@/hooks/ModalProvide';
import { createConfirmModal } from '@/components/modals/ConfirmModal';
import style from '@/styles/admin/AdminProductList.module.scss';
import MaterialIcon from '@/components/system/MaterialIcon';
import Button, { ButtonContainer } from '@/components/system/Button';
import { ScheduleTable } from './ScheduleTable';

interface AdminScheduleListProps {
  onCreateSchedule: () => void;
  onEditSchedule: (schedule: ISchedule) => void;
}

const AdminScheduleList: React.FC<AdminScheduleListProps> = ({
  onCreateSchedule,
  onEditSchedule,
}) => {
  const { t } = useTranslation();
  const { showFeedback } = useFeedback();
  const { awaitModalResult } = useModal();

  const { data: response, isLoading } = useSWR(
    '/api/schedules',
    getAllSchedules,
  );

  const schedules = useMemo(() => {
    return response?.data && Array.isArray(response.data) ? response.data : [];
  }, [response]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof ISchedule | null;
    direction: 'asc' | 'desc';
  }>({ key: 'validFrom', direction: 'desc' });

  const sortedSchedules = useMemo(() => {
    const items = [...schedules];
    if (sortConfig.key) {
      items.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];
        if (!aVal || !bVal) return 0;
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [schedules, sortConfig]);

  const handleDelete = async (schedule: ISchedule) => {
    if (schedule.isActive) {
      showFeedback('Der aktive Plan kann nicht gelöscht werden.', 'error');
      return;
    }
    const confirmed = await awaitModalResult(
      createConfirmModal(
        t('common.deleteConfirmTitle', 'Löschen bestätigen'),
        <>
          {t('common.deleteConfirmMessage', `Plan "${schedule.name}" löschen?`)}
        </>,
        { confirmText: t('common.delete', 'Löschen') },
      ),
    );

    if (confirmed) {
      try {
        await deleteSchedule(schedule._id);
        showFeedback('Plan gelöscht', 'success');
        mutate('/api/schedules');
      } catch {
        showFeedback('Fehler beim Löschen', 'error');
      }
    }
  };

  const handleActivate = async (schedule: ISchedule) => {
    try {
      await activateSchedule(schedule._id);
      showFeedback(`Plan "${schedule.name}" ist jetzt aktiv`, 'success');
      mutate('/api/schedules');
    } catch {
      showFeedback('Fehler beim Aktivieren', 'error');
    }
  };

  const handleSort = (key: keyof ISchedule) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc')
      direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof ISchedule) => {
    if (sortConfig.key !== key) return 'unfold_more';
    return sortConfig.direction === 'asc'
      ? 'keyboard_arrow_up'
      : 'keyboard_arrow_down';
  };

  if (isLoading)
    return (
      <div className={style.productList}>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className={style.productList}>
      <div className={style.listHeader}>
        <div className={style.headerActions}>
          <h2>Zeitpläne ({schedules.length})</h2>
          <ButtonContainer>
            <Button variant="primary" icon="add" onClick={onCreateSchedule}>
              Neuer Plan
            </Button>
          </ButtonContainer>
        </div>
      </div>

      <div className={style.tableContainer}>
        {schedules.length > 0 ? (
          <ScheduleTable
            schedules={sortedSchedules}
            handleSort={handleSort}
            getSortIcon={getSortIcon}
            onEdit={onEditSchedule}
            onDelete={handleDelete}
            onActivate={handleActivate}
          />
        ) : (
          <div className={style.emptyState}>
            <MaterialIcon icon="calendar_month" iconSize="huge" />
            <h3>Keine Zeitpläne vorhanden</h3>
            <Button variant="primary" onClick={onCreateSchedule}>
              Ersten Plan erstellen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScheduleList;
