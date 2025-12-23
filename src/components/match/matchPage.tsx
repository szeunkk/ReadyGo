'use client';

import React from 'react';
import styles from './styles.module.css';
import { MatchList } from './ui';
import { useMatchFilters } from './hooks/useMatchFilters';
import { useSidePanelStore } from '@/stores/sidePanel.store';
import { matchData } from './constants/mockData';

export default function Match() {
  // 필터 상태 관리
  const {
    selectedMatchRate,
    selectedStatus,
    handleMatchRateChange,
    handleStatusChange,
    handleRefresh,
  } = useMatchFilters();

  // side-panel 상태 관리
  const { isOpen, targetUserId, open, close } = useSidePanelStore();

  // 프로필 클릭 핸들러
  const handleProfileClick = (userId: string) => {
    if (isOpen && targetUserId === userId) {
      close();
    } else {
      open(userId);
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 섹션 */}
      <div className={styles.header}>
        <h1 className={styles.title}>매칭 찾기</h1>
        <p className={styles.subtitle}>너랑 딱 맞는 게임 친구를 찾아봐</p>
      </div>

      {/* 매치 리스트 섹션 */}
      <div className={styles.content}>
        <MatchList
          matches={matchData}
          selectedMatchRate={selectedMatchRate}
          selectedStatus={selectedStatus}
          isSidePanelOpen={isOpen}
          activeProfileUserId={targetUserId}
          onMatchRateChange={handleMatchRateChange}
          onStatusChange={handleStatusChange}
          onRefresh={handleRefresh}
          onProfileClick={handleProfileClick}
        />
      </div>
    </div>
  );
}
