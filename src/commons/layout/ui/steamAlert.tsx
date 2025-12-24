'use client';

import React from 'react';
import Icon from '@/commons/components/icon';
import Button from '@/commons/components/button';
import styles from '../styles.module.css';
import { HTMLAttributes } from 'react';

export interface SteamAlertProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onClick'
> {
  /**
   * 스팀 계정 연동 버튼 클릭 핸들러
   */
  onConnect?: () => void;
  /**
   * 닫기 버튼 클릭 핸들러
   */
  onClose?: () => void;
  /**
   * 알림 텍스트
   * @default '스팀 계정을 연동해 실제 플레이 데이터로 더 정확한 매칭을 받아보세요.'
   */
  message?: string;
  /**
   * 버튼 텍스트
   * @default '스팀 계정 연동하기'
   */
  buttonText?: string;
}

export const SteamAlert = ({
  onConnect,
  onClose,
  message = '스팀 계정을 연동해 실제 플레이 데이터로 더 정확한 매칭을 받아보세요.',
  buttonText = '스팀 계정 연동하기',
  className = '',
  ...props
}: SteamAlertProps) => {
  const handleConnect = () => {
    onConnect?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  const alertClasses = [styles.steamAlert, className].filter(Boolean).join(' ');

  return (
    <div className={alertClasses} {...props}>
      <div className={styles.steamAlertContent}>
        <div className={styles.steamAlertLeft}>
          <Icon name="alert" size={24} className={styles.steamAlertIcon} />
          <p className={styles.steamAlertText}>{message}</p>
        </div>
        <Button
          variant="primary"
          size="s"
          shape="round"
          onClick={handleConnect}
          className={styles.steamAlertButton}
        >
          <Icon name="steam" size={16} className={styles.steamButtonIcon} />
          {buttonText}
        </Button>
        <button
          onClick={handleClose}
          className={styles.steamAlertClose}
          aria-label="닫기"
        >
          <Icon name="x" size={24} className={styles.steamAlertCloseIcon} />
        </button>
      </div>
    </div>
  );
};
