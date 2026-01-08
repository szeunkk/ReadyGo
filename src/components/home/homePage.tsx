'use client';

import React from 'react';
import styles from './styles.module.css';
import MatchSection from './ui/match-section/matchSection';
import PartySection from './ui/party-section/partySection';
import ProfileSection from './ui/profile-section/profileSection';
import { MatchCardProps } from './ui/match-section/card/matchCard';
import { PartyCardProps } from './ui/party-section/card/partyCard';
import { AnimalType } from '@/commons/constants/animal';
import { BarChartDataItem } from '@/commons/components/bar-chart';
import { useGoogleOAuth } from '@/components/auth/hooks/useGoogleOAuth.hook';
import { useKakaoOAuth } from '@/components/auth/hooks/useKakaoOAuth.hook';
import { useSidePanelStore } from '@/stores/sidePanel.store';
import { useProfile } from './hooks/useProfile';

// 임시 데이터 - 추후 API로 대체될 예정
const mockMatchData: MatchCardProps[] = [
  {
    userId: 'd3216299-dac9-478a-ab19-d79e56c6a2b1',
    nickname: '턱없는살모사',
    matchRate: 94,
    status: 'online',
    animalType: AnimalType.raven,
    gamePreference: 'Valorant, Apex',
    playTime: '저녁 시간대',
    skillLevel: '플래티넘',
  },
  {
    userId: '3943add5-23d2-4bc3-8818-65a04a41161e',
    nickname: '예쁜코알라',
    matchRate: 89,
    status: 'online',
    animalType: AnimalType.fox,
    gamePreference: 'League of Legends',
    playTime: '저녁 시간대',
    skillLevel: '다이아',
  },
  {
    userId: '73ea14dd-2e4d-4d96-b267-bee66a6c8ad5',
    nickname: '더운담비',
    matchRate: 87,
    status: 'away',
    animalType: AnimalType.owl,
    gamePreference: 'Overwatch, Valorant',
    playTime: '밤 시간대',
    skillLevel: '플래티넘',
  },
  {
    userId: '84e1e171-a836-4264-8277-c97decb722d3',
    nickname: '시원찮은닭',
    matchRate: 85,
    status: 'online',
    animalType: AnimalType.rabbit,
    gamePreference: 'League of Legends, Valorant',
    playTime: '저녁 시간대',
    skillLevel: '플래티넘',
  },
];

const mockPartyData: PartyCardProps[] = [
  {
    title: 'RPG 길드 매칭',
    gameName: '팰월드',
    description: '대형 RPG 게임을 함께 즐기는 길드원 모집',
    currentMembers: 5,
    maxMembers: 8,
    members: [
      { animalType: AnimalType.bear, nickname: '호쾌한곰' },
      { animalType: AnimalType.wolf, nickname: '용맹한늑대' },
      { animalType: AnimalType.fox, nickname: '영리한여우' },
    ],
    tags: ['RPG', '협력', '저녁'],
  },
  {
    title: '새벽반 FPS 게이머',
    gameName: '오버워치',
    description: '새벽 시간대 FPS 게임을 즐기는 게이머 모임',
    currentMembers: 5,
    maxMembers: 8,
    members: [
      { animalType: AnimalType.tiger, nickname: '날쌘호랑이' },
      { animalType: AnimalType.hawk, nickname: '날카로운매' },
      { animalType: AnimalType.leopard, nickname: '민첩한표범' },
    ],
    tags: ['FPS', '새벽', '경쟁'],
  },
  {
    title: '전략가들의 모임',
    gameName: '백룸',
    description: '전략 게임을 깊이 있게 플레이하는 모임',
    currentMembers: 5,
    maxMembers: 8,
    members: [
      { animalType: AnimalType.owl, nickname: '현명한올빼미' },
      { animalType: AnimalType.raven, nickname: '똑똑한까마귀' },
      { animalType: AnimalType.dolphin, nickname: '영민한돌고래' },
    ],
    tags: ['전략', '주말', '분석'],
  },
  {
    title: '캐주얼 게이머 연합',
    gameName: '구스구스덕',
    description: '편하게 즐기는 캐주얼 게임 커뮤니티',
    currentMembers: 5,
    maxMembers: 8,
    members: [
      { animalType: AnimalType.koala, nickname: '느긋한코알라' },
      { animalType: AnimalType.panda, nickname: '귀여운판다' },
      { animalType: AnimalType.rabbit, nickname: '활발한토끼' },
    ],
    tags: ['캐주얼', '소셜', '평일'],
  },
  {
    title: '공포 게임 탐험대',
    gameName: '포비아',
    description: '공포 게임을 함께 즐기는 용감한 게이머들',
    currentMembers: 5,
    maxMembers: 8,
    members: [
      { animalType: AnimalType.cat, nickname: '겁많은고양이' },
      { animalType: AnimalType.dog, nickname: '용감한강아지' },
      { animalType: AnimalType.hedgehog, nickname: '조심스러운고슴도치' },
    ],
    tags: ['공포', '협동', '야간'],
  },
  {
    title: '스포츠 게임 리그',
    gameName: 'FC 온라인',
    description: '스포츠 게임으로 함께 즐기는 리그전',
    currentMembers: 5,
    maxMembers: 8,
    members: [
      { animalType: AnimalType.deer, nickname: '빠른사슴' },
      { animalType: AnimalType.dolphin, nickname: '영민한돌고래' },
      { animalType: AnimalType.leopard, nickname: '민첩한표범' },
    ],
    tags: ['스포츠', '경쟁', '주말'],
  },
];

