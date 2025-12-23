'use client';

import { useSidePanelStore } from '@/stores/sidePanel.store';
import ProfilePanel from './ui/profilePanel';

export const SidePanel = () => {
  const { isOpen, targetUserId } = useSidePanelStore();

  if (!isOpen || !targetUserId) return null;

  return <ProfilePanel userId={targetUserId} />;
};
