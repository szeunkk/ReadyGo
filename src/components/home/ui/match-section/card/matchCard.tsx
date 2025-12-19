'use client';

import React from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Button from '@/commons/components/button';

export interface MatchCardProps {
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
   * 사용자 아바타 이미지 경로
   */
  avatarSrc?: string;
  /**
   * 질문 텍스트
   */
  question?: string;
  /**
   * 게임 선호 항목들
   */
  preferences?: {
    icon: string;
    label: string;
    value: string;
  }[];
  /**
   * 프로필 보기 버튼 클릭 핸들러
   */
  onProfileClick?: () => void;
  /**
   * 추가 클래스명
   */
  className?: string;
}

export default function MatchCard({
  nickname,
  matchRate,
  status = 'online',
  avatarSrc,
  question = '왜 이 친구와 잘 맞나요?',
  preferences = [],
  onProfileClick,
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
              src={avatarSrc || '/images/bird.svg'}
              alt={nickname}
              size="m"
              status={status}
              showStatus={true}
              className={styles.avatar}
            />
          </div>

          {/* 닉네임 및 매칭률 */}
          <div className={styles.userInfo}>
            <h3 className={styles.nickname}>{nickname}</h3>
            <div className={styles.matchRate}>
              <span className={styles.matchRateLabel}>매칭률</span>
              <span className={styles.matchRateValue}>{matchRate}%</span>
            </div>
          </div>
        </div>

        {/* 질문 섹션 */}
        {question && (
          <div className={styles.questionSection}>
            <p className={styles.questionText}>{question}</p>
          </div>
        )}

        {/* 선호도 목록 */}
        {preferences.length > 0 && (
          <div className={styles.preferencesSection}>
            {preferences.map((preference, index) => (
              <div key={index} className={styles.preferenceItem}>
                <div className={styles.preferenceIcon}>
                  <span className={styles.iconEmoji}>{preference.icon}</span>
                  <span className={styles.preferenceLabel}>
                    {preference.label}
                  </span>
                </div>
                <span className={styles.preferenceValue}>
                  {preference.value}
                </span>
              </div>
            ))}
          </div>
        )}

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

