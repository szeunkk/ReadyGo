'use client';

import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import AnimalCard from '../../components/animal-card';
import RadarChart, { RadarChartData } from '../../components/radar-chart';
import BarChart, { BarChartDataItem } from '../../components/bar-chart';
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
  myPlayStyleData: RadarChartData[]; // 내 플레이스타일 데이터
  userPlayStyleData?: RadarChartData[]; // 상대방 플레이스타일 데이터 (optional)
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
        // userId별 Mock 데이터 매핑 (테스트용)
        const mockDataMap: Record<string, UserProfileData> = {
          'user-1': {
            nickname: '게이머호랑이',
            tier: TierType.diamond,
            animal: AnimalType.tiger,
            favoriteGenre: 'FPS',
            activeTime: '18 - 22시',
            gameStyle: '공격적',
            weeklyAverage: '12.3 시간',
            matchPercentage: 94,
            matchReasons: [
              '동일 게임 선호',
              '유사한 플레이 시간대',
              '비슷한 실력대',
            ],
            myPlayStyleData: [
              { trait: 'leadership', value: 85 },
              { trait: 'cooperation', value: 75 },
              { trait: 'strategy', value: 80 },
              { trait: 'exploration', value: 70 },
              { trait: 'social', value: 60 },
            ],
            userPlayStyleData: [
              { trait: 'leadership', value: 90 },
              { trait: 'cooperation', value: 70 },
              { trait: 'strategy', value: 85 },
              { trait: 'exploration', value: 75 },
              { trait: 'social', value: 65 },
            ],
            recentPlayPattern: [
              { label: 'FPS', value: 35.2, color: 'var(--color-bg-brand)' },
              {
                label: '전략',
                value: 8.5,
                color: 'var(--color-icon-interactive-primary-hover)',
              },
              {
                label: 'RPG',
                value: 5.3,
                color: 'var(--color-text-info-bold)',
              },
              { label: '생존', value: 2.1, color: 'var(--color-icon-info)' },
            ],
          },
          'user-2': {
            nickname: '호쾌한망토',
            tier: TierType.gold,
            animal: AnimalType.fox,
            favoriteGenre: 'RPG',
            activeTime: '22 - 02시',
            gameStyle: '탐험 지향',
            weeklyAverage: '8.7 시간',
            matchPercentage: 87,
            matchReasons: ['유사한 플레이 시간대', '같은 장르 선호'],
            myPlayStyleData: [
              { trait: 'leadership', value: 65 },
              { trait: 'cooperation', value: 75 },
              { trait: 'strategy', value: 75 },
              { trait: 'exploration', value: 85 },
              { trait: 'social', value: 80 },
            ],
            userPlayStyleData: [
              { trait: 'leadership', value: 60 },
              { trait: 'cooperation', value: 80 },
              { trait: 'strategy', value: 70 },
              { trait: 'exploration', value: 95 },
              { trait: 'social', value: 85 },
            ],
            recentPlayPattern: [
              { label: 'RPG', value: 28.4, color: 'var(--color-bg-brand)' },
              {
                label: '모험',
                value: 15.6,
                color: 'var(--color-icon-interactive-primary-hover)',
              },
              {
                label: '캐주얼',
                value: 8.9,
                color: 'var(--color-text-info-bold)',
              },
              { label: 'FPS', value: 4.2, color: 'var(--color-icon-info)' },
            ],
          },
          'user-3': {
            nickname: '까칠한까마귀',
            tier: TierType.platinum,
            animal: AnimalType.raven,
            favoriteGenre: 'FPS',
            activeTime: '20 - 24시',
            gameStyle: '전략적',
            weeklyAverage: '5.4 시간',
            matchPercentage: 94,
            matchReasons: ['동일 게임 선호', '유사한 플레이 시간대'],
            myPlayStyleData: [
              { trait: 'leadership', value: 70 },
              { trait: 'cooperation', value: 80 },
              { trait: 'strategy', value: 85 },
              { trait: 'exploration', value: 65 },
              { trait: 'social', value: 75 },
            ],
            userPlayStyleData: [
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
              {
                label: '모험',
                value: 7.2,
                color: 'var(--color-text-info-bold)',
              },
              { label: '캐주얼', value: 3.8, color: 'var(--color-icon-info)' },
            ],
          },
        };

        // userId에 해당하는 Mock 데이터 가져오기, 없으면 기본 데이터 사용
        const mockData = mockDataMap[userId] ||
          mockDataMap['user-3'] || {
            // 기본값으로 user-3 데이터 사용
            nickname: '알 수 없는 사용자',
            tier: TierType.bronze,
            animal: AnimalType.rabbit,
            favoriteGenre: '알 수 없음',
            activeTime: '알 수 없음',
            gameStyle: '알 수 없음',
            weeklyAverage: '0 시간',
            matchPercentage: 0,
            matchReasons: [],
            myPlayStyleData: [
              { trait: 'leadership', value: 50 },
              { trait: 'cooperation', value: 50 },
              { trait: 'strategy', value: 50 },
              { trait: 'exploration', value: 50 },
              { trait: 'social', value: 50 },
            ],
            userPlayStyleData: [
              { trait: 'leadership', value: 50 },
              { trait: 'cooperation', value: 50 },
              { trait: 'strategy', value: 50 },
              { trait: 'exploration', value: 50 },
              { trait: 'social', value: 50 },
            ],
            recentPlayPattern: [],
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
    myPlayStyleData,
    userPlayStyleData,
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

      {/* 플레이스타일과 최근 플레이 패턴을 포함하는 통합 섹션 */}
      <div className={styles.statsContainer}>
        {/* 플레이스타일 섹션 */}
        <div className={styles.playStyleSection}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>플레이스타일</h4>
          </div>
          <div className={styles.radarChartWrapper}>
            <RadarChart
              myData={myPlayStyleData}
              userData={userPlayStyleData}
              size="m"
              showLabels={true}
            />
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
      </div>
    </div>
  );
}
