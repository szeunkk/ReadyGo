'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/commons/components/avatar';
import { getChatRoomUrl } from '@/commons/constants/url';
import styles from './styles.module.css';
import { AnimalType } from '@/commons/constants/animal';

// ERD 기반 Mock 데이터 타입 정의
interface ChatRoom {
  room_id: string;
  room_type: '1:1' | 'group';
  room_name?: string;
  created_at: string;
  updated_at: string;
}

interface ChatRoomMember {
  member_id: string;
  room_id: string;
  user_id: string;
  nickname: string;
  animalType?: string;
  joined_at: string;
  status?: 'online' | 'away' | 'dnd' | 'offline';
}

interface ChatMessage {
  message_id: string;
  room_id: string;
  sender_id: string;
  content: string;
  content_type: 'text' | 'image' | 'system';
  created_at: string;
}

// interface ChatMessageRead {
//   read_id: string;
//   message_id: string;
//   user_id: string;
//   is_read: boolean;
//   read_at?: string;
// }

// interface ChatBlock {
//   block_id: string;
//   blocker_id: string;
//   blocked_id: string;
//   created_at: string;
// }

interface ChatListItemData {
  room: ChatRoom;
  members: ChatRoomMember[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isBlocked: boolean;
}

// Mock 데이터 (ERD 필드명 기반) - export하여 다른 컴포넌트에서도 사용 가능
export const mockChatRooms: ChatListItemData[] = [
  {
    room: {
      room_id: 'room-1',
      room_type: '1:1',
      created_at: '2024-12-19T10:00:00Z',
      updated_at: '2024-12-19T14:58:00Z',
    },
    members: [
      {
        member_id: 'member-1',
        room_id: 'room-1',
        user_id: 'user-1',
        nickname: '게이머호랑이',
        animalType: 'tiger',
        joined_at: '2024-12-19T10:00:00Z',
        status: 'online',
      },
    ],
    lastMessage: {
      message_id: 'msg-1',
      room_id: 'room-1',
      sender_id: 'user-1',
      content: '오늘 저녁에 같이 게임할래?',
      content_type: 'text',
      created_at: '2024-12-19T14:58:00Z',
    },
    unreadCount: 2,
    isBlocked: false,
  },
  {
    room: {
      room_id: 'room-2',
      room_type: '1:1',
      created_at: '2024-12-19T09:00:00Z',
      updated_at: '2024-12-19T14:50:00Z',
    },
    members: [
      {
        member_id: 'member-2',
        room_id: 'room-2',
        user_id: 'user-2',
        nickname: '호쾌한망토',
        animalType: 'fox',
        joined_at: '2024-12-19T09:00:00Z',
        status: 'away',
      },
    ],
    lastMessage: {
      message_id: 'msg-2',
      room_id: 'room-2',
      sender_id: 'user-2',
      content: '오늘 저녁에 같이 게임할래?',
      content_type: 'text',
      created_at: '2024-12-19T14:50:00Z',
    },
    unreadCount: 2,
    isBlocked: false,
  },
  {
    room: {
      room_id: 'room-3',
      room_type: '1:1',
      created_at: '2024-12-19T08:00:00Z',
      updated_at: '2024-12-19T14:00:00Z',
    },
    members: [
      {
        member_id: 'member-3',
        room_id: 'room-3',
        user_id: 'user-3',
        nickname: '까칠한까마귀',
        animalType: 'raven',
        joined_at: '2024-12-19T08:00:00Z',
        status: 'offline',
      },
    ],
    lastMessage: {
      message_id: 'msg-3',
      room_id: 'room-3',
      sender_id: 'user-3',
      content: '오늘 저녁 9시쯤 어떠세요?',
      content_type: 'text',
      created_at: '2024-12-19T14:00:00Z',
    },
    unreadCount: 2,
    isBlocked: false,
  },
  {
    room: {
      room_id: 'room-4',
      room_type: 'group',
      room_name: '게임 파티',
      created_at: '2024-12-19T07:00:00Z',
      updated_at: '2024-12-19T13:00:00Z',
    },
    members: [
      {
        member_id: 'member-4',
        room_id: 'room-4',
        user_id: 'user-4',
        nickname: '용감한사자',
        animalType: 'bear',
        joined_at: '2024-12-19T07:00:00Z',
        status: 'online',
      },
      {
        member_id: 'member-5',
        room_id: 'room-4',
        user_id: 'user-5',
        nickname: '날쌘독수리',
        animalType: 'hawk',
        joined_at: '2024-12-19T07:00:00Z',
        status: 'away',
      },
    ],
    lastMessage: {
      message_id: 'msg-4',
      room_id: 'room-4',
      sender_id: 'user-4',
      content: '다들 준비됐나요?',
      content_type: 'text',
      created_at: '2024-12-19T13:00:00Z',
    },
    unreadCount: 0,
    isBlocked: false,
  },
  {
    room: {
      room_id: 'room-5',
      room_type: '1:1',
      created_at: '2024-12-19T06:00:00Z',
      updated_at: '2024-12-19T12:00:00Z',
    },
    members: [
      {
        member_id: 'member-6',
        room_id: 'room-5',
        user_id: 'user-6',
        nickname: '차단된유저',
        animalType: 'wolf',
        joined_at: '2024-12-19T06:00:00Z',
        status: 'dnd',
      },
    ],
    lastMessage: {
      message_id: 'msg-5',
      room_id: 'room-5',
      sender_id: 'user-6',
      content: '안녕하세요',
      content_type: 'text',
      created_at: '2024-12-19T12:00:00Z',
    },
    unreadCount: 0,
    isBlocked: true,
  },
];

// 시간 포맷 함수 (24h 기준, 오늘은 시간, 그 외는 날짜)
const formatMessageTime = (dateString: string): string => {
  const messageDate = new Date(dateString);
  const now = new Date();
  const isToday =
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear();

  if (isToday) {
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) {
      return '방금 전';
    }
    if (diffMins < 60) {
      return `${diffMins}분 전`;
    }
    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }
  }

  const month = messageDate.getMonth() + 1;
  const day = messageDate.getDate();
  return `${month}월 ${day}일`;
};

