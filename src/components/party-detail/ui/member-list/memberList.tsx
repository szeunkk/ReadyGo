'use client';

import React from 'react';
import styles from './styles.module.css';
import MemberItem from '../member-item/memberItem';

export default function MemberList() {
  return (
    <div className={styles.container}>
      <div className={styles.mainArea}>
        <div className={styles.partyTitle}>
          파티원
          <div className={styles.memberCount}>
            <span className={styles.currentCount}>4</span>
            <span className={styles.maxCount}> / 8명</span>
          </div>
        </div>
        <div className={styles.partyItemGroup}>
          {Array.from({ length: 8 }).map((_, index) => (
            <MemberItem
              key={index}
              type={index === 0 ? 'leader' : index < 4 ? 'member' : 'empty'}
              name={
                index === 0
                  ? '까칠한까마귀'
                  : index < 4
                    ? '도라방돌핀'
                    : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
