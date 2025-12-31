'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { supabase as baseSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/commons/providers/auth/auth.provider';
import type { Database } from '@/types/supabase';
import type { ChatRoomListItem } from '@/repositories/chat.repository';

/**
 * 세션 확인 (Realtime 구독 전 인증 확인용)
 *
 * API 기반 세션 관리 방식이므로,
 * /api/auth/session API를 통해 세션을 확인합니다.
 * 기본 supabase 클라이언트를 재사용하여 Multiple GoTrueClient 인스턴스 경고를 방지합니다.
 */
const checkSession = async () => {
  try {
    // API를 통해 현재 세션 확인
    const sessionResponse = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
    });

    if (!sessionResponse.ok) {
      return null;
    }

    const sessionData = await sessionResponse.json();
    return sessionData.user ? sessionData : null;
  } catch (error) {
    console.error('Failed to check session:', error);
    return null;
  }
};

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
 * Hook 파라미터 타입
 */
export interface UseChatListProps {
  autoRefresh?: boolean; // 기본값: true
  refreshInterval?: number; // 기본값: 30000 (30초)
}

/**
 * Hook 반환 타입
 */
export interface UseChatListReturn {
  chatRooms: ChatRoomListItem[];
  isLoading: boolean;
  error: string | null;
}

/**
 * useChatList Hook
 *
 * - 채팅방 목록 조회 (API)
 * - postgres_changes로 목록 실시간 업데이트
 * - 읽지 않은 메시지 수 표시 관리
 * - 자동 새로고침 (선택사항)
 */
export const useChatList = (
  props?: UseChatListProps
): UseChatListReturn => {
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
   * debounced refresh 함수 (필수에 가까운 권장)
   */
  const debouncedRefresh = useCallback(
    debounce(() => {
      refresh();
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
       */
      const setupRealtimeSubscription = async () => {
        try {
          // 세션 확인 (인증 확인용)
          const sessionData = await checkSession();
          if (!sessionData) {
            console.error('Failed to verify session for Realtime');
            // 세션 없을 때 처리
            if (isMountedRef.current) {
              setChatRooms([]);
              setIsLoading(false);
            }
            cleanupChannel();
            return;
          }

          // postgres_changes 채널 생성
          const channel = baseSupabase
            .channel(`chat_list:${userId}`)
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_rooms',
              },
              () => {
                // chat_rooms INSERT: 새 채팅방 생성 시 목록에 추가
                debouncedRefresh();
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_room_members',
                filter: `user_id=eq.${userId}`,
              },
              () => {
                // chat_room_members INSERT: 사용자가 새 채팅방에 참여 시 목록에 추가
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
                // chat_room_members DELETE: 사용자가 채팅방 탈퇴 시 목록에서 제거
                debouncedRefresh();
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'chat_rooms',
              },
              () => {
                // chat_rooms UPDATE: 채팅방 정보 변경 시 목록 업데이트
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
                // chat_rooms DELETE: 채팅방 삭제 시 목록에서 제거
                debouncedRefresh();
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
              },
              () => {
                // chat_messages INSERT: 새 메시지 수신 시 목록 업데이트
                debouncedRefresh();
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_message_reads',
                filter: `user_id=eq.${userId}`,
              },
              () => {
                // chat_message_reads INSERT: 메시지 읽음 처리 시 unreadCount 업데이트
                debouncedRefresh();
              }
            )
            .subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                // 구독 성공
              } else if (status === 'CHANNEL_ERROR') {
                const errorMessage = 'Realtime error: Channel subscription failed';
                console.error(errorMessage);
                if (isMountedRef.current) {
                  // 백그라운드 처리이므로 error 상태는 선택사항
                  // setError(errorMessage);
                }
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
          console.error(errorMessage);
          cleanupChannel();
        }
      };

      await setupRealtimeSubscription();
    },
    [cleanupChannel, debouncedRefresh]
  );

  /**
   * 초기 목록 로드
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
  }, [user?.id, refresh, cleanupChannel]);

  /**
   * postgres_changes 구독
   */
  useEffect(() => {
    if (!user?.id) {
      cleanupChannel();
      return;
    }

    subscribeToPostgresChanges(user.id);

    // cleanup 함수
    return () => {
      cleanupChannel();
    };
  }, [user?.id, subscribeToPostgresChanges, cleanupChannel]);

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
   * user?.id 변경 시 cleanup 및 재로딩 (순서 중요)
   */
  useEffect(() => {
    if (!user?.id) {
      // 1) 이전 채널 정리
      cleanupChannel();
      // 2) 상태 초기화
      if (isMountedRef.current) {
        setChatRooms([]);
        setError(null);
      }
      // 3) 로딩 상태 설정
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return;
    }

    // user?.id가 변경된 경우
    const previousUserId = subscribedUserIdRef.current;
    if (previousUserId && previousUserId !== user.id) {
      // 1) 이전 채널 정리
      cleanupChannel();
      // 2) 상태 초기화
      if (isMountedRef.current) {
        setChatRooms([]);
        setError(null);
      }
      // 3) 로딩 상태 설정
      if (isMountedRef.current) {
        setIsLoading(true);
      }
      // 4) 새 구독 및 데이터 로드
      subscribeToPostgresChanges(user.id);
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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

  return {
    chatRooms,
    isLoading,
    error,
  };
};

