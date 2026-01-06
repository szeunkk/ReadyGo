'use client';

import { useCallback } from 'react';
import { useModal } from '@/commons/providers/modal';

interface UseJoinPartyOptions {
  onRefetch?: () => Promise<void>;
}

interface UseJoinPartyReturn {
  joinParty: (partyId: number | string) => Promise<void>;
}

export const useJoinParty = (
  options?: UseJoinPartyOptions
): UseJoinPartyReturn => {
  const { openModal } = useModal();
  const onRefetch = options?.onRefetch;

  const joinParty = useCallback(
    async (partyId: number | string) => {
      if (!partyId) {
        return;
      }

      const id = parseInt(String(partyId), 10);
      if (isNaN(id)) {
        return;
      }

      try {
        const response = await fetch(`/api/party/${id}/members`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            errorData.error || '파티 참여 중 오류가 발생했습니다.';

          // 에러 모달 표시
          openModal({
            variant: 'dual',
            title: '참여 실패',
            description: errorMessage,
            confirmText: '확인',
          });

          return;
        }

        // API 호출 성공 시 (201 상태 코드)
        if (onRefetch) {
          await onRefetch();
        }
      } catch (error) {
        // 네트워크 오류 등 예외 처리
        const errorMessage =
          error instanceof Error
            ? error.message
            : '파티 참여 중 오류가 발생했습니다.';

        openModal({
          variant: 'dual',
          title: '참여 실패',
          description: errorMessage,
          confirmText: '확인',
        });
      }
    },
    [openModal, onRefetch]
  );

  return {
    joinParty,
  };
};
