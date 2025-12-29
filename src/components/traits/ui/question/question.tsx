'use client';

import React, { useRef } from 'react';
import styles from './styles.module.css';
import Button from '@/commons/components/button';
import Icon from '@/commons/components/icon';
import Image from 'next/image';
import QuestionList from './question-list/questionList';
import QuestionSchedule from './question-schedule/questionSchedule';
import { useTraitSurvey, type AnswerType, type TraitSubmitPayload } from '../../hooks';

interface QuestionProps {
  onComplete?: (payload: TraitSubmitPayload) => void;
}

// 팩맨 애니메이션 상수
const PACMAN_STEP_WIDTH = 21; // px per step

export default function Question({ onComplete }: QuestionProps) {
  // 중복 호출 방지 플래그
  const isCompletedRef = useRef(false);

  // 완료 콜백 래퍼 (중복 호출 방지)
  const handleComplete = (payload: TraitSubmitPayload) => {
    if (isCompletedRef.current) {
      return; // 이미 호출되었으면 무시
    }
    isCompletedRef.current = true;
    onComplete?.(payload);
  };

  // 통합 훅 사용
  const {
    currentQuestion,
    currentIndex,
    totalSteps,
    progressPercentage,
    isScheduleQuestion,
    selectedAnswer,
    selectAnswer,
    prev,
  } = useTraitSurvey(handleComplete);

  // 현재 단계 (1부터 시작)
  const currentStep = currentIndex + 1;

  const handleBack = () => {
    // 뒤로가기 로직 (실제 구현 시 router.back() 등 사용)
  };

  const handleAnswerSelect = (answer: AnswerType) => {
    // 답변 선택 및 다음 단계로 자동 이동
    selectAnswer(answer);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <Icon name="arrow-left" size={24} />
          <span className={styles.backText}>돌아가기</span>
        </button>

        <div className={styles.titleSection}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>게임 성향 분석 테스트</h1>
            <p className={styles.stepCounter} data-testid="survey-step-counter">
              {currentStep} / {totalSteps}
            </p>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>진행률</span>
              <span
                className={styles.progressPercentage}
                data-testid="survey-progress"
              >
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className={styles.progressBarWrapper}>
              <div
                className={styles.progressBar}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 질문 카드 */}
      <div className={styles.questionCard}>
        {/* 질문 카드 헤더 */}
        <div className={styles.questionCardHeader}>
          <div className={styles.statusDots}>
            <div className={styles.dotDark} />
            <div className={styles.dotMedium} />
            <div className={styles.dotLight} />
          </div>
          <span
            className={styles.questionNumber}
            data-testid="survey-question-number"
          >
            Q{String(currentStep).padStart(2, '0')}
          </span>
        </div>

        {/* 질문 본문 */}
        <div
          data-testid={`survey-question-${currentQuestion?.id || 'unknown'}`}
        >
          {isScheduleQuestion ? (
            <QuestionSchedule
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={
                selectedAnswer as
                  | { dayTypes: string[]; timeSlots: string[] }
                  | undefined
              }
            />
          ) : currentQuestion && 'choices' in currentQuestion ? (
            <QuestionList
              questionId={currentQuestion.id}
              questionText={currentQuestion.text}
              choices={currentQuestion.choices}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={selectedAnswer as number | undefined}
            />
          ) : null}
        </div>

        {/* 질문 카드 푸터 (팩맨 진행률) */}
        <div className={styles.questionCardFooter}>
          <div className={styles.pacmanProgress}>
            <div
              className={styles.pacmanIcon}
              style={{
                transform: `translateX(${currentIndex * PACMAN_STEP_WIDTH}px)`,
              }}
            >
              <Image
                src="/icons/pacman.svg"
                alt="pacman"
                width={16}
                height={16}
              />
            </div>
            <div className={styles.dotsWrapper}>
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`${styles.progressDot} ${
                    index < currentIndex ? styles.progressDotEaten : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className={styles.footer}>
        <Button
          variant="outline"
          size="m"
          shape="rectangle"
          onClick={prev}
          disabled={currentIndex === 0}
          data-testid="survey-prev-button"
        >
          <Icon name="chevron-left" size={20} />
          이전
        </Button>
        <p className={styles.footerHint}>답변을 선택하면 자동으로 넘어갑니다</p>
      </div>
    </div>
  );
}
