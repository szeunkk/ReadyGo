'use client';

import { useEffect, useRef } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { useAuth } from '@/commons/providers/auth/auth.provider';
import {
  useUserStatusStore,
  type ManualStatus,
} from '@/stores/user-status.store';
import { supabase as baseSupabase } from '@/lib/supabase/client';

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

interface UserStatusProviderProps {
  children?: React.ReactNode;
}

/**
 * UserStatusProvider
 *
 * 유저가 직접 설정하는 상태(user_status)를 Supabase DB와 연동하고,
 * Realtime(Postgres Changes)을 통해 모든 페이지에서 실시간으로 동기화합니다.
 *
 * 또한 PresenceProvider가 제공하는 "실제 접속 여부"와 결합하여
 * 최종 표시 상태(effective status)를 계산합니다.
 *
 * - UI를 렌더링하지 않습니다
 * - AuthProvider의 user 정보만 참조합니다
 * - user.id가 있을 때만 로직을 실행합니다
 */
export const UserStatusProvider = ({ children }: UserStatusProviderProps) => {
  const { user } = useAuth();
  const { setMyStatus, setUserStatus } = useUserStatusStore();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedUserIdRef = useRef<string | null>(null);
  const seededUserIdRef = useRef<string | null>(null);

  /**
   * 로그인 후 1회: user_status row 시딩
   */
  useEffect(() => {
    if (!user?.id) {
      // user.id가 null이면 시딩 플래그 초기화
      seededUserIdRef.current = null;
      return;
    }

    const userId = user.id;

    // 이미 시딩이 완료된 경우 무시
    if (seededUserIdRef.current === userId) {
      return;
    }

    /**
     * user_status row 시딩 (1회만 실행)
     * 서버 API를 통해 시딩 수행 (인증 토큰이 HttpOnly 쿠키에 있으므로)
     */
    const seedUserStatus = async () => {
      try {
        // 서버 API를 통해 user_status 시딩 수행
        const response = await fetch('/api/user-status/seed', {
          method: 'POST',
          credentials: 'include', // 쿠키 포함
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            'Failed to seed user_status:',
            errorData.error || response.statusText
          );
          return;
        }

        // 시딩 완료 플래그 설정
        seededUserIdRef.current = userId;
      } catch (error) {
        console.error('Unexpected error while seeding user_status:', error);
      }
    };

    seedUserStatus();
  }, [user?.id]);

  /**
   * 실시간 반영: Postgres Changes 구독
   */
  useEffect(() => {
    // user.id가 없으면 Realtime 구독을 실행하지 않음
    if (!user?.id) {
      // user.id가 null로 변경된 경우(로그아웃) cleanup 수행
      if (channelRef.current) {
        const previousUserId = subscribedUserIdRef.current;

        // 채널 제거
        baseSupabase.removeChannel(channelRef.current);
        channelRef.current = null;
        subscribedUserIdRef.current = null;

        // store 초기화
        setMyStatus(null);

        // 로그아웃 시 user_status 테이블의 status를 offline으로 업데이트
        if (previousUserId) {
          fetch('/api/user-status/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status: 'offline' }),
          }).catch((error) => {
            // 로그아웃 후에는 쿠키가 없어서 실패할 수 있으므로 에러는 무시
            console.error(
              'Failed to update status to offline on logout:',
              error
            );
          });
        }
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
     * Postgres Changes 구독 설정
     */
    const setupRealtimeSubscription = async () => {
      try {
        // 세션 확인 (인증 확인용)
        const sessionData = await checkSession();
        if (!sessionData) {
          console.error('Failed to verify session for Realtime');
          return;
        }

        // 기본 supabase 클라이언트 재사용 (Multiple GoTrueClient 인스턴스 방지)
        // Realtime은 기본적으로 anon key로도 작동하며,
        // RLS 정책이 있다면 서버에서 인증을 처리합니다
        // Supabase Realtime postgres_changes 구독
        // 타입 정의에 user_status가 없을 수 있으므로 any로 캐스팅
        const channel = baseSupabase
          .channel(`user_status:${userId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              table: 'user_status' as any,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (payload: any) => {
              // 이벤트 수신 시 payload.new를 기준으로 처리
              if (payload.new) {
                const changedUserId = payload.new.user_id as string | null;
                const changedStatus = payload.new.status as ManualStatus | null;

                if (changedUserId) {
                  // 수신된 데이터를 Zustand store의 statusByUserId[user_id]에 반영
                  setUserStatus(changedUserId, changedStatus);

                  // 만약 변경된 user_id가 내 user.id와 같다면 myStatus도 함께 갱신
                  if (changedUserId === userId) {
                    setMyStatus(changedStatus);
                  }
                }
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              // 구독 성공
            } else if (status === 'CHANNEL_ERROR') {
              console.error('UserStatus channel error');
            }
          });

        channelRef.current = channel;
        subscribedUserIdRef.current = userId;
      } catch (error) {
        console.error('Failed to setup Realtime subscription:', error);
        // 에러 발생 시 안전하게 종료
        if (channelRef.current) {
          baseSupabase.removeChannel(channelRef.current);
          channelRef.current = null;
          subscribedUserIdRef.current = null;
        }
      }
    };

    setupRealtimeSubscription();

    // Cleanup 함수
    return () => {
      if (channelRef.current) {
        baseSupabase.removeChannel(channelRef.current);
        channelRef.current = null;
        subscribedUserIdRef.current = null;
      }
    };
  }, [user?.id, setMyStatus, setUserStatus]);

  /**
   * 수동 상태 변경 API 제공
   *
   * setMyManualStatus 호출 시 서버 API를 통해 Supabase DB에 upsert 수행
   */
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    // store의 setMyManualStatus를 래핑하여 실제 DB 업데이트 수행
    const originalSetMyManualStatus =
      useUserStatusStore.getState().setMyManualStatus;

    // store의 setMyManualStatus를 오버라이드하여 DB 업데이트 포함
    useUserStatusStore.setState({
      setMyManualStatus: async (status: ManualStatus) => {
        // Optimistic update (원래 함수 호출)
        originalSetMyManualStatus(status);

        try {
          // 서버 API를 통해 user_status 업데이트 수행
          const response = await fetch('/api/user-status/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // 쿠키 포함
            body: JSON.stringify({ status }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(
              'Failed to update user_status:',
              errorData.error || response.statusText
            );
            // 에러 발생 시 optimistic update 롤백은 하지 않음
            // (Realtime 이벤트가 수신되면 자동으로 동기화됨)
          }
        } catch (error) {
          console.error('Unexpected error while updating user_status:', error);
        }
      },
    });

    // Cleanup: 원래 함수로 복원
    return () => {
      useUserStatusStore.setState({
        setMyManualStatus: originalSetMyManualStatus,
      });
    };
  }, [user?.id]);

  // UI를 렌더링하지 않는 bootstrap Provider
  // children은 반드시 렌더링해야 합니다
  return <>{children}</>;
};
