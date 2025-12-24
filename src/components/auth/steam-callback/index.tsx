'use client';

import { useSteamCallback } from './hooks/index.steam-callback.hook';
import styles from './styles.module.css';

interface SteamCallbackProps {
  initialParams?: Record<string, string>;
}

/**
 * Steam 연동 콜백 컴포넌트
 * Steam OpenID 인증 완료 후 리다이렉트되는 페이지입니다.
 */
export default function SteamCallback({ initialParams }: SteamCallbackProps) {
  useSteamCallback(initialParams);

  return (
    <section className={styles.wrapper} data-testid="steam-callback-page">
      <div className={styles.container}>
        <div className={styles.loading}>연동 처리 중...</div>
      </div>
    </section>
  );
}
