/**
 * 성향 점수 기반 동물 유형 결정 모듈
 *
 * 사용자의 5가지 성향 점수를 분석하여 가장 적합한 동물 유형을 매칭합니다.
 * 각 동물은 dominant(핵심), secondary(부수), avoid(회피) 특성을 가지며,
 * 이에 따라 가중치를 부여하여 최적의 매칭을 계산합니다.
 */
import { animalProfiles } from '@/commons/constants/animal/animal.profile';
import { AnimalType } from '@/commons/constants/animal/animal.enum';
import type { TraitScores } from './calculateTraitScores';
import type { TraitKey } from '@/commons/constants/animal/trait.enum';

/**
 * 특성별 가중치
 *
 * - dominant: 동물의 핵심 특성 (2배 가중치)
 *   예: 늑대의 리더십, 여우의 전략성
 *
 * - secondary: 동물의 부수 특성 (1배 가중치)
 *   예: 늑대의 협력성, 여우의 사교성
 *
 * - avoid: 동물과 맞지 않는 특성 (마이너스 가중치)
 *   예: 고양이의 협력성(독립적 성향과 반대)
 *
 * 가중치가 높을수록 해당 특성이 최종 점수에 미치는 영향이 큽니다.
 */
const WEIGHT = {
  dominant: 2.0, // 핵심 특성: 2배 강조
  secondary: 1.0, // 부수 특성: 기본 가중치
  avoid: -1.5, // 회피 특성: 패널티 부여
} as const;

/**
 * 성향 점수를 기반으로 가장 적합한 동물 유형을 결정
 *
 * @param traitScores - 5가지 성향별 점수 (0~100)
 * @returns 가장 적합한 동물 유형
 *
 * @example
 * ```ts
 * const scores = {
 *   cooperation: 80,  // 협력성 높음
 *   leadership: 90,   // 리더십 높음
 *   strategy: 50,
 *   exploration: 60,
 *   social: 70
 * };
 * const animal = resolveAnimalType(scores);
 * // AnimalType.WOLF (리더십 + 협력성이 강한 늑대)
 * ```
 *
 * 계산 방식:
 * 1. 각 동물 프로필에 대해 점수 계산:
 *    - dominant 특성 점수 × 2.0
 *    - secondary 특성 점수 × 1.0
 *    - avoid 특성 점수 × -1.5
 * 2. 위 세 점수를 합산하여 각 동물의 총점 산출
 * 3. 가장 높은 점수를 받은 동물 선택
 *
 * 특징:
 * - 순수 함수 (side-effect 없음)
 * - 불변성 보장
 * - reduce/map 기반 선언적 구현
 */
export const resolveAnimalType = (traitScores: TraitScores): AnimalType => {
  return (
    (
      Object.entries(animalProfiles) as [
        AnimalType,
        {
          dominantTraits: TraitKey[];
          secondaryTraits: TraitKey[];
          avoidTraits: TraitKey[];
        },
      ][]
    )
      // 1단계: 각 동물 유형의 적합도 점수 계산
      .map(([animalType, profile]) => {
        // 핵심 특성 점수: dominant 특성들의 가중 합
        const dominantScore = profile.dominantTraits.reduce(
          (sum, trait) => sum + traitScores[trait] * WEIGHT.dominant,
          0
        );

        // 부수 특성 점수: secondary 특성들의 가중 합
        const secondaryScore = profile.secondaryTraits.reduce(
          (sum, trait) => sum + traitScores[trait] * WEIGHT.secondary,
          0
        );

        // 회피 특성 점수: avoid 특성들의 가중 합 (마이너스 패널티)
        const avoidScore = profile.avoidTraits.reduce(
          (sum, trait) => sum + traitScores[trait] * WEIGHT.avoid,
          0
        );

        // 세 점수를 합산하여 해당 동물의 최종 적합도 산출
        return {
          animalType,
          score: dominantScore + secondaryScore + avoidScore,
        };
      })

      // 2단계: 가장 높은 점수를 받은 동물 선택
      .reduce((best, current) => {
        return current.score > best.score ? current : best;
      }).animalType
  );
};
