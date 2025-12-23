'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import Modal, { ModalProps } from '../../components/modal';
import styles from './styles.module.css';

interface ModalItem {
  id: string;
  props: ModalProps;
  isClosing: boolean;
}

interface ModalContextType {
  openModal: (props: ModalProps) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  isOpen: boolean;
  modalCount: number;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

// 고유 ID 생성 함수
let modalIdCounter = 0;
const generateModalId = () => {
  modalIdCounter += 1;
  return `modal-${modalIdCounter}-${Date.now()}`;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalStack, setModalStack] = useState<ModalItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 모달 열기 - 스택에 추가
  const openModal = useCallback((props: ModalProps): string => {
    const id = generateModalId();
    setModalStack((prev) => [
      ...prev,
      {
        id,
        props,
        isClosing: false,
      },
    ]);
    return id;
  }, []);

  // 모달 닫기 - 특정 ID 또는 가장 최근 모달
  const closeModal = useCallback((id?: string) => {
    setModalStack((prev) => {
      const targetId = id || prev[prev.length - 1]?.id;
      if (!targetId) {
        return prev;
      }

      // 해당 모달을 isClosing 상태로 변경
      const updated = prev.map((modal) =>
        modal.id === targetId ? { ...modal, isClosing: true } : modal
      );

      // 300ms 후 실제로 제거
      setTimeout(() => {
        setModalStack((current) =>
          current.filter((modal) => modal.id !== targetId)
        );
      }, 300);

      return updated;
    });
  }, []);

  // 모든 모달 닫기
  const closeAllModals = useCallback(() => {
    setModalStack((prev) => {
      const allClosing = prev.map((modal) => ({ ...modal, isClosing: true }));
      setTimeout(() => {
        setModalStack([]);
      }, 300);
      return allClosing;
    });
  }, []);

  // body 스크롤 제어
  useEffect(() => {
    if (modalStack.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [modalStack.length]);

  // ESC 키로 가장 최근 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalStack.length > 0) {
        const lastModal = modalStack[modalStack.length - 1];
        if (!lastModal.isClosing) {
          closeModal(lastModal.id);
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [modalStack, closeModal]);

  // 개별 모달 렌더링 함수
  const renderModal = (modal: ModalItem, index: number) => {
    const handleConfirm = () => {
      if (modal.props.onConfirm) {
        modal.props.onConfirm();
      }
      closeModal(modal.id);
    };

    const handleCancel = () => {
      if (modal.props.onCancel) {
        modal.props.onCancel();
      }
      closeModal(modal.id);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        closeModal(modal.id);
      }
    };

    // z-index 계산: 베이스 9999 + (인덱스 * 10)
    const zIndex = 9999 + index * 10;
    const isOpen = !modal.isClosing;

    return (
      <div
        key={modal.id}
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        style={{ zIndex }}
      >
        <div
          className={`${styles.modalWrapper} ${isOpen ? styles.modalOpen : ''}`}
        >
          <Modal
            {...modal.props}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  };

  const modalContent = modalStack.length > 0 && (
    <>{modalStack.map((modal, index) => renderModal(modal, index))}</>
  );

  const isOpen = modalStack.length > 0;
  const modalCount = modalStack.length;

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, closeAllModals, isOpen, modalCount }}
    >
      {children}
      {mounted &&
        typeof window !== 'undefined' &&
        createPortal(modalContent, document.body)}
    </ModalContext.Provider>
  );
};
