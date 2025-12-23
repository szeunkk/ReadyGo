'use client';

import React from 'react';
import styles from './styles.module.css';
import MemberItem from '../member-item/memberItem';

export default function MemberList() {
  return (
    <div className={styles.container}>
      <div className={styles.mainArea}>
        <div className={styles.partyTitle}>
          파티원
          <div className={styles.memberCount}>
            <span className={styles.currentCount}>4</span>
            <span className={styles.maxCount}> / 8명</span>
          </div>
        </div>
        <div className={styles.partyItemGroup}>
          {Array.from({ length: 8 }).map((_, index) => {
            // Mock 데이터 (테스트용)
            const getMemberData = (idx: number) => {
              if (idx === 0) {
                return {
                  userId: 'user-1',
                  name: '까칠한까마귀',
                  animalType: 'raven',
                };
              }
              if (idx === 1) {
                return {
                  userId: 'user-2',
                  name: '도라방돌핀',
                  animalType: 'dolphin',
                };
              }
              if (idx === 2) {
                return {
                  userId: 'user-3',
                  name: '호쾌한망토',
                  animalType: 'fox',
                };
              }
              if (idx === 3) {
                return {
                  userId: 'user-4',
                  name: '용감한사자',
                  animalType: 'bear',
                };
              }
              return { userId: undefined, name: undefined, animalType: undefined };
            };

            const memberData = getMemberData(index);
            const type = index === 0 ? 'leader' : index < 4 ? 'member' : 'empty';

            return (
              <MemberItem
                key={index}
                type={type}
                userId={memberData.userId}
                name={memberData.name}
                animalType={memberData.animalType}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
