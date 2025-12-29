import { QUESTIONS } from '../data/questions';
import type { TraitKey } from '@/commons/constants/animal/trait.enum';
import type { AnswerType } from '../hooks/useTraitAnswers';

/**
 * 5가지 성향별 점수 (0~100)
 * - cooperation: 협력성
 * - exploration: 탐험성
 * - strategy: 전략성
 * - leadership: 리더십
 * - social: 사교성
 */
export type TraitScores = Record<TraitKey, number>;

/**
 * 리커트 척도 답변(1~5)을 점수(-2~2)로 변환하는 맵
 * - 1: 매우 그렇지 않다 (-2점)
 * - 2: 그렇지 않다 (-1점)
 * - 3: 보통이다 (0점)
 * - 4: 그렇다 (1점)
 * - 5: 매우 그렇다 (2점)
 */
const ANSWER_SCORE_MAP: Record<number, number> = {
  1: -2,
  2: -1,
  3: 0,
  4: 1,
  5: 2,
};

/**
 * 초기 성향 점수 (모두 0점)
 */
const EMPTY_SCORES: TraitScores = {
  cooperation: 0,
  exploration: 0,
  strategy: 0,
  leadership: 0,
  social: 0,
};

/**
 * 사용자 답변을 기반으로 5가지 성향 점수를 계산
 *
 * @param answers - questionId를 key로 하는 답변 맵
 * @returns 0~100 사이로 정규화된 성향 점수
 *
 * @example
 * ```ts
 * const answers = {
 *   'q1': 5,  // 매우 그렇다
 *   'q2': 3,  // 보통이다
 *   // ...
 * };
 * const scores = calculateTraitScores(answers);
 * // { cooperation: 65, exploration: 50, ... }
 * ```
 *
 * 계산 방식:
 * 1. 각 질문의 답변(1~5)을 점수(-2~2)로 변환
 * 2. 질문의 가중치(weight)를 곱하여 누적
 * 3. 각 성향별 원점수를 0~100 범위로 정규화
 */
export const calculateTraitScores = (
  answers: Record<string, AnswerType>
): TraitScores => {
  // 1단계: 각 질문의 답변을 점수로 변환하여 성향별로 누적
  const rawScores = QUESTIONS.reduce<TraitScores>(
    (acc, q) => {
      const answer = answers[q.id];

      // 스케줄 질문 등 숫자가 아닌 답변은 스킵
      if (typeof answer !== 'number') {
        return acc;
      }

      // 답변 점수 * 가중치를 해당 성향에 누적
      acc[q.axis] += ANSWER_SCORE_MAP[answer] * q.weight;
      return acc;
    },
    { ...EMPTY_SCORES }
  );

  // 2단계: 원점수를 0~100 범위로 정규화
  return normalize(rawScores);
};

/**
 * 원점수를 0~100 범위로 정규화
 *
 * @param scores - 원점수 (-MAX ~ +MAX 범위)
 * @returns 0~100 범위로 변환된 점수
 *
 * 변환 공식:
 * - 최소값 (-5) → 0
 * - 중간값 (0) → 50
 * - 최대값 (+5) → 100
 * - 공식: ((value + MAX) / (MAX * 2)) * 100
 */
const normalize = (scores: TraitScores): TraitScores => {
  // 이론적 최대값 (모든 질문에 5점, weight=1 가정 시)
  const MAX = 5;

  return (Object.entries(scores) as [TraitKey, number][]).reduce<TraitScores>(
    (acc, [key, value]) => {
      // -5 ~ +5 범위를 0 ~ 100 범위로 선형 변환 후 반올림
      acc[key] = Math.round(((value + MAX) / (MAX * 2)) * 100);
      return acc;
    },
    {} as TraitScores
  );
};
