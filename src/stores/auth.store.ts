import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

interface AuthStore {
  accessToken: string | null;
  user: User | null;
  setAuth: (accessToken: string | null, user: User | null) => void;
  clearAuth: () => void;
}

/**
 * 인증 상태 관리 Store
 *
 * HttpOnly 쿠키 방식으로 전환하여:
 * - localStorage 저장 로직 완전 제거 (중복 저장 방지)
 * - 실제 토큰은 서버의 HttpOnly 쿠키에서 관리
 * - 클라이언트는 인증 상태(authenticated 여부)만 메모리에 보관
 * - 세션 관리는 API(/api/auth/session)를 통해서만 수행
 */
export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,

  /**
   * 인증 상태 설정
   * 실제 토큰은 서버에서 HttpOnly 쿠키로 관리되므로,
   * 클라이언트에는 인증 여부만 저장
   */
  setAuth: (accessToken, user) => {
    set({
      accessToken,
      user,
    });
  },

  /**
   * 인증 상태 초기화
   * 서버 쿠키 삭제는 API 호출을 통해 처리됨
   */
  clearAuth: () => {
    set({
      accessToken: null,
      user: null,
    });
  },
}));
