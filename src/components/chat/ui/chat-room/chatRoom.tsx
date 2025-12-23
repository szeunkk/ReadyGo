'use client';

import React, { useMemo } from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Icon from '@/commons/components/icon';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import Searchbar from '@/commons/components/searchbar';
import { mockChatRooms } from '../chat-list/chatList';

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

// interface ChatRoomMember {
//   id: number;
//   room_id: number | null;
//   user_id: string | null;
//   joined_at: string | null;
// }

// interface ChatBlock {
//   id: number;
//   user_id: string | null;
//   blocked_user_id: string | null;
//   created_at: string | null;
// }

// Mock 데이터 - chatList의 mock 데이터와 매핑
// 현재 사용자 ID (chatList의 mock 데이터와 다른 ID 사용)
const MOCK_CURRENT_USER_ID = 'current-user';

// chatList의 mock 데이터를 기반으로 한 roomId별 mock 데이터
const MOCK_ROOM_DATA: Record<
  string,
  {
    otherUser: {
      id: string;
      nickname: string;
      animalType?: string;
      status: 'online' | 'away' | 'ban' | 'offline';
    };
    messages: ChatMessage[];
    messageReads: ChatMessageRead[];
    isBlocked: boolean;
  }
> = {
  'room-1': {
    otherUser: {
      id: 'user-1',
      nickname: '게이머호랑이',
      animalType: 'tiger',
      status: 'online',
    },
    messages: [
      {
        id: 1,
        content: '안녕하세요! 프로필 봤는데 플레이 스타일이 비슷해 보이네요 👋🏻',
        content_type: 'text',
        created_at: '2025-01-15T14:30:00Z',
        sender_id: 'user-1',
        room_id: 1,
        is_read: true,
      },
      {
        id: 2,
        content: '네, 저도 프로필 보고 매칭률이 높아서 놀랐어요 😊',
        content_type: 'text',
        created_at: '2025-01-15T14:32:00Z',
        sender_id: MOCK_CURRENT_USER_ID,
        room_id: 1,
        is_read: true,
      },
      {
        id: 3,
        content: '발로란트 주로 하시나요?',
        content_type: 'text',
        created_at: '2025-01-15T14:33:00Z',
        sender_id: 'user-1',
        room_id: 1,
        is_read: true,
      },
      {
        id: 4,
        content: '네! 요즘 발로란트에 빠져있어요 ㅎㅎ',
        content_type: 'text',
        created_at: '2025-01-15T14:34:00Z',
        sender_id: MOCK_CURRENT_USER_ID,
        room_id: 1,
        is_read: true,
      },
      {
        id: 5,
        content: '저도 요즘 매일 하고 있는데 ㅎㅎ',
        content_type: 'text',
        created_at: '2025-01-15T14:35:00Z',
        sender_id: 'user-1',
        room_id: 1,
        is_read: true,
      },
      {
        id: 6,
        content: '오늘 저녁에 같이 게임할래?',
        content_type: 'text',
        created_at: '2025-01-15T14:36:00Z',
        sender_id: 'user-1',
        room_id: 1,
        is_read: false,
      },
      {
        id: 7,
        content: '좋아요! 몇 시쯤이 좋을까요?',
        content_type: 'text',
        created_at: '2025-01-15T14:37:00Z',
        sender_id: MOCK_CURRENT_USER_ID,
        room_id: 1,
        is_read: false,
      },
    ],
    messageReads: [
      {
        id: 1,
        message_id: 1,
        user_id: MOCK_CURRENT_USER_ID,
        read_at: '2025-01-15T14:30:30Z',
      },
      {
        id: 2,
        message_id: 2,
        user_id: 'user-1',
        read_at: '2025-01-15T14:32:30Z',
      },
      {
        id: 3,
        message_id: 3,
        user_id: MOCK_CURRENT_USER_ID,
        read_at: '2025-01-15T14:33:30Z',
      },
      {
        id: 4,
        message_id: 4,
        user_id: 'user-1',
        read_at: '2025-01-15T14:34:30Z',
      },
      {
        id: 5,
        message_id: 5,
        user_id: MOCK_CURRENT_USER_ID,
        read_at: '2025-01-15T14:35:30Z',
      },
    ],
    isBlocked: false,
  },
  'room-2': {
    otherUser: {
      id: 'user-2',
      nickname: '호쾌한망토',
      animalType: 'fox',
      status: 'away',
    },
    messages: [
      {
        id: 1,
        content: '안녕하세요!',
        content_type: 'text',
        created_at: '2025-01-15T14:20:00Z',
        sender_id: 'user-2',
        room_id: 2,
        is_read: true,
      },
      {
        id: 2,
        content: '오늘 저녁에 같이 게임할래?',
        content_type: 'text',
        created_at: '2025-01-15T14:50:00Z',
        sender_id: 'user-2',
        room_id: 2,
        is_read: false,
      },
    ],
    messageReads: [
      {
        id: 1,
        message_id: 1,
        user_id: MOCK_CURRENT_USER_ID,
        read_at: '2025-01-15T14:20:30Z',
      },
    ],
    isBlocked: false,
  },
  'room-3': {
    otherUser: {
      id: 'user-3',
      nickname: '까칠한까마귀',
      animalType: 'raven',
      status: 'offline',
    },
    messages: [
      {
        id: 1,
        content: '오늘 저녁 9시쯤 어떠세요?',
        content_type: 'text',
        created_at: '2025-01-15T14:00:00Z',
        sender_id: 'user-3',
        room_id: 3,
        is_read: false,
      },
    ],
    messageReads: [],
    isBlocked: false,
  },
  'room-4': {
    otherUser: {
      id: 'user-4',
      nickname: '게임 파티',
      animalType: 'bear',
      status: 'online',
    },
    messages: [
      {
        id: 1,
        content: '다들 준비됐나요?',
        content_type: 'text',
        created_at: '2025-01-15T13:00:00Z',
        sender_id: 'user-4',
        room_id: 4,
        is_read: true,
      },
    ],
    messageReads: [
      {
        id: 1,
        message_id: 1,
        user_id: MOCK_CURRENT_USER_ID,
        read_at: '2025-01-15T13:00:30Z',
      },
    ],
    isBlocked: false,
  },
  'room-5': {
    otherUser: {
      id: 'user-6',
      nickname: '차단된유저',
      animalType: 'wolf',
      status: 'ban',
    },
    messages: [
      {
        id: 1,
        content: '안녕하세요',
        content_type: 'text',
        created_at: '2025-01-15T12:00:00Z',
        sender_id: 'user-6',
        room_id: 5,
        is_read: true,
      },
    ],
    messageReads: [],
    isBlocked: true,
  },
};

