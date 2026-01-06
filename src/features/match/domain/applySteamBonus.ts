/**
 * ❗ Apply Steam Bonus
 *
 * 📌 책임 (Responsibility):
 * - 기본 유사도 점수에 Steam 공통 게임 보정 적용
 * - viewer와 target의 공통 게임 수에 따라 점수 상승
 * - Steam 미연동 시 보정 미적용
 *
 * 📌 입력:
 * - baseScore: 기본 유사도 점수 (0~100)
 * - context: MatchContext 입력
 *
 * 📌 출력:
 * - number: Steam 보정 적용된 점수 (0~100)
 *
 * 📌 계산 로직:
 * - 공통 게임 1개당 +2점
 * - 최종 점수는 100을 초과하지 않음
 * - Steam 미연동 시 기본 점수 유지
 */

import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';

/**
 * Steam 보정 적용
 *
 * @param baseScore - 기본 유사도 점수 (0~100)
 * @param context - MatchContext 입력
 * @returns Steam 보정 적용된 점수 (0~100)
 *
 * @example
 * ```typescript
 * // Steam 연동 + 공통 게임 3개
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     steam: { steamGames: [570, 730, 440] }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     steam: { steamGames: [570, 730, 220] }
 *   }
 * };
 *
 * const score = applySteamBonus(80, context); // 84 (80 + 2*2)
 * ```
 *
 * @example
 * ```typescript
 * // Steam 미연동
 * const context: MatchContextCoreDTO = {
 *   viewer: { userId: 'viewer-uuid' },
 *   target: { userId: 'target-uuid' }
 * };
 *
 * const score = applySteamBonus(80, context); // 80 (보정 미적용)
 * ```
 *
 * @example
 * ```typescript
 * // Steam 연동했지만 공통 게임 없음
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     steam: { steamGames: [570, 730] }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     steam: { steamGames: [440, 220] }
 *   }
 * };
 *
 * const score = applySteamBonus(80, context); // 80 (공통 게임 없음)
 * ```
 */
export function applySteamBonus(
  baseScore: number,
  context: MatchContextCoreDTO
): number {
  // Steam 게임 목록 가져오기
  const viewerGames = context.viewer.steam?.steamGames ?? [];
  const targetGames = context.target.steam?.steamGames ?? [];

  // Steam 미연동 또는 게임 없음
  if (viewerGames.length === 0 || targetGames.length === 0) {
    return baseScore;
  }

  // 공통 게임 찾기
  const commonGames = viewerGames.filter((game) => targetGames.includes(game));

  // 공통 게임 1개당 +2점
  const bonus = commonGames.length * 2;
  const bonusScore = baseScore + bonus;

  // 최종 점수는 100을 초과하지 않음
  return Math.min(100, bonusScore);
}

