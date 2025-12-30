'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import styles from './styles.module.css';
import Searchbar from '@/commons/components/searchbar';
import Input from '@/commons/components/input';
import Selectbox, { SelectboxItem } from '@/commons/components/selectbox';
import Button from '@/commons/components/button';
import Icon from '@/commons/components/icon';
import { usePartySubmit } from './hooks/index.submit.hook';
import { useLinkModalClose } from './hooks/index.link.modal.close.hook';

interface PartySubmitProps {
  onClose?: () => void;
}

export default function PartySubmit({ onClose }: PartySubmitProps) {
  const { form, onSubmit, isSubmitting, isValid, errors } = usePartySubmit();
  const { control, setValue } = form;
  const { openCancelModal } = useLinkModalClose();
  const [gameSearchQuery, setGameSearchQuery] = useState('');
  const [isGameOptionsOpen, setIsGameOptionsOpen] = useState(false);
  const gameSearchRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // 폼 값 감시
  // watch()를 인자 없이 호출하면 모든 필드를 감시하고 리렌더링을 트리거함
  const watchedValues = form.watch();
  const maxMembers = watchedValues.max_members || 4;
  const voiceChat = watchedValues.voice_chat;
  const description = watchedValues.description || '';

  // 폼 유효성 확인
  const isFormValid = isValid;

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
    setValue('game_title', game.value, { shouldValidate: true });
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

  // 시간 옵션 (30분 간격)
  const timeOptions: SelectboxItem[] = Array.from({ length: 24 }, (_, hour) =>
    Array.from({ length: 2 }, (_, minuteIndex) => {
      const minute = minuteIndex * 30;
      const period = hour < 12 ? '오전' : '오후';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = minute.toString().padStart(2, '0');
      const timeString = `${period} ${displayHour}:${displayMinute}`;
      const timeId = `${hour.toString().padStart(2, '0')}:${displayMinute}`;
      return { id: timeId, value: timeString };
    })
  ).flat();

  const handlePartyCountDecrease = () => {
    if (maxMembers > 1) {
      setValue('max_members', maxMembers - 1, { shouldValidate: true });
    }
  };

  const handlePartyCountIncrease = () => {
    if (maxMembers < 8) {
      setValue('max_members', maxMembers + 1, { shouldValidate: true });
    }
  };

  const handleVoiceChatToggle = (value: 'required' | 'optional') => {
    const newValue = voiceChat === value ? null : value;
    setValue('voice_chat', newValue, { shouldValidate: true });
  };

  // 날짜 제한: 과거 날짜 선택 차단
  const disabledDate: DatePickerProps['disabledDate'] = (current) => {
    return current && current.isBefore(dayjs().startOf('day'));
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
          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
            data-testid="party-submit-close-button"
          >
            <Icon name="x" size={24} />
          </button>
        </div>
      </div>

      {/* 본문 영역 */}
      <div className={styles.body} ref={bodyRef}>
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
                    const isSelected = watchedValues.game_title === game.value;
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
              {errors?.game_title && (
                <span className={styles.errorMessage}>
                  {errors.game_title.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <Controller
              name="party_title"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="파티 제목"
                  required
                  size="l"
                  placeholder="파티 제목을 입력해 주세요."
                  state={fieldState.error ? 'error' : 'Default'}
                  additionalInfo={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.formGroup}>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label className={styles.label}>
                        시작일
                        <span className={styles.required}>*</span>
                      </label>
                      <DatePicker
                        className={styles.datePicker}
                        placeholder="날짜 선택"
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                        format="YYYY-MM-DD"
                        disabledDate={disabledDate}
                        suffixIcon={<Icon name="calendar" size={20} />}
                        getPopupContainer={(trigger) => {
                          return (
                            bodyRef.current ||
                            trigger.parentElement ||
                            document.body
                          );
                        }}
                        popupClassName={styles.datePickerPopup}
                      />
                      {fieldState.error && (
                        <span className={styles.errorMessage}>
                          {fieldState.error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            <div className={styles.col}>
              <Controller
                name="start_time"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedTimeItem = timeOptions.find(
                    (item) => item.value === field.value
                  );
                  return (
                    <>
                      <Selectbox
                        label="시작시간"
                        size="l"
                        required
                        placeholder="시간 선택"
                        items={timeOptions}
                        selectedId={selectedTimeItem?.id || undefined}
                        onSelect={(item) => {
                          field.onChange(item.value); // value를 저장 ("오전 09:00" 형식)
                        }}
                        state={fieldState.error ? 'error' : 'default'}
                      />
                      {fieldState.error && (
                        <span className={styles.errorMessage}>
                          {fieldState.error.message}
                        </span>
                      )}
                    </>
                  );
                }}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    label="설명"
                    required
                    size="l"
                    placeholder="파티 모집과 관련된 상세 내용을 입력해 주세요."
                    state={fieldState.error ? 'error' : 'Default'}
                    additionalInfo={fieldState.error?.message}
                  />
                  <div className={styles.charCount}>
                    {description.length}/100
                  </div>
                </>
              )}
            />
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
                  <span className={styles.countValue}>{maxMembers}</span>
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
              <Controller
                name="control_level"
                control={control}
                render={({ field, fieldState }) => (
                  <Selectbox
                    label="컨트롤 수준"
                    required
                    placeholder="옵션 선택"
                    items={controlLevelOptions}
                    selectedId={field.value || undefined}
                    onSelect={(item) => {
                      field.onChange(item.id);
                    }}
                    state={fieldState.error ? 'error' : 'default'}
                  />
                )}
              />
            </div>
            <div className={styles.col}>
              <Controller
                name="difficulty"
                control={control}
                render={({ field, fieldState }) => (
                  <Selectbox
                    label="난이도"
                    required
                    placeholder="난이도 선택"
                    items={difficultyOptions}
                    selectedId={field.value || undefined}
                    onSelect={(item) => {
                      field.onChange(item.id);
                    }}
                    state={fieldState.error ? 'error' : 'default'}
                  />
                )}
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
                onClick={() => handleVoiceChatToggle('required')}
              >
                필수 사용
              </button>
              <button
                type="button"
                className={`${styles.voiceChatButton} ${
                  voiceChat === 'optional' ? styles.active : ''
                }`}
                onClick={() => handleVoiceChatToggle('optional')}
              >
                선택적 사용
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <Controller
              name="tags"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="태그"
                  size="l"
                  placeholder="#태그 입력"
                  state={fieldState.error ? 'error' : 'Default'}
                  additionalInfo={fieldState.error?.message}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className={styles.footer}>
        <Button
          variant="secondary"
          shape="rectangle"
          className={styles.cancelButton}
          onClick={openCancelModal}
        >
          취소
        </Button>
        <Button
          variant="primary"
          shape="rectangle"
          className={styles.submitButton}
          onClick={onSubmit}
          disabled={!isFormValid || isSubmitting}
          data-testid="party-submit-button"
        >
          파티 만들기
        </Button>
      </div>
    </div>
  );
}
