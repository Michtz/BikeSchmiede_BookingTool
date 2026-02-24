'use client';
import React, {
  Context,
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import { v4 } from 'uuid';
import Modal from '@/components/modals/DeleteModal';

/*
 * this hook is used to handle modal locig
 */

export interface ModalConfig {
  element: React.ReactElement;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  onClose?: () => void;
  onCallback?: (...args: any[]) => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

interface IdentifiableModal extends ModalConfig {
  uuid: string;
}

interface ModalHook {
  openModal: (modal: ModalConfig) => string;
  closeModal: (uuid?: string) => void;
  awaitModalResult: <T = any>(
    modal: Omit<ModalConfig, 'onCallback'>,
  ) => Promise<T>;
  currentModal: IdentifiableModal | null;
}

const defaultValue: ModalHook = {
  openModal: () => '',
  closeModal: () => {},
  awaitModalResult: () => Promise.resolve(undefined as any),
  currentModal: null,
};

const ModalContext: Context<ModalHook> = createContext<ModalHook>(defaultValue);

interface ModalContentHook {
  uuid: string;
  onClose: () => void;
  onCallback?: (...args: any[]) => void;
  hasCallback: boolean;
}

const ModalContentContext: Context<ModalContentHook | null> =
  createContext<ModalContentHook | null>(null);

export const ModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentModal, setCurrentModal] = useState<IdentifiableModal | null>(
    null,
  );

  const openModal = (modal: ModalConfig): string => {
    const uuid = v4();
    setCurrentModal({ ...modal, uuid });
    return uuid;
  };

  const closeModal = (uuid?: string): void => {
    if (!uuid || currentModal?.uuid === uuid) {
      if (currentModal?.onClose) currentModal.onClose();
      setCurrentModal(null);
    }
  };

  const awaitModalResult = <T = any,>(
    modal: Omit<ModalConfig, 'onCallback'>,
  ): Promise<T> => {
    return new Promise<T>((resolve) => {
      openModal({
        ...modal,
        onCallback: (result: T) => resolve(result),
      });
    });
  };

  const handleModalClose = (): void => {
    if (currentModal?.onClose) currentModal.onClose();
    setCurrentModal(null);
  };

  const handleCallback = (...args: any[]): void => {
    if (currentModal?.onCallback) {
      currentModal.onCallback(...args);
    }
    setCurrentModal(null);
  };

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, awaitModalResult, currentModal }}
    >
      {children}

      {currentModal && (
        <ModalContentContext.Provider
          value={{
            uuid: currentModal.uuid,
            onClose: handleModalClose,
            onCallback: currentModal.onCallback ? handleCallback : undefined,
            hasCallback: !!currentModal.onCallback,
          }}
        >
          <Modal
            isOpen={true}
            onClose={handleModalClose}
            title={currentModal.title}
            size={currentModal.size}
            closeOnOverlayClick={currentModal.closeOnOverlayClick}
            closeOnEscape={currentModal.closeOnEscape}
          >
            {currentModal.element}
          </Modal>
        </ModalContentContext.Provider>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalHook => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};

export const useModalContent = (): ModalContentHook => {
  const context = useContext(ModalContentContext);
  if (!context) throw new Error('useModalContent must be used within a Modal');
  return context;
};
