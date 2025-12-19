'use client';

import React from 'react';
import Icon from '@/commons/components/icon';
import styles from './styles.module.css';

export default function ChatNull() {
  return (
    <div className={styles.container} aria-label="채팅방 선택 안내">
      <div className={styles.iconContainer} aria-hidden="true">
        <Icon
          name="message-bubble"
          size={40}
          style={{ color: 'var(--color-icon-interactive-secondary)' }}
        />
      </div>

      <div className={styles.textContainer}>
        <h2 className={styles.title}>채팅방을 선택하세요</h2>
        <p className={styles.description}>
          왼쪽 목록에서 대화를 시작할 친구를 선택해주세요
        </p>
      </div>
    </div>
  );
}
