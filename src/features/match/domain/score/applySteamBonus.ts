/**
 * ❗ Calculate Steam Compatibility Factor
 *
 * 📌 책임 (Responsibility):
 * - viewer와 target의 Steam 공통 게임에 따른 팩터 계산
 * - 공통 게임 수에 따라 "Steam compatibility factor"를 반환
 * - baseScore와 독립적으로 계산되는 순수 팩터
 *
 * 📌 입력:
 * - context: MatchContext 입력
 *
 * 📌 출력:
 * - number: Steam 호환성 팩터 (1.0 ~ 1.10)
 *
 * 📌 계산 로직 (multiplicative factor):
 * - 공통 게임 0개: 1.0 (보정 없음)
 * - 공통 게임 1개: 1.02 (2% 증가)
 * - 공통 게임 2개: 1.04 (4% 증가)
 * - 공통 게임 3개: 1.06 (6% 증가)
 * - 공통 게임 4개: 1.08 (8% 증가)
 * - 공통 게임 5개 이상: 1.10 (10% 증가, 최대)
 * - Steam 미연동: 1.0 (보정 없음)
 */

import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';

/**
 * Steam 호환성 팩터 계산
 *
 * @param context - MatchContext 입력
 * @returns Steam 호환성 팩터 (1.0 ~ 1.10)
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
 * const factor = calculateSteamCompatibilityFactor(context); // 1.06
 * // 최종 점수 = baseScore × factor
 * // 예: 80점 × 1.06 = 84.8 → 85점
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
 * const factor = calculateSteamCompatibilityFactor(context); // 1.0
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
 * const factor = calculateSteamCompatibilityFactor(context); // 1.0
 * ```
 */
export const calculateSteamCompatibilityFactor = (
  context: MatchContextCoreDTO
): number => {
  // Steam 게임 목록 가져오기
  const viewerGames = context.viewer.steam?.steamGames ?? [];
  const targetGames = context.target.steam?.steamGames ?? [];

  // Steam 미연동 또는 게임 없음
  if (viewerGames.length === 0 || targetGames.length === 0) {
    return 1.0;
  }

  // 공통 게임 찾기
  const commonGames = viewerGames.filter((game) => targetGames.includes(game));

  // 공통 게임 수에 따른 팩터 계산
  // 공통 게임 1개당 2% 증가, 최대 10% (5개 이상)
  const commonCount = Math.min(commonGames.length, 5);
  const factor = 1.0 + commonCount * 0.02;

  return factor;
};
