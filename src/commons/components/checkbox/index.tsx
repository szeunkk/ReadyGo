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
  status?: CheckboxStatus; // 제어 컴포넌트용 (optional)
  defaultStatus?: CheckboxStatus; // 비제어 컴포넌트 초기값
  state?: CheckboxState;
  onChange?: (status: CheckboxStatus) => void;
}

export default function Checkbox({
  status: controlledStatus,
  defaultStatus = 'unselected',
  state = 'default',
  className = '',
  onChange,
  ...props
}: CheckboxProps) {
  // 비제어 컴포넌트를 위한 내부 상태
  const [internalStatus, setInternalStatus] =
    React.useState<CheckboxStatus>(defaultStatus);

  // 제어 컴포넌트면 controlledStatus, 아니면 internalStatus 사용
  const status = controlledStatus ?? internalStatus;

  const isDisabled = state === 'disabled';

  const checkboxClasses = [
    styles.checkbox,
    styles[`status-${status}`],
    styles[`state-${state}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputRef = React.useRef<HTMLInputElement>(null);

  // indeterminate와 checked 상태를 DOM에서 직접 관리
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = status === 'partial';
      inputRef.current.checked = status === 'selected';
    }
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('changed', e.target.checked, status);
    if (isDisabled) return;

    // input의 checked 상태를 그대로 사용
    // partial 상태에서 클릭하면 selected로 전환
    const newStatus: CheckboxStatus = e.target.checked
      ? 'selected'
      : 'unselected';

    // 비제어 컴포넌트인 경우 내부 상태 업데이트
    if (controlledStatus === undefined) {
      setInternalStatus(newStatus);
    }

    onChange?.(newStatus);
  };

  return (
    <label className={styles.label}>
      <input
        ref={inputRef}
        type="checkbox"
        className={styles.input}
        disabled={isDisabled}
        onChange={handleChange}
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
