'use client';
import OverlayContainer from '@/commons/components/overlay/';
import Notifications, {
  type NotificationItem,
} from '@/components/overlay/notifications/ui';

// 테스트용 더미 데이터
const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'REVIEW_RECEIVED',
    nickname: '까칠한까마귀',
    timestamp: '방금 전',
    isRead: false,
  },
  {
    id: '2',
    type: 'REVIEW_REQUESTED',
    nickname: '게이머호랑이',
    timestamp: '방금 전',
    isRead: false,
  },
  {
    id: '3',
    type: 'FRIEND_REQUESTED',
    nickname: '전략토끼',
    timestamp: '5분 전',
    isRead: false,
  },
  {
    id: '4',
    type: 'PARTY_INVITED',
    nickname: '캐주얼곰',
    timestamp: '3시간 전',
    isRead: false,
  },
  {
    id: '5',
    type: 'CHAT_RECEIVED',
    nickname: '게이머호랑이',
    timestamp: '5시간 전',
    isRead: true,
  },
  {
    id: '6',
    type: 'PARTY_INVITED',
    nickname: '돌핀',
    timestamp: '8시간 전',
    isRead: true,
  },
];

export default function NotificationsPage() {
  const handleMarkAllAsRead = () => {
    // TODO: 모두 읽음 처리 로직 구현
  };

  const handleNotificationClick = (_notification: NotificationItem) => {
    // TODO: 알림 클릭 처리 로직 구현
  };

  return (
    <OverlayContainer onClose={() => history.back()}>
      <Notifications
        notifications={mockNotifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNotificationClick={handleNotificationClick}
      />
    </OverlayContainer>
  );
}
