'use client';

import React, { useState, useEffect } from 'react';
import type { TraitKey } from '@/commons/constants/animal/trait.enum';
import styles from './styles.module.css';

interface QuestionChoice {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
}

interface Question {
  id: string;
  axis: TraitKey;
  weight: number;
  text: string;
  choices: QuestionChoice[];
}

interface QuestionListProps {
  onAnswerSelect?: (answer: number) => void;
  currentStep?: number;
  selectedAnswer?: number;
}

// TODO: hooks를 통해 questions를 import할 예정
const QUESTIONS: Question[] = [];

export default function QuestionList({
  onAnswerSelect,
  selectedAnswer,
  currentStep,
}: QuestionListProps) {
  const [currentQuestion] = QUESTIONS; // TODO: hooks에서 가져온 questions 사용
  const [clickedAnswer, setClickedAnswer] = useState<number | null>(null);

  // 질문이 바뀌면 클릭 상태 초기화
  useEffect(() => {
    setClickedAnswer(null);
  }, [currentStep]);

  const handleAnswerSelect = (answerId: number) => {
    // 클릭하는 즉시 로컬 상태 업데이트 (선택 효과 표시)
    setClickedAnswer(answerId);

    if (onAnswerSelect) {
      // 300ms 후에 부모로 전달하여 다음 단계로 이동
      setTimeout(() => {
        onAnswerSelect(answerId);
      }, 300);
    }
  };

  return (
    <div className={styles.questionBody}>
      <h2 className={styles.questionText}>{currentQuestion?.text}</h2>

      {/* 답변 옵션들 */}
      <div className={styles.answersWrapper}>
        {currentQuestion?.choices.map((choice) => {
          // 클릭한 답변이거나 이전에 선택된 답변이면 선택 상태로 표시
          const isSelected =
            clickedAnswer === choice.value || selectedAnswer === choice.value;
          return (
            <button
              key={choice.value}
              className={`${styles.answerButton} ${
                isSelected ? styles.answerButtonSelected : ''
              }`}
              onClick={() => handleAnswerSelect(choice.value)}
            >
              <div
                className={`${styles.answerNumber} ${
                  isSelected ? styles.answerNumberSelected : ''
                }`}
              >
                {choice.value}
              </div>
              <span
                className={`${styles.answerText} ${
                  isSelected ? styles.answerTextSelected : ''
                }`}
              >
                {choice.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
