import { NotificationItem } from '@/components/overlay/notifications/ui';

// Mock data - TODO: API로 대체 예정
export const mockNotifications: NotificationItem[] = [
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
