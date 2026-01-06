/**
 * ❗ Calculate Availability Factor
 *
 * 📌 책임 (Responsibility):
 * - Target 사용자의 현재 가용성(매칭 가능 정도)을 계산
 * - 온라인 상태에 따라 "지금 매칭될 가능성"을 팩터로 반환
 * - 성향 일치도가 아닌 우선권/가시성/가중치 개념
 *
 * 📌 입력:
 * - context: MatchContext 입력
 *
 * 📌 출력:
 * - number: 가용성 팩터 (0.85 ~ 1.0)
 *
 * 📌 계산 로직:
 * - target.activity.isOnline === true: 1.0 (100% 가용)
 * - target.activity.isOnline === false: 0.85 (85% 가용)
 * - target.activity.isOnline === undefined: 0.85 (오프라인으로 간주)
 *
 * 📌 설계 의도:
 * - 온라인 사용자는 즉시 매칭 가능하므로 가시성 최대화
 * - 오프라인 사용자도 85%의 가중치로 매칭 풀에 포함
 * - 성향이 매우 잘 맞는 오프라인 사용자 > 성향이 덜 맞는 온라인 사용자
 */

import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';

/**
 * 가용성 팩터 계산
 *
 * @param context - MatchContext 입력
 * @returns 가용성 팩터 (0.85 ~ 1.0)
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
 * const factor = calculateAvailabilityFactor(context); // 1.0
 * // 최종 점수 = baseScore * factor
 * // 예: 80점 × 1.0 = 80점 (온라인, 가시성 최대)
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
 * const factor = calculateAvailabilityFactor(context); // 0.85
 * // 최종 점수 = baseScore * factor
 * // 예: 80점 × 0.85 = 68점 (오프라인, 우선순위 하락)
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
 * const factor = calculateAvailabilityFactor(context); // 0.85
 * // 오프라인으로 간주
 * ```
 *
 * @example
 * ```typescript
 * // 실제 사용 시나리오
 * // 온라인인 덜 맞는 사람: 60점 × 1.0 = 60점
 * // 오프라인인 잘 맞는 사람: 80점 × 0.85 = 68점
 * // → 성향이 잘 맞는 사람이 여전히 위에 위치
 * ```
 */
export const calculateAvailabilityFactor = (
  context: MatchContextCoreDTO
): number => {
  // Target 온라인 상태 확인
  const targetOnline = context.target.activity?.isOnline ?? false;

  // 온라인: 1.0 (100% 가용, 즉시 매칭 가능)
  // 오프라인: 0.85 (85% 가용, 우선순위 하락)
  return targetOnline ? 1.0 : 0.85;
};
