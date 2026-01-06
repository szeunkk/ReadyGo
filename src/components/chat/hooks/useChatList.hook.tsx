'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { supabase as baseSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/commons/providers/auth/auth.provider';
import { getEffectiveStatus } from '@/stores/user-status.store';
import { getAvatarImagePath } from '@/lib/avatar/getAvatarImagePath';
import type { ChatRoomListItem } from '@/repositories/chat.repository';
import type { ChatRoom, ChatMessage, UserProfile } from '@/types/chat';

/**
 * 간단한 debounce 함수
 */
const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * 시간 포맷 함수 (24h 기준, 오늘은 시간, 그 외는 날짜)
 */
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

/**
 * 메시지 내용 포맷 함수
 */
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

/**
 * 채팅방 이름 생성 함수
 */
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

/**
 * Hook 파라미터 타입
 */
export interface UseChatListProps {
  autoRefresh?: boolean; // 기본값: true
  refreshInterval?: number; // 기본값: 30000 (30초)
}

/**
 * 포맷된 채팅방 아이템 타입 (UI에서 바로 사용 가능)
 */
export interface FormattedChatRoomItem {
  roomId: number;
  roomName: string;
  avatarImagePath: string;
  userStatus: 'online' | 'away' | 'dnd' | 'offline';
  messageContent: string;
  messageTime: string;
  unreadCount: number;
  isSelected?: boolean;
  // 원본 데이터 (필요한 경우)
  originalData: ChatRoomListItem;
}

/**
 * Hook 반환 타입
 */
export interface UseChatListReturn {
  chatRooms: ChatRoomListItem[]; // 원본 데이터 (하위 호환성)
  formattedChatRooms: FormattedChatRoomItem[]; // UI에서 바로 사용 가능한 포맷된 데이터
  isLoading: boolean;
  error: string | null;
  markRoomAsReadOptimistic: (roomId: number) => void; // 낙관적 업데이트 함수
}

/**
 * useChatList Hook
 *
 * - 채팅방 목록 조회 (API)
 * - postgres_changes로 목록 실시간 업데이트
 * - 읽지 않은 메시지 수 표시 관리
 * - 자동 새로고침 (선택사항)
 */
