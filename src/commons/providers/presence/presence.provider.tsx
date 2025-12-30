'use client';

import { useEffect, useRef } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { useAuth } from '@/commons/providers/auth/auth.provider';
import { usePresenceStore } from '@/stores/presence.store';
import { supabase as baseSupabase } from '@/lib/supabase/client';

interface PresenceProviderProps {
  children: React.ReactNode;
}

/**
 * PresenceProvider
 *
 * Supabase Realtime Presence를 사용하여
 * 현재 접속 중인 사용자 목록을 관리하는 bootstrap Provider입니다.
 *
 * - UI를 렌더링하지 않습니다
 * - AuthProvider의 user 정보만 참조합니다
 * - user.id가 있을 때만 Presence 로직을 실행합니다
 */
export const PresenceProvider = ({ children }: PresenceProviderProps) => {
  const { user } = useAuth();
  const { setPresenceUserIds } = usePresenceStore();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // user.id가 없으면 Presence 로직을 실행하지 않음
    if (!user?.id) {
      // user.id가 null로 변경된 경우(로그아웃) cleanup 수행
      if (channelRef.current) {
        // Presence를 먼저 untrack하여 다른 클라이언트에 leave 이벤트 전송
        channelRef.current
          .untrack()
          .then(() => {
            // untrack 완료 후 채널 제거
            baseSupabase.removeChannel(channelRef.current!);
            channelRef.current = null;
            subscribedUserIdRef.current = null;
            setPresenceUserIds([]);
          })
          .catch((error) => {
            // untrack 실패해도 채널은 제거
            console.error('Failed to untrack presence:', error);
            baseSupabase.removeChannel(channelRef.current!);
            channelRef.current = null;
            subscribedUserIdRef.current = null;
            setPresenceUserIds([]);
          });
      }
      return;
    }

    const userId = user.id;

    // 중복 subscribe 방지: 동일 user.id에 대해 이미 채널이 생성되어 있으면 무시
    if (subscribedUserIdRef.current === userId && channelRef.current) {
      return;
    }

    // 기존 채널이 있으면 정리 (user.id가 변경된 경우)
    if (channelRef.current && subscribedUserIdRef.current !== userId) {
      baseSupabase.removeChannel(channelRef.current);
      channelRef.current = null;
      subscribedUserIdRef.current = null;
    }

    /**
     * Presence 설정
     *
     * 기본 supabase 클라이언트를 재사용하여 Multiple GoTrueClient 인스턴스 경고를 방지합니다.
     * Realtime Presence는 기본적으로 anon key로도 작동하며,
     * RLS 정책이 있다면 서버에서 인증을 처리합니다.
     */
    const setupPresence = async () => {
      try {
        // API를 통해 현재 세션 확인 (인증 확인용)
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        });

        if (!sessionResponse.ok) {
          console.error('Failed to get session for Presence');
          return;
        }

        const sessionData = await sessionResponse.json();

        if (!sessionData.user || sessionData.user.id !== userId) {
          console.error('Session user mismatch');
          return;
        }

        // 기본 supabase 클라이언트 재사용 (Multiple GoTrueClient 인스턴스 방지)
        // Presence 채널 생성
        const channel = baseSupabase.channel('presence:global', {
          config: {
            presence: {
              key: userId,
            },
          },
        });

        // Presence 상태 업데이트 핸들러
        const handlePresenceSync = () => {
          const presenceState = channel.presenceState();
          const userIds: string[] = [];

          // presenceState에서 모든 접속 중인 userId 추출
          Object.values(presenceState).forEach((presences) => {
            if (Array.isArray(presences)) {
              presences.forEach((presence) => {
                // presence 객체는 track할 때 전달한 데이터를 포함
                const presenceData = presence as {
                  user_id?: string;
                  joined_at?: string;
                  [key: string]: unknown;
                };
                if (
                  presenceData.user_id &&
                  typeof presenceData.user_id === 'string'
                ) {
                  if (!userIds.includes(presenceData.user_id)) {
                    userIds.push(presenceData.user_id);
                  }
                }
              });
            }
          });

          // Zustand store에 반영
          setPresenceUserIds(userIds);
        };

        // 채널 이벤트 구독
        channel
          .on('presence', { event: 'sync' }, handlePresenceSync)
          .on('presence', { event: 'join' }, handlePresenceSync)
          .on('presence', { event: 'leave' }, handlePresenceSync)
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              // subscribe 성공 후 presence track
              const trackStatus = await channel.track({
                user_id: userId,
                joined_at: new Date().toISOString(),
              });

              if (trackStatus === 'ok') {
                // 초기 presence 상태 동기화
                handlePresenceSync();
              } else {
                console.error('Failed to track presence');
              }
            } else if (status === 'CHANNEL_ERROR') {
              console.error('Presence channel error');
            }
          });

        channelRef.current = channel;
        subscribedUserIdRef.current = userId;
      } catch (error) {
        console.error('Failed to setup Presence:', error);
        // 에러 발생 시 안전하게 종료
        if (channelRef.current) {
          baseSupabase.removeChannel(channelRef.current);
          channelRef.current = null;
          subscribedUserIdRef.current = null;
        }
      }
    };

    setupPresence();

    // Cleanup 함수
    return () => {
      if (channelRef.current) {
        // Presence를 먼저 untrack하여 다른 클라이언트에 leave 이벤트 전송
        channelRef.current
          .untrack()
          .then(() => {
            // untrack 완료 후 채널 제거
            baseSupabase.removeChannel(channelRef.current!);
            channelRef.current = null;
            subscribedUserIdRef.current = null;
            setPresenceUserIds([]);
          })
          .catch((error) => {
            // untrack 실패해도 채널은 제거
            console.error('Failed to untrack presence:', error);
            baseSupabase.removeChannel(channelRef.current!);
            channelRef.current = null;
            subscribedUserIdRef.current = null;
            setPresenceUserIds([]);
          });
      }
    };
  }, [user?.id, setPresenceUserIds]);

  // UI를 렌더링하지 않는 bootstrap Provider
  return <>{children}</>;
};
