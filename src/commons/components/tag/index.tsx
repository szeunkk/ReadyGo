'use client';

import React from 'react';
import styles from './styles.module.css';
import { HTMLAttributes } from 'react';

export type TagStyle = 'rectangle' | 'duotone' | 'circle';

export interface TagProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'style'
> {
  style?: TagStyle;
  children?: React.ReactNode;
}

export default function Tag({
  style = 'rectangle',
  children,
  className = '',
  ...props
}: TagProps) {
  const tagClasses = [
    styles.tag,
    styles[`style-${style}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={tagClasses} {...props}>
      <span className={styles.content}>{children}</span>
    </div>
  );
}




