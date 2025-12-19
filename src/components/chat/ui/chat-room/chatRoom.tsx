'use client';

import React from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Icon from '@/commons/components/icon';
import Input from '@/commons/components/input';

// Mock 데이터 타입 정의 (ERD 기반)
interface ChatMessage {
  id: number;
  content: string | null;
  content_type: string | null;
  created_at: string | null;
  sender_id: string | null;
  room_id: number | null;
  is_read: boolean | null;
}

interface ChatMessageRead {
  id: number;
  message_id: number | null;
  user_id: string | null;
  read_at: string | null;
}

interface ChatRoomMember {
  id: number;
  room_id: number | null;
  user_id: string | null;
  joined_at: string | null;
}

interface ChatBlock {
  id: number;
  user_id: string | null;
  blocked_user_id: string | null;
  created_at: string | null;
}

// Mock 데이터
const MOCK_CURRENT_USER_ID = 'user-1';

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    content: '안녕하세요! 프로필 봤는데 플레이 스타일이 비슷해 보이네요 👋🏻',
    content_type: 'text',
    created_at: '2025-01-15T14:30:00Z',
    sender_id: 'user-2',
    room_id: 1,
    is_read: true,
  },
  {
    id: 2,
    content: '안녕하세요! 네, 저도 프로필 보고 매칭률이 높아서 놀랐어요 😊',
    content_type: 'text',
    created_at: '2025-01-15T14:32:00Z',
    sender_id: 'user-1',
    room_id: 1,
    is_read: true,
  },
  {
    id: 3,
    content: '발로란트 주로 하시나요?',
    content_type: 'text',
    created_at: '2025-01-15T14:35:00Z',
    sender_id: 'user-2',
    room_id: 1,
    is_read: true,
  },
  {
    id: 4,
    content: '저도 요즘 매일 하고 있는데 ㅎㅎ',
    content_type: 'text',
    created_at: '2025-01-15T14:35:00Z',
    sender_id: 'user-2',
    room_id: 1,
    is_read: true,
  },
  {
    id: 5,
    content: '오늘 저녁 9시쯤 어떠세요?',
    content_type: 'text',
    created_at: '2025-01-15T14:36:00Z',
    sender_id: 'user-2',
    room_id: 1,
    is_read: false,
  },
];

const MOCK_MESSAGE_READS: ChatMessageRead[] = [
  {
    id: 1,
    message_id: 1,
    user_id: 'user-1',
    read_at: '2025-01-15T14:30:30Z',
  },
  {
    id: 2,
    message_id: 2,
    user_id: 'user-2',
    read_at: '2025-01-15T14:32:30Z',
  },
  {
    id: 3,
    message_id: 3,
    user_id: 'user-1',
    read_at: '2025-01-15T14:35:30Z',
  },
  {
    id: 4,
    message_id: 4,
    user_id: 'user-1',
    read_at: '2025-01-15T14:35:30Z',
  },
];

const MOCK_ROOM_MEMBERS: ChatRoomMember[] = [
  {
    id: 1,
    room_id: 1,
    user_id: 'user-1',
    joined_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 2,
    room_id: 1,
    user_id: 'user-2',
    joined_at: '2025-01-15T10:00:00Z',
  },
];

const MOCK_BLOCKS: ChatBlock[] = [];

const MOCK_OTHER_USER = {
  id: 'user-2',
  nickname: '까칠한까마귀',
  avatar_url: '/images/raven_m.svg',
  is_online: true,
};

// 메시지 시간 포맷팅 함수
function formatMessageTime(dateString: string | null): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';
  const displayHours = hours % 12 || 12;
  const timeString = `${ampm} ${displayHours}:${minutes
    .toString()
    .padStart(2, '0')}`;

  if (messageDate.getTime() === today.getTime()) {
    return timeString;
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return `어제 ${timeString}`;
  } else {
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[date.getDay()];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekday}`;
  }
}

// 날짜 구분선 포맷팅 함수
function formatDateDivider(dateString: string | null): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekday = weekdays[date.getDay()];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekday}`;
}

// 날짜가 변경되었는지 확인하는 함수
function isNewDate(
  currentDate: string | null,
  previousDate: string | null
): boolean {
  if (!currentDate || !previousDate) return true;

  const current = new Date(currentDate);
  const previous = new Date(previousDate);

  return (
    current.getFullYear() !== previous.getFullYear() ||
    current.getMonth() !== previous.getMonth() ||
    current.getDate() !== previous.getDate()
  );
}

// 연속된 메시지인지 확인하는 함수
function isConsecutiveMessage(
  currentMessage: ChatMessage,
  previousMessage: ChatMessage | null
): boolean {
  if (!previousMessage) return false;
  return (
    currentMessage.sender_id === previousMessage.sender_id &&
    currentMessage.content_type !== 'system'
  );
}

