'use client';

import React from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Button from '@/commons/components/button';
import Tag from '@/commons/components/tag';
import { AnimalType } from '@/commons/constants/animal';
import { useSideProfilePanel } from '@/hooks/useSideProfilePanel';

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
   * 추가 클래스명
   */
  className?: string;
}

export default function MatchCard({
  userId,
  nickname,
  matchRate,
  status = 'online',
  animalType,
  tags,
  className = '',
}: MatchCardProps) {
  // 사이드 프로필 패널 제어
  const { toggleProfile, isOpen, targetUserId } = useSideProfilePanel();
  const isActive = isOpen && targetUserId === userId;

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

        {/* 
          프로필 보기 버튼
          - 현재: userId props로 전달된 사용자 ID 사용
          - 실제 데이터 전환 시: userId에 실제 user ID를 전달하면 됨
          - toggleProfile() 함수는 수정 없이 그대로 동작
        */}
        <Button
          variant="secondary"
          size="m"
          shape="round"
          className={styles.button}
          onClick={() => toggleProfile(userId)}
        >
          {isActive ? '프로필 닫기' : '프로필 보기'}
        </Button>
      </div>
    </div>
  );
}
