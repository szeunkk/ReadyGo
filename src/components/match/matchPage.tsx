'use client';

import React from 'react';
import styles from './styles.module.css';
import MatchList from './ui/match-list/matchList';

export default function Match() {
  return (
    <div className={styles.container}>
      {/* 헤더 섹션 */}
      <div className={styles.header}>
        <h1 className={styles.title}>매칭 찾기</h1>
        <p className={styles.subtitle}>너랑 딱 맞는 게임 친구를 찾아봐</p>
      </div>

      {/* 매치 리스트 섹션 */}
      <div className={styles.content}>
        <MatchList />
      </div>
    </div>
  );
}
