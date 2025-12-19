'use client';

import React from 'react';
import Question from './ui/question/question';
import styles from './styles.module.css';

export default function TraitsPage() {
  return (
    <div className={styles.page}>
      <Question />
    </div>
  );
}

