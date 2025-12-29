'use client';

import { useState } from 'react';
import Icon from '@/commons/components/icon';
import { useAuth } from '@/commons/providers/auth/auth.provider';
import styles from './styles.module.css';

type UserStatus = 'online' | 'away' | 'dnd' | 'offline';

interface ProfileDropdownProps {
  onClose: () => void;
}

// 상태별 정보
const STATUS_CONFIG = {
  online: {
    label: '온라인',
    color: 'var(--color-icon-success)',
  },
  away: {
    label: '자리비움',
    color: 'var(--color-icon-warning)',
  },
  dnd: {
    label: '방해금지',
    color: 'var(--color-icon-danger)',
  },
  offline: {
    label: '오프라인',
    color: 'var(--color-icon-interactive-secondary)',
  },
} as const;

export default function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const { logout } = useAuth();
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<UserStatus>('online');

  // TODO: 실제 사용자 데이터로 교체
  const user = {
    nickname: '게이머베어',
    username: '@gamer_bear',
    avatar: 'bear', // 아바타 타입
    isSteamConnected: true,
  };

  const handleStatusToggle = () => {
    setIsStatusOpen(!isStatusOpen);
  };

  const handleStatusSelect = (status: UserStatus) => {
    setCurrentStatus(status);
    setIsStatusOpen(false);
    // TODO: 실제 상태 변경 API 호출
  };

  const handleViewProfile = () => {
    // TODO: 프로필 페이지로 이동
    onClose();
  };

  const handleEditProfile = () => {
    // TODO: 프로필 수정 페이지로 이동
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className={styles.dropdown} role="menu" aria-label="프로필 메뉴">
      {/* 사용자 정보 */}
      <div className={styles.userInfo}>
        <div className={styles.userInfoContent}>
          <div className={styles.avatar}>
            {/* TODO: Avatar 컴포넌트로 교체 */}
            <Icon name="user" size={20} />
          </div>
          <div className={styles.userText}>
            <div className={styles.nickname}>{user.nickname}</div>
            <div className={styles.username}>{user.username}</div>
          </div>
        </div>
      </div>

      {/* 온라인 상태 */}
      <div className={styles.section}>
        <div className={styles.statusContainer}>
          <button
            className={styles.statusButton}
            onClick={handleStatusToggle}
            role="menuitem"
            aria-expanded={isStatusOpen}
          >
            <div className={styles.statusContent}>
              <div
                className={styles.statusIndicator}
                style={{
                  backgroundColor: STATUS_CONFIG[currentStatus].color,
                }}
              />
              <span className={styles.statusText}>
                {STATUS_CONFIG[currentStatus].label}
              </span>
            </div>
            <Icon
              name="chevron-right"
              size={16}
              className={`${styles.statusChevron} ${isStatusOpen ? styles.statusChevronOpen : ''}`}
            />
          </button>

          {/* 상태 옵션 목록 */}
          {isStatusOpen && (
            <div className={styles.statusOptions}>
              {(Object.keys(STATUS_CONFIG) as UserStatus[]).map((status) => (
                <button
                  key={status}
                  className={`${styles.statusOption} ${currentStatus === status ? styles.statusOptionActive : ''}`}
                  onClick={() => handleStatusSelect(status)}
                  role="menuitemradio"
                  aria-checked={currentStatus === status}
                >
                  <div className={styles.statusContent}>
                    <div
                      className={styles.statusIndicator}
                      style={{
                        backgroundColor: STATUS_CONFIG[status].color,
                      }}
                    />
                    <span className={styles.statusOptionText}>
                      {STATUS_CONFIG[status].label}
                    </span>
                  </div>
                  {currentStatus === status && <Icon name="check" size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 프로필 메뉴 */}
      <div className={styles.section}>
        <button
          className={styles.menuItem}
          onClick={handleViewProfile}
          role="menuitem"
        >
          <Icon name="user" size={16} />
          <span>프로필 보기</span>
        </button>
        <button
          className={styles.menuItem}
          onClick={handleEditProfile}
          role="menuitem"
        >
          <Icon name="settings" size={16} />
          <span>프로필 수정</span>
        </button>
      </div>

      {/* 스팀 연동 */}
      <div className={styles.section}>
        <div className={styles.steamConnection}>
          <div className={styles.steamContent}>
            <div className={styles.steamIconContainer}>
              <Icon name="steam" size={20} />
            </div>
            <div className={styles.steamText}>
              <div className={styles.steamLabel}>스팀 연동</div>
              <div className={styles.steamStatus}>
                {user.isSteamConnected ? '연동됨' : '미연동'}
              </div>
            </div>
          </div>
          {user.isSteamConnected && (
            <div className={styles.connectedIndicator} />
          )}
        </div>
      </div>

      {/* 로그아웃 */}
      <div className={styles.logoutSection}>
        <button
          className={styles.logoutButton}
          onClick={handleLogout}
          role="menuitem"
        >
          <Icon name="log-out" size={16} />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
}
