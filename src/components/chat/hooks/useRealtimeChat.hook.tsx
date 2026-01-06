'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { supabase as baseSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/commons/providers/auth/auth.provider';

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
 * Realtime 메시지 타입
 */
export interface RealtimeMessage {
  id?: number; // DB에 저장된 메시지 ID (중복 방지용, Broadcast 수신 시 포함)
  content: string;
  contentType?: string; // 메시지 타입 (중복 방지용, Broadcast 수신 시 포함)
  senderId: string;
  roomId: number;
  createdAt: string;
}

/**
 * Hook 파라미터 타입
 */
export interface UseRealtimeChatProps {
  onMessage?: (message: RealtimeMessage) => void;
  roomId?: number; // 초기 roomId (선택사항, prop으로 전달 시 자동 구독)
}

/**
 * Hook 반환 타입
 */
export interface UseRealtimeChatReturn {
  subscribeToRoom: (roomId: number) => void;
  sendMessage: (content: string, contentType?: string) => Promise<void>;
  unsubscribe: () => void;
  isConnected: boolean;
  error: string | null;
}

/**
 * Supabase Realtime Broadcast를 사용한 실시간 채팅 Hook
 *
 * - Broadcast 채널을 통해 실시간 메시지 전송/수신
 * - 메시지는 Repository를 통해 DB에 저장 후 Broadcast로 전송
 * - 중복 수신 방지를 위해 Broadcast payload에 id와 contentType 포함
 */
export const useRealtimeChat = (
  props?: UseRealtimeChatProps
): UseRealtimeChatReturn => {
  const { onMessage, roomId: initialRoomId } = props || {};
  const { user } = useAuth();

  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedRoomIdRef = useRef<number | null>(null);
  const onMessageRef = useRef(onMessage);
  const isSendingRef = useRef(false); // 중복 전송 방지
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // onMessage ref 업데이트 (최신 콜백 유지)
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  /**
   * 채널 정리 함수
   */
  const cleanupChannel = useCallback(() => {
    if (channelRef.current) {
      baseSupabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    subscribedRoomIdRef.current = null;
    setIsConnected(false);
    setError(null);
  }, []);

  /**
   * 특정 채팅방에 대한 Broadcast 채널 구독
   */
  const subscribeToRoom = useCallback(
    async (roomId: number) => {
      // roomId가 유효하지 않으면 early return
      if (!roomId || roomId <= 0) {
        cleanupChannel();
        return;
      }

      // user.id가 없으면 구독하지 않음
      if (!user?.id) {
        cleanupChannel();
        return;
      }

      // 중복 구독 방지: 동일 roomId에 대해 이미 채널이 생성되어 있으면 무시
      if (subscribedRoomIdRef.current === roomId && channelRef.current) {
        return;
      }

      // 기존 채널이 있으면 정리 (roomId가 변경된 경우)
      if (channelRef.current && subscribedRoomIdRef.current !== roomId) {
        baseSupabase.removeChannel(channelRef.current);
        channelRef.current = null;
        subscribedRoomIdRef.current = null;
      }

      /**
       * Broadcast 채널 구독 설정
       */
      const setupBroadcastSubscription = async () => {
        try {
          // 세션 확인 (인증 확인용)
          const sessionData = await checkSession();
          if (!sessionData) {
            console.error('Failed to verify session for Realtime');
            cleanupChannel();
            return;
          }

          // Broadcast 채널 생성
          const channel = baseSupabase
            .channel(`chat:${roomId}`, {
              config: {
                broadcast: { self: true },
              },
            })
            .on('broadcast', { event: 'message' }, (payload) => {
              // 메시지 수신 시 콜백 호출 (ref를 통해 최신 콜백 사용)
              if (onMessageRef.current) {
                const message: RealtimeMessage = {
                  id: payload.payload.id,
                  content: payload.payload.content,
                  contentType: payload.payload.contentType,
                  senderId: payload.payload.senderId,
                  roomId: payload.payload.roomId,
                  createdAt: payload.payload.createdAt,
                };
                onMessageRef.current(message);
              }
            })
            .subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                setIsConnected(true);
                setError(null);
              } else if (status === 'CHANNEL_ERROR') {
                setIsConnected(false);
                const errorMessage = 'Channel error occurred';
                setError(errorMessage);
                console.error('Channel error:', errorMessage);
              } else if (status === 'CLOSED') {
                setIsConnected(false);
                const errorMessage = 'Channel closed';
                setError(errorMessage);
              }
            });

          channelRef.current = channel;
          subscribedRoomIdRef.current = roomId;
        } catch (error) {
          console.error('Failed to setup Broadcast subscription:', error);
          cleanupChannel();
        }
      };

      await setupBroadcastSubscription();
    },
    [user?.id, cleanupChannel]
  );

  /**
   * 메시지 전송 함수
   */
  const sendMessage = useCallback(
    async (content: string, contentType: string = 'text'): Promise<void> => {
      // 중복 전송 방지
      if (isSendingRef.current) {
        console.warn(
          'Message is already being sent, ignoring duplicate request'
        );
        return;
      }

      // user.id가 없으면 전송하지 않음
      if (!user?.id) {
        throw new Error('User is not authenticated');
      }

      const roomId = subscribedRoomIdRef.current;
      const senderId = user.id;

      // roomId 또는 senderId가 없으면 에러 throw
      if (!roomId || !senderId) {
        throw new Error('Room ID or sender ID is missing');
      }

      // 전송 시작
      isSendingRef.current = true;

      try {
        // 1) API를 통해 메시지 저장 (서버 사이드 Repository 함수 호출)
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

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || '메시지 전송에 실패했습니다.');
        }

        const savedMessage = result.data;

        // 2) 저장 성공 후 Broadcast로 실시간 전송 (id 포함하여 중복 방지 가능하도록)
        if (channelRef.current) {
          const payload = {
            id: savedMessage.id,
            content: savedMessage.content,
            contentType: savedMessage.content_type,
            senderId: savedMessage.sender_id,
            roomId: savedMessage.room_id,
            createdAt: savedMessage.created_at,
          };

          try {
            await channelRef.current.send({
              type: 'broadcast',
              event: 'message',
              payload,
            });
          } catch (broadcastError) {
            // Broadcast 전송 실패 시 에러 로그 (저장은 성공했으므로 계속 진행)
            console.error('Failed to broadcast message:', broadcastError);
          }
        }
      } catch (error) {
        // API 호출 실패 시 에러 throw
        console.error('Failed to send message:', error);
        throw error;
      } finally {
        // 전송 완료
        isSendingRef.current = false;
      }
    },
    [user?.id]
  );

  /**
   * 채널 수동 해제 함수
   */
  const unsubscribe = useCallback(() => {
    cleanupChannel();
  }, [cleanupChannel]);

  /**
   * roomId prop 기반 자동 구독 (선택사항)
   */
  useEffect(() => {
    if (initialRoomId) {
      subscribeToRoom(initialRoomId);
    }

    // cleanup 함수
    return () => {
      cleanupChannel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRoomId]);

  /**
   * user?.id 변경 시 채널 정리
   */
  useEffect(() => {
    if (!user?.id) {
      cleanupChannel();
    }
  }, [user?.id, cleanupChannel]);

  /**
   * 컴포넌트 언마운트 시 채널 정리
   */
  useEffect(() => {
    return () => {
      cleanupChannel();
    };
  }, [cleanupChannel]);

  return {
    subscribeToRoom,
    sendMessage,
    unsubscribe,
    isConnected,
    error,
  };
};

