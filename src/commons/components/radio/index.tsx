'use client';

import React from 'react';
import styles from './styles.module.css';
import { InputHTMLAttributes } from 'react';

export type RadioState = 'default' | 'hover' | 'press' | 'disabled' | 'error';

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  state?: RadioState;
}

export default function Radio({
  state = 'default',
  checked = false,
  className = '',
  disabled,
  ...props
}: RadioProps) {
  const isDisabled = disabled || state === 'disabled';

  const radioClasses = [
    styles.radio,
    styles[`status-${checked ? 'selected' : 'unselected'}`],
    styles[`state-${state}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={styles.label}>
      <input
        type="radio"
        className={styles.input}
        disabled={isDisabled}
        checked={checked}
        {...props}
      />
      <div className={styles.radioWrapper}>
        <span className={radioClasses}>
          {checked && <span className={styles.indicator} />}
        </span>
      </div>
    </label>
  );
}
