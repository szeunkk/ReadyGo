import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Icon from '@/commons/components/icon';
import styles from '../styles.module.css';

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <button
          className={styles.themeButton}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
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
  );
};
