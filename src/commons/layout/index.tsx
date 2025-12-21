'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Icon from '@/commons/components/icon';
import { getUrlMetadata, URL_PATHS } from '@/commons/constants/url';
import styles from './styles.module.css';

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

  // 현재 경로의 visibility 설정 가져오기
  const urlMetadata = getUrlMetadata(pathname);
  const showSidebar = urlMetadata?.visibility.sidebar ?? false;
  const showHeader = urlMetadata?.visibility.header ?? false;

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
                onClick={() => router.push(URL_PATHS.NOTIFICATIONS)}
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
                onClick={() => router.push(URL_PATHS.FRIENDS)}
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
        <main
          className={`${styles.children} ${!showHeader ? styles.noHeader : ''}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
