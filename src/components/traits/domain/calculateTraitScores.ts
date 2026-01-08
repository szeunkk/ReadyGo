/**
 * Effect 기반 특성 점수 계산 모듈 (V2)
 *
 * 사용자의 답변에 따른 effect를 누적하여 최종 특성 벡터를 계산합니다.
 *
 * 기존 시스템에서 마이그레이션:
 * - 기존: 리커트 척도 점수(-2~2) × 가중치
 * - 신규: Effect 누적 (-20~20) + Radial Clipping
 */

import type { TraitVector } from '@/commons/constants/animal/animal.vector';
import {
  createInitialVector,
  normalizeVector,
  applyRadialClipping,
} from './calculateVectorDistance';
import type {
  QuestionWithEffect,
  TraitEffect,
} from '../data/questionEffects.types';
import type { TraitKey } from '@/commons/constants/animal/trait.enum';
import { QUESTIONS_WITH_EFFECTS } from '../data/questions';

/**
 * 사용자 답변 타입 (기존 호환)
 */
export type AnswerType = number;

/**
 * 사용자 답변 맵 타입
 */
export type UserAnswers = Record<string, number>; // questionId -> choice value (1~5)

/**
 * 성향 점수 타입 (기존 호환)
 */
export type TraitScores = TraitVector;

/**
 * Effect 기반으로 특성 점수 계산 (내부 함수)
 *
 * @param answers - 사용자의 답변 맵 (questionId -> choice value)
 * @param questions - Effect가 포함된 질문 목록
 * @returns 계산된 특성 벡터 (0~100)
 */
export const calculateTraitScoresByEffect = (
  answers: UserAnswers,
  questions: QuestionWithEffect[]
): TraitVector => {
  // 1단계: 초기 벡터 생성 (모두 50점)
  const vector = createInitialVector();

  // 2단계: 각 질문의 effect 누적
  for (const question of questions) {
    const choiceValue = answers[question.id];

    // 답변하지 않은 질문은 스킵
    if (choiceValue === undefined || choiceValue === null) {
      continue;
    }

    // 해당 선택지 찾기
    const choice = question.choices.find((c) => c.value === choiceValue);

    if (!choice) {
      continue;
    }

    // Effect 적용
    applyEffect(vector, choice.effects);
  }

  // 3단계: Radial Clipping 적용 (중심에서 너무 멀어지지 않도록)
  const clipped = applyRadialClipping(vector, 120);

  // 4단계: 0~100 범위로 정규화
  return normalizeVector(clipped);
};

/**
 * 벡터에 Effect 적용
 *
 * @param vector - 적용할 대상 벡터 (mutable)
 * @param effect - 적용할 effect
 */
const applyEffect = (vector: TraitVector, effect: TraitEffect): void => {
  const traits: TraitKey[] = [
    'cooperation',
    'exploration',
    'strategy',
    'leadership',
    'social',
  ];

  for (const trait of traits) {
    const effectValue = effect[trait];
    if (effectValue !== undefined) {
      vector[trait] += effectValue;
    }
  }
};

/**
 * 특정 질문의 답변이 특성에 미치는 영향 미리보기
 *
 * @param question - 질문
 * @param choiceValue - 선택지 값 (1~5)
 * @returns 해당 선택지의 effect
 *
 * @example
 * ```ts
 * const effect = previewQuestionEffect(question1, 5);
 * // { cooperation: 20, social: 10, leadership: 5 }
 * ```
 */
export const previewQuestionEffect = (
  question: QuestionWithEffect,
  choiceValue: number
): TraitEffect => {
  const choice = question.choices.find((c) => c.value === choiceValue);
  return choice?.effects ?? {};
};

/**
 * 현재까지 답변한 내용의 중간 결과 계산
 *
 * @param answers - 현재까지의 답변
 * @param questions - 질문 목록
 * @returns 현재까지의 특성 벡터
 *
 * 용도: 진행 중인 설문에서 중간 결과를 보여줄 때 사용
 */
export const calculateIntermediateScores = (
  answers: UserAnswers,
  questions: QuestionWithEffect[]
): TraitVector => {
  return calculateTraitScoresByEffect(answers, questions);
};

/**
 * Effect 총합 계산 (디버깅용)
 *
 * @param answers - 사용자 답변
 * @param questions - 질문 목록
 * @returns 각 특성별 총 effect 합계
 *
 * @example
 * ```ts
 * const totalEffects = calculateTotalEffects(answers, questions);
 * // {
 * //   cooperation: +35,  // 총 +35 effect 적용됨
 * //   exploration: -10,  // 총 -10 effect 적용됨
 * //   ...
 * // }
 * ```
 */
export const calculateTotalEffects = (
  answers: UserAnswers,
  questions: QuestionWithEffect[]
): TraitEffect => {
  const totalEffect: TraitEffect = {};

  for (const question of questions) {
    const choiceValue = answers[question.id];
    if (choiceValue === undefined) {
      continue;
    }

    const choice = question.choices.find((c) => c.value === choiceValue);
    if (!choice) {
      continue;
    }

    // Effect 누적
    for (const [trait, value] of Object.entries(choice.effects)) {
      totalEffect[trait as TraitKey] =
        (totalEffect[trait as TraitKey] ?? 0) + value;
    }
  }

  return totalEffect;
};

// ============================================
// 기존 인터페이스 호환 함수
// ============================================

/**
 * 사용자 답변을 기반으로 5가지 성향 점수를 계산 (기존 인터페이스 호환)
 *
 * @param answers - questionId를 key로 하는 답변 맵
 * @returns 0~100 사이로 정규화된 성향 점수
 *
 * @example
 * ```ts
 * const answers = {
 *   'Q1': 5,  // 매우 그렇다
 *   'Q2': 3,  // 보통이다
 *   // ...
 * };
 * const scores = calculateTraitScores(answers);
 * // { cooperation: 65, exploration: 50, ... }
 * ```
 *
 * 새로운 시스템:
 * - Effect 기반 점수 누적
 * - Radial Clipping 적용
 * - 유클리드 거리 기반 매칭
 */
export const calculateTraitScores = (
  answers: Record<string, AnswerType>
): TraitScores => {
  return calculateTraitScoresByEffect(answers, QUESTIONS_WITH_EFFECTS);
};
