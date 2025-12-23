'use client';

import Icon, { type IconName } from '@/commons/components/icon';
import styles from './styles.module.css';

// 알림 타입 정의
export type NotificationType =
  | 'REVIEW_RECEIVED' // 후기 받음
  | 'REVIEW_REQUESTED' // 후기 요청
  | 'FRIEND_REQUESTED' // 친구 요청
  | 'PARTY_INVITED' // 파티 초대
  | 'CHAT_RECEIVED'; // 메시지 받음

// 알림 아이템 인터페이스
export interface NotificationItem {
  id: string;
  type: NotificationType;
  nickname: string;
  timestamp: string;
  isRead: boolean;
  onClick?: () => void;
}

// 알림 리스트 Props
interface NotificationsProps {
  notifications: NotificationItem[];
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
}

// 알림 타입별 메시지 생성
const getNotificationMessage = (
  type: NotificationType,
  nickname: string
): string => {
  switch (type) {
    case 'REVIEW_RECEIVED':
      return `${nickname}님이 후기를 보냄`;
    case 'REVIEW_REQUESTED':
      return `${nickname}님과의 게임은 어떠셨나요?`;
    case 'FRIEND_REQUESTED':
      return `${nickname}님이 친구 요청을 보냄`;
    case 'PARTY_INVITED':
      return `${nickname}님이 파티에 초대함`;
    case 'CHAT_RECEIVED':
      return `${nickname}님이 메시지를 보냄`;
    default:
      return '';
  }
};

// 알림 타입별 아이콘 이름
const getNotificationIcon = (type: NotificationType): IconName => {
  switch (type) {
    case 'REVIEW_RECEIVED':
      return 'review';
    case 'REVIEW_REQUESTED':
      return 'edit';
    case 'FRIEND_REQUESTED':
      return 'add-user';
    case 'PARTY_INVITED':
      return 'group';
    case 'CHAT_RECEIVED':
      return 'message-circle-dots';
    default:
      return 'notification';
  }
};

// 단일 알림 아이템 컴포넌트
const NotificationItemComponent = ({
  notification,
  onClick,
}: {
  notification: NotificationItem;
  onClick?: () => void;
}) => {
  const message = getNotificationMessage(
    notification.type,
    notification.nickname
  );
  const iconName = getNotificationIcon(notification.type);

  return (
    <button
      className={`${styles.notificationItem} ${notification.isRead ? styles.read : styles.unread}`}
      onClick={onClick}
      type="button"
    >
      <div className={styles.notificationContent}>
        <div className={styles.iconContainer}>
          <Icon name={iconName} size={20} className={styles.icon} />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.message}>{message}</div>
          <div className={styles.timestamp}>{notification.timestamp}</div>
        </div>
      </div>
      {!notification.isRead && <div className={styles.unreadDot} />}
    </button>
  );
};

// 메인 알림 컴포넌트
export default function Notifications({
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
}: NotificationsProps) {
  const handleNotificationClick = (notification: NotificationItem) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    if (notification.onClick) {
      notification.onClick();
    }
  };

  return (
    <div className={styles.notificationsContainer}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>알림 수신함</h2>
        {onMarkAllAsRead && (
          <button
            className={styles.markAllReadButton}
            onClick={onMarkAllAsRead}
            type="button"
          >
            모두 읽음
          </button>
        )}
      </div>

      {/* 알림 리스트 */}
      <div className={styles.notificationsList}>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>알림이 없습니다</div>
        ) : (
          notifications.map((notification) => (
            <NotificationItemComponent
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
            />
          ))
        )}
      </div>
    </div>
  );
}
