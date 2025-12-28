'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface QuestionChoice {
  value: number;
  label: string;
}

interface QuestionListProps {
  questionId: string;
  questionText: string;
  choices: QuestionChoice[];
  selectedAnswer?: number;
  onAnswerSelect?: (answer: number) => void;
}

export default function QuestionList({
  questionId,
  questionText,
  choices,
  selectedAnswer,
  onAnswerSelect,
}: QuestionListProps) {
  const [clickedAnswer, setClickedAnswer] = useState<number | null>(null);

  // 질문이 바뀌면 클릭 상태 초기화
  useEffect(() => {
    setClickedAnswer(null);
  }, [questionId]);

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
      <h2 className={styles.questionText}>{questionText}</h2>

      <div className={styles.answersWrapper}>
        {choices.map((choice) => {
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
