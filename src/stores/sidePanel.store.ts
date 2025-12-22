import { create } from 'zustand';

interface SidePanelStore {
  isOpen: boolean;
  targetUserId?: string;

  open: (userId: string) => void;
  close: () => void;
}

export const useSidePanelStore = create<SidePanelStore>((set) => ({
  isOpen: true,
  targetUserId: 'test-user-123', // 임시 테스트 ID (UI 개발용)

  open: (userId: string) => set({ isOpen: true, targetUserId: userId }),
  close: () => set({ isOpen: false, targetUserId: undefined }),
}));
