// traits/hooks/useTraitResult.ts

import { useMemo } from 'react';
import type { AnswerType } from './useTraitAnswers';
import { calculateTraitScores } from '../domain/calculateTraitScores';
import { resolveAnimalType } from '../domain/resolveAnimalType';
import type { TraitScores } from '../domain/calculateTraitScores';

export const useTraitResult = (answers: Record<string, AnswerType>) => {
  /**
   * answers → traitScores
   */
  const traitScores: TraitScores = useMemo(() => {
    return calculateTraitScores(answers);
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