export const useChatList = (props?: UseChatListProps): UseChatListReturn => {
  const { autoRefresh = true, refreshInterval = 30000 } = props || {};
  const { user } = useAuth();

  // 상태 관리
  const [chatRooms, setChatRooms] = useState<ChatRoomListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // postgres_changes 채널 관리
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedUserIdRef = useRef<string | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 내부 refresh 함수 (API를 통해 전체 목록 재조회)
   */
  const refresh = useCallback(async () => {
    // unmount 체크
    if (!isMountedRef.current) {
      return;
    }

    // user?.id가 없으면 조회하지 않음
    if (!user?.id) {
      if (isMountedRef.current) {
        setChatRooms([]);
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await fetch('/api/chat/rooms', {
        method: 'GET',
        credentials: 'include',
      });

      if (!isMountedRef.current) {
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = `API error: 채팅방 목록 조회 실패: ${
          errorData.error || 'Unknown error'
        }`;
        setError(errorMessage);
        setIsLoading(false);
        console.error(errorMessage);
        return;
      }

      const result = await response.json();
      const rooms: ChatRoomListItem[] = result.data || [];

      if (isMountedRef.current) {
        setChatRooms(rooms);
        setIsLoading(false);
        setError(null);
      }
    } catch (err) {
      if (!isMountedRef.current) {
        return;
      }
      const errorMessage = `API error: 채팅방 목록 조회 실패: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`;
      setError(errorMessage);
      setIsLoading(false);
      console.error(errorMessage);
    }
  }, [user?.id]);

  /**
   * 낙관적 업데이트: 특정 채팅방의 unreadCount를 즉시 0으로 설정
   */
  const markRoomAsReadOptimistic = useCallback((roomId: number) => {
    if (!isMountedRef.current) {
      return;
    }

    setChatRooms((prev) =>
      prev.map((room) =>
        room.room.id === roomId ? { ...room, unreadCount: 0 } : room
      )
    );
  }, []);

  /**
   * debounced refresh 함수 (필수에 가까운 권장)
   */
  const debouncedRefresh = useMemo(
    () =>
      debounce((...args: Parameters<typeof refresh>) => {
        refresh(...args);
      }, 300),
    [refresh]
  );

  /**
   * postgres_changes 채널 정리 함수
   */
  const cleanupChannel = useCallback(() => {
    if (channelRef.current) {
      baseSupabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    subscribedUserIdRef.current = null;
  }, []);

  /**
   * postgres_changes 구독
   */
  const subscribeToPostgresChanges = useCallback(
    async (userId: string) => {
      // 중복 구독 방지
      if (subscribedUserIdRef.current === userId && channelRef.current) {
        return;
      }

      // 기존 채널 정리
      if (channelRef.current && subscribedUserIdRef.current !== userId) {
        cleanupChannel();
      }

      /**
       * Postgres Changes 구독 설정
       * Supabase Realtime은 자동으로 세션을 확인하므로 별도 세션 확인 불필요
       */
      const setupRealtimeSubscription = async () => {
        try {
          // postgres_changes 채널 생성
          // 채널 이름에 userId를 포함하여 고유성 보장
          const channelName = `chat_list:${userId}:${Date.now()}`;
          const channel = baseSupabase
            .channel(channelName, {
              config: {
                broadcast: { self: false },
                presence: { key: userId },
              },
            })
            // chat_room_members: 사용자가 참여한 채팅방 변경 감지
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_room_members',
                filter: `user_id=eq.${userId}`,
              },
              () => {
                // 사용자가 새 채팅방에 참여 시 목록에 추가
                debouncedRefresh();
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'DELETE',
                schema: 'public',
                table: 'chat_room_members',
                filter: `user_id=eq.${userId}`,
              },
              () => {
                // 사용자가 채팅방 탈퇴 시 목록에서 제거
                debouncedRefresh();
              }
            )
            // chat_rooms: 채팅방 정보 변경 감지 (사용자가 참여한 방만)
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'chat_rooms',
              },
              () => {
                // 채팅방 정보 변경 시 목록 업데이트
                debouncedRefresh();
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'DELETE',
                schema: 'public',
                table: 'chat_rooms',
              },
              () => {
                // 채팅방 삭제 시 목록에서 제거
                debouncedRefresh();
              }
            )
            // chat_messages: 새 메시지 수신 감지 (사용자가 참여한 방의 메시지만)
            // RLS 정책에 의해 자동으로 필터링됨
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
              },
              () => {
                // 새 메시지 수신 시 목록 업데이트 (마지막 메시지, 시간 등)
                debouncedRefresh();
              }
            )
            // chat_message_reads: 읽음 처리 감지
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_message_reads',
                filter: `user_id=eq.${userId}`,
              },
              async (payload) => {
                // 메시지 읽음 처리 시 unreadCount 업데이트
                try {
                  const messageId = payload.new?.message_id;

                  if (messageId) {
                    // message_id로 room_id 조회 (낙관적 업데이트를 위해)
                    const { data: messageData } = await baseSupabase
                      .from('chat_messages')
                      .select('room_id')
                      .eq('id', messageId)
                      .single();

                    if (messageData?.room_id) {
                      // 즉시 낙관적 업데이트
                      markRoomAsReadOptimistic(messageData.room_id);
                    }
                  }
                } catch (error) {
                  // 에러 발생 시 기존 방식으로 fallback
                  console.warn('Failed to get room_id from message_id:', error);
                }

                // 백그라운드에서 최종 동기화 (debounce 적용)
                debouncedRefresh();
              }
            )
            .subscribe((status, err) => {
              if (status === 'SUBSCRIBED') {
                // 구독 성공
              } else if (status === 'CHANNEL_ERROR') {
                const errorMessage =
                  'Realtime error: Channel subscription failed';
                console.error(errorMessage, err);
                // Realtime 구독 실패해도 앱은 정상 동작 (폴링으로 대체)
                if (channelRef.current === channel) {
                  channelRef.current = null;
                  subscribedUserIdRef.current = null;
                }
              } else if (status === 'TIMED_OUT') {
                console.warn('⚠️ Realtime subscription timed out');
                // 타임아웃 시 재시도하지 않음 (폴링으로 대체)
                if (channelRef.current === channel) {
                  channelRef.current = null;
                  subscribedUserIdRef.current = null;
                }
              } else if (status === 'CLOSED') {
                if (channelRef.current === channel) {
                  channelRef.current = null;
                  subscribedUserIdRef.current = null;
                }
              }
            });

          channelRef.current = channel;
          subscribedUserIdRef.current = userId;
        } catch (err) {
          const errorMessage = `Realtime error: Failed to setup postgres_changes subscription: ${
            err instanceof Error ? err.message : 'Unknown error'
          }`;
          console.error(errorMessage, err);
          // Realtime 구독 실패해도 앱은 정상 동작 (폴링으로 대체)
          cleanupChannel();
        }
      };

      await setupRealtimeSubscription();
    },
    [cleanupChannel, debouncedRefresh, markRoomAsReadOptimistic]
  );

  /**
   * 초기 목록 로드 및 postgres_changes 구독
   */
  useEffect(() => {
    if (!user?.id) {
      if (isMountedRef.current) {
        setChatRooms([]);
        setIsLoading(false);
      }
      cleanupChannel();
      return;
    }

    // 초기 목록 로드
    refresh();
    // postgres_changes 구독
    subscribeToPostgresChanges(user.id);

    // cleanup 함수
    return () => {
      cleanupChannel();
    };
  }, [user?.id, refresh, subscribeToPostgresChanges, cleanupChannel]);

  /**
   * 자동 새로고침 구현
   */
  useEffect(() => {
    if (!autoRefresh || !user?.id) {
      // 기존 타이머 정리
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
      }
      return;
    }

    // 타이머 설정
    autoRefreshTimerRef.current = setInterval(() => {
      refresh();
    }, refreshInterval);

    // cleanup 함수
    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
      }
    };
  }, [autoRefresh, refreshInterval, user?.id, refresh]);

  /**
   * 컴포넌트 언마운트 시 cleanup
   */
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      // postgres_changes 채널 정리
      cleanupChannel();
      // 자동 새로고침 타이머 정리
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
      }
    };
  }, [cleanupChannel]);

  /**
   * 포맷된 채팅방 목록 계산 (UI에서 바로 사용 가능)
   */
  const formattedChatRooms = useMemo<FormattedChatRoomItem[]>(() => {
    return chatRooms.map((item) => {
      const { room, otherMember, lastMessage, unreadCount } = item;

      // 채팅방 이름
      const roomName = getChatRoomName(room, otherMember);

      // 아바타 이미지 경로
      const avatarImagePath = getAvatarImagePath(
        otherMember?.avatar_url,
        otherMember?.animal_type
      );

      // 사용자 상태
      const userStatus = otherMember?.id
        ? getEffectiveStatus(otherMember.id)
        : 'offline';

      // 메시지 내용
      const messageContent = formatMessageContent(lastMessage);

      // 메시지 시간
      const messageTime = lastMessage?.created_at
        ? formatMessageTime(lastMessage.created_at)
        : '';

      return {
        roomId: room.id || 0,
        roomName,
        avatarImagePath,
        userStatus,
        messageContent,
        messageTime,
        unreadCount,
        originalData: item,
      };
    });
  }, [chatRooms]);

  return {
    chatRooms, // 하위 호환성을 위해 유지
    formattedChatRooms,
    isLoading,
    error,
    markRoomAsReadOptimistic,
  };
};
