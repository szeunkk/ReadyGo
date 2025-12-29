'use client';

import React from 'react';
import Icon from '@/commons/components/icon';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import styles from './styles.module.css';

export default function ChatNull() {
  return (
    <div className={styles.chatArea}>
      <div className={styles.chatLog}>
        <div className={styles.chatLogContent}>
          <div className={styles.iconWrapper}>
            <Icon name="message-bubble" size={40} className={styles.icon} />
          </div>
          <p className={styles.mainMessage}>
            파티에 참여하면 채팅을 볼 수 있어요
          </p>
          <p className={styles.secondaryMessage}>
            오른쪽에서 참여하기 버튼을 눌러주세요
          </p>
        </div>
      </div>
      <div className={styles.messageArea}>
        <Input
          variant="primary"
          state="disabled"
          size="m"
          placeholder="파티에 참여하면 메세지를 보낼 수 있어요"
        />
        <Button
          variant="primary"
          state="disabled"
          shape="round"
          className={styles.sendButton}
          disabled
        >
          <Icon name="send" size={20} className={styles.sendIcon} />
        </Button>
      </div>
    </div>
  );
}
