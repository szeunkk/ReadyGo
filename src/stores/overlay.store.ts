import { create } from 'zustand';

type OverlayType = 'notifications' | 'friends' | null;

interface OverlayStore {
  currentOverlay: OverlayType;
  openNotifications: () => void;
  openFriends: () => void;
  close: () => void;
  isOpen: (type: OverlayType) => boolean;
}

export const useOverlayStore = create<OverlayStore>((set, get) => ({
  currentOverlay: null,

  openNotifications: () => set({ currentOverlay: 'notifications' }),

  openFriends: () => set({ currentOverlay: 'friends' }),

  close: () => set({ currentOverlay: null }),

  isOpen: (type: OverlayType) => get().currentOverlay === type,
}));
