import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

interface AuthStore {
  accessToken: string | null;
  user: User | null;
  setAuth: (accessToken: string | null, user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,

  setAuth: (accessToken, user) =>
    set({
      accessToken,
      user,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
    }),
}));
