import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button, { ButtonContainer } from '@/components/system/button/Button';
import MaterialIcon from '@/components/system/materialIcon/MaterialIcon';
import style from '@/styles/old/modals/ConfirmModal.module.scss';
import { useModalContent } from '@/hooks/ModalProvide';

interface ConfirmModalProps {
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'error' | 'warning';
  icon?: string;
  destructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  description,
  confirmText,
  cancelText,
  variant = 'primary',
  icon,
  destructive = false,
}) => {
  const { t } = useTranslation();
  const { onCallback } = useModalContent();
  const defaultConfirmText = confirmText || t('ui.buttons.confirm');
  const defaultCancelText = cancelText || t('ui.buttons.cancel');
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus confirm button when modal opens
    if (confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, []);

  const handleCancel = (): void => {
    if (onCallback) onCallback(false);
  };

  const handleConfirm = (): void => {
    if (onCallback) onCallback(true);
  };

  const getIconForVariant = () => {
    if (icon) return icon;

    switch (variant) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'help';
    }
  };

  const getIconColorForVariant = () => {
    switch (variant) {
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className={style.confirmModal}>
      <div className={style.modalContent}>
        <div className={style.iconContainer}>
          <div
            className={style.iconCircle}
            style={{ backgroundColor: getIconColorForVariant() }}
          >
            <MaterialIcon
              icon={getIconForVariant()}
              iconSize="big"
              color="white"
            />
          </div>
        </div>

        <div className={style.messageContainer}>
          {typeof description === 'string' ? (
            <p className={style.description}>{description}</p>
          ) : (
            <div className={style.description}>{description}</div>
          )}

          {destructive && (
            <div className={style.warningNote}>
              <MaterialIcon icon="info" iconSize="small" />
              <span>{t('modals.irreversible-action')}</span>
            </div>
          )}
        </div>
      </div>

      <ButtonContainer spread={false} className={style.actionButtons}>
        <Button variant="secondary" onClick={handleCancel}>
          {defaultCancelText}
        </Button>
        <Button
          ref={confirmButtonRef}
          variant={variant === 'error' ? 'error' : 'primary'}
          onClick={handleConfirm}
        >
          {defaultConfirmText}
        </Button>
      </ButtonContainer>
    </div>
  );
};

export default ConfirmModal;

// Helper function to create confirm modals easily
export const createConfirmModal = (
  title: string,
  description: React.ReactNode,
  options?: {
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'error' | 'warning';
    size?: 'small' | 'medium' | 'large';
    icon?: string;
    destructive?: boolean;
  },
) => ({
  element: (
    <ConfirmModal
      description={description}
      confirmText={options?.confirmText}
      cancelText={options?.cancelText}
      variant={options?.variant}
      icon={options?.icon}
      destructive={options?.destructive}
    />
  ),
  title,
  size: options?.size || 'small',
  closeOnOverlayClick: false, // Prevent accidental cancellation
  closeOnEscape: true,
});

// Specialized helper functions
export const createDeleteConfirmModal = (
  itemName: string,
  options?: {
    title?: string;
    confirmText?: string;
    size?: 'small' | 'medium' | 'large';
  },
) =>
  createConfirmModal(
    options?.title || 'Löschen bestätigen',
    <>
      Möchten Sie <strong>{itemName}</strong> wirklich löschen?
    </>,
    {
      variant: 'error',
      confirmText: options?.confirmText || 'Löschen',
      cancelText: 'Abbrechen',
      size: options?.size || 'small',
      icon: 'delete',
      destructive: true,
    },
  );

export const createBulkDeleteConfirmModal = (
  count: number,
  itemType: string = 'Elemente',
  options?: {
    title?: string;
    confirmText?: string;
  },
) =>
  createConfirmModal(
    options?.title || 'Mehrere Elemente löschen',
    <>
      Möchten Sie{' '}
      <strong>
        {count} {itemType}
      </strong>{' '}
      wirklich löschen?
    </>,
    {
      variant: 'error',
      confirmText: options?.confirmText || 'Alle löschen',
      cancelText: 'Abbrechen',
      size: 'small',
      icon: 'delete_sweep',
      destructive: true,
    },
  );

export const createUnsavedChangesModal = (options?: {
  title?: string;
  description?: string;
}) =>
  createConfirmModal(
    options?.title || 'Ungespeicherte Änderungen',
    options?.description ||
      'Sie haben ungespeicherte Änderungen. Möchten Sie wirklich fortfahren?',
    {
      variant: 'warning',
      confirmText: 'Fortfahren',
      cancelText: 'Bleiben',
      size: 'small',
      icon: 'warning',
      destructive: false,
    },
  );
