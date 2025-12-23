import { useSidePanelStore } from '@/stores/sidePanel.store';

export const useSideProfilePanel = () => {
  const { isOpen, targetUserId, open, close } = useSidePanelStore();

  const openProfile = (userId: string) => {
    open(userId);
  };

  const closeProfile = () => {
    close();
  };

  const toggleProfile = (userId: string) => {
    if (isOpen && targetUserId === userId) {
      close();
    } else {
      open(userId);
    }
  };

  return {
    isOpen,
    targetUserId,
    openProfile,
    closeProfile,
    toggleProfile,
  };
};
