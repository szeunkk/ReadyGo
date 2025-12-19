'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import MatchCard from '@/components/match/ui/match-card/matchCard';
import Selectbox, { SelectboxItem } from '@/commons/components/selectbox';
import Button from '@/commons/components/button';
import Icon from '@/commons/components/icon';

// 매치률 필터 옵션
const matchRateOptions: SelectboxItem[] = [
  { id: 'all', value: '전체' },
  { id: '50', value: '매칭률 50% 이상' },
  { id: '75', value: '매칭률 75% 이상' },
  { id: '90', value: '매칭률 90% 이상' },
];

// 온라인 상태 필터 옵션
const statusOptions: SelectboxItem[] = [
  { id: 'all', value: '전체' },
  { id: 'online', value: '온라인' },
  { id: 'away', value: '자리비움' },
  { id: 'offline', value: '오프라인' },
];

// 더미 매치 데이터
const matchData = [
  {
    id: 1,
    nickname: '까칠한까마귀',
    matchRate: 94,
    status: 'online' as const,
    tags: ['FPS 마스터', '새벽 플레이어', '협력 지향'],
  },
  {
    id: 2,
    nickname: '기분좋은곰',
    matchRate: 94,
    status: 'online' as const,
    tags: ['FPS 마스터', '새벽 플레이어', '협력 지향'],
  },
  {
    id: 3,
    nickname: '상쾌한고양이',
    matchRate: 94,
    status: 'online' as const,
    tags: ['FPS 마스터', '새벽 플레이어', '협력 지향'],
  },
  {
    id: 4,
    nickname: '날뛰는기린',
    matchRate: 85,
    status: 'online' as const,
    tags: ['캐주얼 게임', '주말 플레이어', '소셜'],
  },
  {
    id: 5,
    nickname: '신비로운팬더',
    matchRate: 94,
    status: 'online' as const,
    tags: ['FPS 마스터', '새벽 플레이어', '협력 지향'],
  },
  {
    id: 6,
    nickname: '친절한사자',
    matchRate: 88,
    status: 'online' as const,
    tags: ['RPG 마니아', '저녁 플레이어', '전략적'],
  },
  {
    id: 7,
    nickname: '날뛰는기린',
    matchRate: 85,
    status: 'online' as const,
    tags: ['캐주얼 게임', '주말 플레이어', '소셜'],
  },
  {
    id: 8,
    nickname: '날뛰는기린',
    matchRate: 85,
    status: 'online' as const,
    tags: ['캐주얼 게임', '주말 플레이어', '소셜'],
  },
  {
    id: 9,
    nickname: '춤추는강아지',
    matchRate: 94,
    status: 'online' as const,
    tags: ['FPS 마스터', '새벽 플레이어', '협력 지향'],
  },
  {
    id: 10,
    nickname: '기분좋은곰',
    matchRate: 94,
    status: 'online' as const,
    tags: ['FPS 마스터', '새벽 플레이어', '협력 지향'],
  },
  {
    id: 11,
    nickname: '상쾌한고양이',
    matchRate: 94,
    status: 'online' as const,
    tags: ['FPS 마스터', '새벽 플레이어', '협력 지향'],
  },
  {
    id: 12,
    nickname: '친절한사자',
    matchRate: 88,
    status: 'online' as const,
    tags: ['RPG 마니아', '저녁 플레이어', '전략적'],
  },
];

export default function Match() {
  const [selectedMatchRate, setSelectedMatchRate] = useState<string>('75');
  const [selectedStatus, setSelectedStatus] = useState<string>('online');

  const handleMatchRateChange = (item: SelectboxItem) => {
    setSelectedMatchRate(item.id);
  };

  const handleStatusChange = (item: SelectboxItem) => {
    setSelectedStatus(item.id);
  };

  const handleRefresh = () => {
    console.log('목록 갱신');
    // TODO: 실제 데이터 갱신 로직 구현
  };

  const handleProfileClick = (id: number) => {
    console.log('프로필 보기:', id);
    // TODO: 프로필 페이지 이동 로직 구현
  };

  return (
    <div className={styles.container}>
      {/* 필터 섹션 */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <Selectbox
            items={matchRateOptions}
            selectedId={selectedMatchRate}
            onSelect={handleMatchRateChange}
            placeholder="매칭률 75% 이상"
            className={styles.selectbox}
          />
          <Selectbox
            items={statusOptions}
            selectedId={selectedStatus}
            onSelect={handleStatusChange}
            placeholder="온라인"
            className={styles.selectbox}
          />
        </div>
        <Button
          variant="primary"
          size="m"
          shape="rectangle"
          className={styles.refreshButton}
          onClick={handleRefresh}
        >
          <Icon name="refresh" size={20} />
          <span>목록갱신</span>
        </Button>
      </div>

      {/* 매치 카드 그리드 */}
      <div className={styles.grid}>
        {matchData.map((match) => (
          <MatchCard
            key={match.id}
            nickname={match.nickname}
            matchRate={match.matchRate}
            status={match.status}
            tags={match.tags}
            onProfileClick={() => handleProfileClick(match.id)}
          />
        ))}
      </div>
    </div>
  );
}
