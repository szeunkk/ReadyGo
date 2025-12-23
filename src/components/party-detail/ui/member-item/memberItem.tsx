'use client';

import React from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Tag from '@/commons/components/tag';
import Icon from '@/commons/components/icon';
import { AnimalType } from '@/commons/constants/animal';
import { useSideProfilePanel } from '@/hooks/useSideProfilePanel';

export type MemberItemType = 'leader' | 'member' | 'empty';

export interface MemberItemProps {
  type: MemberItemType;
  userId?: string;
  name?: string;
  animalType?: string;
  className?: string;
}

export default function MemberItem({
  type,
  userId,
  name,
  animalType,
  className = '',
}: MemberItemProps) {
  // 사이드 프로필 패널 제어
  const { toggleProfile, isOpen, targetUserId } = useSideProfilePanel();
  const isActive = isOpen && userId && targetUserId === userId;

  const handleClick = () => {
    if (type !== 'empty' && userId) {
      toggleProfile(userId);
    }
  };

  if (type === 'empty') {
    const emptyContainerClasses = [styles.container, styles.empty, className]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={emptyContainerClasses}>
        <div className={styles.avatarWrapper}>
          <div className={styles.emptyAvatar}>
            <Icon name="userprofile" size={24} className={styles.emptyIcon} />
          </div>
        </div>
        <span className={styles.emptyText}>빈 자리</span>
      </div>
    );
  }

  const containerClasses = [
    styles.container,
    isActive && styles.active,
    userId && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      role={userId ? 'button' : undefined}
      tabIndex={userId ? 0 : undefined}
      aria-label={userId ? `${name} 프로필 보기` : undefined}
    >
      <div className={styles.avatarWrapper}>
        <Avatar
          animalType={animalType as AnimalType}
          alt={name || 'Member'}
          size="s"
          status="online"
          showStatus={true}
        />
      </div>
      <div className={styles.nameAndTag}>
        <span className={styles.name}>{name}</span>
        {type === 'leader' && <Tag style="duotone">파티장</Tag>}
      </div>
    </div>
  );
}
