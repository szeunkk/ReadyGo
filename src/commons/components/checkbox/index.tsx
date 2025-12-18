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
  'type' | 'checked' | 'disabled' | 'onChange'
> {
  status?: CheckboxStatus;
  state?: CheckboxState;
  onChange?: (status: CheckboxStatus) => void;
}

export default function Checkbox({
  status: propStatus,
  state = 'default',
  className = '',
  onChange,
  ...props
}: CheckboxProps) {
  // 내부 상태: propStatus로 초기화하되, propStatus가 바뀌면 동기화
  const [status, setStatus] = React.useState<CheckboxStatus>(
    propStatus ?? 'unselected'
  );

  React.useEffect(() => {
    if (propStatus !== undefined && propStatus !== status) {
      setStatus(propStatus);
    }
  }, [propStatus]);
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

  const toggleStatus = () => {
    if (isDisabled) return;

    // 상태 토글: unselected <-> selected
    // partial 상태에서는 selected로 변경
    const newStatus: CheckboxStatus =
      status === 'selected' ? 'unselected' : 'selected';

    // 비제어(내부 상태)인 경우 내부 상태 업데이트
    if (propStatus === undefined) {
      setStatus(newStatus);
    }

    // onChange 콜백 호출
    onChange?.(newStatus);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    const newStatus: CheckboxStatus = e.target.checked
      ? 'selected'
      : 'unselected';
    if (propStatus === undefined) {
      setStatus(newStatus);
    }
    onChange?.(newStatus);
  };

  const inputId = React.useId();

  return (
    <>
      <input
        id={inputId}
        ref={inputRef}
        type="checkbox"
        className={styles.input}
        disabled={isDisabled}
        checked={status === 'selected'}
        onChange={handleInputChange}
        {...props}
      />
      <label htmlFor={inputId} className={styles.label}>
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
    </>
  );
}
