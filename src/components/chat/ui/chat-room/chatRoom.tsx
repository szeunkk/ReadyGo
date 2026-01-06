'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Avatar from '@/commons/components/avatar';
import Icon from '@/commons/components/icon';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import Searchbar from '@/commons/components/searchbar';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimalType } from '@/commons/constants/animal';
import { useSideProfilePanel } from '@/hooks/useSideProfilePanel';
import {
  useChatRoom,
  type FormattedMessageItem,
} from '@/components/chat/hooks';

interface ChatRoomProps {
  roomId?: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
  // 사이드 프로필 패널 제어
  const { toggleProfile, openProfile, isOpen, targetUserId } =
    useSideProfilePanel();

  // roomId를 number로 변환 (NaN 처리 포함)
  const roomIdNumber = isNaN(parseInt(roomId || '', 10))
    ? 0
    : parseInt(roomId || '', 10);

  // useChatRoom Hook 호출
  const {
    formattedMessages,
    otherMemberInfo,
    isOtherMemberInfoLoading,
    sendMessage,
    isLoading,
    error,
    isBlocked,
  } = useChatRoom({ roomId: roomIdNumber });

  // 메시지 입력 상태 (UI 상태만 관리)
  const [messageInput, setMessageInput] = useState('');

  // 채팅방이 변경될 때 사이드 패널이 열려있다면 새로운 상대방의 프로필로 자동 업데이트
  useEffect(() => {
    if (
      isOpen &&
      targetUserId &&
      otherMemberInfo &&
      targetUserId !== otherMemberInfo.id
    ) {
      // 다른 사용자의 프로필이 열려있을 때만 자동으로 변경
      openProfile(otherMemberInfo.id);
    }
  }, [roomId, otherMemberInfo?.id, isOpen, targetUserId, openProfile]);

  // 현재 사용자의 프로필이 열려있는지 확인
  const isProfileActive =
    isOpen && otherMemberInfo && targetUserId === otherMemberInfo.id;

  // 메시지 전송 핸들러
  const handleSendMessage = async () => {
    if (!messageInput.trim() || isBlocked) {
      return;
    }

    try {
      await sendMessage(messageInput.trim(), 'text');
      setMessageInput(''); // 전송 성공 시 입력 초기화
    } catch (err) {
      console.error('Failed to send message:', err);
      // 에러 발생 시 messageInput은 그대로 유지하여 재전송 가능
    }
  };

  // Enter 키 입력 시 전송
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 에러 상태 처리 (에러가 있어도 UI는 유지)
  if (error) {
    console.error('ChatRoom error:', error);
  }

  // 상대방 정보 기본값
  const displayNickname = otherMemberInfo?.nickname ?? '알 수 없음';
  const displayAvatarImagePath = otherMemberInfo?.avatarImagePath ?? '';
  const displayUserStatus = otherMemberInfo?.userStatus ?? 'offline';
  const displayAnimalType = otherMemberInfo?.animalType;
  const displayOtherUserId = otherMemberInfo?.id ?? '';

