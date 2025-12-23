'use client';

import React from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Tag from '@/commons/components/tag';
import Icon from '@/commons/components/icon';

export type MemberItemType = 'leader' | 'member' | 'empty';

export interface MemberItemProps {
  type: MemberItemType;
  name?: string;
  animalType?: string;
  className?: string;
}

export default function MemberItem({
  type,
  name,
  animalType,
  className = '',
}: MemberItemProps) {
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

  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.avatarWrapper}>
        <Avatar
          animalType={animalType as any}
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