// 기본 mock 데이터 (roomId가 없거나 매칭되지 않을 때 사용)
const DEFAULT_MOCK_DATA = {
  otherUser: {
    id: 'user-2',
    nickname: '까칠한까마귀',
    animalType: 'raven',
    status: 'online' as const,
  },
  messages: [
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
      sender_id: MOCK_CURRENT_USER_ID,
      room_id: 1,
      is_read: true,
    },
  ],
  messageReads: [
    {
      id: 1,
      message_id: 1,
      user_id: MOCK_CURRENT_USER_ID,
      read_at: '2025-01-15T14:30:30Z',
    },
    {
      id: 2,
      message_id: 2,
      user_id: 'user-2',
      read_at: '2025-01-15T14:32:30Z',
    },
  ],
  isBlocked: false,
};

// 메시지 시간 포맷팅 함수
const formatMessageTime = (dateString: string | null): string => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';
  const displayHours = hours % 12 || 12;
  const timeString = `${ampm} ${displayHours}:${minutes
    .toString()
    .padStart(2, '0')}`;

  return timeString;
};

// 날짜 구분선 포맷팅 함수
const formatDateDivider = (dateString: string | null): string => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  const weekdays = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  const weekday = weekdays[date.getDay()];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekday}`;
};

// 날짜가 변경되었는지 확인하는 함수
const isNewDate = (
  currentDate: string | null,
  previousDate: string | null
): boolean => {
  if (!currentDate || !previousDate) {
    return true;
  }

  const current = new Date(currentDate);
  const previous = new Date(previousDate);

  return (
    current.getFullYear() !== previous.getFullYear() ||
    current.getMonth() !== previous.getMonth() ||
    current.getDate() !== previous.getDate()
  );
};

// 연속된 메시지인지 확인하는 함수
const isConsecutiveMessage = (
  currentMessage: ChatMessage,
  previousMessage: ChatMessage | null
): boolean => {
  if (!previousMessage) {
    return false;
  }
  return (
    currentMessage.sender_id === previousMessage.sender_id &&
    currentMessage.content_type !== 'system'
  );
};

interface ChatRoomProps {
  roomId?: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
  // roomId에 해당하는 mock 데이터 가져오기 또는 동적 생성
  const roomData = useMemo(() => {
    // 1. MOCK_ROOM_DATA에 roomId가 있으면 사용
    if (roomId && MOCK_ROOM_DATA[roomId]) {
      return MOCK_ROOM_DATA[roomId];
    }

    // 2. chatList의 mock 데이터에서 roomId 찾기
    if (roomId) {
      const chatRoomData = mockChatRooms.find(
        (room) => room.room.room_id === roomId
      );

      if (chatRoomData) {
        const [otherMember] = chatRoomData.members;
        const { isBlocked } = chatRoomData;

        // chatList의 데이터를 기반으로 chatRoom mock 데이터 생성
        return {
          otherUser: {
            id: otherMember.user_id,
            nickname: otherMember.nickname,
            animalType: otherMember.animalType,
            status: otherMember.status || 'offline',
          },
          messages: chatRoomData.lastMessage
            ? [
                {
                  id: 1,
                  content: chatRoomData.lastMessage.content,
                  content_type: chatRoomData.lastMessage.content_type || 'text',
                  created_at: chatRoomData.lastMessage.created_at,
                  sender_id: chatRoomData.lastMessage.sender_id,
                  room_id: parseInt(roomId.replace('room-', '')) || 1,
                  is_read: chatRoomData.unreadCount === 0,
                },
              ]
            : [],
          messageReads: [],
          isBlocked,
        };
      }
    }

    // 3. 기본 mock 데이터 사용
    return DEFAULT_MOCK_DATA;
  }, [roomId]);

  const MOCK_OTHER_USER = {
    id: roomData.otherUser.id,
    nickname: roomData.otherUser.nickname,
    animalType: roomData.otherUser.animalType,
    status: roomData.otherUser.status,
    is_online: roomData.otherUser.status === 'online',
  };

  const MOCK_MESSAGES = roomData.messages;
  const MOCK_MESSAGE_READS = roomData.messageReads;
  const { isBlocked } = roomData;

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
            animalType={MOCK_OTHER_USER.animalType as AnimalType}
            alt={MOCK_OTHER_USER.nickname}
            size="s"
            status={MOCK_OTHER_USER.status}
            showStatus={true}
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
          <Searchbar
            placeholder="검색하기"
            aria-label="메시지 검색"
            className={styles.searchBar}
          />
          <button
            className={styles.menuButton}
            aria-label="사용자 메뉴"
            type="button"
          >
            <Icon name="userprofile" size={20} />
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
                      <span
                        className={styles.unreadIndicator}
                        aria-label="읽지 않음"
                      />
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
                    animalType={MOCK_OTHER_USER.animalType as AnimalType}
                    alt={MOCK_OTHER_USER.nickname}
                    size="s"
                    status={MOCK_OTHER_USER.status}
                    showStatus={true}
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
            variant="primary"
            size="m"
            state={isBlocked ? 'disabled' : 'Default'}
            placeholder={`@${MOCK_OTHER_USER.nickname} 님에게 메시지 보내기`}
            className={styles.messageInput}
            disabled={isBlocked}
            aria-label="메시지 입력"
            label={false}
            iconLeft={undefined}
            iconRight={undefined}
            additionalInfo={undefined}
          />
        </div>
        <Button
          variant="secondary"
          size="m"
          shape="rectangle"
          disabled={isBlocked}
          aria-label="메시지 전송"
          className={styles.sendButton}
        >
          <Icon name="send" size={20} />
        </Button>
      </div>
    </div>
  );
}
