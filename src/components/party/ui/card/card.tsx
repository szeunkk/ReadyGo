'use client';

import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import Button from '@/commons/components/button';
import Tag from '@/commons/components/tag';
import Icon from '@/commons/components/icon';

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
   * 파티 멤버 아바타 목록
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
   * 참여하기 버튼 클릭 핸들러
   */
  onJoinClick?: () => void;
  /**
   * 추가 클래스명
   */
  className?: string;
}

export default function Card({
  title,
  description,
  gameTag,
  memberAvatars,
  currentMembers,
  maxMembers,
  categories: _categories,
  onJoinClick,
  className = '',
}: PartyCardProps) {
  const containerClasses = [styles.card, className].filter(Boolean).join(' ');

  // 표시할 아바타 개수 (최대 4개)
  const displayAvatars = memberAvatars.slice(0, 4);
  const remainingCount = Math.max(0, memberAvatars.length - 4);

  return (
    <div className={containerClasses}>
      {/* Title 영역 */}
      <div className={styles.cardTitleMemberWrapper}>
        <div className={styles.titleSection}>
          <div className={styles.titleTagWrapper}>
            <h2 className={styles.cardTitle}>{title}</h2>
            <Tag style="duotone" className={styles.gameTag}>
              {gameTag}
            </Tag>
          </div>
          <p className={styles.cardDescription}>{description}</p>
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
                <Image
                  src={avatar}
                  alt={`Member ${index + 1}`}
                  width={40}
                  height={40}
                  className={styles.avatar}
                  unoptimized
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div className={styles.avatarWrapper} style={{ zIndex: 0 }}>
                <div className={styles.remainingCount}>+{remainingCount}</div>
              </div>
            )}
          </div>
          <div className={styles.memberCount}>
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
            <span className={styles.categoryValue}>
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
            <span className={styles.categoryValue}>
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
            <span className={styles.categoryValue}>
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
            <span className={styles.categoryValue}>
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
          onClick={onJoinClick}
        >
          참여하기
        </Button>
      </div>
    </div>
  );
}
