import { useState } from 'react';
import { QUESTIONS } from '@/components/traits/data/questions';
import { SCHEDULE_QUESTION } from '@/components/traits/data/questionSchedule';

/**
 * 배열을 랜덤하게 섞는 함수
 */
const shuffle = <T,>(arr: T[]): T[] => {
  return [...arr].sort(() => Math.random() - 0.5);
};

/**
 * 전체 테스트 흐름 관리 Hook
 * - 질문 랜덤 섞기 (스케줄 질문은 마지막에 고정)
 * - 현재 인덱스 관리 (0-based)
 * - 페이지 이동 (다음/이전)
 * - 완료 판단
 */
export const useTraitTest = () => {
  // 일반 질문들을 섞고, 스케줄 질문을 마지막에 고정
  const [questions] = useState(() => {
    return [...shuffle(QUESTIONS), SCHEDULE_QUESTION];
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  // 현재 질문
  const currentQuestion = questions[currentIndex];

  // 총 단계 수
  const totalSteps = questions.length;

  // 테스트 완료 여부
  const isFinished = currentIndex === totalSteps - 1;

  // 스케줄 질문 판별 헬퍼
  const isScheduleQuestion = currentQuestion?.id === SCHEDULE_QUESTION.id;

  /**
   * 다음 단계로 이동
   */
  const next = () => {
    setCurrentIndex((i) => Math.min(i + 1, totalSteps));
  };

  /**
   * 이전 단계로 이동
   */
  const prev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  /**
   * 테스트 초기화
   */
  const reset = () => {
    setCurrentIndex(0);
  };

  return {
    currentQuestion,
    isScheduleQuestion,
    currentIndex,
    totalSteps,
    isFinished,
    next,
    prev,
    reset,
  };
};