// 임시 Bar Chart 데이터 (최근 플레이 패턴)
const mockBarData: BarChartDataItem[] = [
  { label: 'FPS', value: 23.6 },
  { label: '생존', value: 18.2 },
  { label: '모험', value: 12.5 },
  { label: '캐주얼', value: 8.7 },
];

export default function Home() {
  // OAuth 콜백 처리를 위한 Hook 호출
  useGoogleOAuth();
  useKakaoOAuth();

  const { isOpen } = useSidePanelStore();

  // 프로필 데이터 fetch + 상태 관리 (ProfileViewModel 반환)
  const {
    data: profileViewModel,
    loading: profileLoading,
    error: profileError,
  } = useProfile();

  return (
    <div className={styles.container}>
      {/* 왼쪽 컨텐츠 영역 */}
      <div
        className={`${styles.leftSection} ${isOpen ? styles.sidePanelOpen : ''}`}
      >
        {/* 매치 섹션 */}
        <MatchSection
          title="레전드 조합, ㄹㄷ? 🎲"
          matches={mockMatchData}
          className={styles.matchSection}
        />

        {/* 파티 섹션 */}
        <PartySection
          title="너만 오면 ㄱ!🔥 "
          parties={mockPartyData}
          className={styles.partySection}
        />
      </div>

      {/* 오른쪽 사이드바 영역 */}
      <div className={styles.rightSection}>
        {!isOpen && (
          <div className={styles.profileStateContainer}>
            {/* 로딩 상태 */}
            {profileLoading && (
              <div className={styles.profileState}>
                <p>프로필을 불러오는 중...</p>
              </div>
            )}

            {/* 에러 상태 */}
            {!profileLoading && profileError && (
              <div className={styles.profileState}>
                <p>프로필을 불러올 수 없습니다.</p>
              </div>
            )}

            {/* Empty 상태 (데이터 없음) */}
            {!profileLoading && !profileError && !profileViewModel && (
              <div className={styles.profileState}>
                <p>프로필 정보가 없습니다.</p>
              </div>
            )}

            {/* 데이터 있음 - ProfileSection 컴포넌트 사용 */}
            {!profileLoading && !profileError && profileViewModel && (
              <ProfileSection
                nickname={profileViewModel.nickname || '익명 사용자'}
                tier={profileViewModel.tier}
                animal={profileViewModel.animalType || AnimalType.rabbit}
                activeTime={profileViewModel.activeTimeText}
                perfectMatchTypes={profileViewModel.perfectMatchTypes}
                radarData={profileViewModel.radarData || []}
                barData={mockBarData}
                className={styles.profileSection}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
