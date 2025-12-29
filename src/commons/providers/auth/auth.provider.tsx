'use client';

import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import { useAuthStore } from '@/stores/auth.store';
import { URL_PATHS } from '@/commons/constants/url';

// 공개 페이지 목록 (자동 리다이렉트 예외)
const PUBLIC_PATHS = [
  URL_PATHS.LOGIN,
  URL_PATHS.SIGNUP,
  URL_PATHS.SIGNUP_SUCCESS,
  URL_PATHS.STEAM_CALLBACK,
] as const;

interface AuthContextValue {
  isLoggedIn: boolean;
  user: User | null;
  isSessionSynced: boolean; // 세션 동기화 완료 여부
  loginRedirect: () => void;
  logout: () => Promise<void>;
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
  const pathname = usePathname();
  const { accessToken, user, setAuth, clearAuth } = useAuthStore();
  const isInitializedRef = useRef(false);
  const isRedirectingRef = useRef(false);
  const isSessionSyncedRef = useRef(false);
  const [isSessionSynced, setIsSessionSynced] = useState(false); // 세션 동기화 완료 상태
  const storeRef = useRef({ accessToken, user });

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
   */
  const syncSessionToStore = useCallback(async () => {
    try {
      // API를 통해 세션 조회 (HttpOnly 쿠키 자동 포함, 토큰 갱신 자동 처리)
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
      });

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
      }
    } catch (error) {
      console.error('Unexpected error while syncing session:', error);
      clearAuth();
    } finally {
      // 세션 동기화 완료 표시
      isSessionSyncedRef.current = true;
      setIsSessionSynced(true);
    }
  }, [clearAuth, setAuth]);

  // 마운트 시 초기 세션 동기화
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      setIsSessionSynced(false); // 초기화 시작 시 false로 설정
      syncSessionToStore().then(() => {
        isSessionSyncedRef.current = true;
        setIsSessionSynced(true); // 동기화 완료 시 true로 설정
      });
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

  // 로그인 상태 해제 시 자동 리다이렉트 (공개 페이지 제외)
  useEffect(() => {
    // 세션 동기화가 완료되지 않았으면 리다이렉트하지 않음
    if (!isSessionSyncedRef.current) {
      return;
    }

    // 이미 리다이렉트 중이면 무시
    if (isRedirectingRef.current) {
      return;
    }

    // 공개 페이지에서는 리다이렉트하지 않음
    if (PUBLIC_PATHS.includes(pathname as (typeof PUBLIC_PATHS)[number])) {
      return;
    }

    // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
    if (!accessToken) {
      isRedirectingRef.current = true;
      router.push(URL_PATHS.LOGIN);
    }
  }, [accessToken, pathname, router]);

  // 리다이렉트 완료 후 플래그 리셋
  useEffect(() => {
    if (isRedirectingRef.current && pathname === URL_PATHS.LOGIN) {
      isRedirectingRef.current = false;
    }
  }, [pathname]);

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
   */
  const logout = async () => {
    try {
      // API를 통해 로그아웃 처리 (서버 쿠키 삭제 및 Supabase 세션 제거)
      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include', // 쿠키 포함
      });
      // Zustand store 초기화
      clearAuth();
      // 로그인 페이지로 이동
      router.push(URL_PATHS.LOGIN);
    } catch (error) {
      console.error('Failed to logout:', error);
      // 에러가 발생해도 상태는 초기화
      clearAuth();
      router.push(URL_PATHS.LOGIN);
    }
  };

  const value: AuthContextValue = {
    isLoggedIn: Boolean(accessToken),
    user,
    isSessionSynced,
    loginRedirect,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
