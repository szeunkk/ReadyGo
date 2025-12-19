'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import Button from '@/commons/components/button';
import Icon from '@/commons/components/icon';
import Image from 'next/image';

interface Answer {
  id: number;
  text: string;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

// 임시 질문 데이터 (실제로는 props나 API에서 받아올 것)
const QUESTIONS: Question[] = [
  {
    id: 1,
    question: '게임할 때 더 편한 방식은?',
    answers: [
      { id: 1, text: '완전 혼자서 플레이하는 걸 선호함' },
      { id: 2, text: '혼자 플레이가 편하지만 파티도 가끔 함' },
      { id: 3, text: '둘 다 상관없음' },
      { id: 4, text: '팀 플레이가 더 즐거움' },
      { id: 5, text: '팀원과 협력하는 플레이가 핵심이라고 생각함' },
    ],
  },
  // 추가 질문들은 나중에 채워넣을 것
];

export default function QuestionList() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});

  const totalSteps = 10;
  const [currentQuestion] = QUESTIONS; // 현재는 첫 질문만

  const handleAnswerSelect = (answerId: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentStep]: answerId,
    });

    // 자동으로 다음 단계로
    if (currentStep < totalSteps) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBack = () => {
    // 뒤로가기 로직 (실제 구현 시 router.back() 등 사용)
  };

  const progressPercentage = Math.round((currentStep / totalSteps) * 100);
  const progressWidth = (currentStep / totalSteps) * 100;

  // 팩맨 위치 계산 (0-9 사이)
  const pacmanPosition = currentStep - 1;

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
        <div className={styles.questionBody}>
          <h2 className={styles.questionText}>{currentQuestion.question}</h2>

          {/* 답변 옵션들 */}
          <div className={styles.answersWrapper}>
            {currentQuestion.answers.map((answer) => (
              <button
                key={answer.id}
                className={styles.answerButton}
                onClick={() => handleAnswerSelect(answer.id)}
              >
                <div className={styles.answerNumber}>{answer.id}</div>
                <span className={styles.answerText}>{answer.text}</span>
              </button>
            ))}
          </div>
        </div>

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
          onClick={handlePrevious}
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
