'use client';

import React from 'react';
import QuestionList from './ui/question-list/questionList';
import styles from './styles.module.css';

export default function TraitsPage() {
  return (
    <div className={styles.page}>
      <QuestionList />
    </div>
  );
}

