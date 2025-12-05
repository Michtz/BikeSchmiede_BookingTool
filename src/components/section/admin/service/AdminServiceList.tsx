import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR, { mutate } from 'swr';
import { getAllServices, deleteService } from '@/requests/service.request';
import { IService } from '@/types/service.types';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useModal } from '@/hooks/ModalProvide';
import { createConfirmModal } from '@/components/modals/ConfirmModal';
import style from '@/styles/admin/AdminProductList.module.scss';
import MaterialIcon from '@/components/system/MaterialIcon';
import Button, { ButtonContainer } from '@/components/system/Button';
import { ServiceTable } from './ServiceTable';

interface AdminServiceListProps {
  onCreateService: () => void;
  onEditService: (service: IService) => void;
}

const AdminServiceList: React.FC<AdminServiceListProps> = ({
  onCreateService,
  onEditService,
}) => {
  const { t } = useTranslation();
  const { showFeedback } = useFeedback();
  const { awaitModalResult } = useModal();

  // Data Fetching
  const {
    data: response,
    error,
    isLoading,
  } = useSWR('/api/services', getAllServices);
  const services =
    response?.data && Array.isArray(response.data) ? response.data : [];

  const [sortConfig, setSortConfig] = useState<{
    key: keyof IService | null;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  const sortedServices = useMemo(() => {
    const items = [...services];
    if (sortConfig.key) {
      items.sort((a, b) => {
        // @ts-ignore
        const aVal = a[sortConfig.key!];
        // @ts-ignore
        const bVal = b[sortConfig.key!];
        if (!aVal || !bVal) return 0;
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [services, sortConfig]);

  const handleDelete = async (service: IService) => {
    const confirmed = await awaitModalResult(
      createConfirmModal(
        t('common.deleteConfirmTitle', 'Löschen bestätigen'), // Translation keys anpassen
        <>
          {t(
            'common.deleteConfirmMessage',
            `Möchten Sie "${service.name}" wirklich löschen?`,
          )}
        </>,
        { confirmText: t('common.delete', 'Löschen') },
      ),
    );

    if (confirmed) {
      try {
        await deleteService(service._id);
        showFeedback(
          t('feedback.delete-success', 'Service gelöscht'),
          'success',
        );
        mutate('/api/services');
      } catch (e) {
        showFeedback(t('feedback.error', 'Fehler beim Löschen'), 'error');
      }
    }
  };

  const handleSort = (key: keyof IService) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc')
      direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof IService) => {
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
          <h2>Dienstleistungen ({services.length})</h2>
          <ButtonContainer>
            <Button variant="primary" icon="add" onClick={onCreateService}>
              Neuer Service
            </Button>
          </ButtonContainer>
        </div>
      </div>

      <div className={style.tableContainer}>
        {services.length > 0 ? (
          <ServiceTable
            services={sortedServices}
            handleSort={handleSort}
            getSortIcon={getSortIcon}
            onEdit={onEditService}
            onDelete={handleDelete}
          />
        ) : (
          <div className={style.emptyState}>
            <MaterialIcon icon="handyman" iconSize="huge" />
            <h3>Keine Services gefunden</h3>
            <Button variant="primary" onClick={onCreateService}>
              Ersten Service erstellen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServiceList;
