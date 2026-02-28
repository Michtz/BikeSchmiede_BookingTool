'use client';

import React, { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import style from './BookingModal.module.scss';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  calLink: string;
  notes?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  calLink,
  notes,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      (async function () {
        const cal = await getCalApi();
        cal('ui', { theme: 'dark' });
      })();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay} onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={style.closeButton} onClick={onClose}>
          &times;
        </button>
        <Cal
          calLink={calLink}
          style={{ width: '100%', height: '100%', overflow: 'scroll' }}
          config={{ theme: 'dark', notes: notes as string }}
        />
      </div>
    </div>
  );
};

export default BookingModal;
