'use client';

import React from 'react';
import styles from './styles.module.css';
import { InputHTMLAttributes } from 'react';

export type SearchbarState = 'default' | 'hover' | 'active' | 'filled';

export interface SearchbarProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  state?: SearchbarState;
  children?: React.ReactNode;
}

export default function Searchbar({
  state = 'default',
  children,
  className = '',
  ...props
}: SearchbarProps) {
  const searchbarClasses = [
    styles.searchbar,
    state !== 'default' ? styles[`state-${state}`] : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={searchbarClasses}>
      <div className={styles.searchbarContent}>
        {children ? (
          children
        ) : (
          <input type="text" className={styles.inputField} {...props} />
        )}
      </div>
    </div>
  );
}
