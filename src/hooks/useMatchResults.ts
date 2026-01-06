'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type { MatchResultWithTarget } from '@/services/match/calculateMatchResults.service';

/**
 * 매칭 결과 Hook 옵션
 *
 * 📌 필드:
 * - minScore: 최소 점수 필터 (이 점수 이상인 결과만 반환)
 * - onlineOnly: 온라인 사용자만 필터링
 * - sortBy: 정렬 기준 ('score' | 'online')
 */
export interface UseMatchResultsOptions {
  minScore?: number;
  onlineOnly?: boolean;
  sortBy?: 'score' | 'online';
}

/**
 * 매칭 결과 Hook 반환 타입
 *
 * 📌 필드:
 * - results: 처리된 매칭 결과 배열
 * - loading: 로딩 상태
 * - error: 에러 객체 (없으면 null)
 * - isEmpty: 결과가 비어있는지 여부
 * - refetch: 매칭 결과를 다시 가져오는 함수
 */
interface UseMatchResultsReturn {
  results: MatchResultWithTarget[];
  loading: boolean;
  error: Error | null;
  isEmpty: boolean;
  refetch: () => void;
}

/**
 * 매칭 결과를 조회하고 관리하는 Hook
 *
 * 📌 책임:
 * - calculateMatchResults Service 호출 오케스트레이션
 * - loading / error / data 상태 관리
 * - 정렬 / 필터 등 UI 친화적 가공
 * - refetch 제공
 *
 * 📌 비책임:
 * - MatchContext 생성 ❌
 * - 점수 계산 ❌
 * - Domain 함수 호출 ❌
 * - Supabase 쿼리 직접 작성 ❌
 * - Service 로직 복사 ❌
 *
 * 📌 동작:
 * - viewerId 없을 때: Service 호출하지 않음
 * - viewerId 변경 시: 재호출
 * - options 변경 시: 재정렬만 수행 (재요청 ❌)
 *
 * @param viewerId - viewer 사용자 ID (없으면 호출하지 않음)
 * @param options - 매칭 결과 필터링/정렬 옵션
 * @returns 매칭 결과 및 상태
 *
 * @example
 * ```typescript
 * // 기본 사용
 * const { results, loading, error, isEmpty, refetch } = useMatchResults(viewerId);
 *
 * // 옵션 사용
 * const { results } = useMatchResults(viewerId, {
 *   minScore: 70,
 *   onlineOnly: true,
 *   sortBy: 'score'
 * });
 * ```
 */
export const useMatchResults = (
  viewerId: string,
  options?: UseMatchResultsOptions
): UseMatchResultsReturn => {
  // 내부 상태 (Service 호출 결과)
  const [rawResults, setRawResults] = useState<MatchResultWithTarget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Service 호출 Effect
  useEffect(() => {
    // viewerId가 없으면 Service 호출하지 않음
    if (!viewerId) {
      setRawResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        // API를 통해 매칭 결과 조회 (서버 사이드에서 인증된 요청)
        const response = await fetch('/api/match/results', {
          method: 'GET',
          credentials: 'include', // 쿠키 포함
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch match results: ${response.statusText}`);
        }

        const data = await response.json();
        const results: MatchResultWithTarget[] = data.results || [];

        if (isCancelled) {
          return;
        }

        setRawResults(results);
        setLoading(false);
      } catch (err) {
        if (isCancelled) {
          return;
        }

        console.error('[useMatchResults] Error fetching match results:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    fetchResults();

    // Cleanup: 컴포넌트 unmount 시 setState 경고 방지
    return () => {
      isCancelled = true;
    };
  }, [viewerId, refetchTrigger]);

  // refetch 함수
  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  // 데이터 가공 (정렬 / 필터) - options 변경 시에만 재실행
  const processedResults = useMemo(() => {
    let filtered = [...rawResults];

    // 1. 점수 필터
    if (options?.minScore !== undefined) {
      filtered = filtered.filter(
        (result) => result.finalScore >= options.minScore!
      );
    }

    // 2. 온라인 필터
    if (options?.onlineOnly) {
      filtered = filtered.filter((result) => result.isOnlineMatched);
    }

    // 3. 정렬
    if (options?.sortBy === 'score') {
      // 점수 높은 순
      filtered.sort((a, b) => b.finalScore - a.finalScore);
    } else if (options?.sortBy === 'online') {
      // 온라인 우선, 그 다음 점수 높은 순
      filtered.sort((a, b) => {
        if (a.isOnlineMatched === b.isOnlineMatched) {
          return b.finalScore - a.finalScore;
        }
        return a.isOnlineMatched ? -1 : 1;
      });
    }

    return filtered;
  }, [rawResults, options?.minScore, options?.onlineOnly, options?.sortBy]);

  // isEmpty 파생 상태
  const isEmpty = !loading && processedResults.length === 0;

  return {
    results: processedResults,
    loading,
    error,
    isEmpty,
    refetch,
  };
};

