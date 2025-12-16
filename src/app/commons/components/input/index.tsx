'use client';

import React from 'react';
import styles from './styles.module.css';
import { InputHTMLAttributes } from 'react';
import Image from 'next/image';

export type InputVariant =
  | 'primary'
  | 'hover'
  | 'active'
  | 'filled'
  | 'danger'
  | 'disabled'
  | 'secondary';
export type InputState =
  | 'Default'
  | 'hover'
  | 'active'
  | 'filled'
  | 'error'
  | 'disabled';
export type InputTheme = 'light' | 'dark';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  state?: InputState;
  theme?: InputTheme;
  label?: React.ReactNode;
  additionalInfo?: React.ReactNode;
  required?: boolean;
  iconLeft?: string;
  iconRight?: string;
  iconSize?: 14 | 16 | 20 | 24 | 32 | 40;
  labelIcon?: string;
  additionalInfoIcon?: string;
  gap?: number;
}

export default function Input({
  variant = 'primary',
  state = 'Default',
  theme = 'light',
  label,
  additionalInfo,
  required = false,
  iconLeft,
  iconRight,
  iconSize = 20,
  labelIcon,
  additionalInfoIcon,
  gap = 4,
  className = '',
  disabled,
  ...props
}: InputProps) {
  const isDisabled = disabled || state === 'disabled' || variant === 'disabled';

  // variant와 state를 기반으로 실제 적용할 클래스 결정
  const getVariantClass = () => {
    if (isDisabled) {
      return 'disabled';
    }
    if (state === 'error' || variant === 'danger') {
      return 'danger';
    }
    if (state === 'filled' || variant === 'filled') {
      return 'filled';
    }
    if (state === 'active' || variant === 'active') {
      return 'active';
    }
    if (state === 'hover' || variant === 'hover') {
      return 'hover';
    }
    if (variant === 'secondary') {
      return 'secondary';
    }
    return 'primary';
  };

  const getStateClass = () => {
    if (isDisabled) {
      return 'disabled';
    }
    if (state === 'error') {
      return 'error';
    }
    if (state === 'filled') {
      return 'filled';
    }
    if (state === 'active') {
      return 'active';
    }
    if (state === 'hover') {
      return 'hover';
    }
    return 'Default';
  };

  const actualVariant = getVariantClass();
  const actualState = getStateClass();

  const inputClasses = [
    styles.input,
    styles[`variant-${actualVariant}`],
    styles[`state-${actualState}`],
    styles[`theme-${theme}`],
    isDisabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const labelClasses = [styles.label, styles[`theme-${theme}`]]
    .filter(Boolean)
    .join(' ');

  const additionalInfoClasses = [
    styles.additionalInfo,
    styles[`theme-${theme}`],
    (actualState === 'error' || actualVariant === 'danger') && styles.error,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {label && (
        <div className={labelClasses} style={{ gap: `${gap}px` }}>
          {labelIcon && (
            <Image
              src={`/icons/size=${iconSize}.svg`}
              alt=""
              width={iconSize}
              height={iconSize}
              className={styles.labelIcon}
            />
          )}
          <span className={styles.labelText}>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </div>
      )}
      <div className={inputClasses}>
        <div className={styles.inputContent} style={{ gap: `${gap}px` }}>
          {iconLeft && (
            <Image
              src={`/icons/size=${iconSize}.svg`}
              alt=""
              width={iconSize}
              height={iconSize}
              className={styles.inputIcon}
            />
          )}
          <div className={styles.inputTextContainer}>
            {actualState === 'active' && (
              <span className={styles.cursor}>|</span>
            )}
            <input
              type="text"
              className={styles.inputField}
              disabled={isDisabled}
              {...props}
            />
          </div>
          {iconRight && (
            <Image
              src={`/icons/size=${iconSize}.svg`}
              alt=""
              width={iconSize}
              height={iconSize}
              className={styles.inputIcon}
            />
          )}
        </div>
      </div>
      {additionalInfo && (
        <div className={additionalInfoClasses} style={{ gap: `${gap}px` }}>
          {additionalInfoIcon && (
            <Image
              src={`/icons/size=${iconSize}.svg`}
              alt=""
              width={iconSize}
              height={iconSize}
              className={styles.additionalInfoIcon}
            />
          )}
          <span className={styles.additionalInfoText}>{additionalInfo}</span>
        </div>
      )}
    </div>
  );
}

