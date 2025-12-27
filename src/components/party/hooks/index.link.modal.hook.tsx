import { useCallback } from 'react';
import { useModal } from '@/commons/providers/modal';
import PartySubmit from '@/components/party-submit/partySubmit';

export const useLinkModal = () => {
  const { openModal, closeModal } = useModal();

  const openPartySubmitModal = useCallback(() => {
    openModal({
      component: PartySubmit,
      componentProps: {},
    });
  }, [openModal]);

  const closePartySubmitModal = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return {
    openPartySubmitModal,
    closePartySubmitModal,
  };
};
