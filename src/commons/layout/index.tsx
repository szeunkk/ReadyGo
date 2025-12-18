import { ReactNode } from 'react';
import styles from './styles.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {/* Sidebar content */}
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          {/* Header content */}
        </header>
        <main className={styles.children}>
          {children}
        </main>
      </div>
    </div>
  );
};

