import { useEffect, useState } from 'react';
import type { ProfileCoreDTO } from '@/commons/types/profile/profileCore.dto';
import type { ProfileViewModel } from '@/viewmodels/profile/ProfileViewModel';
import { toProfileViewModel } from '@/viewmodels/profile/toProfileViewModel';

/**
 * useProfile Hook
 *
 * 책임:
 * - /api/profile/me fetch 호출
 * - loading / data / error 상태 관리
 * - 컴포넌트 마운트 시 1회만 fetch
 * - Core DTO를 ProfileViewModel로 변환하여 UI에 전달
 *
 * 비책임:
 * - API 응답 데이터 가공/변환 (toProfileViewModel에 위임)
 * - 에러 메시지 가공 X
 * - userId 직접 접근 X (API가 인증에서 추출)
 */
interface UseProfileReturn {
  data: ProfileViewModel | null;
  loading: boolean;
  error: Error | null;
}

export const useProfile = (): UseProfileReturn => {
  const [data, setData] = useState<ProfileViewModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/profile/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const profileData: ProfileCoreDTO = await response.json();

        // Core DTO를 ProfileViewModel로 변환 (단일 진입점)
        const viewModel = toProfileViewModel(profileData);
        setData(viewModel);
        setError(null);
      } catch (err) {
        // 에러 객체를 그대로 저장 (해석/가공 X)
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    // 컴포넌트 마운트 시 1회만 호출
    fetchProfile();
  }, []);

  return {
    data,
    loading,
    error,
  };
};
