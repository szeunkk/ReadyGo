'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Icon from '@/commons/components/icon';

interface FriendRequest {
  id: string;
  nickname: string;
  status: 'online' | 'offline' | 'away' | 'dnd';
}

export default function FriendRequests() {
  const [friendRequests] = useState<FriendRequest[]>([
    { id: '1', nickname: '게이머호랑이', status: 'online' },
    { id: '2', nickname: '게이머호랑이', status: 'offline' },
    { id: '3', nickname: '게이머호랑이', status: 'away' },
  ]);

  const handleAccept = (id: string) => {
    // TODO: Implement accept functionality
    void id;
  };

  const handleReject = (id: string) => {
    // TODO: Implement reject functionality
    void id;
  };

  return (
    <div className={styles.container}>
      {/* Content */}
      <div className={styles.content}>
        {/* Friend Request List */}
        <div className={styles.listContainer}>
          {friendRequests.map((request) => (
            <div key={request.id} className={styles.requestItem}>
              <div className={styles.userInfo}>
                <div className={styles.avatarWrapper}>
                  <Avatar size="s" status={request.status} showStatus={false} />
                </div>
                <div className={styles.textInfo}>
                  <div className={styles.nicknameContainer}>
                    <p className={styles.nickname}>{request.nickname}</p>
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.actionButton}
                  onClick={() => handleAccept(request.id)}
                  aria-label="수락"
                >
                  <Icon name="check" size={20} />
                </button>
                <button
                  className={`${styles.actionButton} ${styles.rejectButton}`}
                  onClick={() => handleReject(request.id)}
                  aria-label="거절"
                >
                  <Icon name="x" size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
