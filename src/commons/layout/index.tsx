'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Icon from '@/commons/components/icon';
import styles from './styles.module.css';

interface LayoutProps {
  children: ReactNode;
}

type NavigationButton = 'home' | 'chat' | 'match' | 'party';

export const Layout = ({ children }: LayoutProps) => {
  const [activeNav, setActiveNav] = useState<NavigationButton>('home');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.container}>
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
              onClick={() => setActiveNav('home')}
            >
              <div className={styles.navButtonIcon}>
                <Icon name="home-circle" size={20} className={styles.navIcon} />
              </div>
              <span className={styles.navButtonLabel}>홈</span>
            </button>

            <button
              className={`${styles.navButton} ${activeNav === 'chat' ? styles.active : ''}`}
              onClick={() => setActiveNav('chat')}
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
              onClick={() => setActiveNav('match')}
            >
              <div className={styles.navButtonIcon}>
                <Icon name="match" size={20} className={styles.navIcon} />
              </div>
              <span className={styles.navButtonLabel}>매칭</span>
            </button>

            <button
              className={`${styles.navButton} ${activeNav === 'party' ? styles.active : ''}`}
              onClick={() => setActiveNav('party')}
            >
              <div className={styles.navButtonIcon}>
                <Icon name="handheld" size={20} className={styles.navIcon} />
              </div>
              <span className={styles.navButtonLabel}>파티</span>
            </button>
          </nav>

          {/* Menu Buttons */}
          <div className={styles.menuButtons}>
            <button className={styles.menuButton}>
              <div className={styles.menuButtonIcon}>
                <Icon
                  name="notification"
                  size={24}
                  className={styles.themeIcon}
                />
                <div className={styles.badge} />
              </div>
            </button>

            <button className={styles.menuButton}>
              <div className={styles.menuButtonIcon}>
                <Icon name="group" size={24} className={styles.themeIcon} />
                <div className={styles.badge} />
              </div>
            </button>
          </div>
        </div>
      </aside>

      <div className={styles.main}>
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
        <main className={styles.children}>{children}</main>
      </div>
    </div>
  );
};
