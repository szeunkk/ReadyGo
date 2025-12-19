'use client';

import React from 'react';
import styles from './styles.module.css';
import MatchSection from './ui/match-section/matchSection';
import PartySection from './ui/party-section/partySection';
import { MatchCardProps } from './ui/match-section/card/matchCard';
import { PartyCardProps } from './ui/party-section/card/partyCard';

// 임시 데이터 - 추후 API로 대체될 예정
const mockMatchData: MatchCardProps[] = [
  {
    nickname: '까칠한까마귀',
    matchRate: 94,
    status: 'online',
    avatarSrc: '/images/raven_m.svg',
    gamePreference: 'Valorant, Apex',
    playTime: '저녁 시간대',
    skillLevel: '플래티넘',
  },
  {
    nickname: '용감한여우',
    matchRate: 89,
    status: 'online',
    avatarSrc: '/images/fox_m.svg',
    gamePreference: 'League of Legends',
    playTime: '저녁 시간대',
    skillLevel: '다이아',
  },
  {
    nickname: '신중한올빼미',
    matchRate: 87,
    status: 'away',
    avatarSrc: '/images/owl_m.svg',
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
      { avatarSrc: '/images/bear_m.svg', nickname: '호쾌한곰' },
      { avatarSrc: '/images/wolf_m.svg', nickname: '용맹한늑대' },
      { avatarSrc: '/images/fox_m.svg', nickname: '영리한여우' },
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
      { avatarSrc: '/images/tiger_m.svg', nickname: '날쌘호랑이' },
      { avatarSrc: '/images/hawk_m.svg', nickname: '날카로운매' },
      { avatarSrc: '/images/leopard_m.svg', nickname: '민첩한표범' },
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
      { avatarSrc: '/images/owl_m.svg', nickname: '현명한올빼미' },
      { avatarSrc: '/images/raven_m.svg', nickname: '똑똑한까마귀' },
      { avatarSrc: '/images/dolphin_m.svg', nickname: '영민한돌고래' },
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
      { avatarSrc: '/images/koala_m.svg', nickname: '느긋한코알라' },
      { avatarSrc: '/images/panda_m.svg', nickname: '귀여운판다' },
      { avatarSrc: '/images/rabbit_m.svg', nickname: '활발한토끼' },
    ],
    tags: ['캐주얼', '소셜', '평일'],
  },
];

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
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

        {/* 오른쪽 사이드바 영역 (추후 구현) */}
        <div className={styles.rightSection}>
          {/* TODO: 사용자 프로필 카드 및 플레이스타일 차트 컴포넌트 추가 */}
          <div className={styles.placeholder}>
            <p>프로필 카드 영역</p>
          </div>
        </div>
      </div>
    </div>
  );
}
