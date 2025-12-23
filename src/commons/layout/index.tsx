'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Icon from '@/commons/components/icon';
import { getUrlMetadata, URL_PATHS } from '@/commons/constants/url';
import styles from './styles.module.css';
import { useSidePanelStore } from '@/stores/sidePanel.store';
import { useOverlayStore } from '@/stores/overlay.store';
import { SidePanel } from '@/commons/side-panel';
import OverlayContainer from '@/commons/components/overlay';
import Notifications, {
  type NotificationItem,
} from '@/components/overlay/notifications/ui';

interface LayoutProps {
  children: ReactNode;
}

type NavigationButton = 'home' | 'chat' | 'match' | 'party';

export const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavigationButton>('home');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isOpen, close } = useSidePanelStore();
  const {
    currentOverlay,
    openNotifications,
    openFriends,
    close: closeOverlay,
  } = useOverlayStore();

  // 현재 경로의 visibility 설정 가져오기
  const urlMetadata = getUrlMetadata(pathname);
  const showSidebar = urlMetadata?.visibility.sidebar ?? false;
  const showHeader = urlMetadata?.visibility.header ?? false;

  // 현재 탭 계산 -> 이전 탭과 비교해서 side panel 닫기
  const getTopLevelRoute = (pathname: string) => {
    if (pathname.startsWith(URL_PATHS.HOME)) {
      return 'home';
    }
    if (pathname.startsWith(URL_PATHS.CHAT)) {
      return 'chat';
    }
    if (pathname.startsWith(URL_PATHS.MATCH)) {
      return 'match';
    }
    if (pathname.startsWith(URL_PATHS.PARTY)) {
      return 'party';
    }
    return 'etc';
  };

  const prevTopRouteRef = useRef<string | null>(null);

  useEffect(() => {
    const currentTop = getTopLevelRoute(pathname);
    const prevTop = prevTopRouteRef.current;

    // 일반 탭 간 이동 시에만 side panel 닫기
    if (prevTop && prevTop !== currentTop) {
      close();
    }

    prevTopRouteRef.current = currentTop;
  }, [pathname, close]);

  // 페이지 이동 시 overlay 자동 닫기
  useEffect(() => {
    if (currentOverlay) {
      closeOverlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 마운트 완료 후 테마 설정
  useEffect(() => {
    setMounted(true);
  }, []);

  // 현재 경로에 따라 activeNav 상태 업데이트
  useEffect(() => {
    if (pathname.startsWith(URL_PATHS.HOME)) {
      setActiveNav('home');
    } else if (pathname.startsWith(URL_PATHS.CHAT)) {
      setActiveNav('chat');
    } else if (pathname.startsWith(URL_PATHS.MATCH)) {
      setActiveNav('match');
    } else if (pathname.startsWith(URL_PATHS.PARTY)) {
      setActiveNav('party');
    } else if (pathname.startsWith(URL_PATHS.TRAITS)) {
      // traits 페이지는 홈에서 접근하는 기능이므로 home 활성화
      setActiveNav('home');
    }
  }, [pathname]);

  const handleNavClick = (nav: NavigationButton, path: string) => {
    setActiveNav(nav);
    router.push(path);
  };

  return (
    <div className={styles.container}>
      {showSidebar && (
        <aside className={styles.sidebar}>
          {/* Logo */}
          <div className={styles.logo}>
            <Icon name="readygo-fox" size={40} className={styles.logoIcon} />
          </div>

          <div className={styles.sidebarContent}>
            {/* Navigation Buttons */}
            <nav className={styles.navigation}>
              <button
                className={`${styles.navButton} ${activeNav === 'home' ? styles.active : ''}`}
                onClick={() => handleNavClick('home', URL_PATHS.HOME)}
              >
                <div className={styles.navButtonIcon}>
                  <Icon
                    name="home-circle"
                    size={20}
                    className={styles.navIcon}
                  />
                </div>
                <span className={styles.navButtonLabel}>홈</span>
              </button>

              <button
                className={`${styles.navButton} ${activeNav === 'chat' ? styles.active : ''}`}
                onClick={() => handleNavClick('chat', URL_PATHS.CHAT)}
              >
                <div className={styles.navButtonIcon}>
                  <Icon
                    name="message-bubble"
                    size={20}
                    className={styles.navIcon}
                  />
                </div>
                <span className={styles.navButtonLabel}>채팅</span>
              </button>

              <button
                className={`${styles.navButton} ${activeNav === 'match' ? styles.active : ''}`}
                onClick={() => handleNavClick('match', URL_PATHS.MATCH)}
              >
                <div className={styles.navButtonIcon}>
                  <Icon name="match" size={20} className={styles.navIcon} />
                </div>
                <span className={styles.navButtonLabel}>매칭</span>
              </button>

              <button
                className={`${styles.navButton} ${activeNav === 'party' ? styles.active : ''}`}
                onClick={() => handleNavClick('party', URL_PATHS.PARTY)}
              >
                <div className={styles.navButtonIcon}>
                  <Icon name="handheld" size={20} className={styles.navIcon} />
                </div>
                <span className={styles.navButtonLabel}>파티</span>
              </button>
            </nav>

            {/* Menu Buttons */}
            <div className={styles.menuButtons}>
              <button
                className={styles.menuButton}
                onClick={() => {
                  if (currentOverlay === 'notifications') {
                    closeOverlay();
                  } else {
                    openNotifications();
                  }
                }}
              >
                <div className={styles.menuButtonIcon}>
                  <Icon
                    name="notification"
                    size={24}
                    className={styles.themeIcon}
                  />
                  <div className={styles.badge} />
                </div>
              </button>

              <button
                className={styles.menuButton}
                onClick={() => {
                  if (currentOverlay === 'friends') {
                    closeOverlay();
                  } else {
                    openFriends();
                  }
                }}
              >
                <div className={styles.menuButtonIcon}>
                  <Icon name="group" size={24} className={styles.themeIcon} />
                  <div className={styles.badge} />
                </div>
              </button>
            </div>
          </div>
        </aside>
      )}

      <div className={`${styles.main} ${!showSidebar ? styles.fullWidth : ''}`}>
        {showHeader && (
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <button
                className={styles.themeButton}
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                }}
                aria-label="테마 전환"
                suppressHydrationWarning
              >
                {mounted ? (
                  <Icon
                    name={theme === 'dark' ? 'sun' : 'moon'}
                    size={24}
                    className={styles.themeIcon}
                  />
                ) : (
                  <div style={{ width: 24, height: 24 }} />
                )}
              </button>
              <div className={styles.userAvatar}>
                <Icon name="user" size={20} />
              </div>
            </div>
          </header>
        )}
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
        {currentOverlay === 'notifications' && (
          <OverlayContainer onClose={closeOverlay}>
            <Notifications
              notifications={mockNotifications}
              onMarkAllAsRead={() => {
                // TODO: 모두 읽음 처리 로직 구현
              }}
              onNotificationClick={() => {
                // TODO: 알림 클릭 처리 로직 구현
              }}
            />
          </OverlayContainer>
        )}

        {currentOverlay === 'friends' && (
          <OverlayContainer onClose={closeOverlay}>
            <div style={{ padding: '24px' }}>
              {/* TODO: Friends 컴포넌트 구현 */}
              <h2>Friends (준비 중)</h2>
            </div>
          </OverlayContainer>
        )}
      </div>
    </div>
  );
};

// Mock data - TODO: API로 대체 예정
const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'REVIEW_RECEIVED',
    nickname: '까칠한까마귀',
    timestamp: '방금 전',
    isRead: false,
  },
  {
    id: '2',
    type: 'REVIEW_REQUESTED',
    nickname: '게이머호랑이',
    timestamp: '방금 전',
    isRead: false,
  },
  {
    id: '3',
    type: 'FRIEND_REQUESTED',
    nickname: '전략토끼',
    timestamp: '5분 전',
    isRead: false,
  },
  {
    id: '4',
    type: 'PARTY_INVITED',
    nickname: '캐주얼곰',
    timestamp: '3시간 전',
    isRead: false,
  },
  {
    id: '5',
    type: 'CHAT_RECEIVED',
    nickname: '게이머호랑이',
    timestamp: '5시간 전',
    isRead: true,
  },
  {
    id: '6',
    type: 'PARTY_INVITED',
    nickname: '돌핀',
    timestamp: '8시간 전',
    isRead: true,
  },
];
