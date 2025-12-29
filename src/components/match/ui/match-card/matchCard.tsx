'use client';

import React from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Button from '@/commons/components/button';
import Tag from '@/commons/components/tag';
import { AnimalType } from '@/commons/constants/animal';

export interface MatchCardProps {
  /**
   * 사용자 ID
   */
  userId: string;
  /**
   * 사용자 닉네임
   */
  nickname: string;
  /**
   * 매칭률 (0-100)
   */
  matchRate: number;
  /**
   * 사용자 온라인 상태
   */
  status?: 'online' | 'away' | 'ban' | 'offline';
  /**
   * 동물 타입
   */
  animalType?: string;
  /**
   * 태그 목록
   */
  tags: string[];
  /**
   * 프로필 보기 버튼 클릭 핸들러
   */
  onProfileClick?: () => void;
  /**
   * 프로필이 열려있는지 여부
   */
  isProfileOpen?: boolean;
  /**
   * 추가 클래스명
   */
  className?: string;
}

export default function MatchCard({
  userId: _userId,
  nickname,
  matchRate,
  status = 'online',
  animalType,
  tags,
  onProfileClick,
  isProfileOpen = false,
  className = '',
}: MatchCardProps) {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.content}>
        {/* 아바타 및 사용자 정보 섹션 */}
        <div className={styles.userSection}>
          {/* 아바타 */}
          <div className={styles.avatarWrapper}>
            <Avatar
              animalType={animalType as AnimalType}
              alt={nickname}
              size="m"
              status={status}
              showStatus={true}
              className={styles.avatar}
            />
          </div>

          {/* 닉네임 및 매칭률 */}
          <div className={styles.userInfo}>
            <div className={styles.nameSection}>
              <h3 className={styles.nickname}>{nickname}</h3>
              <div className={styles.matchRate}>
                <span className={styles.matchRateLabel}>매칭률</span>
                <span className={styles.matchRateValue}>{matchRate}%</span>
              </div>
            </div>

            {/* 태그 목록 */}
            <div className={styles.tagContainer}>
              {tags.map((tag, index) => (
                <Tag key={index} style="duotone" className={styles.tag}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        {/* 프로필 보기 버튼 */}
        <Button
          variant="secondary"
          size="m"
          shape="round"
          className={styles.button}
          onClick={onProfileClick}
        >
          {isProfileOpen ? '프로필 닫기' : '프로필 보기'}
        </Button>
      </div>
    </div>
  );
}
