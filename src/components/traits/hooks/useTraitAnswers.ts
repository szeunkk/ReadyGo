import { useState } from 'react';

/**
 * 답변 타입
 * - number: 일반 선택형 질문의 답변 (1~5)
 * - schedule: 스케줄 질문의 답변
 */
export type ScheduleAnswer = {
  dayTypes: string[];
  timeSlots: string[];
};

export type AnswerType = number | ScheduleAnswer;

/**
 * questionId 기준 답변 맵
 */
export type TraitAnswers = Record<string, AnswerType>;

/**
 * 성향 설문 답변 상태 관리 Hook
 * - 질문 ID 기준으로 답변 저장
 * - UI(step)와 완전히 분리
 */
export const useTraitAnswers = () => {
  const [answers, setAnswers] = useState<TraitAnswers>({});

  /**
   * 특정 질문의 답변 저장
   */
  const saveAnswer = (questionId: string, answer: AnswerType) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  /**
   * 특정 질문의 답변 조회
   */
  const getAnswer = (questionId: string): AnswerType | undefined => {
    return answers[questionId];
  };

  /**
   * 특정 질문 답변 제거 (선택)
   */
  const removeAnswer = (questionId: string) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  /**
   * 전체 답변 초기화
   */
  const resetAnswers = () => {
    setAnswers({});
  };

  return {
    answers, // 전체 답변 맵
    saveAnswer, // answer(questionId, value)
    getAnswer, // getAnswer(questionId)
    removeAnswer, // optional
    resetAnswers,
  };
};
