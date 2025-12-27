'use client';

import React from 'react';
import styles from './styles.module.css';
import { InputHTMLAttributes } from 'react';
import Icon from '@/commons/components/icon';

export type SearchbarState = 'default' | 'hover' | 'active' | 'filled';
export type SearchbarIcon = 'left' | 'right';
export type SearchbarSize = 'm' | 'l';

export interface SearchbarProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  state?: SearchbarState;
  icon?: SearchbarIcon;
  size?: SearchbarSize;
  children?: React.ReactNode;
}

export default function Searchbar({
  state = 'default',
  icon = 'left',
  size = 'm',
  children,
  className = '',
  ...props
}: SearchbarProps) {
  const searchbarClasses = [
    styles.searchbar,
    state !== 'default' ? styles[`state-${state}`] : null,
    styles[`icon-${icon}`],
    styles[`size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const searchIcon = (
    <Icon name="search" size={20} className={styles.searchIcon} />
  );

  return (
    <div className={searchbarClasses}>
      <div className={styles.searchbarContent}>
        {icon === 'left' && searchIcon}
        {children ? (
          children
        ) : (
          <input type="text" className={styles.inputField} {...props} />
        )}
        {icon === 'right' && searchIcon}
      </div>
    </div>
  );
}