export default function ChatRoom() {
  const isBlocked = MOCK_BLOCKS.some(
    (block) => block.blocked_user_id === MOCK_OTHER_USER.id
  );

  // 메시지를 날짜별로 그룹화
  const groupedMessages = MOCK_MESSAGES.reduce(
    (acc, message, index) => {
      const previousMessage = index > 0 ? MOCK_MESSAGES[index - 1] : null;
      const showDateDivider = isNewDate(
        message.created_at,
        previousMessage?.created_at || null
      );

      if (showDateDivider) {
        acc.push({
          type: 'date-divider' as const,
          date: message.created_at,
        });
      }

      acc.push({
        type: 'message' as const,
        message,
        isConsecutive: isConsecutiveMessage(message, previousMessage),
      });

      return acc;
    },
    [] as Array<
      | { type: 'date-divider'; date: string | null }
      | { type: 'message'; message: ChatMessage; isConsecutive: boolean }
    >
  );

  return (
    <div className={styles.container} aria-label="채팅방">
      {/* 헤더 영역 */}
      <header className={styles.header} aria-label="채팅방 헤더">
        <div className={styles.headerLeft}>
          <Avatar
            src={MOCK_OTHER_USER.avatar_url}
            alt={MOCK_OTHER_USER.nickname}
            size="s"
            showStatus={false}
            className={styles.headerAvatar}
          />
          <div className={styles.headerUserInfo}>
            <div className={styles.headerNickname}>
              {MOCK_OTHER_USER.nickname}
            </div>
            <div className={styles.headerStatus}>
              {MOCK_OTHER_USER.is_online ? '온라인' : '오프라인'}
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
              <Icon name="search" size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="검색하기"
                className={styles.searchInput}
                aria-label="메시지 검색"
              />
            </div>
          </div>
          <button
            className={styles.menuButton}
            aria-label="사용자 메뉴"
            type="button"
          >
            <Icon name="user" size={20} />
          </button>
        </div>
      </header>

      {/* 차단 안내 배너 */}
      {isBlocked && (
        <div className={styles.blockBanner} role="alert" aria-live="polite">
          차단된 사용자입니다. 메시지를 보낼 수 없습니다.
        </div>
      )}

      {/* 메시지 리스트 영역 */}
      <div className={styles.messageList} aria-label="메시지 목록">
        {groupedMessages.map((item, index) => {
          if (item.type === 'date-divider') {
            return (
              <div
                key={`divider-${index}`}
                className={styles.dateDivider}
                aria-label={`날짜 구분선: ${formatDateDivider(item.date)}`}
              >
                {formatDateDivider(item.date)}
              </div>
            );
          }

          const { message, isConsecutive } = item;
          const isOwnMessage = message.sender_id === MOCK_CURRENT_USER_ID;
          const isSystemMessage = message.content_type === 'system';
          const messageRead = MOCK_MESSAGE_READS.find(
            (read) => read.message_id === message.id
          );
          const isRead = messageRead?.read_at !== null;

          if (isSystemMessage) {
            return (
              <div
                key={message.id}
                className={styles.systemMessage}
                aria-label="시스템 메시지"
              >
                {message.content}
              </div>
            );
          }

          if (isOwnMessage) {
            return (
              <div
                key={message.id}
                className={styles.messageRow}
                aria-label={`내 메시지: ${message.content}`}
              >
                <div className={styles.ownMessageContainer}>
                  <div className={styles.messageTime}>
                    {formatMessageTime(message.created_at)}
                  </div>
                  <div className={styles.ownMessageBubble}>
                    <span className={styles.messageContent}>
                      {message.content}
                    </span>
                    {!isRead && (
                      <span className={styles.unreadIndicator} aria-label="읽지 않음" />
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={styles.messageRow}
              aria-label={`${MOCK_OTHER_USER.nickname}의 메시지: ${message.content}`}
            >
              <div
                className={`${styles.otherMessageContainer} ${
                  isConsecutive ? styles.consecutive : ''
                }`}
              >
                {!isConsecutive && (
                  <Avatar
                    src={MOCK_OTHER_USER.avatar_url}
                    alt={MOCK_OTHER_USER.nickname}
                    size="s"
                    showStatus={false}
                    className={styles.messageAvatar}
                  />
                )}
                {isConsecutive && <div className={styles.avatarSpacer} />}
                <div className={styles.otherMessageContent}>
                  <div className={styles.otherMessageBubble}>
                    <span className={styles.messageContent}>
                      {message.content}
                    </span>
                  </div>
                  <div className={styles.messageTime}>
                    {formatMessageTime(message.created_at)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 입력 영역 */}
      <div className={styles.inputArea} aria-label="메시지 입력 영역">
        <div className={styles.inputWrapper}>
          <Input
            variant="secondary"
            state={isBlocked ? 'disabled' : 'Default'}
            placeholder={`@${MOCK_OTHER_USER.nickname} 님에게 메시지 보내기`}
            className={styles.messageInput}
            disabled={isBlocked}
            aria-label="메시지 입력"
          />
        </div>
        <button
          className={styles.sendButton}
          disabled={isBlocked}
          aria-label="메시지 전송"
          type="button"
        >
          <Icon name="send" size={20} />
        </button>
      </div>
    </div>
  );
}

