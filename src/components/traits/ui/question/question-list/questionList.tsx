'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface Answer {
  id: number;
  text: string;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

interface QuestionListProps {
  onAnswerSelect?: (answerId: number) => void;
  currentStep?: number;
  selectedAnswer?: number;
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

export default function QuestionList({
  onAnswerSelect,
  selectedAnswer,
  currentStep,
}: QuestionListProps) {
  const [currentQuestion] = QUESTIONS; // 현재는 첫 질문만
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
      <h2 className={styles.questionText}>{currentQuestion.question}</h2>

      {/* 답변 옵션들 */}
      <div className={styles.answersWrapper}>
        {currentQuestion.answers.map((answer) => {
          // 클릭한 답변이거나 이전에 선택된 답변이면 선택 상태로 표시
          const isSelected =
            clickedAnswer === answer.id || selectedAnswer === answer.id;
          return (
            <button
              key={answer.id}
              className={`${styles.answerButton} ${
                isSelected ? styles.answerButtonSelected : ''
              }`}
              onClick={() => handleAnswerSelect(answer.id)}
            >
              <div
                className={`${styles.answerNumber} ${
                  isSelected ? styles.answerNumberSelected : ''
                }`}
              >
                {answer.id}
              </div>
              <span
                className={`${styles.answerText} ${
                  isSelected ? styles.answerTextSelected : ''
                }`}
              >
                {answer.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

