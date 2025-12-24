'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import Searchbar from '@/commons/components/searchbar';
import Input from '@/commons/components/input';
import Selectbox, { SelectboxItem } from '@/commons/components/selectbox';
import Button from '@/commons/components/button';
import Icon from '@/commons/components/icon';

export default function PartySubmit() {
  const [partyCount, setPartyCount] = useState(4);
  const [voiceChat, setVoiceChat] = useState<'required' | 'optional' | null>(
    null
  );
  const [gameSearchQuery, setGameSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<SelectboxItem | null>(null);
  const [isGameOptionsOpen, setIsGameOptionsOpen] = useState(false);
  const gameSearchRef = useRef<HTMLDivElement>(null);

  // 게임 목업 데이터
  const gameMockData: SelectboxItem[] = [
    { id: 'overwatch', value: '오버워치' },
    { id: 'overcooked', value: '오버쿡드' },
    { id: 'squid-game', value: '오징어게임' },
    { id: 'oriental', value: '오리엔탈' },
    { id: 'orienteering', value: '오리엔티어링' },
    { id: 'ozone', value: '오존' },
    { id: 'office-simulator', value: '오피스시뮬레이터' },
    { id: 'league-of-legends', value: '리그 오브 레전드' },
    { id: 'valorant', value: '발로란트' },
    { id: 'apex-legends', value: '에이펙스 레전드' },
  ];

  // 검색어에 따라 필터링된 게임 목록
  const filteredGames = gameMockData.filter((game) =>
    game.value.toLowerCase().includes(gameSearchQuery.toLowerCase())
  );

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        gameSearchRef.current &&
        !gameSearchRef.current.contains(event.target as Node)
      ) {
        setIsGameOptionsOpen(false);
      }
    };

    if (isGameOptionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGameOptionsOpen]);

  // 게임 검색어 변경 핸들러
  const handleGameSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setGameSearchQuery(value);
    setIsGameOptionsOpen(value.length > 0 && filteredGames.length > 0);
  };

  // 게임 선택 핸들러
  const handleGameSelect = (game: SelectboxItem) => {
    setSelectedGame(game);
    setGameSearchQuery(game.value);
    setIsGameOptionsOpen(false);
  };

  // 컨트롤 수준 옵션
  const controlLevelOptions: SelectboxItem[] = [
    { id: 'beginner', value: '미숙' },
    { id: 'intermediate', value: '반숙' },
    { id: 'advanced', value: '완숙' },
    { id: 'expert', value: '빡숙' },
    { id: 'master', value: '장인' },
  ];

  // 난이도 옵션
  const difficultyOptions: SelectboxItem[] = [
    { id: 'undefined', value: '미정' },
    { id: 'flexible', value: '유동' },
    { id: 'easy', value: '이지' },
    { id: 'normal', value: '노멀' },
    { id: 'hard', value: '하드' },
    { id: 'hell', value: '지옥' },
  ];

  // 시간 옵션 (10분 간격)
  const timeOptions: SelectboxItem[] = Array.from({ length: 24 }, (_, hour) =>
    Array.from({ length: 6 }, (_, minuteIndex) => {
      const minute = minuteIndex * 10;
      const period = hour < 12 ? '오전' : '오후';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = minute.toString().padStart(2, '0');
      const timeString = `${period} ${displayHour}:${displayMinute}`;
      const timeId = `${hour.toString().padStart(2, '0')}:${displayMinute}`;
      return { id: timeId, value: timeString };
    })
  ).flat();

  const handlePartyCountDecrease = () => {
    if (partyCount > 1) {
      setPartyCount(partyCount - 1);
    }
  };

  const handlePartyCountIncrease = () => {
    if (partyCount < 10) {
      setPartyCount(partyCount + 1);
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>새 파티 만들기</h1>
            <p className={styles.subtitle}>
              파티 정보를 입력하고 멤버를 모집하세요
            </p>
          </div>
          <button className={styles.closeButton} type="button">
            <Icon name="x" size={24} />
          </button>
        </div>
      </div>

      {/* 본문 영역 */}
      <div className={styles.body}>
        {/* 파티 정보 섹션 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>파티 정보</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              게임
              <span className={styles.required}>*</span>
            </label>
            <div className={styles.gameSearchWrapper} ref={gameSearchRef}>
              <Searchbar
                placeholder="게임 검색"
                value={gameSearchQuery}
                onChange={handleGameSearchChange}
                onFocus={() => {
                  if (gameSearchQuery.length > 0 && filteredGames.length > 0) {
                    setIsGameOptionsOpen(true);
                  }
                }}
              >
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="게임 검색"
                  value={gameSearchQuery}
                  onChange={handleGameSearchChange}
                  onFocus={() => {
                    if (
                      gameSearchQuery.length > 0 &&
                      filteredGames.length > 0
                    ) {
                      setIsGameOptionsOpen(true);
                    }
                  }}
                />
                <Icon name="search" size={20} />
              </Searchbar>
              {isGameOptionsOpen && filteredGames.length > 0 && (
                <div className={styles.gameOptionsGroup}>
                  {filteredGames.map((game) => {
                    const isSelected = selectedGame?.id === game.id;
                    return (
                      <div
                        key={game.id}
                        className={`${styles.gameOptionItem} ${
                          isSelected ? styles.selected : ''
                        }`}
                        onClick={() => handleGameSelect(game)}
                        role="option"
                        aria-selected={isSelected}
                      >
                        {isSelected && (
                          <span className={styles.checkIcon}>
                            <Icon name="check" size={20} />
                          </span>
                        )}
                        <span className={styles.gameOptionValue}>
                          {game.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <Input
              label="파티 제목"
              required
              size="l"
              placeholder="파티 제목을 입력해 주세요."
            />
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <Input
                label="시작일"
                required
                size="l"
                placeholder="날짜 선택"
                iconRight="calendar"
                readOnly
              />
            </div>
            <div className={styles.col}>
              <Selectbox
                label="시작시간"
                required
                placeholder="시간 선택"
                items={timeOptions}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <Input
              label="설명"
              required
              size="l"
              placeholder="파티 모집과 관련된 상세 내용을 입력해 주세요."
            />
            <div className={styles.charCount}>0/100</div>
          </div>
        </div>

        {/* 파티 조건 섹션 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>파티 조건</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              파티 인원
              <span className={styles.required}>*</span>
            </label>
            <div className={styles.partyCountInput}>
              <div className={styles.partyCountInputField}>
                <span className={styles.partyCountLabel}>최대 인원</span>
                <div className={styles.partyCountControls}>
                  <button
                    type="button"
                    className={styles.countButton}
                    onClick={handlePartyCountDecrease}
                  >
                    <Icon name="minus" size={16} />
                  </button>
                  <span className={styles.countValue}>{partyCount}</span>
                  <button
                    type="button"
                    className={styles.countButton}
                    onClick={handlePartyCountIncrease}
                  >
                    <Icon name="plus" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <Selectbox
                label="컨트롤 수준"
                required
                placeholder="옵션 선택"
                items={controlLevelOptions}
              />
            </div>
            <div className={styles.col}>
              <Selectbox
                label="난이도"
                required
                placeholder="난이도 선택"
                items={difficultyOptions}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>보이스챗 사용</label>
            <div className={styles.voiceChatGroup}>
              <button
                type="button"
                className={`${styles.voiceChatButton} ${
                  voiceChat === 'required' ? styles.active : ''
                }`}
                onClick={() =>
                  setVoiceChat(voiceChat === 'required' ? null : 'required')
                }
              >
                필수 사용
              </button>
              <button
                type="button"
                className={`${styles.voiceChatButton} ${
                  voiceChat === 'optional' ? styles.active : ''
                }`}
                onClick={() =>
                  setVoiceChat(voiceChat === 'optional' ? null : 'optional')
                }
              >
                선택적 사용
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <Input label="태그" size="l" placeholder="#태그 입력" />
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className={styles.footer}>
        <Button
          variant="secondary"
          shape="rectangle"
          className={styles.cancelButton}
        >
          취소
        </Button>
        <Button
          variant="primary"
          shape="rectangle"
          className={styles.submitButton}
        >
          파티 만들기
        </Button>
      </div>
    </div>
  );
}


