import { useTraitTest } from './useTraitTest';
import { useTraitAnswers } from './useTraitAnswers';
import { useTraitResult } from './useTraitResult';
import type { AnswerType } from './useTraitAnswers';

/**
 * 성향 테스트 통합 관리 Hook
 * - 질문 흐름 관리
 * - 답변 상태 관리
 * - 결과 계산
 * - 테스트 완료 시 콜백 실행
 *
 * @param onComplete - 테스트 완료 시 실행될 콜백 함수
 */
export const useTraitSurvey = (onComplete?: () => void) => {
  // 질문 흐름 관리
  const {
    currentQuestion,
    currentIndex,
    totalSteps,
    isFinished,
    isScheduleQuestion,
    next,
    prev,
    reset: resetTest,
  } = useTraitTest();

  // 답변 상태 관리
  const { answers, saveAnswer, getAnswer, resetAnswers } = useTraitAnswers();

  // 결과 계산
  const { traitScores, animalType } = useTraitResult(answers);

  /**
   * 답변 선택 및 다음 단계 이동
   */
  const selectAnswer = (answer: AnswerType) => {
    if (!currentQuestion) {
      return;
    }

    saveAnswer(currentQuestion.id, answer);

    // 마지막 질문이 아닌 경우에만 다음으로 이동
    if (!isFinished) {
      next();
    } else {
      // 마지막 질문인 경우 완료 콜백 실행
      onComplete?.();
    }
  };

  /**
   * 전체 테스트 초기화 (질문 + 답변)
   */
  const reset = () => {
    resetTest();
    resetAnswers();
  };

  /**
   * 진행률 (퍼센트, 0-100)
   */
  const progressPercentage = (currentIndex / totalSteps) * 100;

  /**
   * 현재 질문에 대한 선택된 답변
   */
  const selectedAnswer = currentQuestion
    ? getAnswer(currentQuestion.id)
    : undefined;

  return {
    // 상태
    currentQuestion,
    currentIndex,
    totalSteps,
    progressPercentage,
    isFinished,
    isScheduleQuestion,

    // 답변
    selectedAnswer,
    answers,

    // 액션
    selectAnswer,
    prev,
    reset,

    // 결과
    traitScores,
    animalType,
  };
};
