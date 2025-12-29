'use client';

import React, { useState } from 'react';
import Avatar from '@/commons/components/avatar';
import Button from '@/commons/components/button';
import Icon from '@/commons/components/icon';
import Input from '@/commons/components/input';
import { AnimalType } from '@/commons/constants/animal';
import styles from './styles.module.css';

// Mock 데이터 타입 정의
interface ChatMessage {
  id: number;
  content: string;
  sender_id: string;
  sender_nickname: string;
  sender_animalType?: AnimalType;
  created_at: string;
}

// Mock 데이터 - 현재 사용자 ID
const MOCK_CURRENT_USER_ID = 'current-user';

// Mock 데이터
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    content: '안녕하세요! 프로필 봤는데 플레이 스타일이 비슷해 보이네요 👋',
    sender_id: 'user-1',
    sender_nickname: '도라방돌핀',
    sender_animalType: AnimalType.dolphin,
    created_at: '2025-01-15T14:30:00Z',
  },
  {
    id: 2,
    content: '안녕하세요! 네, 저도 프로필 보고 매칭률이 높아서 놀랐어요 😊',
    sender_id: MOCK_CURRENT_USER_ID,
    sender_nickname: '나',
    created_at: '2025-01-15T14:32:00Z',
  },
  {
    id: 3,
    content: '발로란트 주로 하시나요?',
    sender_id: 'user-2',
    sender_nickname: '까칠한까마귀',
    sender_animalType: AnimalType.raven,
    created_at: '2025-01-15T14:33:00Z',
  },
  {
    id: 4,
    content: '저도 요즘 매일 하고 있는데 ㅎㅎ',
    sender_id: 'user-3',
    sender_nickname: '도도한도치',
    sender_animalType: AnimalType.hedgehog,
    created_at: '2025-01-15T14:35:00Z',
  },
  {
    id: 5,
    content: '오늘 저녁 9시쯤 어떠세요?',
    sender_id: 'user-3',
    sender_nickname: '도도한도치',
    sender_animalType: AnimalType.hedgehog,
    created_at: '2025-01-15T14:36:00Z',
  },
];

// 메시지 시간 포맷팅 함수
const formatMessageTime = (dateString: string): string => {
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
const formatDateDivider = (dateString: string): string => {
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
  currentDate: string,
  previousDate: string | null
): boolean => {
  if (!previousDate) {
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

// 메시지가 내 메시지인지 확인하는 함수
const isOwnMessage = (message: ChatMessage): boolean => {
  return message.sender_id === MOCK_CURRENT_USER_ID;
};

// 메시지 그룹 타입 정의
type MessageGroup = {
  sender_id: string;
  sender_nickname: string;
  sender_animalType?: AnimalType;
  messages: ChatMessage[];
  isOwn: boolean;
};

export default function ChatRoom() {
  const [messageInput, setMessageInput] = useState('');

  // 메시지를 그룹화하는 함수
  const groupMessages = (
    messages: ChatMessage[]
  ): Array<MessageGroup | { type: 'date-divider'; date: string }> => {
    const result: Array<MessageGroup | { type: 'date-divider'; date: string }> =
      [];
    let currentGroup: MessageGroup | null = null;
    let previousDate: string | null = null;

    messages.forEach((message) => {
      // 날짜 구분선 추가
      if (isNewDate(message.created_at, previousDate)) {
        result.push({
          type: 'date-divider',
          date: message.created_at,
        });
        previousDate = message.created_at;
      }

      const messageIsOwn = isOwnMessage(message);

      // 내 메시지이거나 새로운 발신자의 메시지인 경우 새 그룹 시작
      if (
        !currentGroup ||
        currentGroup.sender_id !== message.sender_id ||
        currentGroup.isOwn !== messageIsOwn
      ) {
        if (currentGroup) {
          result.push(currentGroup);
        }
        currentGroup = {
          sender_id: message.sender_id,
          sender_nickname: message.sender_nickname,
          sender_animalType: message.sender_animalType,
          messages: [message],
          isOwn: messageIsOwn,
        };
      } else {
        // 같은 그룹에 메시지 추가
        currentGroup.messages.push(message);
      }
    });

    // 마지막 그룹 추가
    if (currentGroup) {
      result.push(currentGroup);
    }

    return result;
  };

  const groupedMessages = groupMessages(MOCK_MESSAGES);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: 실제 메시지 전송 로직 구현
      setMessageInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatRoom}>
      {/* 메시지 리스트 영역 */}
      <div className={styles.messageList} aria-label="메시지 목록">
        <div className={styles.messagesContainer}>
          {groupedMessages.map((item, index) => {
            if ('type' in item && item.type === 'date-divider') {
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
            return null;
          })}
          <div className={styles.messagesWrapper}>
            {groupedMessages.map((item, index) => {
              if ('type' in item && item.type === 'date-divider') {
                return null;
              }

              const group = item as MessageGroup;

              if (group.isOwn) {
                return (
                  <div
                    key={`group-${group.sender_id}-${index}`}
                    className={styles.messageGroup}
                  >
                    {group.messages.map((message) => (
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div
                  key={`group-${group.sender_id}-${index}`}
                  className={styles.messageGroup}
                >
                  <div className={styles.messageRow}>
                    <div className={styles.otherMessageContainer}>
                      <Avatar
                        animalType={group.sender_animalType}
                        alt={group.sender_nickname}
                        size="s"
                        status="online"
                        showStatus={true}
                        className={styles.messageAvatar}
                      />
                      <div className={styles.otherMessageContent}>
                        <div className={styles.senderNickname}>
                          {group.sender_nickname}
                        </div>
                        <div className={styles.messageBubbles}>
                          {group.messages.map((message) => (
                            <div
                              key={message.id}
                              className={styles.otherMessageWrapper}
                            >
                              <div className={styles.otherMessageBubble}>
                                <span className={styles.messageContent}>
                                  {message.content}
                                </span>
                              </div>
                              <div className={styles.messageTime}>
                                {formatMessageTime(message.created_at)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 입력 영역 */}
      <div className={styles.inputArea} aria-label="메시지 입력 영역">
        <div className={styles.inputWrapper}>
          <Input
            variant="primary"
            size="m"
            placeholder="메세지 보내기"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="메시지 입력"
            label={false}
          />
        </div>
        <Button
          variant="secondary"
          size="m"
          shape="rectangle"
          disabled={!messageInput.trim()}
          aria-label="메시지 전송"
          className={styles.sendButton}
          onClick={handleSendMessage}
        >
          <Icon name="send" size={20} className={styles.sendIcon} />
        </Button>
      </div>
    </div>
  );
}
