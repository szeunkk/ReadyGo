// traits/hooks/useTraitResult.ts

import { useMemo } from 'react';
import type { AnswerType } from './useTraitAnswers';
import { calculateTraitScores } from '../domain/calculateTraitScores';
import { resolveAnimalType } from '../domain/resolveAnimalType';
import type { TraitScores } from '../domain/calculateTraitScores';

export const useTraitResult = (answers: Record<string, AnswerType>) => {
  /**
   * answers → traitScores
   * ScheduleAnswer를 제외하고 숫자 답변만 필터링
   */
  const traitScores: TraitScores = useMemo(() => {
    const numericAnswers: Record<string, number> = {};
    for (const [key, value] of Object.entries(answers)) {
      if (typeof value === 'number') {
        numericAnswers[key] = value;
      }
    }
    return calculateTraitScores(numericAnswers);
  }, [answers]);

  /**
   * traitScores → animalType
   */
  const animalType = useMemo(() => {
    return resolveAnimalType(traitScores);
  }, [traitScores]);

  return {
    traitScores,
    animalType,
  };
};
