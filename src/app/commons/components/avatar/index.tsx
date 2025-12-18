'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import Image from 'next/image';

export type AvatarSize = 's' | 'm' | 'L';
export type AvatarStatus = 'online' | 'away' | 'ban' | 'offline';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  showStatus?: boolean;
  className?: string;
}

export default function Avatar({
  src,
  alt = 'Avatar',
  size = 'm',
  status = 'offline',
  showStatus = true,
  className = '',
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const defaultImage = '/images/bird.svg';
  const imageSrc = src && !imageError ? src : defaultImage;

  const wrapperClasses = [styles.wrapper, styles[`size-${size}`], className]
    .filter(Boolean)
    .join(' ');

  const statusDotClasses = [
    styles.statusDot,
    styles[`status-${status}`],
    styles[`size-${size}`],
  ]
    .filter(Boolean)
    .join(' ');

  const getStatusLabel = () => {
    switch (status) {
      case 'online':
        return '온라인';
      case 'away':
        return '자리비움';
      case 'ban':
        return '차단됨';
      case 'offline':
        return '오프라인';
      default:
        return '';
    }
  };

  return (
    <div className={wrapperClasses}>
      <div className={styles.imageContainer}>
        <Image
          src={imageSrc}
          alt={alt}
          width={size === 's' ? 40 : size === 'm' ? 64 : 100}
          height={size === 's' ? 40 : size === 'm' ? 64 : 100}
          className={styles.image}
          onError={() => setImageError(true)}
        />
      </div>
      {showStatus && (
        <div className={statusDotClasses} aria-label={getStatusLabel()} />
      )}
    </div>
  );
}

