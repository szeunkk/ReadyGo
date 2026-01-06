/**
 * ❗ Apply Online Bonus
 *
 * 📌 책임 (Responsibility):
 * - 기본 유사도 점수에 온라인 보정 적용
 * - Target 사용자가 온라인일 경우 점수 상승
 * - 온라인 상태 미확인 시 보정 미적용
 *
 * 📌 입력:
 * - baseScore: 기본 유사도 점수 (0~100)
 * - context: MatchContext 입력
 *
 * 📌 출력:
 * - number: 온라인 보정 적용된 점수 (0~100)
 *
 * 📌 계산 로직:
 * - target.activity.isOnline === true: 기본 점수 * 1.1
 * - target.activity.isOnline === false: 기본 점수 유지
 * - target.activity.isOnline === undefined: 기본 점수 유지
 * - 최종 점수는 100을 초과하지 않음
 */

import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';

/**
 * 온라인 보정 적용
 *
 * @param baseScore - 기본 유사도 점수 (0~100)
 * @param context - MatchContext 입력
 * @returns 온라인 보정 적용된 점수 (0~100)
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
 * const score = applyOnlineBonus(80, context); // 88 (80 * 1.1)
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
 * const score = applyOnlineBonus(80, context); // 80 (보정 미적용)
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
 * const score = applyOnlineBonus(80, context); // 80 (보정 미적용)
 * ```
 */
export function applyOnlineBonus(
  baseScore: number,
  context: MatchContextCoreDTO
): number {
  // Target 온라인 상태 확인
  const targetOnline = context.target.activity?.isOnline ?? false;

  // 온라인일 경우 10% 보정
  if (targetOnline) {
    const bonusScore = baseScore * 1.1;
    return Math.min(100, Math.round(bonusScore));
  }

  // 오프라인이거나 상태 미확인 시 기본 점수 유지
  return baseScore;
}

