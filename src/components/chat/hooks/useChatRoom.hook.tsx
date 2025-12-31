'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { supabase as baseSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/commons/providers/auth/auth.provider';
import { useRealtimeChat, type RealtimeMessage } from './useRealtimeChat.hook';
import type { Database } from '@/types/supabase';

// 타입 정의
type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

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
  messages: ChatMessage[];
  sendMessage: (content: string, contentType?: string) => Promise<void>;
  markAsRead: (messageIds: number[]) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

/**
 * useChatRoom Hook
 *
 * - useRealtimeChat 통합
 * - 초기 메시지 로드 (API)
 * - postgres_changes로 INSERT 구독
 * - 메시지 전송 플로우 (DB 저장 + Broadcast)
 * - 읽음 처리
 */
export const useChatRoom = (props: UseChatRoomProps): UseChatRoomReturn => {
  const { roomId, onMessage } = props;
  const { user } = useAuth();

  // 상태 관리
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // postgres_changes 채널 관리
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedRoomIdRef = useRef<number | null>(null);
  const onMessageRef = useRef(onMessage);
  const seenMessageIdsRef = useRef<Set<number>>(new Set());

  // onMessage ref 업데이트 (최신 콜백 유지)
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  /**
   * 새 메시지 처리 (중복 제거 포함)
   */
  const handleNewMessage = useCallback((message: ChatMessage) => {
    // 중복 체크 (Set 기반)
    if (seenMessageIdsRef.current.has(message.id)) {
      return;
    }

    seenMessageIdsRef.current.add(message.id);

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
  }, []);

  // onMessage 콜백을 useCallback으로 감싸서 안정적인 참조 유지
  const handleRealtimeMessage = useCallback(
    (realtimeMessage: RealtimeMessage) => {
      // RealtimeMessage → ChatMessage 변환
      try {
        const chatMessage: ChatMessage = {
          id: realtimeMessage.id!,
          content: realtimeMessage.content,
          content_type: realtimeMessage.contentType || 'text',
          created_at: realtimeMessage.createdAt,
          sender_id: realtimeMessage.senderId,
          room_id: realtimeMessage.roomId,
          is_read: false, // 기본값
        };

        // Broadcast 수신 메시지를 내부 상태에 추가
        handleNewMessage(chatMessage);

        // 외부 콜백 호출
        if (onMessageRef.current) {
          try {
            onMessageRef.current(chatMessage);
          } catch (error) {
            console.error('Error in onMessage callback:', error);
          }
        }
      } catch (error) {
        console.error(
          'Error converting RealtimeMessage to ChatMessage:',
          error
        );
      }
    },
    [handleNewMessage]
  );

  // useRealtimeChat 통합
  const realtimeChat = useRealtimeChat({
    roomId,
    onMessage: handleRealtimeMessage,
  });

  // realtimeChat의 함수들을 추출하여 안정적인 참조 유지
  const {
    subscribeToRoom: subscribeToRealtimeRoom,
    unsubscribe: unsubscribeRealtime,
    isConnected: isRealtimeConnected,
  } = realtimeChat;

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

      setMessages(reversedMessages);
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
            if (status === 'SUBSCRIBED') {
              // 구독 성공
            } else if (status === 'CHANNEL_ERROR') {
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
    [user?.id, cleanupChannel, handleNewMessage]
  );

  /**
   * 메시지 전송 (useRealtimeChat.sendMessage 재사용)
   */
  const sendMessage = useCallback(
    async (content: string, contentType: string = 'text'): Promise<void> => {
      // roomId가 유효하지 않으면 에러
      if (!roomId || roomId <= 0) {
        throw new Error('유효한 채팅방이 선택되지 않았습니다.');
      }

      try {
        // useRealtimeChat의 sendMessage 재사용 (옵션 A)
        await realtimeChat.sendMessage(content, contentType);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : '메시지 전송에 실패했습니다.';
        setError(errorMessage);
        console.error('Failed to send message:', error);
        throw error;
      }
    },
    [realtimeChat, roomId]
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
            errorData.error || '읽음 처리에 실패했습니다.'
          );
          return;
        }

        // 읽음 처리 후 로컬 상태 업데이트
        setMessages((prev) =>
          prev.map((msg) =>
            msg.room_id === targetRoomId && msg.sender_id !== user.id
              ? { ...msg, is_read: true }
              : msg
          )
        );
      } catch (error) {
        console.error('Failed to mark room as read:', error);
        // 백그라운드 처리이므로 사용자에게 에러 표시하지 않음
      }
    },
    [user?.id]
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
   * roomId 변경 시 자동 처리
   */
  useEffect(() => {
    // roomId가 유효하지 않으면 early return
    if (!roomId || roomId <= 0) {
      cleanupChannel();
      unsubscribeRealtime();
      setMessages([]);
      seenMessageIdsRef.current.clear();
      setIsLoading(false);
      setError(null);
      return;
    }

    // 이전 채널 정리
    cleanupChannel();
    // useRealtimeChat의 unsubscribe 호출
    unsubscribeRealtime();
    // messages 배열 초기화
    setMessages([]);
    seenMessageIdsRef.current.clear();
    // isLoading 리셋
    setIsLoading(true);
    // error 상태 초기화
    setError(null);

    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    // 초기 메시지 로드
    loadMessages(roomId).then(() => {
      // postgres_changes 구독
      subscribeToPostgresChanges(roomId);
      // useRealtimeChat의 subscribeToRoom 호출
      subscribeToRealtimeRoom(roomId);
      // 읽음 처리
      markRoomAsRead(roomId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user?.id]);

  /**
   * user?.id 변경 시 cleanup 및 재로딩
   */
  useEffect(() => {
    // roomId가 유효하지 않으면 early return
    if (!roomId || roomId <= 0) {
      cleanupChannel();
      unsubscribeRealtime();
      setMessages([]);
      seenMessageIdsRef.current.clear();
      setIsLoading(false);
      return;
    }

    if (!user?.id) {
      // 채널 정리
      cleanupChannel();
      // useRealtimeChat의 cleanup 처리
      unsubscribeRealtime();
      // messages 배열 초기화
      setMessages([]);
      seenMessageIdsRef.current.clear();
      // isLoading 리셋
      setIsLoading(true);
    } else {
      // user?.id가 다시 설정되면 자동으로 재로딩 및 재구독
      loadMessages(roomId).then(() => {
        subscribeToPostgresChanges(roomId);
        subscribeToRealtimeRoom(roomId);
        markRoomAsRead(roomId);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, roomId]);

  /**
   * 컴포넌트 언마운트 시 cleanup
   */
  useEffect(() => {
    return () => {
      // postgres_changes 채널 정리
      cleanupChannel();
      // useRealtimeChat의 unsubscribe 호출
      unsubscribeRealtime();
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

  return {
    messages: sortedMessages,
    sendMessage,
    markAsRead,
    isLoading,
    error,
    isConnected: isRealtimeConnected,
  };
};
