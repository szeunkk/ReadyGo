'use client';

import React from 'react';
import Question from './ui/question/question';
import QuestionList from './ui/question/question-list/questionList';
import styles from './styles.module.css';

export default function TraitsPage() {
  return (
    <div className={styles.page}>
      <Question>
        <QuestionList />
      </Question>
    </div>
  );
}