  return (
    <div className={styles.container} aria-label="채팅방">
      {/* 헤더 영역 */}
      <header className={styles.header} aria-label="채팅방 헤더">
        <div className={styles.headerLeft}>
          {isOtherMemberInfoLoading ? (
            <>
              <Skeleton
                className={styles.headerAvatarSkeleton}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
              <div className={styles.headerUserInfo}>
                <Skeleton
                  className={styles.headerNicknameSkeleton}
                  style={{ width: '120px', height: '20px', marginBottom: '4px' }}
                />
                <Skeleton
                  className={styles.headerStatusSkeleton}
                  style={{ width: '60px', height: '16px' }}
                />
              </div>
            </>
          ) : (
            <>
              <Avatar
                imageUrl={displayAvatarImagePath}
                animalType={displayAnimalType as AnimalType}
                alt={displayNickname}
                size="s"
                status={displayUserStatus}
                showStatus={true}
                className={styles.headerAvatar}
              />
              <div className={styles.headerUserInfo}>
                <div className={styles.headerNickname}>{displayNickname}</div>
                <div className={styles.headerStatus}>
                  {displayUserStatus === 'online' ? '온라인' : '오프라인'}
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles.headerRight}>
          <Searchbar
            placeholder="검색하기"
            aria-label="메시지 검색"
            className={styles.searchBar}
          />
          {!isOtherMemberInfoLoading && displayOtherUserId && (
            <button
              className={`${styles.menuButton} ${isProfileActive ? styles.active : ''}`}
              aria-label="사용자 메뉴"
              type="button"
              onClick={() => toggleProfile(displayOtherUserId)}
            >
              <Icon name="userprofile" size={20} />
            </button>
          )}
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
        {isLoading ? (
          // 메시지 로딩 중일 때는 빈 상태로 표시 (스켈레톤 없음)
          null
        ) : formattedMessages.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            메시지가 없습니다
          </div>
        ) : (
          formattedMessages.map((item, index) => {
          if (item.type === 'date-divider') {
            return (
              <div
                key={`divider-${index}`}
                className={styles.dateDivider}
                  aria-label={`날짜 구분선: ${item.formattedDate || ''}`}
              >
                  {item.formattedDate || ''}
              </div>
            );
          }

            // message 타입인 경우
            const { message, isConsecutive, isOwnMessage, formattedTime, formattedContent, isRead } = item;

            if (!message) {
              return null;
            }

          const isSystemMessage = message.content_type === 'system';

          if (isSystemMessage) {
            return (
              <div
                key={message.id}
                className={styles.systemMessage}
                aria-label="시스템 메시지"
              >
                  {formattedContent}
              </div>
            );
          }

          if (isOwnMessage) {
            return (
              <div
                key={message.id}
                className={styles.messageRow}
                  aria-label={`내 메시지: ${formattedContent}`}
              >
                <div className={styles.ownMessageContainer}>
                  <div className={styles.messageTime}>
                      {formattedTime}
                  </div>
                  <div className={styles.ownMessageBubble}>
                    <span className={styles.messageContent}>
                        {formattedContent}
                    </span>
                    </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={styles.messageRow}
                aria-label={`${displayNickname}의 메시지: ${formattedContent}`}
            >
              <div
                className={`${styles.otherMessageContainer} ${
                  isConsecutive ? styles.consecutive : ''
                }`}
              >
                {!isConsecutive && (
                  <Avatar
                      imageUrl={displayAvatarImagePath}
                      animalType={displayAnimalType as AnimalType}
                      alt={displayNickname}
                    size="s"
                      status={displayUserStatus}
                    showStatus={false}
                    className={styles.messageAvatar}
                  />
                )}
                {isConsecutive && <div className={styles.avatarSpacer} />}
                <div className={styles.otherMessageContent}>
                  <div className={styles.otherMessageBubble}>
                    <span className={styles.messageContent}>
                        {formattedContent}
                    </span>
                  </div>
                  <div className={styles.messageTime}>
                      {formattedTime}
                    </div>
                </div>
              </div>
            </div>
          );
          })
        )}
      </div>

      {/* 입력 영역 */}
      <div className={styles.inputArea} aria-label="메시지 입력 영역">
        <div className={styles.inputWrapper}>
          <Input
            variant="primary"
            size="m"
            state={isBlocked ? 'disabled' : 'Default'}
            placeholder={`@${displayNickname} 님에게 메시지 보내기`}
            className={styles.messageInput}
            disabled={isBlocked}
            aria-label="메시지 입력"
            label={false}
            iconLeft={undefined}
            iconRight={undefined}
            additionalInfo={undefined}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          variant="secondary"
          size="m"
          shape="rectangle"
          disabled={isBlocked || !messageInput.trim()}
          aria-label="메시지 전송"
          className={styles.sendButton}
          onClick={handleSendMessage}
        >
          <Icon name="send" size={20} />
        </Button>
      </div>
    </div>
  );
}
