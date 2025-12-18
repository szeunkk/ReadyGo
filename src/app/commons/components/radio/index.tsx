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

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked'
> {
  status?: RadioStatus;
  state?: RadioState;
  checked?: boolean;
}

export default function Radio({
  status,
  state = 'default',
  checked = false,
  className = '',
  disabled,
  ...props
}: RadioProps) {
  const isDisabled = disabled || state === 'disabled';

  // status를 checked로부터 결정
  const actualStatus: RadioStatus =
    status || (checked ? 'selected' : 'unselected');

  const radioClasses = [
    styles.radio,
    styles[`status-${actualStatus}`],
    styles[`state-${state}`],
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
        checked={checked}
        disabled={isDisabled}
        {...props}
      />
      <div
        className={`${styles.radioWrapper} ${
          state === 'focus' ? styles.hasFocusRing : ''
        }`}
      >
        <span className={radioClasses}>
          {actualStatus === 'selected' && <span className={styles.indicator} />}
        </span>
      </div>
    </label>
  );
}




