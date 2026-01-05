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

  const joinParty = useCallback(
    async (partyId: number | string) => {
      // 파티 ID 검증
      if (!partyId) {
        return;
      }

      // 파티 ID를 숫자로 변환
      const id = parseInt(String(partyId), 10);
      if (isNaN(id)) {
        return;
      }

      try {
        // API 호출
        const response = await fetch(`/api/party/${id}/members`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 응답 상태 코드 확인
        if (!response.ok) {
          // 에러 응답 파싱
          let errorMessage = '참여 중 오류가 발생했습니다.';

          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // JSON 파싱 실패 시 기본 메시지 사용
            if (response.status === 400) {
              errorMessage = '잘못된 요청입니다.';
            } else if (response.status === 401) {
              errorMessage = '인증이 필요합니다.';
            } else if (response.status === 404) {
              errorMessage = '파티를 찾을 수 없습니다.';
            } else if (response.status === 500) {
              errorMessage = '서버 오류가 발생했습니다.';
            }
          }

          // 에러 모달 표시
          openModal({
            variant: 'dual',
            title: '참여 실패',
            description: errorMessage,
            confirmText: '확인',
          });

          return;
        }

        // 성공 응답 확인 (201)
        if (response.status === 201) {
          // onRefetch 콜백 호출 (옵셔널)
          if (options?.onRefetch) {
            await options.onRefetch();
          }
        }
      } catch (error) {
        // 네트워크 오류 등 예외 처리
        const errorMessage =
          error instanceof Error
            ? error.message
            : '참여 중 오류가 발생했습니다.';

        openModal({
          variant: 'dual',
          title: '참여 실패',
          description: errorMessage,
          confirmText: '확인',
        });
      }
    },
    [openModal, options]
  );

  return {
    joinParty,
  };
};

