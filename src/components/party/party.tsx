'use client';

import React, { useState } from 'react';
import Selectbox, { type SelectboxItem } from '@/commons/components/selectbox';
import Searchbar from '@/commons/components/searchbar';
import Button from '@/commons/components/button';
import Card, { PartyCardProps } from './ui/card';
import styles from './styles.module.css';

// 임시 데이터 - 추후 API로 대체될 예정
const mockPartyData: PartyCardProps[] = [
  {
    title: 'RPG 길드 매칭',
    description: '대형 RPG게임을 함께 즐기는 길드원 모집',
    gameTag: '팰월드',
    memberAvatars: ['raven', 'hedgehog', 'dolphin', 'fox', 'bear'],
    currentMembers: 5,
    maxMembers: 8,
    categories: {
      startTime: '12/25 오후 6:30',
      voiceChat: '필수 사용',
      difficulty: '지옥',
      controlLevel: '빡숙',
    },
  },
  {
    title: '새벽반 FPS 게이머',
    description: '새벽 시간대 FPS 게임을 즐기는 게이머 모임',
    gameTag: '오버워치',
    memberAvatars: ['tiger', 'hawk', 'leopard', 'wolf'],
    currentMembers: 4,
    maxMembers: 6,
    categories: {
      startTime: '12/26 새벽 2:00',
      voiceChat: '선택 사용',
      difficulty: '어려움',
      controlLevel: '숙련',
    },
  },
  {
    title: '전략가들의 모임',
    description: '전략 게임을 깊이 있게 플레이하는 모임',
    gameTag: '백룸',
    memberAvatars: ['owl', 'raven', 'dolphin', 'fox', 'bear', 'wolf'],
    currentMembers: 6,
    maxMembers: 8,
    categories: {
      startTime: '12/27 오후 8:00',
      voiceChat: '필수 사용',
      difficulty: '보통',
      controlLevel: '중급',
    },
  },
  {
    title: '캐주얼 게이머 연합',
    description: '편하게 즐기는 캐주얼 게임 커뮤니티',
    gameTag: '구스구스덕',
    memberAvatars: ['koala', 'panda', 'rabbit'],
    currentMembers: 3,
    maxMembers: 10,
    categories: {
      startTime: '12/28 오후 7:00',
      voiceChat: '선택 사용',
      difficulty: '쉬움',
      controlLevel: '초급',
    },
  },
  {
    title: '경쟁전 랭커 모집',
    description: '상위 티어 목표하는 게이머들의 모임',
    gameTag: '발로란트',
    memberAvatars: ['hawk', 'tiger', 'leopard', 'wolf', 'fox'],
    currentMembers: 5,
    maxMembers: 5,
    categories: {
      startTime: '12/29 오후 9:00',
      voiceChat: '필수 사용',
      difficulty: '지옥',
      controlLevel: '빡숙',
    },
  },
  {
    title: '주말 레이드 파티',
    description: '주말에 모여 함께 레이드를 즐기는 파티',
    gameTag: '데스티니',
    memberAvatars: ['bear', 'deer', 'cat', 'dog'],
    currentMembers: 4,
    maxMembers: 6,
    categories: {
      startTime: '12/30 오후 2:00',
      voiceChat: '선택 사용',
      difficulty: '어려움',
      controlLevel: '숙련',
    },
  },
];

export default function Party() {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    undefined
  );

  const genreItems: SelectboxItem[] = [
    { id: 'all', value: '모든 게임 장르' },
    { id: 'action', value: '액션' },
    { id: 'rpg', value: 'RPG' },
    { id: 'strategy', value: '전략' },
    { id: 'sports', value: '스포츠' },
  ];

  const handleGenreSelect = (item: SelectboxItem) => {
    setSelectedGenre(item.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>파티 모집</h1>
        <p className={styles.subtitle}>함께 게임할 파티를 찾거나 모집하세요</p>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.searchArea}>
          <div className={styles.filterSearchWrapper}>
            <div className={styles.filterSelect}>
              <Selectbox
                items={genreItems}
                selectedId={selectedGenre}
                onSelect={handleGenreSelect}
                placeholder="모든 게임 장르"
                className={styles.selectboxWidth}
              />
            </div>
            <div className={styles.searchInput}>
              <Searchbar
                placeholder="게임 이름으로 검색하기"
                className={styles.searchbarWidth}
              />
            </div>
          </div>
          <div className={styles.newPartyButton}>
            <Button
              variant="secondary"
              size="m"
              shape="rectangle"
              className={styles.buttonWidth}
            >
              새 파티 만들기
            </Button>
          </div>
        </div>
        <div className={styles.mainArea}>
          {mockPartyData.map((party, index) => (
            <Card key={index} {...party} />
          ))}
        </div>
      </div>
    </div>
  );
}


