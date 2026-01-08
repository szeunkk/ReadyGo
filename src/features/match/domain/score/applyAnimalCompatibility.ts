/**
 * ❗ Calculate Animal Compatibility Factor
 *
 * 📌 책임 (Responsibility):
 * - viewer와 target의 동물 타입 간 궁합을 팩터로 계산
 * - 동물 궁합에 따라 "compatibility factor"를 반환
 * - baseScore와 독립적으로 계산되는 순수 팩터
 *
 * 📌 입력:
 * - context: MatchContext 입력
 *
 * 📌 출력:
 * - number: 동물 궁합 팩터 (0.95 ~ 1.10)
 *
 * 📌 계산 로직 (multiplicative factor):
 * - 천생연분 (best): 1.10 (10% 증가)
 * - 좋은 궁합 (good): 1.07 (7% 증가)
 * - 동일한 동물: 1.05 (5% 증가)
 * - 중립 (neutral): 1.0 (보정 없음)
 * - 도전적인 궁합 (challenging): 0.95 (5% 감소)
 * - 궁합 정보 없음: 1.0 (보정 없음)
 * - 동물 타입 미설정: 1.0 (보정 없음)
 */

import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';
import { getCompatibilityLevel } from '@/commons/constants/animal/animal.compat';

/**
 * 동물 궁합 팩터 계산
 *
 * @param context - MatchContext 입력
 * @returns 동물 궁합 팩터 (0.95 ~ 1.10)
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
 * const factor = calculateAnimalCompatibilityFactor(context); // 1.10
 * // 최종 점수 = baseScore × factor
 * // 예: 80점 × 1.10 = 88점
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
 * const factor = calculateAnimalCompatibilityFactor(context); // 1.07
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
 * const factor = calculateAnimalCompatibilityFactor(context); // 0.95
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
 * const factor = calculateAnimalCompatibilityFactor(context); // 1.05
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
 * const factor = calculateAnimalCompatibilityFactor(context); // 1.0
 * ```
 */
export const calculateAnimalCompatibilityFactor = (
  context: MatchContextCoreDTO
): number => {
  // 동물 타입 가져오기
  const viewerAnimal = context.viewer.traits?.animalType;
  const targetAnimal = context.target.traits?.animalType;

  // 동물 타입 미설정 시 보정 미적용
  if (!viewerAnimal || !targetAnimal) {
    return 1.0;
  }

  // 동일한 동물: 2.5% 증가 (기존 5%에서 축소)
  if (viewerAnimal === targetAnimal) {
    return 1.025;
  }

  // 궁합 레벨 확인
  const compatibilityLevel = getCompatibilityLevel(viewerAnimal, targetAnimal);

  // 궁합 레벨에 따른 팩터 반환 (범위 축소: 과도한 보정 방지)
  switch (compatibilityLevel) {
    case 'best':
      // 천생연분: 5% 증가 (기존 10%에서 축소)
      return 1.05;
    case 'good':
      // 좋은 궁합: 3.5% 증가 (기존 7%에서 축소)
      return 1.035;
    case 'challenging':
      // 도전적인 궁합: 2.5% 감소 (기존 5%에서 축소)
      return 0.975;
    case 'neutral':
    case 'unknown':
    default:
      // 중립 또는 정보 없음: 보정 미적용
      return 1.0;
  }
};
