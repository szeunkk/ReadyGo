'use client';

import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { MatchList } from './ui';
import { useMatchFilters } from './hooks/useMatchFilters';
import { useSidePanelStore } from '@/stores/sidePanel.store';
import { useAuthStore } from '@/stores/auth.store';
import { useMatchResults } from '@/hooks/useMatchResults';
import { MatchData } from './types/match.types';

interface MatchResultWithProfile {
  targetUserId: string;
  finalScore: number;
  isOnlineMatched: boolean;
  availabilityHint: 'online' | 'offline' | 'unknown';
  profile?: {
    nickname: string;
    avatarUrl?: string;
    animalType?: string;
  };
  status?: 'online' | 'offline';
}

export default function Match() {
  // 현재 로그인한 사용자 정보
  const { user } = useAuthStore();
  const viewerId = user?.id;

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

  // 매칭 결과 가져오기 (전체)
  const { results, loading, error, refetch } = useMatchResults(viewerId || '', {
    sortBy: 'score',
  });

  // 매칭 결과를 MatchData 형식으로 변환
  const [matchData, setMatchData] = useState<MatchData[]>([]);

  useEffect(() => {
    if (!results.length) {
      setMatchData([]);
      return;
    }

    // API에서 이미 프로필과 상태 정보가 포함되어 있으므로 바로 변환
    const matchDataArray: MatchData[] = results.map((result, index) => {
      const enrichedResult = result as MatchResultWithProfile;
      return {
        id: index + 1,
        userId: result.targetUserId,
        nickname: enrichedResult.profile?.nickname || '알 수 없음',
        matchRate: Math.round(result.finalScore),
        status: enrichedResult.status || 'offline',
        avatarUrl: enrichedResult.profile?.avatarUrl,
        tags: [], // TODO: 나중에 user traits에서 가져오기
      };
    });

    setMatchData(matchDataArray);
  }, [results]);

  // 프로필 클릭 핸들러
  const handleProfileClick = (userId: string) => {
    if (isOpen && targetUserId === userId) {
      close();
    } else {
      open(userId);
    }
  };

  // 갱신 핸들러 (useMatchFilters의 handleRefresh + useMatchResults의 refetch 결합)
  const handleRefreshWithData = () => {
    handleRefresh();
    refetch();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 헤더 섹션 */}
        <div className={styles.header}>
          <h1 className={styles.title}>매칭 찾기</h1>
          <p className={styles.subtitle}>너랑 딱 맞는 게임 친구를 찾아봐</p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className={styles.loading}>매칭 결과를 불러오는 중...</div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className={styles.error}>
            매칭 결과를 불러오는 데 실패했습니다: {error.message}
          </div>
        )}

        {/* 매치 리스트 섹션 */}
        {!loading && !error && (
          <MatchList
            matches={matchData}
            selectedMatchRate={selectedMatchRate}
            selectedStatus={selectedStatus}
            isSidePanelOpen={isOpen}
            activeProfileUserId={targetUserId}
            onMatchRateChange={handleMatchRateChange}
            onStatusChange={handleStatusChange}
            onRefresh={handleRefreshWithData}
            onProfileClick={handleProfileClick}
          />
        )}
      </div>
    </div>
  );
}
