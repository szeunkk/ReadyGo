'use client';

import React from 'react';
import styles from './styles.module.css';
import { InputHTMLAttributes } from 'react';

export type RadioStatus = 'unselected' | 'selected';
export type RadioState =
  | 'default'
  | 'hover'
  | 'press'
  | 'focus'
  | 'disabled'
  | 'error';
export type RadioTheme = 'light' | 'dark';

export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'checked' | 'disabled'
  > {
  status?: RadioStatus;
  state?: RadioState;
  theme?: RadioTheme;
}

export default function Radio({
  status = 'unselected',
  state = 'default',
  theme = 'light',
  className = '',
  ...props
}: RadioProps) {
  const isDisabled = state === 'disabled';

  const radioClasses = [
    styles.radio,
    styles[`status-${status}`],
    styles[`state-${state}`],
    styles[`theme-${theme}`],
    isDisabled && styles.disabled,
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
        checked={status === 'selected'}
        {...props}
      />
      <div
        className={`${styles.radioWrapper} ${
          state === 'focus' ? styles.hasFocusRing : ''
        }`}
      >
        <span className={radioClasses}>
          {status === 'selected' && <span className={styles.dot} />}
        </span>
      </div>
    </label>
  );
}


