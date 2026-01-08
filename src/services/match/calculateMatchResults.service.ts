/**
 * ❗ Calculate Match Results Service (복수 후보 오케스트레이션)
 *
 * 📌 책임 (Responsibility):
 * - 여러 후보에 대한 매칭 결과 계산 오케스트레이션
 * - getMatchCandidates와 calculateMatchResult를 조합하여 목록 처리
 * - 순수하게 조립과 호출만 수행, 계산/판단/해석 로직 없음
 *
 * 📌 입력:
 * - client: Supabase 클라이언트
 * - viewerId: viewer 사용자 ID (UUID)
 *
 * 📌 출력:
 * - Promise<MatchResultWithTarget[]>: 항상 배열 반환 (throw ❌, null ❌)
 *
 * 📌 설계 원칙:
 * - Service Layer는 "오케스트레이션(Orchestration)" 책임만 가진다
 * - Domain 로직 직접 구현 금지
 * - 계산 정책 / 점수 공식 / factor 정의 금지
 * - Context 조립은 calculateMatchResult를 통해 위임
 * - 단일 public 함수만 export
 * - throw / null 반환 금지
 * - Cold Start 포함 모든 경우에서 결과 배열 반환
 * - 객체 mutation 금지 (immutability 유지)
 *
 * 📌 처리 흐름:
 * 1. getMatchCandidates를 통해 후보 목록 조회
 * 2. 후보가 0명이면 빈 배열 즉시 반환
 * 3. 각 후보에 대해 calculateMatchResult 호출 (병렬 처리)
 * 4. Promise.allSettled로 단일 실패가 전체 실패로 전파되는 것을 방지
 * 5. fulfilled 결과만 추출하여 배열로 반환
 *
 * 📌 금지 사항:
 * - MatchContext 직접 조립 금지
 * - Domain factor / sub-function 직접 호출 금지
 * - 점수 기준 필터링 금지 (예: score > 75)
 * - 정렬 로직 금지
 * - Object.assign, push, mutation 사용 금지
 * - Hook 또는 UI 로직 호출 금지
 * - throw 사용 금지
 * - null / undefined 반환 금지
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { getMatchCandidates } from './getMatchCandidates.service';
import { calculateMatchResult } from './calculateMatchResult.service';

/**
 * 매칭 후보와 결과를 포함한 타입
 *
 * 📌 필수 필드:
 * - targetUserId: 매칭 대상 사용자 ID
 * - finalScore: 최종 매칭 점수 (0~100)
 * - isOnlineMatched: target이 현재 온라인인지 여부
 * - availabilityHint: 가용성 힌트 ('online' | 'offline' | 'unknown')
 *
 * 📌 금지:
 * - UI용 문구/퍼센트/게이지/표시 단위 가공 ❌
 * - tags, reasons 포함 ❌
 */
export interface MatchResultWithTarget {
  targetUserId: string;
  finalScore: number;
  isOnlineMatched: boolean;
  availabilityHint: 'online' | 'offline' | 'unknown';
}

/**
 * 여러 후보에 대한 매칭 결과를 계산한다
 *
 * @param client - Supabase 클라이언트
 * @param viewerId - viewer 사용자 ID
 * @returns 항상 유효한 MatchResultWithTarget 배열 반환
 *
 * @example
 * ```typescript
 * // 정상 케이스 (후보가 있는 경우)
 * const results = await calculateMatchResults(supabase, 'viewer-uuid');
 * // [
 * //   {
 * //     targetUserId: 'target-uuid-1',
 * //     finalScore: 87,
 * //     isOnlineMatched: true,
 * //     availabilityHint: 'online'
 * //   },
 * //   {
 * //     targetUserId: 'target-uuid-2',
 * //     finalScore: 65,
 * //     isOnlineMatched: false,
 * //     availabilityHint: 'offline'
 * //   }
 * // ]
 *
 * // 후보 없음
 * const results = await calculateMatchResults(supabase, 'viewer-uuid');
 * // []
 *
 * // Cold Start (데이터 없음)
 * const results = await calculateMatchResults(supabase, 'new-user-uuid');
 * // [
 * //   {
 * //     targetUserId: 'target-uuid',
 * //     finalScore: 50,
 * //     isOnlineMatched: false,
 * //     availabilityHint: 'unknown'
 * //   }
 * // ]
 * ```
 */
export const calculateMatchResults = async (
  client: SupabaseClient<Database>,
  viewerId: string
): Promise<MatchResultWithTarget[]> => {
  // 1. 후보 조회 (getMatchCandidates에 위임)
  const candidates = await getMatchCandidates(client, viewerId);

  // 2. 후보 0명이면 빈 배열 즉시 반환
  if (candidates.length === 0) {
    return [];
  }

  // 3. 각 후보에 대해 병렬로 매칭 결과 계산
  // Promise.allSettled 사용: 단일 실패가 전체 실패로 전파되는 것을 방지
  const resultsWithCandidates = await Promise.allSettled(
    candidates.map(async (candidate) => {
      const result = await calculateMatchResult(
        client,
        viewerId,
        candidate.userId
      );
      // 새로운 객체로 조립 (immutability 유지)
      return {
        targetUserId: candidate.userId,
        finalScore: result.finalScore,
        isOnlineMatched: result.isOnlineMatched,
        availabilityHint: result.availabilityHint,
      };
    })
  );

  // 4. fulfilled 결과만 추출하여 반환
  // rejected 결과는 배열에 포함하지 않음 (배열 길이는 후보 수보다 작을 수 있음)
  const matchResults = resultsWithCandidates
    .filter(
      (result): result is PromiseFulfilledResult<MatchResultWithTarget> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value);

  return matchResults;
};
