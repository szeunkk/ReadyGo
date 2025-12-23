'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Searchbar from '@/commons/components/searchbar';
import Icon from '@/commons/components/icon';

interface FriendRequest {
  id: string;
  nickname: string;
  status: 'online' | 'offline' | 'away' | 'ban';
}

export default function FriendRequests() {
  const [activeTab, setActiveTab] = useState<'list' | 'request'>('request');
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
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>친구</h1>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <Searchbar placeholder="검색하기">
            <Icon name="search" size={20} />
            <input
              type="text"
              placeholder="검색하기"
              className={styles.searchInput}
            />
          </Searchbar>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'list' ? '' : styles.tabInactive}`}
            onClick={() => setActiveTab('list')}
          >
            <span className={styles.tabText}>친구 목록</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'request' ? '' : styles.tabInactive}`}
            onClick={() => setActiveTab('request')}
          >
            <span className={styles.tabText}>친구 요청</span>
            {friendRequests.length > 0 && (
              <div className={styles.badge}>
                <span className={styles.badgeText}>
                  {friendRequests.length}
                </span>
              </div>
            )}
          </button>
        </div>

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
                  <div className={styles.statusContainer}>
                    <p className={styles.statusText}>
                      {request.status === 'online'
                        ? '온라인'
                        : request.status === 'offline'
                          ? '오프라인'
                          : request.status === 'away'
                            ? '자리비움'
                            : '방해금지'}
                    </p>
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
