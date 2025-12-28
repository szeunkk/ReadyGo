import { useState, useMemo } from 'react';
import { QUESTIONS } from '../data/questions';

/**
 * 전체 테스트 흐름 관리 Hook
 * - 질문 진행 상태 (currentStep)
 * - 페이지 이동 (다음/이전)
 * - 완료 판단
 * - 진행률 계산
 */
export function useTraitTest() {
  const [currentStep, setCurrentStep] = useState(1);

  // 총 단계 수: 질문 10개 + 스케줄 질문 1개 = 11개
  const totalSteps = useMemo(() => QUESTIONS.length + 1, []);

  /**
   * 이전 단계로 이동
   */
  const goToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /**
   * 다음 단계로 이동
   */
  const goToNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  /**
   * 특정 단계로 이동
   */
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  /**
   * 테스트 완료 여부
   */
  const isCompleted = currentStep > totalSteps;

  /**
   * 마지막 질문 여부
   */
  const isLastStep = currentStep === totalSteps;

  /**
   * 첫 번째 질문 여부
   */
  const isFirstStep = currentStep === 1;

  /**
   * 진행률 계산 (퍼센트)
   */
  const progressPercentage = useMemo(() => {
    return Math.round(((currentStep - 1) / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  /**
   * 진행률 계산 (0-100 사이의 실수)
   */
  const progressWidth = useMemo(() => {
    return ((currentStep - 1) / totalSteps) * 100;
  }, [currentStep, totalSteps]);

  /**
   * 팩맨 위치 (0부터 시작)
   */
  const pacmanPosition = currentStep - 1;

  /**
   * 테스트 초기화
   */
  const resetTest = () => {
    setCurrentStep(1);
  };

  return {
    // 상태
    currentStep,
    totalSteps,
    isCompleted,
    isLastStep,
    isFirstStep,

    // 진행률
    progressPercentage,
    progressWidth,
    pacmanPosition,

    // 액션
    goToPrevious,
    goToNext,
    goToStep,
    resetTest,
  };
}
