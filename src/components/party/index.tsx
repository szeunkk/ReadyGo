'use client';

import React, { useState } from 'react';
import Selectbox, { type SelectboxItem } from '@/commons/components/selectbox';
import Searchbar from '@/commons/components/searchbar';
import Button from '@/commons/components/button';
import styles from './styles.module.css';

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
        <div className={styles.mainArea}>메인 영역</div>
      </div>
    </div>
  );
}
