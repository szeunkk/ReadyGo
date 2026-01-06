/**
 * ❗ Calculate Base Similarity
 *
 * 📌 책임 (Responsibility):
 * - MatchContext를 입력으로 받아 기본 유사도 점수를 계산
 * - **순수 Traits 점수만** 계산 (성향 일치도)
 * - Schedule, Steam 등은 별도 팩터로 관리
 * - Cold Start 상태에서도 동작
 * - 계산 결과는 0~100 범위의 숫자
 *
 * 📌 입력:
 * - MatchContextCoreDTO: viewer와 target 사용자 간 매칭 계산 입력
 *
 * 📌 출력:
 * - number: 기본 유사도 점수 (0~100)
 *
 * 📌 계산 원칙:
 * - Traits만 계산 (순수 성향 점수)
 * - Traits 미설정 시 Cold Start 기본값 (50점)
 * - Schedule은 별도 calculateScheduleCompatibilityFactor로 관리
 */

import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';
import { calculateTraitsSimilarity } from '../utils/traitsSimilarity';

/**
 * 기본 유사도 계산 (순수 Traits 점수)
 *
 * 📌 계산 흐름:
 * 1. Traits 유사도 계산 (있을 경우)
 * 2. Traits 없으면 Cold Start 기본값 (50점) 반환
 *
 * @param context - MatchContext 입력
 * @returns 0~100 범위의 기본 유사도 점수 (순수 성향 점수)
 *
 * @example
 * ```typescript
 * // Traits가 있는 경우
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     traits: {
 *       traits: { cooperation: 58, exploration: 85, strategy: 72, leadership: 45, social: 90 }
 *     }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     traits: {
 *       traits: { cooperation: 62, exploration: 80, strategy: 68, leadership: 50, social: 88 }
 *     }
 *   }
 * };
 *
 * const score = calculateBaseSimilarity(context); // 95 (순수 Traits 유사도)
 * ```
 *
 * @example
 * ```typescript
 * // Cold Start (Traits 없음)
 * const context: MatchContextCoreDTO = {
 *   viewer: { userId: 'viewer-uuid' },
 *   target: { userId: 'target-uuid' }
 * };
 *
 * const score = calculateBaseSimilarity(context); // 50 (기본 점수)
 * ```
 *
 * @example
 * ```typescript
 * // 최종 점수 계산 흐름 예시
 * const baseScore = calculateBaseSimilarity(context); // 85 (순수 Traits)
 * const withAnimal = applyAnimalCompatibility(baseScore, context); // 85 × 1.05 = 89
 * const scheduleFactor = calculateScheduleCompatibilityFactor(context); // 1.025
 * const availabilityFactor = calculateAvailabilityFactor(context); // 1.0
 * const finalScore = withAnimal × scheduleFactor × availabilityFactor; // 91
 * ```
 */
export const calculateBaseSimilarity = (
  context: MatchContextCoreDTO
): number => {
  // Traits 유사도 계산
  const traitsScore =
    context.viewer.traits?.traits && context.target.traits?.traits
      ? calculateTraitsSimilarity(
          context.viewer.traits.traits,
          context.target.traits.traits
        )
      : undefined;

  // Traits가 없으면 Cold Start 기본값 반환
  if (traitsScore === undefined) {
    return 50;
  }

  // 순수 Traits 점수 반환
  return traitsScore;
};
