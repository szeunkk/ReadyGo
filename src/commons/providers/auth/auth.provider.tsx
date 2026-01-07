'use client';

import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import { useAuthStore } from '@/stores/auth.store';
import { useSidePanelStore } from '@/stores/sidePanel.store';
import { useOverlayStore } from '@/stores/overlay.store';
import { URL_PATHS } from '@/commons/constants/url';

interface AuthContextValue {
  isLoggedIn: boolean;
  user: User | null;
  isSessionSynced: boolean; // 세션 동기화 완료 여부
  loginRedirect: () => void;
  logout: () => Promise<void>;
  syncSession: () => Promise<void>; // 세션 동기화 함수 (외부 호출 가능)
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const { accessToken, user, setAuth, clearAuth } = useAuthStore();
  const isInitializedRef = useRef(false);
  const isSessionSyncedRef = useRef(false);
  const [isSessionSynced, setIsSessionSynced] = useState(false); // 세션 동기화 완료 상태
  const storeRef = useRef({ accessToken, user });
  const authChannelRef = useRef<BroadcastChannel | null>(null); // 탭 간 통신 채널

  // store 상태를 ref에 동기화 (무한 루프 방지)
  useEffect(() => {
    storeRef.current = { accessToken, user };
  }, [accessToken, user]);

  /**
   * API를 통해 세션을 Zustand store에 동기화
   *
   * Supabase 세션 관리를 API로 일원화:
   * - Supabase 클라이언트의 localStorage 저장 비활성화
   * - 모든 세션 조회는 /api/auth/session API를 통해서만 수행
   * - 실제 토큰은 서버의 HttpOnly 쿠키에서 관리
   * - 클라이언트 store에는 인증 상태만 저장
   * - 토큰 갱신: API에서 Supabase의 autoRefreshToken을 활용하여 자동 갱신
   * - 클라이언트는 직접 토큰을 읽지 않고 API를 통해서만 조회
   * - 타임아웃: 10초 내 응답이 없으면 자동으로 중단하여 UI 블로킹 방지
   * - 재시도: 서버가 준비되지 않은 경우를 대비하여 최대 3회 재시도
   *
   * @param retryCount - 재시도 횟수 (기본값: 0, 최대 3회)
   * @param isInitialSync - 초기 동기화 여부 (초기화 시에만 재시도 수행)
   */
  const syncSessionToStore = useCallback(
    async (retryCount = 0, isInitialSync = false) => {
      const MAX_RETRIES = 3;
      const RETRY_DELAYS = [1000, 2000, 3000]; // 1초, 2초, 3초

      // AbortController를 사용하여 타임아웃 설정 (10초)
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, 10000); // 10초 타임아웃

      try {
        // API를 통해 세션 조회 (HttpOnly 쿠키 자동 포함, 토큰 갱신 자동 처리)
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include', // 쿠키 포함
          signal: abortController.signal, // 타임아웃 시그널 추가
        });

