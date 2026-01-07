/**
 * ❗ Calculate Online Factor
 *
 * 📌 책임 (Responsibility):
 * - Target 사용자의 온라인 상태에 따른 팩터 계산
 * - 온라인 사용자에게 약간의 가시성 부스트 제공
 * - 성향 일치도가 여전히 가장 중요한 요소로 유지
 *
 * 📌 입력:
 * - context: MatchContext 입력
 *
 * 📌 출력:
 * - number: 온라인 팩터 (1.0 ~ 1.02)
 *
 * 📌 계산 로직:
 * - target.activity.isOnline === true: 1.02 (2% 증가)
 * - target.activity.isOnline === false: 1.0 (보정 없음)
 * - target.activity.isOnline === undefined: 1.0 (보정 없음)
 *
 * 📌 설계 의도:
 * - 온라인 사용자에게 약간의 우선권 부여 (최대 2%)
 * - 오프라인 사용자도 페널티 없이 매칭 풀에 포함
 * - 성향이 매우 잘 맞는 오프라인 사용자 > 성향이 덜 맞는 온라인 사용자
 */

import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';

/**
 * 온라인 팩터 계산
 *
 * @param context - MatchContext 입력
 * @returns 온라인 팩터 (1.0 ~ 1.02)
 *
 * @example
 * ```typescript
 * // Target이 온라인인 경우
 * const context: MatchContextCoreDTO = {
 *   viewer: { userId: 'viewer-uuid' },
 *   target: {
 *     userId: 'target-uuid',
 *     activity: { isOnline: true }
 *   }
 * };
 *
 * const factor = calculateOnlineFactor(context); // 1.02
 * // 최종 점수 = baseScore × factor
 * // 예: 80점 × 1.02 = 81.6 → 82점 (온라인, 약간의 부스트)
 * ```
 *
 * @example
 * ```typescript
 * // Target이 오프라인인 경우
 * const context: MatchContextCoreDTO = {
 *   viewer: { userId: 'viewer-uuid' },
 *   target: {
 *     userId: 'target-uuid',
 *     activity: { isOnline: false }
 *   }
 * };
 *
 * const factor = calculateOnlineFactor(context); // 1.0
 * // 최종 점수 = baseScore × factor
 * // 예: 80점 × 1.0 = 80점 (오프라인, 페널티 없음)
 * ```
 *
 * @example
 * ```typescript
 * // Target 온라인 상태 미확인인 경우
 * const context: MatchContextCoreDTO = {
 *   viewer: { userId: 'viewer-uuid' },
 *   target: { userId: 'target-uuid' }
 * };
 *
 * const factor = calculateOnlineFactor(context); // 1.0
 * // 보정 없음
 * ```
 *
 * @example
 * ```typescript
 * // 실제 사용 시나리오
 * // 온라인인 덜 맞는 사람: 60점 × 1.02 = 61.2 → 61점
 * // 오프라인인 잘 맞는 사람: 80점 × 1.0 = 80점
 * // → 성향이 잘 맞는 사람이 여전히 위에 위치
 * ```
 */
export const calculateOnlineFactor = (context: MatchContextCoreDTO): number => {
  // Target 온라인 상태 확인
  const targetOnline = context.target.activity?.isOnline ?? false;

  // 온라인: 1.02 (2% 증가, 약간의 우선권)
  // 오프라인: 1.0 (보정 없음, 페널티 없음)
  return targetOnline ? 1.02 : 1.0;
};
