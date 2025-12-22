import { create } from 'zustand';

interface SidePanelStore {
  isOpen: boolean;
  targetUserId?: string;

  open: (userId: string) => void;
  close: () => void;
}

export const useSidePanelStore = create<SidePanelStore>((set) => ({
  isOpen: false,
  targetUserId: undefined,

  open: (userId: string) => set({ isOpen: true, targetUserId: userId }),
  close: () => set({ isOpen: false, targetUserId: undefined }),
}));
