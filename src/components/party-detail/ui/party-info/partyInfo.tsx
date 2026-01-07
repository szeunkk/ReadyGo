'use client';

import React from 'react';
import Icon from '@/commons/components/icon';
import Tag from '@/commons/components/tag';
import Button from '@/commons/components/button';
import type { PartyDetailData } from '../../hooks/index.binding.hook';
import styles from './styles.module.css';

interface PartyInfoProps {
  data: PartyDetailData | null;
  isLoading: boolean;
  error: Error | null;
  userRole?: 'leader' | 'member' | null;
  onJoinClick?: () => void;
  onLeaveClick?: () => void;
  onGameStartClick?: () => void;
}

export default function PartyInfo({
  data,
  isLoading,
  error,
  userRole = null,
  onJoinClick,
  onLeaveClick,
  onGameStartClick,
}: PartyInfoProps) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.infoSection}>
            <div className={styles.infoInner}>
              <h2 className={styles.title}>파티 정보</h2>
              <div className={styles.infoList}>
                <span className={styles.infoValue}>로딩 중...</span>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          size="m"
          shape="round"
          className={styles.button}
          disabled
        >
          참여하기
        </Button>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.infoSection}>
            <div className={styles.infoInner}>
              <h2 className={styles.title}>파티 정보</h2>
              <div className={styles.infoList}>
                <span className={styles.infoValue}>
                  {error?.message || '데이터를 불러올 수 없습니다.'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          size="m"
          shape="round"
          className={styles.button}
          disabled
        >
          참여하기
        </Button>
      </div>
    );
  }

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
                <span
                  className={styles.infoValue}
                  data-testid="party-detail-game-title"
                >
                  {data.game_title}
                </span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconLabelWrapper}>
                  <Icon name="time" size={20} className={styles.infoIcon} />
                  <span className={styles.infoLabel}>시작 시간</span>
                </div>
                <span
                  className={styles.infoValue}
                  data-testid="party-detail-start-time"
                >
                  {data.start_date} {data.start_time}
                </span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconLabelWrapper}>
                  <Icon name="crown" size={20} className={styles.infoIcon} />
                  <span className={styles.infoLabel}>난이도</span>
                </div>
                <span
                  className={styles.infoValue}
                  data-testid="party-detail-difficulty"
                >
                  {data.difficulty}
                </span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconLabelWrapper}>
                  <Icon name="gamepad" size={20} className={styles.infoIcon} />
                  <span className={styles.infoLabel}>컨트롤 수준</span>
                </div>
                <span
                  className={styles.infoValue}
                  data-testid="party-detail-control-level"
                >
                  {data.control_level}
                </span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconLabelWrapper}>
                  <Icon name="mic" size={20} className={styles.infoIcon} />
                  <span className={styles.infoLabel}>보이스챗</span>
                </div>
                <span
                  className={styles.infoValue}
                  data-testid="party-detail-voice-chat"
                >
                  {data.voice_chat}
                </span>
              </div>
            </div>
          </div>
        </div>
        {data.tags && data.tags.length > 0 && (
          <div className={styles.tags} data-testid="party-detail-tags">
            {data.tags.map((tag, index) => (
              <Tag key={index} style="rectangle">
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>
      {userRole === 'leader' ? (
        <Button
          variant="primary"
          size="m"
          shape="round"
          className={styles.button}
          onClick={onGameStartClick}
          data-testid="party-detail-game-start-button"
        >
          <Icon name="play-circle" size={20} />
          게임시작
        </Button>
      ) : userRole === 'member' ? (
        <Button
          variant="primary"
          size="m"
          shape="round"
          className={styles.button}
          onClick={onLeaveClick}
          data-testid="party-detail-leave-button"
        >
          파티 나가기
        </Button>
      ) : (
        <Button
          variant="primary"
          size="m"
          shape="round"
          className={styles.button}
          onClick={onJoinClick}
          data-testid="party-detail-join-button"
        >
          참여하기
        </Button>
      )}
    </div>
  );
}
