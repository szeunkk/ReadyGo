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

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'disabled'
> {
  status?: CheckboxStatus;
  state?: CheckboxState;
}

export default function Checkbox({
  status = 'unselected',
  state = 'default',
  className = '',
  ...props
}: CheckboxProps) {
  const isDisabled = state === 'disabled';

  const checkboxClasses = [
    styles.checkbox,
    styles[`status-${status}`],
    styles[`state-${state}`],
    isDisabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = status === 'partial';
      inputRef.current.checked = status === 'selected';
    }
  }, [status]);

  return (
    <label className={styles.label}>
      <input
        ref={inputRef}
        type="checkbox"
        className={styles.input}
        checked={status === 'selected'}
        disabled={isDisabled}
        {...props}
      />
      <div
        className={`${styles.checkboxWrapper} ${
          state === 'focus' && (status === 'selected' || status === 'partial')
            ? styles.hasFocusRing
            : ''
        }`}
      >
        <span className={checkboxClasses}>
          {status === 'selected' && (
            <svg
              className={styles.icon}
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
              className={styles.icon}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6H9"
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


