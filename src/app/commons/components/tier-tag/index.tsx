'use client';

import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { HTMLAttributes } from 'react';
import { TierType, getTierTypeMeta } from '../../constants/tierType.enum';

export type TierTagTheme = 'light' | 'dark';

export interface TierTagProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'style'
> {
  tier: TierType;
  theme?: TierTagTheme;
  className?: string;
}

export default function TierTag({
  tier,
  theme = 'light',
  className = '',
  ...props
}: TierTagProps) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/29c7f2c2-61fa-414f-962c-84e088badf45', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'index.tsx:18',
      message: 'TierTag component entry',
      data: {
        tier,
        tierType: typeof tier,
        theme,
        themeType: typeof theme,
        className,
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'pre-fix',
      hypothesisId: 'A,B,C',
    }),
  }).catch(() => {});
  // #endregion

  const tierMeta = getTierTypeMeta(tier);

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/29c7f2c2-61fa-414f-962c-84e088badf45', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'index.tsx:25',
      message: 'After getTierTypeMeta',
      data: {
        tierMeta,
        tierMetaExists: !!tierMeta,
        iconM: tierMeta?.ui?.iconM,
        label: tierMeta?.label,
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'pre-fix',
      hypothesisId: 'A,E',
    }),
  }).catch(() => {});
  // #endregion

  const tagClasses = [styles.tierTag, styles[`theme-${theme}`], className]
    .filter(Boolean)
    .join(' ');

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/29c7f2c2-61fa-414f-962c-84e088badf45', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'index.tsx:33',
      message: 'Before render',
      data: {
        tagClasses,
        themeClass: styles[`theme-${theme}`],
        themeKey: `theme-${theme}`,
        stylesKeys: Object.keys(styles),
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'pre-fix',
      hypothesisId: 'B',
    }),
  }).catch(() => {});
  // #endregion

  return (
    <div className={tagClasses} {...props}>
      <div className={styles.iconWrapper}>
        <Image
          src={tierMeta.ui.iconM}
          alt={tierMeta.label}
          width={24}
          height={24}
          className={styles.icon}
        />
      </div>
      <span className={styles.label}>{tierMeta.label}</span>
    </div>
  );
}
