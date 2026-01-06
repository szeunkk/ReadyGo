/**
 * ❗ Apply Animal Compatibility
 *
 * 📌 책임 (Responsibility):
 * - 기본 유사도 점수에 동물 궁합 보정 적용
 * - viewer와 target의 동물 타입 간 궁합에 따라 점수 조정
 * - 동물 타입 미설정 시 보정 미적용
 *
 * 📌 입력:
 * - baseScore: 기본 유사도 점수 (0~100)
 * - context: MatchContext 입력
 *
 * 📌 출력:
 * - number: 동물 궁합 보정 적용된 점수 (0~100)
 *
 * 📌 계산 로직 (비율 보정):
 * - 천생연분 (best): baseScore × 1.10 (10% 증가)
 * - 좋은 궁합 (good): baseScore × 1.07 (7% 증가)
 * - 중립 (neutral): 보정 미적용
 * - 도전적인 궁합 (challenging): baseScore × 0.95 (5% 감소)
 * - 동일한 동물: baseScore × 1.05 (5% 증가)
 * - 궁합 정보 없음: 보정 미적용
 * - 동물 타입 미설정: 보정 미적용
 * - 최종 점수는 0~100 범위 내
 */

import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';
import { getCompatibilityLevel } from '@/commons/constants/animal/animal.compat';

/**
 * 동물 궁합 보정 적용
 *
 * @param baseScore - 기본 유사도 점수 (0~100)
 * @param context - MatchContext 입력
 * @returns 동물 궁합 보정 적용된 점수 (0~100)
 *
 * @example
 * ```typescript
 * // 천생연분 (tiger - bear)
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     traits: { animalType: AnimalType.tiger }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     traits: { animalType: AnimalType.bear }
 *   }
 * };
 *
 * const score = applyAnimalCompatibility(80, context); // 88 (80 × 1.10)
 * ```
 *
 * @example
 * ```typescript
 * // 좋은 궁합 (tiger - owl)
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     traits: { animalType: AnimalType.tiger }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     traits: { animalType: AnimalType.owl }
 *   }
 * };
 *
 * const score = applyAnimalCompatibility(80, context); // 85.6 → 86 (80 × 1.07)
 * ```
 *
 * @example
 * ```typescript
 * // 도전적인 궁합 (tiger - dog)
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     traits: { animalType: AnimalType.tiger }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     traits: { animalType: AnimalType.dog }
 *   }
 * };
 *
 * const score = applyAnimalCompatibility(80, context); // 76 (80 × 0.95)
 * ```
 *
 * @example
 * ```typescript
 * // 동일한 동물 (tiger - tiger)
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     traits: { animalType: AnimalType.tiger }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     traits: { animalType: AnimalType.tiger }
 *   }
 * };
 *
 * const score = applyAnimalCompatibility(80, context); // 84 (80 × 1.05)
 * ```
 *
 * @example
 * ```typescript
 * // 동물 타입 미설정
 * const context: MatchContextCoreDTO = {
 *   viewer: { userId: 'viewer-uuid' },
 *   target: { userId: 'target-uuid' }
 * };
 *
 * const score = applyAnimalCompatibility(80, context); // 80 (보정 미적용)
 * ```
 */
export const applyAnimalCompatibility = (
  baseScore: number,
  context: MatchContextCoreDTO
): number => {
  // 동물 타입 가져오기
  const viewerAnimal = context.viewer.traits?.animalType;
  const targetAnimal = context.target.traits?.animalType;

  // 동물 타입 미설정 시 보정 미적용
  if (!viewerAnimal || !targetAnimal) {
    return baseScore;
  }

  // 동일한 동물: 5% 증가
  if (viewerAnimal === targetAnimal) {
    return Math.min(100, Math.round(baseScore * 1.05));
  }

  // 궁합 레벨 확인
  const compatibilityLevel = getCompatibilityLevel(viewerAnimal, targetAnimal);

  // 궁합 레벨에 따른 점수 보정 (비율 적용)
  let multiplier: number;

  switch (compatibilityLevel) {
    case 'best':
      // 천생연분: 10% 증가
      multiplier = 1.1;
      break;
    case 'good':
      // 좋은 궁합: 7% 증가
      multiplier = 1.07;
      break;
    case 'challenging':
      // 도전적인 궁합: 5% 감소
      multiplier = 0.95;
      break;
    case 'neutral':
    case 'unknown':
    default:
      // 중립 또는 정보 없음: 보정 미적용
      multiplier = 1.0;
      break;
  }

  const adjustedScore = baseScore * multiplier;
  return Math.min(100, Math.max(0, Math.round(adjustedScore)));
};
