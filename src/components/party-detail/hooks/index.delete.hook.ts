'use client';

import { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/commons/providers/modal';
import { URL_PATHS } from '@/commons/constants/url';

interface UseDeletePartyOptions {
  onRefetch?: () => Promise<void>;
}

export const useDeleteParty = (options?: UseDeletePartyOptions) => {
  const { openModal } = useModal();
  const router = useRouter();
  const params = useParams();
  const partyId = params?.id as string | undefined;

  const deleteParty = useCallback(async () => {
    if (!partyId) {
      return;
    }

    const id = parseInt(partyId, 10);
    if (isNaN(id)) {
      return;
    }

    try {
      const response = await fetch(`/api/party/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || '파티 삭제 중 오류가 발생했습니다.';

        // 에러 모달 표시
        openModal({
          variant: 'dual',
          title: '삭제 실패',
          description: errorMessage,
          confirmText: '확인',
        });

        return;
      }

      // 삭제 성공 시 refetch 호출 (옵셔널)
      if (options?.onRefetch) {
        await options.onRefetch();
      }

      // /party 경로로 이동
      router.push(URL_PATHS.PARTY);
    } catch (error) {
      // 네트워크 오류 등 예외 처리
      const errorMessage =
        error instanceof Error
          ? error.message
          : '파티 삭제 중 오류가 발생했습니다.';

      openModal({
        variant: 'dual',
        title: '삭제 실패',
        description: errorMessage,
        confirmText: '확인',
      });
    }
  }, [partyId, router, openModal, options]);

  const openDeleteModal = useCallback(() => {
    if (!partyId) {
      return;
    }

    // 삭제 확인 모달 열기
    openModal({
      variant: 'dual',
      title: '정말 삭제하시겠습니까?',
      showDescription: false,
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: deleteParty,
      onCancel: () => {
        // 취소 시 아무 동작도 하지 않음 (모달만 닫힘)
      },
    });
  }, [partyId, openModal, deleteParty]);

  return {
    openDeleteModal,
  };
};
