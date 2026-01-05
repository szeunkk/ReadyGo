'use client';

import React from 'react';
import styles from './styles.module.css';
import AnimalCard from '../../components/animal-card';
import RadarChart from '../../components/radar-chart';
import { useProfileByUserId } from '@/hooks/useProfileByUserId';
import { useAuthStore } from '@/stores/auth.store';
import { AnimalType } from '../../constants/animal';

export interface ProfilePanelProps {
  userId: string;
  className?: string;
}

export default function ProfilePanel({
  userId,
  className = '',
}: ProfilePanelProps) {
  // 쿠키에서 내 userId 가져오기
  const myUserId = useAuthStore((state) => state.user?.id);

  // 내 프로필 가져오기 (비교용)
  const { viewModel: myProfile } = useProfileByUserId(myUserId);

  // 상대방 프로필 가져오기
  const { loading, viewModel, error, empty } = useProfileByUserId(userId);

  const containerClasses = [styles.profilePanel, className]
    .filter(Boolean)
    .join(' ');

  // Loading 상태 (상대방 프로필 로딩 중)
  // 내 프로필은 로딩 중이어도 상대방 프로필만 먼저 표시 가능
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className={styles.loading}>프로필 로딩 중...</div>
      </div>
    );
  }

  // Empty 상태 (userId가 없음)
  if (empty) {
    return (
      <div className={containerClasses}>
        <div className={styles.error}>사용자 정보가 없습니다.</div>
      </div>
    );
  }

  // Error 상태 처리
  if (error) {
    // 401: Unauthorized
    if (error.status === 401) {
      return (
        <div className={containerClasses}>
          <div className={styles.error}>로그인이 필요합니다.</div>
        </div>
      );
    }

    // 403: Forbidden
    if (error.status === 403) {
      return (
        <div className={containerClasses}>
          <div className={styles.error}>접근 권한이 없습니다.</div>
        </div>
      );
    }

    // 404: Not Found
    if (error.status === 404) {
      return (
        <div className={containerClasses}>
          <div className={styles.error}>프로필을 찾을 수 없습니다.</div>
        </div>
      );
    }

    // 기타 에러
    return (
      <div className={containerClasses}>
        <div className={styles.error}>프로필을 불러올 수 없습니다.</div>
      </div>
    );
  }

  // Success 상태 - ViewModel이 없는 경우
  if (!viewModel) {
    return (
      <div className={containerClasses}>
        <div className={styles.error}>프로필 데이터가 없습니다.</div>
      </div>
    );
  }

  // Success 상태 - ViewModel로 렌더링
  const { nickname, tier, animalType, radarData, activeTimeText } = viewModel;

  return (
    <div className={containerClasses}>
      {/* Animal Card - 사용자 프로필 */}
      <AnimalCard
        property="user"
        nickname={nickname || '익명 사용자'}
        tier={tier}
        animal={animalType ?? AnimalType.rabbit}
        favoriteGenre="알 수 없음"
        activeTime={activeTimeText || '알 수 없음'}
        gameStyle="알 수 없음"
        weeklyAverage="알 수 없음"
        matchPercentage={0}
        matchReasons={[]}
      />

      {/* 플레이스타일과 최근 플레이 패턴을 포함하는 통합 섹션 */}
      <div className={styles.statsContainer}>
        {/* 플레이스타일 섹션 */}
        <div className={styles.playStyleSection}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>플레이스타일</h4>
          </div>
          {radarData && radarData.length > 0 ? (
            <div className={styles.radarChartWrapper}>
              <RadarChart
                myData={myProfile?.radarData || []}
                userData={radarData}
                size="m"
                showLabels={true}
              />
            </div>
          ) : (
            <div
              style={{ padding: '20px', textAlign: 'center', color: '#999' }}
            >
              특성 검사를 완료하지 않은 사용자입니다.
            </div>
          )}
        </div>

        {/* 최근 플레이 패턴 섹션 - 현재 ViewModel에 없으므로 숨김 */}
        {/* <div className={styles.playPatternSection}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>최근 플레이 패턴</h4>
          </div>
          <div className={styles.barChartWrapper}>
            <BarChart data={[]} size="s" showValues={true} />
          </div>
        </div> */}
      </div>
    </div>
  );
}
