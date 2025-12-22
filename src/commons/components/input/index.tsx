'use client';

import React, { forwardRef } from 'react';
import styles from './styles.module.css';
import { InputHTMLAttributes } from 'react';
import Icon, { IconName } from '@/commons/components/icon';

export type InputVariant = 'primary' | 'secondary';
export type InputState =
  | 'Default'
  | 'hover'
  | 'active'
  | 'filled'
  | 'error'
  | 'disabled';

export type InputSize = 'm' | 'l';

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  variant?: InputVariant;
  state?: InputState;
  size?: InputSize;
  label?: React.ReactNode;
  additionalInfo?: React.ReactNode;
  required?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  iconSize?: 14 | 16 | 20 | 24 | 32 | 40;
  iconLeftColor?: string;
  iconRightColor?: string;
  labelIcon?: IconName;
  labelIconColor?: string;
  additionalInfoIcon?: IconName;
  additionalInfoIconColor?: string;
  gap?: number;
  'data-testid'?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = 'primary',
    state = 'Default',
    size = 'm',
    label,
    additionalInfo,
    required = false,
    iconLeft,
    iconRight,
    iconSize = 20,
    iconLeftColor,
    iconRightColor,
    labelIcon,
    labelIconColor,
    additionalInfoIcon,
    additionalInfoIconColor,
    gap = 4,
    className = '',
    disabled,
    'data-testid': dataTestId,
    type,
    ...props
  },
  ref
) {
  const isDisabled = disabled || state === 'disabled';

  // variant와 state를 기반으로 실제 적용할 클래스 결정
  const getVariantClass = () => {
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
    styles[`size-${size}`],
    styles[`variant-${actualVariant}`],
    styles[`state-${actualState}`],
    isDisabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const labelClasses = [styles.label].filter(Boolean).join(' ');

  const additionalInfoClasses = [
    styles.additionalInfo,
    actualState === 'error' && styles.error,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {label && (
        <div className={labelClasses} style={{ gap: `${gap}px` }}>
          {labelIcon && (
            <Icon
              name={labelIcon}
              size={iconSize}
              className={styles.labelIcon}
              style={labelIconColor ? { color: labelIconColor } : undefined}
            />
          )}
          <span className={styles.labelText}>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </div>
      )}
      <div className={inputClasses}>
        <div className={styles.inputContent} style={{ gap: `${gap}px` }}>
          {iconLeft && (
            <Icon
              name={iconLeft}
              size={iconSize}
              className={styles.inputIcon}
              style={iconLeftColor ? { color: iconLeftColor } : undefined}
            />
          )}
          <div className={styles.inputTextContainer}>
            {actualState === 'active' && (
              <span className={styles.cursor}>|</span>
            )}
            <input
              ref={ref}
              type={type || 'text'}
              className={styles.inputField}
              disabled={isDisabled}
              data-testid={dataTestId}
              {...props}
            />
          </div>
          {iconRight && (
            <Icon
              name={iconRight}
              size={iconSize}
              className={styles.inputIcon}
              style={iconRightColor ? { color: iconRightColor } : undefined}
            />
          )}
        </div>
      </div>
      {additionalInfo && (
        <div className={additionalInfoClasses} style={{ gap: `${gap}px` }}>
          {additionalInfoIcon && (
            <Icon
              name={additionalInfoIcon}
              size={iconSize}
              className={styles.additionalInfoIcon}
              style={
                additionalInfoIconColor
                  ? { color: additionalInfoIconColor }
                  : undefined
              }
            />
          )}
          <span className={styles.additionalInfoText}>{additionalInfo}</span>
        </div>
      )}
    </div>
  );
});

export default Input;
