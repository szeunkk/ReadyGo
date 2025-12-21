'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/commons/components/icon';
import { URL_PATHS } from '@/commons/constants/url';
import ChatNull from './ui/chat-null/chatNull';
import MemberList from './ui/member-list/memberList';
import styles from './styles.module.css';

export default function PartyDetail() {
  return (
    <div className={styles.container}>
      <div className={styles.titleArea}>
        <Link href={URL_PATHS.PARTY} className={styles.backLink}>
          <Icon name="arrow-left" size={24} className={styles.backIcon} />
          <span className={styles.backText}>돌아가기</span>
        </Link>
        <h1 className={styles.title}>RPG 길드 매칭</h1>
        <p className={styles.subtitle}>
          대형 RPG 게임을 함께 즐기는 길드원 모집
        </p>
      </div>
      <div className={styles.mainArea}>
        <ChatNull />
        <div className={styles.sideArea}>
          <MemberList />
          <div className={styles.partyInfo}>party-info</div>
        </div>
      </div>
    </div>
  );
}
