'use client';

import React from 'react';
import styles from './styles.module.css';
import { InputHTMLAttributes } from 'react';

export type CheckboxStatus = 'unselected' | 'selected' | 'partial';
export type CheckboxState =
  | 'default'
  | 'hover'
  | 'press'
  | 'focus'
  | 'disabled'
  | 'error';
export type CheckboxTheme = 'light' | 'dark';

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'checked' | 'disabled'
  > {
  status?: CheckboxStatus;
  state?: CheckboxState;
  theme?: CheckboxTheme;
}

export default function Checkbox({
  status = 'unselected',
  state = 'default',
  theme = 'light',
  className = '',
  ...props
}: CheckboxProps) {
  const isDisabled = state === 'disabled';

  const checkboxClasses = [
    styles.checkbox,
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
        type="checkbox"
        className={styles.input}
        disabled={isDisabled}
        checked={status === 'selected'}
        {...props}
      />
      <div
        className={`${styles.checkboxWrapper} ${
          state === 'focus' ? styles.hasFocusRing : ''
        }`}
      >
        <span className={checkboxClasses}>
          {status === 'selected' && (
            <svg
              className={styles.checkIcon}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {status === 'partial' && (
            <svg
              className={styles.partialIcon}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6H10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      </div>
    </label>
  );
}

