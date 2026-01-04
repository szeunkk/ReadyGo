import { useEffect, useState } from 'react';
import type { ProfileCoreDTO } from '@/commons/types/profile/profileCore.dto';

/**
 * useProfile Hook
 *
 * 책임:
 * - /api/profile/me fetch 호출
 * - loading / data / error 상태 관리
 * - 컴포넌트 마운트 시 1회만 fetch
 *
 * 비책임:
 * - API 응답 데이터 가공/변환 X
 * - 에러 메시지 가공 X
 * - userId 직접 접근 X (API가 인증에서 추출)
 * - ViewModel 변환 X (다음 PR에서 처리)
 */
interface UseProfileReturn {
  data: ProfileCoreDTO | null;
  loading: boolean;
  error: Error | null;
}

export const useProfile = (): UseProfileReturn => {
  const [data, setData] = useState<ProfileCoreDTO | null>(null);
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

        // API 응답을 그대로 state에 저장 (가공/변환 X)
        setData(profileData);
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
