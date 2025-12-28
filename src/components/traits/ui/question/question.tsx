'use client';

import React from 'react';
import styles from './styles.module.css';
import Button from '@/commons/components/button';
import Icon from '@/commons/components/icon';
import Image from 'next/image';
import QuestionList from './question-list/questionList';
import QuestionSchedule from './question-schedule/questionSchedule';
import { useTraitTest, useTraitAnswers, type AnswerType } from '../../hooks';

interface QuestionProps {
  onComplete?: () => void;
}

export default function Question({ onComplete }: QuestionProps) {
  // 테스트 흐름 관리
  const {
    currentStep,
    totalSteps,
    isLastStep,
    progressPercentage,
    progressWidth,
    pacmanPosition,
    goToPrevious,
    goToNext,
  } = useTraitTest();

  // 답변 상태 관리
  const { saveAnswer, getAnswer } = useTraitAnswers();

  const handleBack = () => {
    // 뒤로가기 로직 (실제 구현 시 router.back() 등 사용)
  };

  const handleAnswerSelect = (answer: AnswerType) => {
    // 선택된 답변 저장
    saveAnswer(currentStep, answer);

    // 다음 단계로 이동
    if (isLastStep) {
      // 마지막 질문 완료 - 분석 로딩 화면 표시
      if (onComplete) {
        onComplete();
      }
    } else {
      goToNext();
    }
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
            <p className={styles.stepCounter}>
              {currentStep} / {totalSteps}
            </p>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>진행률</span>
              <span className={styles.progressPercentage}>
                {progressPercentage}%
              </span>
            </div>
            <div className={styles.progressBarWrapper}>
              <div
                className={styles.progressBar}
                style={{ width: `${progressWidth}%` }}
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
          <span className={styles.questionNumber}>
            Q{String(currentStep).padStart(2, '0')}
          </span>
        </div>

        {/* 질문 본문 */}
        {currentStep === 11 ? (
          <QuestionSchedule
            onAnswerSelect={handleAnswerSelect}
            currentStep={currentStep}
            selectedAnswer={
              getAnswer(currentStep) as
                | { dayTypes: string[]; timeSlots: string[] }
                | undefined
            }
          />
        ) : (
          <QuestionList
            onAnswerSelect={handleAnswerSelect}
            currentStep={currentStep}
            selectedAnswer={getAnswer(currentStep) as number | undefined}
          />
        )}

        {/* 질문 카드 푸터 (팩맨 진행률) */}
        <div className={styles.questionCardFooter}>
          <div className={styles.pacmanProgress}>
            <div
              className={styles.pacmanIcon}
              style={{
                transform: `translateX(${pacmanPosition * 21}px)`,
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
                    index < pacmanPosition ? styles.progressDotEaten : ''
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
          onClick={goToPrevious}
          disabled={currentStep === 1}
        >
          <Icon name="chevron-left" size={20} />
          이전
        </Button>
        <p className={styles.footerHint}>답변을 선택하면 자동으로 넘어갑니다</p>
      </div>
    </div>
  );
}
