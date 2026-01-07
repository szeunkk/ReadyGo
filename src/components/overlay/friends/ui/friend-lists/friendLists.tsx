'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Icon from '@/commons/components/icon';

interface Friend {
  id: string;
  nickname: string;
  status: 'online' | 'offline' | 'away' | 'dnd';
}

export default function FriendLists() {
  const [friends] = useState<Friend[]>([
    { id: '1', nickname: '게이머호랑이', status: 'online' },
    { id: '2', nickname: '게이머호랑이', status: 'offline' },
    { id: '3', nickname: '게이머호랑이', status: 'away' },
    { id: '4', nickname: '게이머호랑이', status: 'dnd' },
    { id: '5', nickname: '까칠한까마귀', status: 'online' },
  ]);

  const handleMessage = (id: string) => {
    // TODO: Implement message functionality
    void id;
  };

  const handleMore = (id: string) => {
    // TODO: Implement more options functionality
    void id;
  };

  return (
    <div className={styles.container}>
      {/* Content */}
      <div className={styles.content}>
        {/* Friend List */}
        <div className={styles.listContainer}>
          {friends.map((friend) => (
            <div key={friend.id} className={styles.friendItem}>
              <div className={styles.userInfo}>
                <div className={styles.avatarWrapper}>
                  <Avatar size="s" status={friend.status} showStatus={true} />
                </div>
                <div className={styles.textInfo}>
                  <div className={styles.nicknameContainer}>
                    <p className={styles.nickname}>{friend.nickname}</p>
                  </div>
                  <div className={styles.statusContainer}>
                    <p className={styles.statusText}>
                      {friend.status === 'online'
                        ? '온라인'
                        : friend.status === 'offline'
                          ? '오프라인'
                          : friend.status === 'away'
                            ? '자리비움'
                            : '방해금지'}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.actionButton}
                  onClick={() => handleMessage(friend.id)}
                  aria-label="메시지 보내기"
                >
                  <Icon name="message-circle-dots" size={20} />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleMore(friend.id)}
                  aria-label="더보기"
                >
                  <div className={styles.moreIcon}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
