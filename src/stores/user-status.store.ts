import { create } from 'zustand';
import { usePresenceStore } from './presence.store';

/**
 * 수동 설정 가능한 사용자 상태 타입
 */
export type ManualStatus = 'online' | 'away' | 'dnd' | 'offline';

/**
 * 최종 표시 상태 타입
 */
export type EffectiveStatus = 'online' | 'away' | 'dnd' | 'offline';

interface UserStatusStore {
  /**
   * 내 상태 (내 user.id에 해당하는 상태)
   */
  myStatus: ManualStatus | null;

  /**
   * 모든 사용자의 상태 맵 (userId -> status)
   */
  statusByUserId: Record<string, ManualStatus>;

  /**
   * 내 상태 설정 (Provider에서 호출)
   */
  setMyStatus: (status: ManualStatus | null) => void;

  /**
   * 특정 사용자 상태 설정 (Provider에서 호출)
   */
  setUserStatus: (userId: string, status: ManualStatus | null) => void;

  /**
   * 내 수동 상태 변경 (UI에서 호출, DB 업데이트 포함)
   * Provider에서 실제 DB 업데이트를 수행하므로,
   * 이 함수는 optimistic update만 수행합니다.
   */
  setMyManualStatus: (status: ManualStatus) => void;
}

/**
 * UserStatus 상태 관리 Store
 *
 * 유저가 직접 설정하는 상태(user_status)를 관리하며,
 * Presence 정보와 결합하여 최종 표시 상태를 계산합니다.
 */
export const useUserStatusStore = create<UserStatusStore>((set, get) => ({
  myStatus: null,
  statusByUserId: {},

  /**
   * 내 상태 설정
   */
  setMyStatus: (status) => {
    set({ myStatus: status });
  },

  /**
   * 특정 사용자 상태 설정
   */
  setUserStatus: (userId, status) => {
    set((state) => {
      const newStatusByUserId = { ...state.statusByUserId };
      if (status === null) {
        // status가 null이면 해당 userId를 삭제
        delete newStatusByUserId[userId];
      } else {
        // status가 있으면 설정
        newStatusByUserId[userId] = status;
      }
      return { statusByUserId: newStatusByUserId };
    });
  },

  /**
   * 내 수동 상태 변경 (optimistic update)
   * 실제 DB 업데이트는 Provider에서 수행합니다.
   */
  setMyManualStatus: (status) => {
    // Optimistic update
    set((state) => ({
      myStatus: status,
      statusByUserId: {
        ...state.statusByUserId,
        // 내 userId는 Provider에서 주입해야 하지만,
        // 여기서는 store에 저장된 myStatus만 업데이트
        // 실제 userId는 Provider에서 처리
      },
    }));
  },
}));

/**
 * 최종 표시 상태 계산 (Presence + ManualStatus 결합)
 *
 * 정책(숨김 오프라인 허용):
 * - isPresent === false → 무조건 'offline'
 * - isPresent === true AND manualStatus === 'offline' → 'offline'
 * - isPresent === true AND manualStatus !== 'offline' → manualStatus
 * - manualStatus가 null인 경우 기본값 'online'
 *
 * @param userId 사용자 ID
 * @returns 최종 표시 상태
 */
export const getEffectiveStatus = (userId: string): EffectiveStatus => {
  const { isUserPresent } = usePresenceStore.getState();
  const { statusByUserId } = useUserStatusStore.getState();

  const isPresent = isUserPresent(userId);
  const manualStatus = statusByUserId[userId] ?? null;

  // isPresent === false → 무조건 'offline'
  if (!isPresent) {
    return 'offline';
  }

  // isPresent === true AND manualStatus === 'offline' → 'offline'
  if (manualStatus === 'offline') {
    return 'offline';
  }

  // isPresent === true AND manualStatus !== 'offline' → manualStatus
  // manualStatus가 null인 경우 기본값 'online'
  return manualStatus ?? 'online';
};
