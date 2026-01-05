'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/commons/components/avatar';
import { getChatRoomUrl } from '@/commons/constants/url';
import styles from './styles.module.css';
import { useChatList } from '@/components/chat/hooks';
import { getEffectiveStatus } from '@/stores/user-status.store';
import { getAvatarImagePath } from '@/lib/avatar/getAvatarImagePath';
import type { ChatRoomListItem } from '@/repositories/chat.repository';
import type { Database } from '@/types/supabase';

type ChatRoom = Database['public']['Tables']['chat_rooms']['Row'];
type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

// 시간 포맷 함수 (24h 기준, 오늘은 시간, 그 외는 날짜)
const formatMessageTime = (dateString: string | null): string => {
  if (!dateString) {
    return '';
  }

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

  const contentType = message.content_type;
  if (contentType === 'image') {
    return '📷 이미지';
  }
  if (contentType === 'system') {
    return message.content || '시스템 메시지';
  }
  return message.content || '메시지가 없습니다';
};

// 채팅방 이름 생성 함수
const getChatRoomName = (room: ChatRoom, otherMember?: UserProfile): string => {
  const roomType = room.type ?? 'direct';

  if (roomType === 'group') {
    return '그룹 채팅';
  }

  // 1:1 채팅인 경우
  if (otherMember?.nickname) {
    return otherMember.nickname;
  }

  return '알 수 없음';
};

interface ChatListItemProps {
  data: ChatRoomListItem;
  isSelected?: boolean;
  onClick?: () => void;
  onRoomClick?: (roomId: number) => void;
}

const ChatListItem = ({
  data,
  isSelected = false,
  onClick,
  onRoomClick,
}: ChatListItemProps) => {
  const { room, otherMember, lastMessage, unreadCount } = data;
  const roomName = getChatRoomName(room, otherMember);
  const messageContent = formatMessageContent(lastMessage);
  const messageTime = lastMessage?.created_at
    ? formatMessageTime(lastMessage.created_at)
    : '';
  const router = useRouter();

  // 아바타 이미지 경로 계산 (유틸리티 함수 사용)
  const avatarImagePath = getAvatarImagePath(
    otherMember?.avatar_url,
    otherMember?.animal_type
  );

  // 사용자 상태 가져오기
  const userStatus = otherMember?.id
    ? getEffectiveStatus(otherMember.id)
    : 'offline';

  const itemClasses = [styles.chatItem, isSelected && styles.selected]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (room.id) {
      if (onRoomClick) {
        onRoomClick(room.id);
      }
      router.push(getChatRoomUrl(String(room.id)));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
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
            imageUrl={avatarImagePath}
            alt={roomName}
            size="s"
            status={userStatus}
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
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const { chatRooms, isLoading, error, markRoomAsReadOptimistic } = useChatList(
    {
      autoRefresh: true,
      refreshInterval: 30000,
    }
  );

  // 에러 상태 처리
  if (error) {
    console.error('ChatList error:', error);
  }

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>메시지</h1>
        </div>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>로딩 중...</p>
        </div>
      </div>
    );
  }

  // 빈 상태 처리
  if (chatRooms.length === 0) {
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

  const handleRoomClick = (roomId: number) => {
    markRoomAsReadOptimistic(roomId);
    setSelectedRoomId(roomId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>메시지</h1>
      </div>

      <div className={styles.listWrapper}>
        {chatRooms.map((chatRoom) => (
          <ChatListItem
            key={chatRoom.room.id}
            data={chatRoom}
            isSelected={selectedRoomId === chatRoom.room.id}
            onClick={() => setSelectedRoomId(chatRoom.room.id)}
            onRoomClick={handleRoomClick}
          />
        ))}
      </div>
    </div>
  );
}
