'use client';

import React from 'react';
import styles from './styles.module.css';

export default function MemberList() {
  return (
    <div className={styles.container}>
      <div className={styles.mainArea}>
        <div className={styles.partyTitle}>party-title</div>
        <div className={styles.partyItemGroup}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={styles.partyItem}>
              party-item
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