// 메시지 내용 포맷 함수
const formatMessageContent = (message: ChatMessage | undefined): string => {
  if (!message) {
    return '메시지가 없습니다';
  }

  switch (message.content_type) {
    case 'image':
      return '📷 이미지';
    case 'system':
      return message.content;
    case 'text':
    default:
      return message.content;
  }
};

// 채팅방 이름 생성 함수
const getChatRoomName = (room: ChatRoom, members: ChatRoomMember[]): string => {
  if (room.room_type === 'group') {
    return room.room_name || `그룹 채팅 (${members.length}명)`;
  }
  return members[0]?.nickname || '알 수 없음';
};

interface ChatListItemProps {
  data: ChatListItemData;
  isSelected?: boolean;
  onClick?: () => void;
}

const ChatListItem = ({
  data,
  isSelected = false,
  onClick,
}: ChatListItemProps) => {
  const { room, members, lastMessage, unreadCount, isBlocked } = data;
  const roomName = getChatRoomName(room, members);
  const messageContent = formatMessageContent(lastMessage);
  const messageTime = lastMessage
    ? formatMessageTime(lastMessage.created_at)
    : '';
  const router = useRouter();

  const itemClasses = [
    styles.chatItem,
    isSelected && styles.selected,
    isBlocked && styles.blocked,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (!isBlocked) {
      if (onClick) {
        onClick();
      }
      router.push(getChatRoomUrl(room.room_id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isBlocked && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={itemClasses}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${roomName} 채팅방, ${unreadCount > 0 ? `읽지 않은 메시지 ${unreadCount}개` : '읽음'}`}
    >
      <div className={styles.chatItemContent}>
        <div className={styles.avatarWrapper}>
          <Avatar
            animalType={members[0]?.animalType as AnimalType}
            alt={roomName}
            size="s"
            status={members[0]?.status || 'offline'}
            showStatus={true}
          />
        </div>

        <div className={styles.textBlock}>
          <div className={styles.nameRow}>
            <span
              className={`${styles.roomName} ${unreadCount > 0 ? styles.unread : ''}`}
            >
              {roomName}
            </span>
          </div>
          <div className={styles.messageRow}>
            <span className={styles.lastMessage}>{messageContent}</span>
          </div>
        </div>
      </div>

      <div className={styles.metaBlock}>
        <div className={styles.timeRow}>
          <span className={styles.messageTime}>{messageTime}</span>
        </div>
        {unreadCount > 0 && (
          <div className={styles.badgeRow}>
            <div
              className={styles.unreadBadge}
              aria-label={`읽지 않은 메시지 ${unreadCount}개`}
            >
              <span>{unreadCount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChatList() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  if (mockChatRooms.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>메시지</h1>
        </div>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>채팅방이 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>메시지</h1>
      </div>

      <div className={styles.listWrapper}>
        {mockChatRooms.map((chatRoom) => (
          <ChatListItem
            key={chatRoom.room.room_id}
            data={chatRoom}
            isSelected={selectedRoomId === chatRoom.room.room_id}
            onClick={() => setSelectedRoomId(chatRoom.room.room_id)}
          />
        ))}
      </div>
    </div>
  );
}
