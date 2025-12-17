'use client';

import React from 'react';
import styles from './styles.module.css';
import { InputHTMLAttributes } from 'react';
import Icon from '../icon';

export interface SearchbarProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  children?: React.ReactNode;
}

export default function Searchbar({
  children,
  className = '',
  ...props
}: SearchbarProps) {
  const searchbarClasses = [styles.searchbar, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={searchbarClasses}>
      <div className={styles.searchbarContent}>
        <Icon name="search" size={20} className={styles.icon} />
        <div className={styles.inputContainer}>
          {children ? (
            <div className={styles.childrenContainer}>{children}</div>
          ) : (
            <input type="text" className={styles.inputField} {...props} />
          )}
        </div>
      </div>
    </div>
  );
}
