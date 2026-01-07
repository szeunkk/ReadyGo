'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import React from 'react';

import { supabase as baseSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/commons/providers/auth/auth.provider';
import { useChatList } from './useChatList.hook';
import { getEffectiveStatus } from '@/stores/user-status.store';
import { getAvatarImagePath } from '@/lib/avatar/getAvatarImagePath';
import type { Database } from '@/types/supabase';

// 타입 정의
type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

/**
 * 포맷된 메시지 아이템 타입
 */
export interface FormattedMessageItem {
  type: 'date-divider' | 'unread-divider' | 'message';
  date?: string | null; // date-divider인 경우 (원본 날짜)
  formattedDate?: string; // date-divider인 경우 (포맷팅된 날짜)
  message?: ChatMessage; // message인 경우
  isConsecutive?: boolean; // message인 경우 (하위 호환성)
  isGroupStart?: boolean; // message인 경우 (그룹의 첫 번째 메시지)
  isGroupEnd?: boolean; // message인 경우 (그룹의 마지막 메시지)
  isOwnMessage?: boolean; // message인 경우
  formattedTime?: string; // message인 경우
  formattedContent?: string; // message인 경우
  isRead?: boolean; // message인 경우
}

/**
 * 포맷된 상대방 정보 타입
 */
export interface FormattedOtherMemberInfo {
  id: string;
  nickname: string;
  avatarImagePath: string;
  userStatus: 'online' | 'away' | 'dnd' | 'offline';
  animalType?: string;
}

/**
 * Hook 파라미터 타입
 */
export interface UseChatRoomProps {
  roomId: number; // 필수: 채팅방 ID
  onMessage?: (message: ChatMessage) => void; // 선택: 메시지 수신 콜백
}

/**
 * Hook 반환 타입
 */
export interface UseChatRoomReturn {
  messages: ChatMessage[]; // 원본 메시지 배열 (하위 호환성)
  formattedMessages: FormattedMessageItem[]; // UI에서 바로 사용 가능한 포맷된 메시지 배열
  otherMemberInfo: FormattedOtherMemberInfo | null; // 상대방 정보, 포맷된 형태
  isOtherMemberInfoLoading: boolean; // 상대방 정보 로딩 상태
  isBlocked: boolean; // 차단 상태
  sendMessage: (content: string, contentType?: string) => Promise<void>;
  markAsRead: (messageIds: number[]) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  scrollToBottom: (containerRef: React.RefObject<HTMLDivElement>) => void;
  scrollToUnreadBoundary: (
    containerRef: React.RefObject<HTMLDivElement>
  ) => void;
  getUnreadBoundaryMessageId: () => number | null;
  shouldShowScrollToBottomButton: (
    containerRef: React.RefObject<HTMLDivElement>
  ) => boolean;
  shouldScrollToBottom: boolean;
  shouldScrollToUnread: boolean;
  clearScrollTriggers: () => void;
}

/**
 * 메시지 시간 포맷팅 함수
 */
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

/**
 * 날짜 구분선 포맷팅 함수
 */
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

/**
 * 날짜가 변경되었는지 확인하는 함수
 */
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

/**
 * 연속된 메시지인지 확인하는 함수 (하위 호환성)
 */
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

/**
 * 같은 시간(시, 분)에 전송된 메시지인지 확인하는 함수
 */
const isSameTimeGroup = (
  currentMessage: ChatMessage,
  previousMessage: ChatMessage | null
): boolean => {
  if (!previousMessage) {
    return false;
  }

  // 같은 발신자이고 시스템 메시지가 아니어야 함
  if (
    currentMessage.sender_id !== previousMessage.sender_id ||
    currentMessage.content_type === 'system' ||
    previousMessage.content_type === 'system'
  ) {
    return false;
  }

  // 시간(시, 분) 비교
  if (!currentMessage.created_at || !previousMessage.created_at) {
    return false;
  }

  const currentDate = new Date(currentMessage.created_at);
  const previousDate = new Date(previousMessage.created_at);

  return (
    currentDate.getHours() === previousDate.getHours() &&
    currentDate.getMinutes() === previousDate.getMinutes()
  );
};

/**
 * 메시지 내용 포맷팅 함수
 */
const formatMessageContent = (message: ChatMessage | null): string => {
  if (!message) {
    return '메시지가 없습니다';
  }

  const { content, content_type: contentType } = message;

  if (content === null) {
    return '메시지가 없습니다';
  }

  if (contentType === 'image') {
    return '📷 이미지';
  }

  if (contentType === 'system') {
    return content;
  }

  return content;
};

/**
 * useChatRoom Hook
 *
 * - 초기 메시지 로드 (API)
 * - postgres_changes로 INSERT 구독
 * - 메시지 전송 플로우 (DB 저장)
 * - 읽음 처리
 * - 메시지 그룹화 및 포맷팅
 * - 상대방 정보 조회 및 포맷팅
 */
export const useChatRoom = (props: UseChatRoomProps): UseChatRoomReturn => {
  const { roomId, onMessage } = props;
  const { user } = useAuth();

  // useChatList Hook 호출하여 chatRooms 조회
  const {
    chatRooms,
    isLoading: isChatListLoading,
    markRoomAsReadOptimistic,
  } = useChatList();

  // 상태 관리
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [shouldScrollToUnread, setShouldScrollToUnread] = useState(false);

  // postgres_changes 채널 관리
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedRoomIdRef = useRef<number | null>(null);
  const onMessageRef = useRef(onMessage);
  const seenMessageIdsRef = useRef<Set<number>>(new Set());
  const isSendingRef = useRef(false); // 중복 전송 방지
  const shouldAutoScrollRef = useRef(true); // 자동 스크롤 여부 (사용자가 수동 스크롤 시 false)
  const initialLoadMessageIdsRef = useRef<Set<number>>(new Set()); // 초기 로드된 메시지 ID들
  const initialLoadMessageReadStatusRef = useRef<Map<number, boolean>>(
    new Map()
  ); // 초기 로드 시점의 메시지별 is_read 상태

  // onMessage ref 업데이트 (최신 콜백 유지)
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  /**
   * 새 메시지 처리 (중복 제거 포함)
   */
  const handleNewMessage = useCallback(
    (message: ChatMessage) => {
      // 중복 체크 (Set 기반)
      if (seenMessageIdsRef.current.has(message.id)) {
        return;
      }
      seenMessageIdsRef.current.add(message.id);

      // 자신이 보낸 메시지이면 최하단 스크롤 트리거
      if (message.sender_id === user?.id) {
        shouldAutoScrollRef.current = true;
        setShouldScrollToBottom(true);
      } else if (shouldAutoScrollRef.current) {
        // 상대방 메시지이고 자동 스크롤이 활성화되어 있으면 최하단 스크롤
        setShouldScrollToBottom(true);
      }

      // 채팅방이 열려있는 상태에서 상대방 메시지가 들어오면 채팅 목록의 안읽은 표시 즉시 제거
      // (실제 읽음 처리는 markRoomAsRead에서 처리되지만, UI는 즉시 업데이트)
      if (message.sender_id !== user?.id && message.room_id) {
        // 낙관적 업데이트: 채팅 목록의 안읽은 표시 즉시 제거
        markRoomAsReadOptimistic(message.room_id);
      }

      setMessages((prev) => {
        // 이미 존재하는지 다시 확인 (race condition 방지)
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }

        // created_at 기준으로 정렬된 위치에 삽입
        const newMessages = [...prev, message];
        return newMessages.sort((a, b) => {
          const aTime = a.created_at || '';
          const bTime = b.created_at || '';
          return aTime.localeCompare(bTime);
        });
      });
    },
    [user?.id, markRoomAsReadOptimistic]
  );

  /**
   * postgres_changes 채널 정리 함수
   */
  const cleanupChannel = useCallback(() => {
    const channel = channelRef.current;
    if (channel) {
      // 채널 참조를 먼저 null로 설정하여 중복 호출 방지
      channelRef.current = null;
      subscribedRoomIdRef.current = null;
      // 채널 제거 (이미 null로 설정했으므로 onClose 콜백에서 다시 cleanupChannel이 호출되지 않음)
      try {
        baseSupabase.removeChannel(channel);
      } catch (error) {
        // 이미 제거된 채널이거나 에러가 발생해도 무시
        console.warn(
          'Failed to remove channel (may already be removed):',
          error
        );
      }
    } else {
      // 채널이 없으면 subscribedRoomIdRef만 초기화
      subscribedRoomIdRef.current = null;
    }
  }, []);

  /**
   * 초기 메시지 로드 (API)
   */
  const loadMessages = useCallback(async (targetRoomId: number) => {
    // roomId가 유효하지 않으면 early return
    if (!targetRoomId || targetRoomId <= 0) {
      setIsLoading(false);
      setMessages([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/chat/message?roomId=${targetRoomId}&limit=50&offset=0`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '메시지 로드에 실패했습니다.');
      }

      const result = await response.json();
      const loadedMessages: ChatMessage[] = result.data || [];

      // Repository는 내림차순(최신→과거)으로 반환하므로 reverse 처리 (과거→최신)
      const reversedMessages = [...loadedMessages].reverse();

      // seenMessageIds 초기화 및 업데이트
      seenMessageIdsRef.current = new Set(reversedMessages.map((m) => m.id));

      // 초기 로드된 메시지 ID 저장 (구분선 표시용)
      initialLoadMessageIdsRef.current = new Set(
        reversedMessages.map((m) => m.id)
      );

      // 초기 로드 시점의 is_read 상태 저장 (markRoomAsRead 호출 전 상태)
      // 구분선 표시는 이 초기 상태를 기준으로 판단
      const initialReadStatusMap = new Map<number, boolean>();
      reversedMessages.forEach((msg) => {
        initialReadStatusMap.set(msg.id, msg.is_read ?? false);
      });
      initialLoadMessageReadStatusRef.current = initialReadStatusMap;

      setMessages(reversedMessages);
      // 스크롤 트리거는 formattedMessages가 준비된 후 별도 useEffect에서 처리
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '메시지 로드에 실패했습니다.';
      setError(errorMessage);
      console.error('Failed to load messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * postgres_changes 구독
   */
  const subscribeToPostgresChanges = useCallback(
    async (targetRoomId: number) => {
      // roomId가 유효하지 않으면 early return
      if (!targetRoomId || targetRoomId <= 0) {
        cleanupChannel();
        return;
      }

      // user.id가 없으면 구독하지 않음
      if (!user?.id) {
        cleanupChannel();
        return;
      }

      // 중복 구독 방지
      if (subscribedRoomIdRef.current === targetRoomId && channelRef.current) {
        return;
      }

      // 기존 채널 정리
      if (channelRef.current) {
        const oldChannel = channelRef.current;
        // 참조를 먼저 null로 설정
        channelRef.current = null;
        subscribedRoomIdRef.current = null;
        // 채널 제거
        try {
          baseSupabase.removeChannel(oldChannel);
        } catch (error) {
          // 이미 제거된 채널이거나 에러가 발생해도 무시
          console.warn('Failed to remove old channel:', error);
        }
      }

      try {
        // postgres_changes 채널 생성
        const channel = baseSupabase
          .channel(`chat:${targetRoomId}:changes`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'chat_messages',
              filter: `room_id=eq.${targetRoomId}`,
            },
            (payload) => {
              try {
                // payload.new는 이미 ChatMessage 타입
                const newMessage = payload.new as ChatMessage;

                // 중복 체크 및 메시지 추가
                handleNewMessage(newMessage);

                // 외부 콜백 호출
                if (onMessageRef.current) {
                  try {
                    onMessageRef.current(newMessage);
                  } catch (error) {
                    console.error('Error in onMessage callback:', error);
                  }
                }
              } catch (error) {
                console.error(
                  'Error processing postgres_changes event:',
                  error
                );
              }
            }
          )
          .subscribe((status) => {
            if (status === 'CHANNEL_ERROR') {
              const errorMessage = 'Postgres changes channel error occurred';
              setError(errorMessage);
              console.error('Channel error:', errorMessage);
              // cleanupChannel을 호출하지 않고, 채널 참조만 정리
              // removeChannel을 호출하면 CLOSED 이벤트가 다시 발생할 수 있음
              if (channelRef.current === channel) {
                channelRef.current = null;
                subscribedRoomIdRef.current = null;
              }
            } else if (status === 'CLOSED') {
              // CLOSED 상태는 이미 채널이 닫힌 상태이므로 cleanupChannel을 호출하지 않음
              // cleanupChannel을 호출하면 removeChannel이 다시 호출되어 무한 루프 발생 가능
              if (channelRef.current === channel) {
                channelRef.current = null;
                subscribedRoomIdRef.current = null;
              }
            }
          });

        channelRef.current = channel;
        subscribedRoomIdRef.current = targetRoomId;
      } catch (error) {
        console.error('Failed to setup postgres_changes subscription:', error);
        setError('구독 설정에 실패했습니다.');
        cleanupChannel();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.id, cleanupChannel]
  );

  /**
   * 메시지 전송
   */
  const sendMessage = useCallback(
    async (content: string, contentType: string = 'text'): Promise<void> => {
      // 중복 전송 방지
      if (isSendingRef.current) {
        console.warn(
          '[useChatRoom] Message is already being sent, ignoring duplicate request'
        );
        return;
      }

      // roomId가 유효하지 않으면 에러
      if (!roomId || roomId <= 0) {
        throw new Error('유효한 채팅방이 선택되지 않았습니다.');
      }

      if (!user?.id) {
        throw new Error('로그인이 필요합니다.');
      }

      // 전송 시작
      isSendingRef.current = true;

      try {
        const response = await fetch('/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            roomId,
            content,
            contentType,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || '메시지 전송에 실패했습니다.');
        }

        // postgres_changes 구독이 자동으로 메시지를 추가하므로
        // 여기서는 로컬 상태에 추가하지 않음 (중복 방지)
        // 메시지 전송 성공 시 최하단 스크롤 트리거
        shouldAutoScrollRef.current = true;
        setShouldScrollToBottom(true);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : '메시지 전송에 실패했습니다.';
        setError(errorMessage);
        console.error('[useChatRoom] Failed to send message:', error);
        throw error;
      } finally {
        // 전송 완료
        isSendingRef.current = false;
      }
    },
    [roomId, user?.id]
  );

  /**
   * 읽음 처리 (자동 - roomId 변경 시)
   */
  const markRoomAsRead = useCallback(
    async (targetRoomId: number) => {
      // roomId가 유효하지 않으면 early return
      if (!targetRoomId || targetRoomId <= 0) {
        return;
      }

      if (!user?.id) {
        return;
      }

      try {
        const response = await fetch('/api/chat/message/read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            roomId: targetRoomId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            'Failed to mark room as read:',
            errorData.error || '읽음 처리에 실패했습니다.',
            'Status:',
            response.status,
            'Response:',
            errorData
          );
          return;
        }

        await response.json().catch(() => ({}));

        // 읽음 처리 후 로컬 상태 업데이트
        setMessages((prev) =>
          prev.map((msg) =>
            msg.room_id === targetRoomId && msg.sender_id !== user.id
              ? { ...msg, is_read: true }
              : msg
          )
        );

        // 채팅 목록의 안읽은 표시 즉시 업데이트
        markRoomAsReadOptimistic(targetRoomId);
      } catch (error) {
        console.error('Failed to mark room as read:', error);
        // 백그라운드 처리이므로 사용자에게 에러 표시하지 않음
      }
    },
    [user?.id, markRoomAsReadOptimistic]
  );

  /**
   * 읽음 처리 (수동 - 특정 메시지)
   */
  const markAsRead = useCallback(
    async (messageIds: number[]) => {
      if (!user?.id || messageIds.length === 0) {
        return;
      }

      try {
        // API 엔드포인트 확장 필요: 현재는 roomId만 받음
        // 임시로 각 메시지에 대해 읽음 처리 (실제로는 API 확장 필요)
        const response = await fetch('/api/chat/message/read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            roomId,
            messageIds, // API 확장 필요
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || '읽음 처리에 실패했습니다.');
        }

        // 읽음 처리 후 로컬 상태 업데이트
        setMessages((prev) =>
          prev.map((msg) =>
            messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
          )
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '읽음 처리에 실패했습니다.';
        console.error('Failed to mark messages as read:', error);
        throw new Error(errorMessage);
      }
    },
    [roomId, user?.id]
  );

  /**
   * roomId 또는 user?.id 변경 시 자동 처리
   */
  useEffect(() => {
    // roomId가 유효하지 않으면 early return
    if (!roomId || roomId <= 0) {
      cleanupChannel();
      setMessages([]);
      seenMessageIdsRef.current.clear();
      setIsLoading(false);
      setError(null);
      return;
    }

    // user?.id가 없으면 채널 정리만 수행
    if (!user?.id) {
      cleanupChannel();
      setMessages([]);
      seenMessageIdsRef.current.clear();
      setIsLoading(false);
      setError(null);
      return;
    }

    // 이전 채널 정리
    cleanupChannel();
    // messages 배열 초기화
    setMessages([]);
    seenMessageIdsRef.current.clear();
    // 초기 로드 메시지 ID 초기화
    initialLoadMessageIdsRef.current.clear();
    // 초기 로드 시점의 is_read 상태 초기화
    initialLoadMessageReadStatusRef.current.clear();
    // isLoading 리셋
    setIsLoading(true);
    // error 상태 초기화
    setError(null);

    // 초기 메시지 로드
    loadMessages(roomId).then(async () => {
      // postgres_changes 구독
      subscribeToPostgresChanges(roomId);
      // 읽음 처리 (await로 에러 확인)
      try {
        await markRoomAsRead(roomId);
      } catch (error) {
        console.error('Failed to mark room as read:', error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user?.id]);

  /**
   * roomId 변경 시 초기 로드 플래그 리셋
   */
  const isInitialLoadRef = useRef(false);
  useEffect(() => {
    isInitialLoadRef.current = false;
  }, [roomId]);

  /**
   * 컴포넌트 언마운트 시 cleanup
   */
  useEffect(() => {
    return () => {
      // postgres_changes 채널 정리
      cleanupChannel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 중복 제거 및 정렬된 메시지 목록 (useMemo)
   */
  const sortedMessages = useMemo(() => {
    const seenIds = new Set<number>();
    return messages.filter((msg) => {
      if (seenIds.has(msg.id)) {
        return false;
      }
      seenIds.add(msg.id);
      return true;
    });
  }, [messages]);

  /**
   * 포맷된 메시지 목록 생성 (날짜 구분선, 안읽은 메시지 구분선, 연속 메시지, 포맷팅 포함)
   */
  const formattedMessages = useMemo<FormattedMessageItem[]>(() => {
    // roomId가 유효하지 않거나 user가 없으면 빈 배열 반환
    if (!roomId || roomId <= 0 || !user?.id) {
      return [];
    }

    const result: FormattedMessageItem[] = [];
    let hasAddedUnreadDivider = false; // 안읽은 메시지 구분선 추가 여부

    sortedMessages.forEach((message, index) => {
      const previousMessage = index > 0 ? sortedMessages[index - 1] : null;
      const isOwnMessage = message.sender_id === user.id;
      const isRead = message.is_read ?? false;

      // 안읽은 메시지 구분선 추가 (초기 로드된 메시지 중 가장 오래된 안읽은 메시지 앞에 한 번만)
      // 실시간으로 들어오는 메시지에는 구분선 추가하지 않음
      // 초기 로드 시점의 is_read 상태를 기준으로 판단 (markRoomAsRead 호출 후에도 유지)
      if (
        !hasAddedUnreadDivider &&
        !isOwnMessage &&
        initialLoadMessageIdsRef.current.has(message.id) // 초기 로드된 메시지만 체크
      ) {
        // 초기 로드 시점의 is_read 상태 확인
        const initialIsRead =
          initialLoadMessageReadStatusRef.current.get(message.id) ?? false;

        // 초기 로드 시점에 안읽은 메시지였던 경우에만 구분선 추가
        if (initialIsRead === false) {
          // 이전 메시지 확인
          let shouldAddDivider = false;

          if (!previousMessage) {
            // 첫 번째 메시지인 경우
            shouldAddDivider = true;
          } else if (previousMessage.sender_id === user.id) {
            // 이전 메시지가 자신의 메시지인 경우
            shouldAddDivider = true;
          } else {
            // 이전 메시지의 초기 로드 시점 is_read 상태 확인
            const previousInitialIsRead =
              initialLoadMessageReadStatusRef.current.get(previousMessage.id) ??
              false;
            if (previousInitialIsRead === true) {
              // 이전 메시지가 초기 로드 시점에 읽은 상태였던 경우
              shouldAddDivider = true;
            }
          }

          if (shouldAddDivider) {
            result.push({
              type: 'unread-divider',
            });
            hasAddedUnreadDivider = true;
          }
        }
      }

      // 날짜 구분선 추가
      const showDateDivider = isNewDate(
        message.created_at,
        previousMessage?.created_at || null
      );

      if (showDateDivider) {
        result.push({
          type: 'date-divider',
          date: message.created_at,
          formattedDate: formatDateDivider(message.created_at),
        });
      }

      // 메시지 아이템 추가
      const isConsecutive = isConsecutiveMessage(message, previousMessage);
      const isInSameTimeGroupWithPrevious = isSameTimeGroup(
        message,
        previousMessage
      );

      // 다음 메시지 확인 (그룹의 끝인지 판단)
      const nextMessage =
        index < sortedMessages.length - 1 ? sortedMessages[index + 1] : null;
      const isInSameTimeGroupWithNext = nextMessage
        ? isSameTimeGroup(nextMessage, message)
        : false;

      // 그룹의 시작인지 판단: 이전 메시지와 같은 시간 그룹이 아니면 시작
      const isGroupStart = !isInSameTimeGroupWithPrevious;

      // 그룹의 끝인지 판단: 다음 메시지와 같은 시간 그룹이 아니면 끝
      const isGroupEnd = !isInSameTimeGroupWithNext;

      const formattedTime = formatMessageTime(message.created_at);
      const formattedContent = formatMessageContent(message);

      result.push({
        type: 'message',
        message,
        isConsecutive,
        isGroupStart,
        isGroupEnd,
        isOwnMessage,
        formattedTime,
        formattedContent,
        isRead,
      });
    });

    return result;
  }, [sortedMessages, user?.id, roomId]);

  /**
   * formattedMessages가 준비된 후 초기 스크롤 처리
   * (안읽은 메시지 경계 스크롤은 formattedMessages가 필요하므로)
   */
  useEffect(() => {
    // 초기 로드가 완료되고 formattedMessages가 준비되었을 때만 실행
    if (isLoading || formattedMessages.length === 0) {
      return;
    }

    // 초기 로드 완료 후 한 번만 실행
    if (!isInitialLoadRef.current) {
      isInitialLoadRef.current = true;

      // 안읽은 메시지가 있는지 확인 (formattedMessages 기반)
      const hasUnread = formattedMessages.some(
        (item) =>
          item.type === 'message' &&
          item.message &&
          !item.isOwnMessage &&
          item.isRead === false
      );

      if (hasUnread) {
        setShouldScrollToUnread(true);
      } else {
        setShouldScrollToBottom(true);
      }
    }
  }, [isLoading, formattedMessages]);

  /**
   * 상대방 정보 조회 및 포맷팅
   */
  const otherMemberInfo = useMemo<FormattedOtherMemberInfo | null>(() => {
    // roomId가 유효하지 않으면 null 반환
    if (!roomId || roomId <= 0) {
      return null;
    }

    // chatRooms에서 현재 roomId와 일치하는 채팅방 찾기
    const chatRoomItem = chatRooms.find((item) => item.room.id === roomId);

    if (!chatRoomItem?.otherMember) {
      // 상대방 정보가 없으면 null 반환 (스켈레톤 표시를 위해)
      return null;
    }

    const { otherMember } = chatRoomItem;

    return {
      id: otherMember.id,
      nickname: otherMember.nickname ?? '알 수 없음',
      avatarImagePath: getAvatarImagePath(
        otherMember.avatar_url,
        otherMember.animal_type
      ),
      userStatus: getEffectiveStatus(otherMember.id),
      animalType: otherMember.animal_type ?? undefined,
    };
  }, [roomId, chatRooms]);

  /**
   * 상대방 정보 로딩 상태
   * - chatRooms가 로딩 중이거나
   * - roomId가 유효하지만 otherMemberInfo가 없는 경우
   */
  const isOtherMemberInfoLoading = useMemo<boolean>(() => {
    if (!roomId || roomId <= 0) {
      return false;
    }

    // chatRooms가 로딩 중이면 true
    if (isChatListLoading) {
      return true;
    }

    // roomId가 유효하지만 otherMemberInfo가 없으면 로딩 중으로 간주
    if (!otherMemberInfo) {
      return true;
    }

    return false;
  }, [roomId, isChatListLoading, otherMemberInfo]);

  /**
   * 차단 상태 확인 (기본값 false, 추후 API 연동 가능)
   */
  const isBlocked = useMemo<boolean>(() => {
    // roomId가 유효하지 않거나 user가 없으면 false
    if (!roomId || roomId <= 0 || !user?.id) {
      return false;
    }

    // otherMemberInfo가 없으면 false
    if (!otherMemberInfo || !otherMemberInfo.id) {
      return false;
    }

    // TODO: API를 통해 차단 상태 확인
    // 현재는 기본값 false 반환
    return false;
  }, [roomId, user?.id, otherMemberInfo]);

  /**
   * 가장 오래된 안읽은 메시지 ID 찾기
   */
  const getUnreadBoundaryMessageId = useCallback((): number | null => {
    if (!user?.id) {
      return null;
    }

    // formattedMessages를 순회하며 isRead: false인 첫 번째 메시지 찾기
    for (const item of formattedMessages) {
      if (item.type === 'message' && item.message && !item.isOwnMessage) {
        if (item.isRead === false) {
          return item.message.id;
        }
      }
    }

    return null;
  }, [formattedMessages, user?.id]);

  /**
   * 안읽은 메시지 구분선이 있는지 확인
   */
  const hasUnreadDivider = useCallback((): boolean => {
    return formattedMessages.some((item) => item.type === 'unread-divider');
  }, [formattedMessages]);

  /**
   * 최하단으로 스크롤
   */
  const scrollToBottom = useCallback(
    (containerRef: React.RefObject<HTMLDivElement>) => {
      if (!containerRef.current) {
        return;
      }

      // DOM 렌더링 완료 후 스크롤
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
          shouldAutoScrollRef.current = true;
        }
      });
    },
    []
  );

  /**
   * 안읽은 메시지 경계로 스크롤
   */
  const scrollToUnreadBoundary = useCallback(
    (containerRef: React.RefObject<HTMLDivElement>) => {
      if (!containerRef.current) {
        return;
      }

      // 먼저 unread-divider를 찾아서 스크롤 시도
      const findAndScroll = (attempts = 0) => {
        if (!containerRef.current) {
          return;
        }

        // unread-divider 요소 찾기
        const unreadDividerElement = containerRef.current.querySelector(
          '[data-unread-divider="true"]'
        );

        if (unreadDividerElement) {
          // divider 요소로 스크롤 (약간의 여백을 두고)
          unreadDividerElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          return;
        }

        // divider를 찾지 못하면 메시지로 fallback
        const unreadMessageId = getUnreadBoundaryMessageId();
        if (unreadMessageId) {
          const messageElement = containerRef.current.querySelector(
            `[data-message-id="${unreadMessageId}"]`
          );

          if (messageElement) {
            // 메시지 요소로 스크롤 (약간의 여백을 두고)
            messageElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
            return;
          }
        }

        // 요소를 찾지 못하면 재시도 또는 최하단으로 스크롤
        if (attempts < 10) {
          // 최대 10번까지 재시도 (DOM 렌더링 대기)
          setTimeout(() => findAndScroll(attempts + 1), 50);
        } else {
          // 여러 번 시도해도 찾지 못하면 최하단으로 스크롤
          scrollToBottom(containerRef);
        }
      };

      // requestAnimationFrame으로 시작하여 다음 프레임에 실행
      requestAnimationFrame(() => {
        findAndScroll(0);
      });
    },
    [getUnreadBoundaryMessageId, scrollToBottom]
  );

  /**
   * 최하단 이동 버튼 표시 여부 확인
   * 스크롤이 전체 길이의 50% 이상 올라갔을 때만 표시
   * (최근 메시지가 화면에서 안 보일 때만 표시)
   */
  const shouldShowScrollToBottomButton = useCallback(
    (containerRef: React.RefObject<HTMLDivElement>): boolean => {
      if (!containerRef.current) {
        return false;
      }

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      // 스크롤 가능한 전체 높이 계산
      const scrollableHeight = scrollHeight - clientHeight;

      // 스크롤 가능한 높이가 없으면 버튼 표시 안 함 (모든 메시지가 화면에 보임)
      if (scrollableHeight <= 0) {
        return false;
      }

      // 현재 스크롤 위치가 하단에서 얼마나 떨어져 있는지 계산
      // scrollTop + clientHeight = 현재 보이는 영역의 하단 위치
      // scrollHeight - (scrollTop + clientHeight) = 하단까지 남은 거리
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      // 하단까지의 거리가 전체 스크롤 가능한 높이의 50% 이상일 때만 버튼 표시
      // 즉, 스크롤이 전체 길이의 50% 이상 올라갔을 때만 표시
      const threshold = scrollableHeight * 0.5;
      return distanceFromBottom > threshold;
    },
    []
  );

  /**
   * 스크롤 트리거 초기화
   */
  const clearScrollTriggers = useCallback(() => {
    setShouldScrollToBottom(false);
    setShouldScrollToUnread(false);
  }, []);

  return {
    messages: sortedMessages, // 하위 호환성을 위해 유지
    formattedMessages,
    otherMemberInfo,
    isOtherMemberInfoLoading,
    isBlocked,
    sendMessage,
    markAsRead,
    isLoading,
    error,
    isConnected: false, // Realtime 연결 상태는 더 이상 사용하지 않음
    scrollToBottom,
    scrollToUnreadBoundary,
    getUnreadBoundaryMessageId,
    shouldShowScrollToBottomButton,
    shouldScrollToBottom,
    shouldScrollToUnread,
    clearScrollTriggers,
  };
};
