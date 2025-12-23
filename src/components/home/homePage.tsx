'use client';

import React from 'react';
import styles from './styles.module.css';
import MatchSection from './ui/match-section/matchSection';
import PartySection from './ui/party-section/partySection';
import ProfileSection from './ui/profile-section/profileSection';
import { MatchCardProps } from './ui/match-section/card/matchCard';
import { PartyCardProps } from './ui/party-section/card/partyCard';
import { AnimalType } from '@/commons/constants/animal';
import { TierType } from '@/commons/constants/tierType.enum';
import { useGoogleLogin } from '@/components/auth/login/hooks/index.login.google.hook';

// 임시 데이터 - 추후 API로 대체될 예정
const mockMatchData: MatchCardProps[] = [
  {
    userId: 'user-1',
    nickname: '까칠한까마귀',
    matchRate: 94,
    status: 'online',
    animalType: AnimalType.raven,
    gamePreference: 'Valorant, Apex',
    playTime: '저녁 시간대',
    skillLevel: '플래티넘',
  },
  {
    userId: 'user-2',
    nickname: '용감한여우',
    matchRate: 89,
    status: 'online',
    animalType: AnimalType.fox,
    gamePreference: 'League of Legends',
    playTime: '저녁 시간대',
    skillLevel: '다이아',
  },
  {
    userId: 'user-3',
    nickname: '신중한올빼미',
    matchRate: 87,
    status: 'away',
    animalType: AnimalType.owl,
    gamePreference: 'Overwatch, Valorant',
    playTime: '밤 시간대',
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
];

// 프로필 섹션 임시 데이터
const mockProfileData = {
  nickname: '호쾌한망토',
  tier: TierType.silver,
  animal: AnimalType.wolf,
  favoriteGenre: 'FPS',
  activeTime: '20 - 24시',
  gameStyle: '경쟁적',
  weeklyAverage: '5.4 시간',
  perfectMatchTypes: [AnimalType.fox, AnimalType.bear, AnimalType.raven],
  radarData: [
    { trait: 'social' as const, value: 70 },
    { trait: 'exploration' as const, value: 85 },
    { trait: 'cooperation' as const, value: 75 },
    { trait: 'strategy' as const, value: 60 },
    { trait: 'leadership' as const, value: 90 },
  ],
  barData: [
    { label: 'FPS', value: 23.6 },
    { label: '생존', value: 12.5 },
    { label: '모험', value: 7.2 },
    { label: '캐주얼', value: 3.8 },
  ],
};

export default function Home() {
  // OAuth 콜백 처리를 위한 Hook 호출
  useGoogleLogin();

  return (
    <div className={styles.container}>
      {/* 왼쪽 컨텐츠 영역 */}
      <div className={styles.leftSection}>
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
        <ProfileSection
          nickname={mockProfileData.nickname}
          tier={mockProfileData.tier}
          animal={mockProfileData.animal}
          favoriteGenre={mockProfileData.favoriteGenre}
          activeTime={mockProfileData.activeTime}
          gameStyle={mockProfileData.gameStyle}
          weeklyAverage={mockProfileData.weeklyAverage}
          perfectMatchTypes={mockProfileData.perfectMatchTypes}
          radarData={mockProfileData.radarData}
          barData={mockProfileData.barData}
        />
      </div>
    </div>
  );
}
