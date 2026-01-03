'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from '@/components/ui/date-picker';
import styles from './styles.module.css';
import Searchbar from '@/commons/components/searchbar';
import Input from '@/commons/components/input';
import Selectbox, { SelectboxItem } from '@/commons/components/selectbox';
import Button from '@/commons/components/button';
import Icon from '@/commons/components/icon';
import { useModal } from '@/commons/providers/modal';
import { usePartySubmit } from './hooks/index.submit.hook';
import { usePartyUpdate } from './hooks/index.update.hook';
import { useLinkModalClose } from './hooks/index.link.modal.close.hook';

interface PartySubmitProps {
  onClose?: () => void;
  partyId?: number;
}

export default function PartySubmit({ onClose, partyId }: PartySubmitProps) {
  const isEditMode = !!partyId;
  const submitHook = usePartySubmit();
  // 항상 hook을 호출하되, 수정 모드가 아닐 때는 사용하지 않음
  const updateHook = usePartyUpdate({ partyId: partyId || 0 });
  const hook = isEditMode ? updateHook : submitHook;
  const { form, onSubmit, isSubmitting, isValid, errors } = hook;
  const { control, setValue, reset } = form;
  const { openCancelModal } = useLinkModalClose();
  const { openModal } = useModal();
  const [gameSearchQuery, setGameSearchQuery] = useState('');
  const [isGameOptionsOpen, setIsGameOptionsOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
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

  // 시간 형식 변환: HH:mm:ss → "오전 hh:mm" 또는 "오후 hh:mm"
  const formatTimeForForm = (timeString: string): string => {
    const match = timeString.match(/(\d{2}):(\d{2}):(\d{2})/);
    if (!match) {
      return timeString;
    }

    const [, hourStr, minuteStr] = match;
    const hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const period = hour < 12 ? '오전' : '오후';
    const displayHour =
      hour === 0 ? 12 : hour > 12 ? hour - 12 : hour === 12 ? 12 : hour;

    return `${period} ${displayHour.toString().padStart(2, '0')}:${minute}`;
  };

  // 태그 배열을 문자열로 변환: string[] → "#태그1#태그2"
  const formatTagsForForm = (tags: string[] | null | undefined): string => {
    if (!tags || tags.length === 0) {
      return '';
    }
    return tags.map((tag) => `#${tag}`).join('');
  };

  // 수정 모드일 때 데이터 조회
  useEffect(() => {
    if (!isEditMode || !partyId) {
      return;
    }

    const fetchPartyData = async () => {
      try {
        setIsLoadingData(true);

        const response = await fetch(`/api/party/${partyId}`, {
          method: 'GET',
          credentials: 'include', // HttpOnly 쿠키 포함 (중요!)
        });

        if (!response.ok) {
          if (response.status === 401) {
            openModal({
              variant: 'dual',
              title: '인증 필요',
              description: '로그인이 필요합니다.',
              onConfirm: () => {
                // 모달 닫기
              },
            });
            return;
          }
          if (response.status === 403) {
            openModal({
              variant: 'dual',
              title: '권한 없음',
              description: '수정 권한이 없습니다.',
              onConfirm: () => {
                // 모달 닫기
              },
            });
            return;
          }
          if (response.status === 404) {
            openModal({
              variant: 'dual',
              title: '파티 없음',
              description: '파티를 찾을 수 없습니다.',
              onConfirm: () => {
                // 모달 닫기
              },
            });
            return;
          }
          throw new Error('데이터를 불러오는 중 오류가 발생했습니다.');
        }

        const { data: partyData } = await response.json();

        if (!partyData) {
          throw new Error('파티 데이터를 찾을 수 없습니다.');
        }

        // 폼 필드에 기본값 설정
        reset({
          game_title: partyData.game_title || '',
          party_title: partyData.party_title || '',
          start_date: partyData.start_date
            ? dayjs(partyData.start_date)
            : null,
          start_time: partyData.start_time
            ? formatTimeForForm(partyData.start_time)
            : '',
          description: partyData.description || '',
          max_members: partyData.max_members || 4,
          control_level: partyData.control_level || '',
          difficulty: partyData.difficulty || '',
          voice_chat: partyData.voice_chat || null,
          tags: formatTagsForForm(partyData.tags),
        });

        // 게임 검색어도 설정
        setGameSearchQuery(partyData.game_title || '');
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : '데이터를 불러오는 중 오류가 발생했습니다.';

        openModal({
          variant: 'dual',
          title: '오류',
          description: `데이터를 불러오는 중 오류가 발생했습니다. ${errorMessage}`,
          onConfirm: () => {
            // 모달 닫기
          },
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPartyData();
  }, [isEditMode, partyId, reset, openModal]);

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
  const disabledDate = (date: Date) => {
    return dayjs(date).isBefore(dayjs().startOf('day'));
  };

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              {isEditMode ? '파티 수정하기' : '새 파티 만들기'}
            </h1>
            <p className={styles.subtitle}>
              {isEditMode
                ? '파티 정보를 수정하고 저장하세요'
                : '파티 정보를 입력하고 멤버를 모집하세요'}
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
                size="l"
                icon="right"
                placeholder="게임 검색"
                value={gameSearchQuery}
                onChange={handleGameSearchChange}
                onFocus={() => {
                  if (gameSearchQuery.length > 0 && filteredGames.length > 0) {
                    setIsGameOptionsOpen(true);
                  }
                }}
              />
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
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                        disabledDate={disabledDate}
                        state={fieldState.error ? 'error' : 'default'}
                        placeholder="날짜 선택"
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
                render={({ field, fieldState }) => {
                  const selectedItem = controlLevelOptions.find(
                    (item) => item.value === field.value
                  );
                  return (
                    <>
                      <Selectbox
                        size="l"
                        label="컨트롤 수준"
                        required
                        placeholder="옵션 선택"
                        items={controlLevelOptions}
                        selectedId={selectedItem?.id || undefined}
                        onSelect={(item) => {
                          field.onChange(item.value);
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
            <div className={styles.col}>
              <Controller
                name="difficulty"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedItem = difficultyOptions.find(
                    (item) => item.value === field.value
                  );
                  return (
                    <>
                      <Selectbox
                        size="l"
                        label="난이도"
                        required
                        placeholder="난이도 선택"
                        items={difficultyOptions}
                        selectedId={selectedItem?.id || undefined}
                        onSelect={(item) => {
                          field.onChange(item.value);
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
          disabled={!isFormValid || isSubmitting || isLoadingData}
          data-testid="party-submit-button"
        >
          {isEditMode ? '수정하기' : '파티 만들기'}
        </Button>
      </div>
    </div>
  );
}
