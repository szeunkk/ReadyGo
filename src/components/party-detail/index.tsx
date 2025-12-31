'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/commons/components/icon';
import { URL_PATHS } from '@/commons/constants/url';
import ChatNull from './ui/chat-null/chatNull';
import ChatRoom from './ui/chat-room/chatRoom';
import MemberList from './ui/member-list/memberList';
import PartyInfo from './ui/party-info/partyInfo';
import { usePartyBinding } from './hooks/index.binding.hook';
import styles from './styles.module.css';

export default function PartyDetail() {
  const [isJoined, setIsJoined] = useState(false);
  const { data, isLoading, error } = usePartyBinding();

  const handleJoinClick = () => {
    setIsJoined(true);
  };

  return (
    <div className={styles.container} data-testid="party-detail-page">
      <div className={styles.titleArea}>
        <div className={styles.titleAreaContent}>
          <Link href={URL_PATHS.PARTY} className={styles.backLink}>
            <Icon name="arrow-left" size={24} className={styles.backIcon} />
            <span className={styles.backText}>돌아가기</span>
          </Link>
          <div className={styles.titleRow}>
            <div className={styles.titleContent}>
              {isLoading ? (
                <>
                  <h1 className={styles.title}>로딩 중...</h1>
                  <p className={styles.subtitle}>데이터를 불러오는 중입니다.</p>
                </>
              ) : error ? (
                <>
                  <h1 className={styles.title}>오류 발생</h1>
                  <p
                    className={styles.subtitle}
                    data-testid="party-detail-error"
                  >
                    {error.message}
                  </p>
                </>
              ) : data ? (
                <>
                  <h1 className={styles.title} data-testid="party-detail-title">
                    {data.party_title}
                  </h1>
                  <p
                    className={styles.subtitle}
                    data-testid="party-detail-description"
                  >
                    {data.description}
                  </p>
                </>
              ) : null}
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.actionButton} type="button">
                <Icon name="edit" size={20} className={styles.buttonIcon} />
                <span className={styles.buttonText}>수정하기</span>
              </button>
              <button className={styles.actionButton} type="button">
                <Icon name="trash" size={20} className={styles.buttonIcon} />
                <span className={styles.buttonText}>삭제하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mainArea}>
        {isJoined ? <ChatRoom /> : <ChatNull />}
        <div className={styles.sideArea}>
          <MemberList />
          <PartyInfo
            data={data}
            isLoading={isLoading}
            error={error}
            onJoinClick={handleJoinClick}
          />
        </div>
      </div>
    </div>
  );
}
