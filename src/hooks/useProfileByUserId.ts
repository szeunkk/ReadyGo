'use client';

import { useEffect, useState } from 'react';
import type { ProfileCoreDTO } from '@/commons/types/profile/profileCore.dto';
import type { ProfileViewModel } from '@/viewmodels/profile/ProfileViewModel';
import { toProfileViewModel } from '@/viewmodels/profile/toProfileViewModel';

/**
 * 특정 사용자의 프로필을 가져오는 Hook
 *
 * 책임:
 * - GET /api/profile/:userId 호출
 * - HTTP 상태 코드 기반 상태 매핑 (loading/forbidden/notFound/error/success)
 * - 성공 시 ProfileCoreDTO → ProfileViewModel 변환 (toProfileViewModel 단일 함수 사용)
 * - fetch 중복 방지 및 cleanup 처리
 *
 * 비책임:
 * - auth 로직 (userId 생성, 토큰 처리 등) 금지
 * - API 응답 메시지 가공 금지
 * - domain 변환 함수 직접 호출 금지 (toProfileViewModel만 사용)
 *
 * @param userId - 조회할 사용자 ID (undefined 시 요청하지 않음)
 * @returns {object} - 프로필 조회 상태 및 데이터
 */

interface UseProfileByUserIdState {
  loading: boolean;
  viewModel?: ProfileViewModel;
  error?: {
    status: 401 | 403 | 404 | 500 | number;
  };
  empty: boolean;
}

export const useProfileByUserId = (
  userId: string | undefined
): UseProfileByUserIdState => {
  const [state, setState] = useState<UseProfileByUserIdState>({
    loading: false,
    viewModel: undefined,
    error: undefined,
    empty: true,
  });

  useEffect(() => {
    // userId가 없으면 요청하지 않음
    if (!userId || userId.trim() === '') {
      setState({
        loading: false,
        viewModel: undefined,
        error: undefined,
        empty: true,
      });
      return;
    }

    let isCancelled = false;

    const fetchProfile = async () => {
      setState({
        loading: true,
        viewModel: undefined,
        error: undefined,
        empty: false,
      });

      try {
        const response = await fetch(`/api/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (isCancelled) {
          return;
        }

        // 200: 성공
        if (response.ok) {
          const dto: ProfileCoreDTO = await response.json();
          const viewModel = toProfileViewModel(dto);

          setState({
            loading: false,
            viewModel,
            error: undefined,
            empty: false,
          });
          return;
        }

        // 403: Forbidden
        if (response.status === 403) {
          setState({
            loading: false,
            viewModel: undefined,
            error: { status: 403 },
            empty: false,
          });
          return;
        }

        // 404: Not Found
        if (response.status === 404) {
          setState({
            loading: false,
            viewModel: undefined,
            error: { status: 404 },
            empty: false,
          });
          return;
        }

        // 401: Unauthorized
        if (response.status === 401) {
          setState({
            loading: false,
            viewModel: undefined,
            error: { status: 401 },
            empty: false,
          });
          return;
        }

        // 기타 에러 (500 등)
        setState({
          loading: false,
          viewModel: undefined,
          error: { status: response.status },
          empty: false,
        });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error('[useProfileByUserId] Fetch error:', error);

        setState({
          loading: false,
          viewModel: undefined,
          error: { status: 500 },
          empty: false,
        });
      }
    };

    fetchProfile();

    // Cleanup: 컴포넌트 unmount 시 setState 경고 방지
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return state;
};
