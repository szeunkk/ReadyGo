'use client';

import React, { useState } from 'react';
import Selectbox, { type SelectboxItem } from '@/commons/components/selectbox';
import Searchbar from '@/commons/components/searchbar';
import Button from '@/commons/components/button';
import Card from './ui/card';
import { useLinkModal } from './hooks/index.link.modal.hook';
import { usePartyListBinding } from './hooks/index.binding.hook';
import { useLinkRouting } from './hooks/index.link.routing.hook';
import styles from './styles.module.css';

export default function Party() {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    undefined
  );
  const { openPartySubmitModal } = useLinkModal();
  const { data: partyList, isLoading, error } = usePartyListBinding();
  const { navigateToPartyDetail } = useLinkRouting();

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
    <div className={styles.container} data-testid="party-page">
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
              onClick={openPartySubmitModal}
              data-testid="party-create-button"
            >
              새 파티 만들기
            </Button>
          </div>
        </div>
        <div className={styles.mainArea}>
          {isLoading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div>데이터를 불러오는 중 오류가 발생했습니다.</div>
          ) : partyList.length === 0 ? (
            <div>파티가 없습니다</div>
          ) : (
            partyList.map((party) => (
              <Card
                key={party.partyId || party.title}
                {...party}
                onJoinClick={() => {
                  if (party.partyId) {
                    navigateToPartyDetail(party.partyId);
                  }
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
