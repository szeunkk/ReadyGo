import { useCallback } from 'react';
import { useModal } from '@/commons/providers/modal';

export const useLinkModalClose = () => {
  const { openModal, closeModal, closeAllModals } = useModal();

  const openCancelModal = useCallback(() => {
    openModal({
      variant: 'dual',
      title: '등록 취소',
      description: '작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?',
      showDescription: true,
      confirmText: '등록 취소',
      cancelText: '계속 작성',
      onConfirm: () => {
        // 등록취소모달과 파티만들기폼모달 모두 닫기
        closeAllModals();
      },
      onCancel: () => {
        // 등록취소모달만 닫기
        closeModal();
      },
    });
  }, [openModal, closeModal, closeAllModals]);

  return {
    openCancelModal,
  };
};
