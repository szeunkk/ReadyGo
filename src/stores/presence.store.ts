import { create } from 'zustand';

interface PresenceStore {
  presenceUserIds: string[];
  setPresenceUserIds: (userIds: string[]) => void;
  isUserPresent: (userId: string) => boolean;
}

/**
 * Presence 상태 관리 Store
 *
 * Supabase Realtime Presence를 통해 관리되는
 * 현재 접속 중인 사용자 ID 목록을 저장합니다.
 */
export const usePresenceStore = create<PresenceStore>((set, get) => ({
  presenceUserIds: [],

  /**
   * 접속 중인 사용자 ID 목록 설정
   */
  setPresenceUserIds: (userIds) => {
    set({ presenceUserIds: userIds });
  },

  /**
   * 특정 사용자의 접속 여부 확인
   */
  isUserPresent: (userId) => {
    return get().presenceUserIds.includes(userId);
  },
}));


