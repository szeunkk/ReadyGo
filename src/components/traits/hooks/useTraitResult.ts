import type { TraitKey } from '@/commons/constants/animal/trait.enum';
import type { AnswerType } from './useTraitAnswers';

/**
 * Trait 점수 타입
 */
export type TraitScores = Record<TraitKey, number>;

/**
 * 답변을 trait 점수로 계산하는 Hook
 * TODO: 실제 계산 로직 구현 필요
 */
export function useTraitResult() {
  /**
   * 답변을 기반으로 trait 점수 계산
   * @param answers - 각 질문에 대한 답변들
   * @returns trait별 점수 (0-100)
   */
  const calculateTraitScores = (
    answers: Record<number, AnswerType>
  ): TraitScores => {
    // TODO: 실제 계산 로직 구현
    // 1. answers를 순회하며 각 질문의 axis와 weight를 고려
    // 2. 각 trait별로 점수 합산
    // 3. 정규화하여 0-100 범위로 변환

    return {
      cooperation: 0,
      exploration: 0,
      strategy: 0,
      leadership: 0,
      social: 0,
    };
  };

  /**
   * trait 점수를 기반으로 동물 타입 결정
   * @param scores - trait별 점수
   * @returns 동물 타입 문자열
   */
  const determineAnimalType = (scores: TraitScores): string => {
    // TODO: 실제 동물 타입 결정 로직 구현
    return 'fox';
  };

  return {
    calculateTraitScores,
    determineAnimalType,
  };
}
