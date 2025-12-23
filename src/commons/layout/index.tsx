'use client';

import { ReactNode } from 'react';
import { useSidePanelStore } from '@/stores/sidePanel.store';
import { useOverlayStore } from '@/stores/overlay.store';
import { SidePanel } from '@/commons/side-panel';
import styles from './styles.module.css';
import { useLayoutNavigation } from './hooks/useLayoutNavigation';
import { useLayoutVisibility } from './hooks/useLayoutVisibility';
import { useAutoClosePanels } from './hooks/useAutoClosePanels';
import { Sidebar } from './ui/Sidebar';
import { Header } from './ui/Header';
import { LayoutOverlays } from './ui/LayoutOverlays';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isOpen, close: closeSidePanel } = useSidePanelStore();
  const {
    currentOverlay,
    openNotifications,
    openFriends,
    close: closeOverlay,
  } = useOverlayStore();

  const { showSidebar, showHeader } = useLayoutVisibility();
  const { activeNav, handleNavClick } = useLayoutNavigation();

  useAutoClosePanels(closeSidePanel, closeOverlay, currentOverlay);

  const handleNotificationsClick = () => {
    if (currentOverlay === 'notifications') {
      closeOverlay();
    } else {
      openNotifications();
    }
  };

  const handleFriendsClick = () => {
    if (currentOverlay === 'friends') {
      closeOverlay();
    } else {
      openFriends();
    }
  };

  return (
    <div className={styles.container}>
      {showSidebar && (
        <Sidebar
          activeNav={activeNav}
          currentOverlay={currentOverlay}
          onNavClick={handleNavClick}
          onNotificationsClick={handleNotificationsClick}
          onFriendsClick={handleFriendsClick}
        />
      )}

      <div className={`${styles.main} ${!showSidebar ? styles.fullWidth : ''}`}>
        {showHeader && <Header />}

        <div
          className={`${styles.contentWrapper} ${
            isOpen ? styles.panelOpen : ''
          }`}
        >
          <main
            className={`${styles.children} ${!showHeader ? styles.noHeader : ''}`}
          >
            {children}
          </main>

          {/* Side Panel */}
          <aside className={`${styles.sidePanel} ${isOpen ? styles.open : ''}`}>
            <SidePanel />
          </aside>
        </div>

        {/* Overlay */}
        <LayoutOverlays
          currentOverlay={currentOverlay}
          onClose={closeOverlay}
        />
      </div>
    </div>
  );
};
