'use client';

import styles from './styles.module.css';

export default function OverlayContainer({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className={styles.overlayBackdrop} onClick={onClose}>
      <div
        className={styles.overlayContent}
        onClick={(event: React.MouseEvent<HTMLDivElement>) =>
          event.stopPropagation()
        }
      >
        {children}
      </div>
    </div>
  );
}
