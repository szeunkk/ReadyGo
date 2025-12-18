'use client';

import React from 'react';
import styles from './styles.module.css';

export default function Party() {
  return (
    <div className={styles.container}>
      <div className={styles.titleArea}>title-area</div>
      <div className={styles.contentWrapper}>
        <div className={styles.searchArea}>search-area</div>
        <div className={styles.mainArea}>main-area</div>
      </div>
    </div>
  );
}
