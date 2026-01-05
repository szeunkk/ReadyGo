'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Button from '@/commons/components/button';
import Tag from '@/commons/components/tag';
import Icon from '@/commons/components/icon';
import { AnimalType } from '@/commons/constants/animal';

export interface PartyCardProps {
  /**
   * 파티 제목
   */
  title: string;
  /**
   * 파티 설명
   */
  description: string;
  /**
   * 게임 태그
   */
  gameTag: string;
  /**
   * 파티 멤버 동물 타입 목록
   */
  memberAvatars: string[];
  /**
   * 현재 파티 인원수
   */
  currentMembers: number;
  /**
   * 최대 파티 인원수
   */
  maxMembers: number;
  /**
   * 카테고리 정보
   */
  categories: {
    startTime: string;
    voiceChat: string;
    difficulty: string;
    controlLevel: string;
  };
  /**
   * 아바타 색상 (CSS color 값)
   * @default 'var(--color-text-secondary)'
   */
  avatarColor?: string;
  /**
   * 참여하기 버튼 클릭 핸들러
   */
  onJoinClick?: () => void;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 파티 ID (data-testid 생성용)
   */
  partyId?: number | string;
}

export default function Card({
  title,
  description,
  gameTag,
  memberAvatars,
  currentMembers,
  maxMembers,
  categories: _categories,
  avatarColor = 'var(--color-text-secondary)',
  onJoinClick,
  className = '',
  partyId,
}: PartyCardProps) {
  const router = useRouter();
  const containerClasses = [styles.card, className].filter(Boolean).join(' ');

  // 표시할 아바타 개수 (최대 4개)
  const displayAvatars = memberAvatars.slice(0, 4);
  const remainingCount = Math.max(0, memberAvatars.length - 4);

  // data-testid 생성
  const cardTestId = partyId ? `party-card-${partyId}` : undefined;
  const titleTestId = partyId ? `party-card-title-${partyId}` : undefined;
  const descriptionTestId = partyId
    ? `party-card-description-${partyId}`
    : undefined;
  const gameTagTestId = partyId ? `party-card-game-tag-${partyId}` : undefined;
  const memberCountTestId = partyId
    ? `party-card-member-count-${partyId}`
    : undefined;
  const startTimeTestId = partyId
    ? `party-card-start-time-${partyId}`
    : undefined;
  const voiceChatTestId = partyId
    ? `party-card-voice-chat-${partyId}`
    : undefined;
  const difficultyTestId = partyId
    ? `party-card-difficulty-${partyId}`
    : undefined;
  const controlLevelTestId = partyId
    ? `party-card-control-level-${partyId}`
    : undefined;
  const joinButtonTestId = partyId
    ? `party-card-join-button-${partyId}`
    : undefined;

  const handleDetailClick = () => {
    // onJoinClick이 있으면 먼저 실행
    if (onJoinClick) {
      onJoinClick();
    }
    // partyId가 있으면 상세 페이지로 이동
    if (partyId) {
      router.push(`/party/${partyId}`);
    }
  };

  return (
    <div className={containerClasses} data-testid={cardTestId}>
      {/* Title 영역 */}
      <div className={styles.cardTitleMemberWrapper}>
        <div className={styles.titleSection}>
          <div className={styles.titleTagWrapper}>
            <h2 className={styles.cardTitle} data-testid={titleTestId}>
              {title}
            </h2>
            <Tag
              style="duotone"
              className={styles.gameTag}
              data-testid={gameTagTestId}
            >
              {gameTag}
            </Tag>
          </div>
          <p className={styles.cardDescription} data-testid={descriptionTestId}>
            {description}
          </p>
        </div>

        {/* Party Member 영역 */}
        <div className={styles.partyMemberSection}>
          <div className={styles.avatarGroup}>
            {displayAvatars.map((avatar, index) => (
              <div
                key={index}
                className={styles.avatarWrapper}
                style={{ zIndex: displayAvatars.length - index }}
              >
                <Avatar
                  animalType={avatar as AnimalType}
                  alt={`Member ${index + 1}`}
                  size="s"
                  showStatus={false}
                  color={avatarColor}
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div className={styles.avatarWrapper} style={{ zIndex: 0 }}>
                <div className={styles.remainingCountWrapper}>
                  <div className={styles.remainingCount}>+{remainingCount}</div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.memberCount} data-testid={memberCountTestId}>
            <span className={styles.currentCount}>{currentMembers}</span>
            <span className={styles.maxCount}> / {maxMembers}명</span>
          </div>
        </div>
      </div>

      {/* Category 영역 */}
      <div className={styles.cardCategoryButtonWrapper}>
        <div className={styles.categoryGrid}>
          <div className={styles.categoryItem}>
            <div className={styles.categoryIconLabelWrapper}>
              <Icon
                key="time"
                name="time"
                size={20}
                className={styles.categoryIcon}
              />
              <span className={styles.categoryLabel}>시작 시간</span>
            </div>
            <span
              className={styles.categoryValue}
              data-testid={startTimeTestId}
            >
              {_categories.startTime}
            </span>
          </div>
          <div className={styles.categoryItem}>
            <div className={styles.categoryIconLabelWrapper}>
              <Icon
                key="mic"
                name="mic"
                size={20}
                className={styles.categoryIcon}
              />
              <span className={styles.categoryLabel}>보이스챗</span>
            </div>
            <span
              className={styles.categoryValue}
              data-testid={voiceChatTestId}
            >
              {_categories.voiceChat}
            </span>
          </div>
          <div className={styles.categoryItem}>
            <div className={styles.categoryIconLabelWrapper}>
              <Icon
                key="crown"
                name="crown"
                size={20}
                className={styles.categoryIcon}
              />
              <span className={styles.categoryLabel}>난이도</span>
            </div>
            <span
              className={styles.categoryValue}
              data-testid={difficultyTestId}
            >
              {_categories.difficulty}
            </span>
          </div>
          <div className={styles.categoryItem}>
            <div className={styles.categoryIconLabelWrapper}>
              <Icon
                key="gamepad"
                name="gamepad"
                size={20}
                className={styles.categoryIcon}
              />
              <span className={styles.categoryLabel}>컨트롤 수준</span>
            </div>
            <span
              className={styles.categoryValue}
              data-testid={controlLevelTestId}
            >
              {_categories.controlLevel}
            </span>
          </div>
        </div>

        {/* Button 영역 */}
        <Button
          variant="primary"
          size="m"
          shape="round"
          className={styles.joinButton}
          onClick={handleDetailClick}
          data-testid={joinButtonTestId}
        >
          상세보기
        </Button>
      </div>
    </div>
  );
}
