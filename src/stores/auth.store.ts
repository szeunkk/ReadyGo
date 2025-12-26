import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

interface AuthStore {
  accessToken: string | null;
  user: User | null;
  setAuth: (accessToken: string | null, user: User | null) => void;
  clearAuth: () => void;
}

const AUTH_STORAGE_KEY = 'auth_access_token';

// localStorage에서 accessToken 읽기 (초기화 시)
const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: getStoredAccessToken(),
  user: null,

  setAuth: (accessToken, user) => {
    // localStorage에 accessToken 저장
    if (typeof window !== 'undefined') {
      if (accessToken) {
        localStorage.setItem(AUTH_STORAGE_KEY, accessToken);
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    set({
      accessToken,
      user,
    });
  },

  clearAuth: () => {
    // localStorage에서 accessToken 삭제
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    set({
      accessToken: null,
      user: null,
    });
  },
}));
