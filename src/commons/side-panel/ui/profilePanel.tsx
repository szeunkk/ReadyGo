'use client';

import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import AnimalCard from '../../components/animal-card';
import RadarChart, { RadarChartData } from '../../components/radar-chart';
import BarChart, { BarChartDataItem } from '../../components/bar-chart';
import Button from '../../components/button';
import { AnimalType } from '../../constants/animal';
import { TierType } from '../../constants/tierType.enum';

export interface ProfilePanelProps {
  userId: string;
  className?: string;
}

// TODO: 실제 API 호출로 대체 필요
interface UserProfileData {
  nickname: string;
  tier: TierType;
  animal: AnimalType;
  favoriteGenre: string;
  activeTime: string;
  gameStyle: string;
  weeklyAverage: string;
  matchPercentage: number;
  matchReasons: string[];
  playStyleData: RadarChartData[];
  recentPlayPattern: BarChartDataItem[];
}

export default function ProfilePanel({
  userId,
  className = '',
}: ProfilePanelProps) {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: userId를 사용하여 실제 사용자 데이터 페칭
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // 임시 데이터 (실제로는 API 호출)
        const mockData: UserProfileData = {
          nickname: '까칠한까마귀',
          tier: TierType.platinum,
          animal: AnimalType.raven,
          favoriteGenre: 'FPS',
          activeTime: '20 - 24시',
          gameStyle: '전략적',
          weeklyAverage: '5.4 시간',
          matchPercentage: 94,
          matchReasons: ['동일 게임 선호', '유사한 플레이 시간대'],
          playStyleData: [
            { trait: 'leadership', value: 75 },
            { trait: 'cooperation', value: 85 },
            { trait: 'strategy', value: 90 },
            { trait: 'exploration', value: 60 },
            { trait: 'social', value: 70 },
          ],
          recentPlayPattern: [
            { label: 'FPS', value: 23.6, color: 'var(--color-bg-brand)' },
            {
              label: '생존',
              value: 12.5,
              color: 'var(--color-icon-interactive-primary-hover)',
            },
            { label: '모험', value: 7.2, color: 'var(--color-text-info-bold)' },
            { label: '캐주얼', value: 3.8, color: 'var(--color-icon-info)' },
          ],
        };

        // API 호출 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProfileData(mockData);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleChatClick = () => {
    // TODO: 채팅 시작 로직 구현
    console.log('채팅 시작:', userId);
  };

  if (isLoading) {
    return (
      <div className={`${styles.profilePanel} ${className}`}>
        <div className={styles.loading}>프로필 로딩 중...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className={`${styles.profilePanel} ${className}`}>
        <div className={styles.error}>프로필을 불러올 수 없습니다.</div>
      </div>
    );
  }

  const {
    nickname,
    tier,
    animal,
    favoriteGenre,
    activeTime,
    gameStyle,
    weeklyAverage,
    matchPercentage,
    matchReasons,
    playStyleData,
    recentPlayPattern,
  } = profileData;
  const containerClasses = [styles.profilePanel, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {/* Animal Card - 사용자 프로필 */}
      <AnimalCard
        property="user"
        nickname={nickname}
        tier={tier}
        animal={animal}
        favoriteGenre={favoriteGenre}
        activeTime={activeTime}
        gameStyle={gameStyle}
        weeklyAverage={weeklyAverage}
        matchPercentage={matchPercentage}
        matchReasons={matchReasons}
      />

      {/* 플레이스타일 섹션 */}
      <div className={styles.playStyleSection}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>플레이스타일</h4>
        </div>
        <div className={styles.radarChartWrapper}>
          <RadarChart myData={playStyleData} size="m" showLabels={true} />
        </div>
      </div>

      {/* 최근 플레이 패턴 섹션 */}
      <div className={styles.playPatternSection}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>최근 플레이 패턴</h4>
        </div>
        <div className={styles.barChartWrapper}>
          <BarChart data={recentPlayPattern} size="s" showValues={true} />
        </div>
      </div>

      {/* 채팅 하기 버튼 */}
      <Button
        variant="primary"
        size="m"
        shape="round"
        className={styles.chatButton}
        onClick={handleChatClick}
      >
        채팅 하기
      </Button>
    </div>
  );
}
