'use client';

import {
  useEffect,
  useRef,
  createContext,
  useContext,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase/client';
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
  const storeRef = useRef({ accessToken, user });

  // store 상태를 ref에 동기화 (무한 루프 방지)
  useEffect(() => {
    storeRef.current = { accessToken, user };
  }, [accessToken, user]);

  // Supabase 세션을 Zustand store에 동기화하는 함수
  const syncSessionToStore = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Failed to get session:', error);
        clearAuth();
        return;
      }

      // 세션 존재 여부만 확인 (복호화/검증 금지)
      const newAccessToken = session?.access_token ?? null;
      const newUser = session?.user ?? null;

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
    }
  }, [clearAuth, setAuth]);

  // 마운트 시 초기 세션 동기화
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      syncSessionToStore().then(() => {
        isSessionSyncedRef.current = true;
      });
    }
  }, [syncSessionToStore]);

  // Supabase auth 상태 변화 구독
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // 세션 동기화
      const newAccessToken = session?.access_token ?? null;
      const newUser = session?.user ?? null;

      // 무한 루프 방지: ref의 현재 값과 비교
      const { accessToken: currentAccessToken, user: currentUser } =
        storeRef.current;
      if (
        currentAccessToken !== newAccessToken ||
        currentUser?.id !== newUser?.id ||
        JSON.stringify(currentUser) !== JSON.stringify(newUser)
      ) {
        setAuth(newAccessToken, newUser);
      }

      // SIGNED_OUT 이벤트 시 명시적으로 초기화
      if (event === 'SIGNED_OUT') {
        clearAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, clearAuth]);

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

  const logout = async () => {
    try {
      // Supabase 세션 제거
      await supabase.auth.signOut();
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
    loginRedirect,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
