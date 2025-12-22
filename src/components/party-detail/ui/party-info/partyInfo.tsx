'use client';

import React from 'react';
import Icon from '@/commons/components/icon';
import Tag from '@/commons/components/tag';
import Button from '@/commons/components/button';
import styles from './styles.module.css';

export default function PartyInfo() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.infoSection}>
          <div className={styles.infoInner}>
            <h2 className={styles.title}>파티 정보</h2>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.iconLabelWrapper}>
                  <Icon name="gaming" size={20} className={styles.infoIcon} />
                  <span className={styles.infoLabel}>게임</span>
                </div>
                <span className={styles.infoValue}>팰월드</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconLabelWrapper}>
                  <Icon name="time" size={20} className={styles.infoIcon} />
                  <span className={styles.infoLabel}>시작 시간</span>
                </div>
                <span className={styles.infoValue}>12/25 오후 6:30</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconLabelWrapper}>
                  <Icon name="crown" size={20} className={styles.infoIcon} />
                  <span className={styles.infoLabel}>난이도</span>
                </div>
                <span className={styles.infoValue}>지옥</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconLabelWrapper}>
                  <Icon name="gamepad" size={20} className={styles.infoIcon} />
                  <span className={styles.infoLabel}>컨트롤 수준</span>
                </div>
                <span className={styles.infoValue}>빡숙</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconLabelWrapper}>
                  <Icon name="mic" size={20} className={styles.infoIcon} />
                  <span className={styles.infoLabel}>보이스챗</span>
                </div>
                <span className={styles.infoValue}>필수 사용</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tags}>
          <Tag style="rectangle">FPS</Tag>
          <Tag style="rectangle">저녁</Tag>
          <Tag style="rectangle">빡겜</Tag>
        </div>
      </div>
      <Button
        variant="primary"
        size="m"
        shape="round"
        className={styles.button}
      >
        참여하기
      </Button>
    </div>
  );
}