        // 타임아웃이 발생하지 않았으면 타이머 정리
        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error('Failed to get session:', response.statusText);
          clearAuth();
          return;
        }

        const data = await response.json();

        // 세션 존재 여부 확인
        const newUser = data.user ?? null;
        // 실제 토큰은 서버에서 HttpOnly 쿠키로 관리되므로,
        // 클라이언트에는 인증 여부만 표시용으로 저장
        const newAccessToken = newUser ? 'authenticated' : null;

        // 무한 루프 방지: 값이 변경된 경우에만 업데이트
        const { accessToken: currentAccessToken, user: currentUser } =
          storeRef.current;
        if (
          currentAccessToken !== newAccessToken ||
          currentUser?.id !== newUser?.id ||
          JSON.stringify(currentUser) !== JSON.stringify(newUser)
        ) {
          setAuth(newAccessToken, newUser);

          // ✅ 다른 탭에 세션 업데이트 알림 (로그인 또는 세션 갱신)
          if (newUser && authChannelRef.current) {
            authChannelRef.current.postMessage({
              type: 'AUTH_SESSION_UPDATED',
              payload: { user: newUser },
            });
          }
        }

        // 성공 시 플래그 설정 (재시도 중이어도 성공하면 플래그 설정)
        if (isInitialSync && retryCount > 0) {
          isSessionSyncedRef.current = true;
          setIsSessionSynced(true);
        }
      } catch (error) {
        // 타임아웃이 발생하지 않았으면 타이머 정리
        clearTimeout(timeoutId);

        // 서버가 준비되지 않은 경우 재시도 (초기 동기화 시에만)
        if (
          isInitialSync &&
          retryCount < MAX_RETRIES &&
          error instanceof TypeError &&
          error.message === 'Failed to fetch'
        ) {
          const delay = RETRY_DELAYS[retryCount] || 3000;
          console.warn(
            `Session sync failed (서버 준비 중일 수 있음). ${delay}ms 후 재시도 (${retryCount + 1}/${MAX_RETRIES})...`
          );

          // 재시도 전 대기
          await new Promise((resolve) => setTimeout(resolve, delay));

          // 재시도 (재시도 완료 후 플래그 설정을 위해 await)
          try {
            await syncSessionToStore(retryCount + 1, isInitialSync);
            // 재시도 성공 시 플래그는 재시도 함수의 finally 블록에서 설정됨
          } catch {
            // 재시도도 실패한 경우 플래그 설정
            isSessionSyncedRef.current = true;
            setIsSessionSynced(true);
          }
          return; // 재시도 중이므로 여기서 종료
        }

        // AbortError (타임아웃) 처리
        if (error instanceof Error && error.name === 'AbortError') {
          console.error(
            'Session sync timeout: API 호출이 10초 내에 완료되지 않았습니다.'
          );
          // 타임아웃 발생 시에도 세션 동기화 완료 플래그를 설정하여 UI 블로킹 방지
          // 사용자가 무한 대기 상태에 빠지지 않도록 함
        } else if (
          error instanceof TypeError &&
          error.message === 'Failed to fetch'
        ) {
          // 네트워크 오류 처리 (재시도 실패 또는 주기적 호출 시)
          console.error(
            'Session sync network error: 네트워크 연결을 확인해주세요.'
          );
        } else {
          // 기타 에러 처리
          console.error('Unexpected error while syncing session:', error);
        }
        // 에러 발생 시에도 인증 상태는 초기화하지 않음 (기존 상태 유지)
        // 네트워크 오류나 타임아웃은 일시적일 수 있으므로 기존 세션 정보 유지
      } finally {
        // 세션 동기화 완료 표시 (성공/실패/타임아웃 모두 포함)
        // 타임아웃이나 에러 발생 시에도 UI가 블로킹되지 않도록 플래그 설정
        // 재시도 중이 아닐 때만 플래그 설정
        // 재시도가 성공하면 try 블록에서 플래그가 설정되고,
        // 재시도가 실패하면 catch 블록에서 플래그가 설정됨
        if (!isInitialSync || retryCount === 0) {
          // 주기적 호출이거나 첫 시도인 경우에만 플래그 설정
          isSessionSyncedRef.current = true;
          setIsSessionSynced(true);
        }
        // 재시도 중일 때는:
        // - 성공 시: try 블록에서 플래그 설정
        // - 실패 시: catch 블록에서 플래그 설정
      }
    },
    [clearAuth, setAuth]
  );

  // BroadcastChannel 초기화 (탭 간 통신)
  useEffect(() => {
    // 브라우저 환경에서만 BroadcastChannel 사용
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      authChannelRef.current = new BroadcastChannel('readygo-auth');

      // 다른 탭에서 보낸 메시지 수신
      authChannelRef.current.onmessage = (event) => {
        const { type, payload } = event.data;

        // eslint-disable-next-line no-console
        console.log('📡 BroadcastChannel 메시지 수신:', type);

        switch (type) {
          case 'AUTH_LOGOUT':
            // 다른 탭에서 로그아웃 → 이 탭도 즉시 로그아웃
            // eslint-disable-next-line no-console
            console.log('다른 탭에서 로그아웃 감지 → 로그아웃 처리');
            clearAuth();
            useSidePanelStore.getState().close();
            useOverlayStore.getState().close();
            router.push(URL_PATHS.LOGIN);
            break;

          case 'AUTH_SESSION_UPDATED':
            // 다른 탭에서 세션 업데이트 → 이 탭도 동기화
            // eslint-disable-next-line no-console
            console.log('다른 탭에서 세션 업데이트 감지 → 세션 동기화');
            if (payload?.user) {
              setAuth('authenticated', payload.user);
            }
            break;
        }
      };
    }

    return () => {
      // Cleanup: BroadcastChannel 닫기
      authChannelRef.current?.close();
    };
  }, [router, setAuth, clearAuth]);

  // 마운트 시 초기 세션 동기화
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      setIsSessionSynced(false); // 초기화 시작 시 false로 설정

      // ✅ 세션 동기화 시작 (초기 동기화이므로 재시도 활성화)
      syncSessionToStore(0, true);

      // ✅ OAuth 콜백 후 쿠키 반영을 위한 추가 재시도 (2초, 4초, 6초 후)
      const retryTimeouts = [
        setTimeout(() => {
          if (!useAuthStore.getState().accessToken) {
            // eslint-disable-next-line no-console
            console.log('세션 재시도 (2초 후)');
            syncSessionToStore(0, false);
          }
        }, 2000),
        setTimeout(() => {
          if (!useAuthStore.getState().accessToken) {
            // eslint-disable-next-line no-console
            console.log('세션 재시도 (4초 후)');
            syncSessionToStore(0, false);
          }
        }, 4000),
        setTimeout(() => {
          if (!useAuthStore.getState().accessToken) {
            // eslint-disable-next-line no-console
            console.log('세션 재시도 (6초 후)');
            syncSessionToStore(0, false);
          }
        }, 6000),
      ];

      // 안전장치: 최대 대기 시간(20초) 후 강제로 isSessionSynced를 true로 설정
      const safetyTimeoutId = setTimeout(() => {
        if (!isSessionSyncedRef.current) {
          console.warn(
            'Session sync safety timeout: 20초 후 강제로 세션 동기화 완료 처리'
          );
          isSessionSyncedRef.current = true;
          setIsSessionSynced(true);
        }
      }, 20000); // 20초 안전장치

      // Cleanup: 컴포넌트 언마운트 시 타이머 정리
      return () => {
        retryTimeouts.forEach(clearTimeout);
        clearTimeout(safetyTimeoutId);
      };
    }
  }, [syncSessionToStore]);

  /**
   * 주기적으로 세션 상태 확인
   *
   * Supabase의 onAuthStateChange 구독 대신 API 기반으로 전환:
   * - Supabase 클라이언트의 자동 세션 관리 비활성화
   * - API를 통한 명시적 세션 조회로 일원화
   * - API에서 토큰 만료 시 자동 갱신 처리 (autoRefreshToken 활용)
   * - 클라이언트는 토큰을 직접 읽지 않고 API를 통해서만 조회
   */
  useEffect(() => {
    // 초기 동기화 후 주기적으로 세션 상태 확인
    // API 호출 시 토큰 만료 여부를 확인하고 필요시 자동 갱신
    const intervalId = setInterval(() => {
      if (isSessionSyncedRef.current) {
        syncSessionToStore();
      }
    }, 60000); // 1분마다 확인

    return () => {
      clearInterval(intervalId);
    };
  }, [syncSessionToStore]);

  // Context API 제공
  const loginRedirect = () => {
    router.push(URL_PATHS.LOGIN);
  };

  /**
   * 로그아웃 처리
   *
   * Supabase 세션 관리 일원화:
   * - API를 통해 서버 쿠키 삭제 및 Supabase 세션 제거
   * - 클라이언트 store 초기화
   * - UI 상태 정리 (사이드 패널, 오버레이)
   * - 다른 탭에 로그아웃 알림
   */
  const logout = async () => {
    try {
      // 1. UI 상태 정리 (API 호출 전)
      useSidePanelStore.getState().close();
      useOverlayStore.getState().close();

      // 2. API를 통해 로그아웃 처리 (서버 쿠키 삭제 및 Supabase 세션 제거)
      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include', // 쿠키 포함
      });

      // 3. Zustand store 초기화 (이 시점에서 user가 null이 되면서 Provider들이 자동 cleanup)
      clearAuth();

      // ✅ 4. 다른 탭에 로그아웃 알림
      if (authChannelRef.current) {
        authChannelRef.current.postMessage({ type: 'AUTH_LOGOUT' });
      }

      // 5. 로그인 페이지로 이동
      router.push(URL_PATHS.LOGIN);
    } catch (error) {
      console.error('Failed to logout:', error);
      // 에러가 발생해도 상태는 초기화
      clearAuth();
      useSidePanelStore.getState().close();
      useOverlayStore.getState().close();

      // 다른 탭에 알림
      if (authChannelRef.current) {
        authChannelRef.current.postMessage({ type: 'AUTH_LOGOUT' });
      }

      router.push(URL_PATHS.LOGIN);
    }
  };

  const value: AuthContextValue = {
    isLoggedIn: Boolean(accessToken),
    user,
    isSessionSynced,
    loginRedirect,
    logout,
    syncSession: syncSessionToStore,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
