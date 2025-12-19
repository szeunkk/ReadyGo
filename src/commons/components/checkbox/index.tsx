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
  'type' | 'onChange'
> {
  // 기본 모드: 표준 HTML 호환 (react-hook-form용)
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // 고급 모드: partial 상태 지원
  status?: CheckboxStatus;
  onStatusChange?: (status: CheckboxStatus) => void;

  state?: CheckboxState;
}

export default function Checkbox({
  checked,
  onChange,
  status,
  onStatusChange,
  state = 'default',
  className = '',
  disabled,
  ...props
}: CheckboxProps) {
  // 고급 모드 감지: status prop 사용 여부
  const isAdvancedMode = status !== undefined;

  const isDisabled = disabled || state === 'disabled';

  // checked 값 계산
  const isChecked = isAdvancedMode ? status === 'selected' : checked;

  // 클래스 계산 (고급 모드면 status 사용, 기본 모드면 checked로 계산)
  const computedStatus: CheckboxStatus = isAdvancedMode
    ? status
    : isChecked
      ? 'selected'
      : 'unselected';

  const checkboxClasses = [
    styles.checkbox,
    styles[`status-${computedStatus}`],
    styles[`state-${state}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputRef = React.useRef<HTMLInputElement>(null);

  // indeterminate 상태는 DOM API로만 제어 가능 (고급 모드에서만)
  React.useEffect(() => {
    if (isAdvancedMode && inputRef.current) {
      inputRef.current.indeterminate = status === 'partial';
    }
  }, [isAdvancedMode, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;

    // 표준 onChange 항상 호출 (react-hook-form 호환)
    onChange?.(e);

    // 고급 모드에서만 onStatusChange 호출
    if (isAdvancedMode && onStatusChange) {
      const newStatus: CheckboxStatus = e.target.checked
        ? 'selected'
        : 'unselected';
      onStatusChange(newStatus);
    }
  };

  // wrapper 클래스 계산 (Radio와 동일한 패턴)
  const wrapperClasses = [
    styles.checkboxWrapper,
    state === 'focus' &&
    (computedStatus === 'selected' || computedStatus === 'partial')
      ? styles.hasFocusRing
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={styles.label}>
      <input
        ref={inputRef}
        type="checkbox"
        className={styles.input}
        disabled={isDisabled}
        checked={isChecked}
        onChange={handleChange}
        {...props}
      />

      <div className={wrapperClasses}>
        <span className={checkboxClasses}>
          {computedStatus === 'selected' && (
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
          {computedStatus === 'partial' && (
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
