/**
 * 질문 Effect 시스템 타입 정의
 * 
 * 각 질문의 답변이 5가지 특성에 미치는 영향을 정의합니다.
 */

import type { TraitKey } from '@/commons/constants/animal/trait.enum';

/**
 * 특성별 효과값
 * 
 * - 양수: 해당 특성 증가
 * - 음수: 해당 특성 감소
 * - 범위: 주 특성 -20~+20, 보조 특성 -10~+10
 */
export type TraitEffect = Partial<Record<TraitKey, number>>;

/**
 * 답변 선택지 (Effect 포함)
 */
export interface QuestionChoiceWithEffect {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
  effects: TraitEffect;
}

/**
 * 질문 (Effect 기반)
 */
export interface QuestionWithEffect {
  id: string;
  text: string;
  description?: string; // 선택적: 질문 설명
  choices: QuestionChoiceWithEffect[];
}

/**
 * 질문 세트
 */
export type QuestionSet = QuestionWithEffect[];

/**
 * Effect 예시
 * 
 * @example
 * ```ts
 * const questionExample: QuestionWithEffect = {
 *   id: 'Q1',
 *   text: '게임할 때 더 편한 방식은?',
 *   choices: [
 *     {
 *       value: 1,
 *       label: '완전 혼자서 플레이하는 걸 선호함',
 *       effects: {
 *         cooperation: -20,  // 협동성 크게 감소
 *         social: -10        // 사교성 감소
 *       }
 *     },
 *     {
 *       value: 3,
 *       label: '둘 다 상관없음',
 *       effects: {} // 중립
 *     },
 *     {
 *       value: 5,
 *       label: '팀원과 협력하는 플레이가 핵심',
 *       effects: {
 *         cooperation: 20,   // 협동성 크게 증가
 *         social: 10,        // 사교성 증가
 *         leadership: 5      // 보너스: 리더십 소폭 증가
 *       }
 *     }
 *   ]
 * };
 * ```
 */

