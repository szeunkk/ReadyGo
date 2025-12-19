'use client';

import React from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Button from '@/commons/components/button';
import Tag from '@/commons/components/tag';

export interface PartyTag {
  /**
   * 태그 아이콘 이름
   */
  icon?: string;
  /**
   * 태그 레이블
   */
  label: string;
  /**
   * 태그 설명
   */
  description: string;
}

export interface PartyCardProps {
  /**
   * 파티 제목
   */
  title: string;
  /**
   * 파티장 닉네임
   */
  nickname: string;
  /**
   * 매칭률 (0-100)
   */
  matchRate: number;
  /**
   * 파티장 온라인 상태
   */
  status?: 'online' | 'away' | 'ban' | 'offline';
  /**
   * 설명 텍스트
   */
  description?: string;
  /**
   * 태그 목록
   */
  tags: PartyTag[];
  /**
   * 아바타 이미지 경로
   */
  avatarSrc?: string;
  /**
   * 프로필 보기 버튼 클릭 핸들러
   */
  onProfileClick?: () => void;
  /**
   * 추가 클래스명
   */
  className?: string;
}

export default function PartyCard({
  title,
  nickname,
  matchRate,
  status = 'online',
  description = '왜 이 친구와 잘 맞나요?',
  tags,
  avatarSrc,
  onProfileClick,
  className = '',
}: PartyCardProps) {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.content}>
        {/* 파티 제목 */}
        <h3 className={styles.title}>{title}</h3>

        {/* 아바타 */}
        <div className={styles.avatarWrapper}>
          <Avatar
            src={avatarSrc || '/images/bird.svg'}
            alt={nickname}
            size="L"
            status={status}
            showStatus={true}
            className={styles.avatar}
          />
        </div>

        {/* 닉네임 및 매칭률 */}
        <div className={styles.userInfo}>
          <div className={styles.nickname}>{nickname}</div>
          <div className={styles.matchRate}>
            <span className={styles.matchRateLabel}>매칭률</span>
            <span className={styles.matchRateValue}>{matchRate}%</span>
          </div>
        </div>

        {/* 설명 텍스트 */}
        <div className={styles.description}>{description}</div>

        {/* 태그 목록 */}
        <div className={styles.tagContainer}>
          {tags.map((tag, index) => (
            <div key={index} className={styles.tagItem}>
              <Tag style="circle" className={styles.tagIcon}>
                {tag.icon || '🎮'}
              </Tag>
              <div className={styles.tagContent}>
                <span className={styles.tagLabel}>{tag.label}</span>
                <span className={styles.tagDescription}>{tag.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 프로필 보기 버튼 */}
        <Button
          variant="secondary"
          size="m"
          shape="round"
          className={styles.button}
          onClick={onProfileClick}
        >
          프로필 보기
        </Button>
      </div>
    </div>
  );
}

