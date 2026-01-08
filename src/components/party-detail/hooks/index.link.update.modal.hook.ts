'use client';

import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useModal } from '@/commons/providers/modal';
import PartySubmit from '@/components/party-submit/PartySubmit';

interface UseLinkUpdateModalOptions {
  onRefetch?: () => Promise<void>;
}

export const useLinkUpdateModal = (options?: UseLinkUpdateModalOptions) => {
  const { openModal } = useModal();
  const params = useParams();
  const partyId = params?.id as string | undefined;

  const openUpdateModal = useCallback(() => {
    if (!partyId) {
      return;
    }

    const id = parseInt(partyId, 10);
    if (isNaN(id)) {
      return;
    }

    // 커스텀 컴포넌트로 PartySubmit 모달 열기
    openModal({
      component: PartySubmit,
      componentProps: {
        isEdit: true,
        partyId: id,
        onRefetch: options?.onRefetch,
      },
    });
  }, [openModal, partyId, options?.onRefetch]);

  return {
    openUpdateModal,
  };
};
