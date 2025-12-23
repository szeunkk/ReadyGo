'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Searchbar from '@/commons/components/searchbar';
import Icon from '@/commons/components/icon';

interface Friend {
  id: string;
  nickname: string;
  status: 'online' | 'offline' | 'away' | 'ban';
}

interface FriendRequest {
  id: string;
  nickname: string;
  status: 'online' | 'offline' | 'away' | 'ban';
}

export default function FriendsContainer() {
  const [activeTab, setActiveTab] = useState<'list' | 'request'>('list');

  const [friends] = useState<Friend[]>([
    { id: '1', nickname: '게이머호랑이', status: 'online' },
    { id: '2', nickname: '게이머호랑이', status: 'offline' },
    { id: '3', nickname: '게이머호랑이', status: 'away' },
    { id: '4', nickname: '게이머호랑이', status: 'ban' },
    { id: '5', nickname: '까칠한까마귀', status: 'online' },
  ]);

  const [friendRequests] = useState<FriendRequest[]>([
    { id: '1', nickname: '게이머호랑이', status: 'online' },
    { id: '2', nickname: '게이머호랑이', status: 'offline' },
    { id: '3', nickname: '게이머호랑이', status: 'away' },
  ]);

  const handleMessage = (id: string) => {
    // TODO: Implement message functionality
    void id;
  };

  const handleMore = (id: string) => {
    // TODO: Implement more options functionality
    void id;
  };

  const handleAccept = (id: string) => {
    // TODO: Implement accept functionality
    void id;
  };

  const handleReject = (id: string) => {
    // TODO: Implement reject functionality
    void id;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return '온라인';
      case 'offline':
        return '오프라인';
      case 'away':
        return '자리비움';
      case 'ban':
        return '방해금지';
      default:
        return '';
    }
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
                <span className={styles.badgeText}>{friendRequests.length}</span>
              </div>
            )}
          </button>
        </div>

        {/* Friend List */}
        {activeTab === 'list' && (
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
                        {getStatusText(friend.status)}
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
        )}

        {/* Friend Request List */}
        {activeTab === 'request' && (
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
                        {getStatusText(request.status)}
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
        )}
      </div>
    </div>
  );
}
