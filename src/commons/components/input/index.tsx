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
  labelColor?: string;
  labelSize?: string;
  labelWeight?: string;
  labelLineHeight?: string;
  labelClassName?: string;
  additionalInfoIcon?: IconName;
  additionalInfoIconColor?: string;
  gap?: number;
  onIconRightClick?: () => void;
  'data-testid'?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
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
      labelColor,
      labelSize,
      labelWeight,
      labelLineHeight,
      labelClassName,
      additionalInfoIcon,
      additionalInfoIconColor,
      gap = 4,
      className = '',
      disabled,
      onIconRightClick,
      'data-testid': dataTestId,
      type,
      ...props
    },
    ref
  ) => {
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
      // hover, active, filled는 CSS pseudo-class로 자동 처리되므로
      // prop으로 전달된 경우에만 클래스 적용 (하위 호환성 유지)
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

    const labelClasses = [styles.label, labelClassName]
      .filter(Boolean)
      .join(' ');

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
            <span
              className={styles.labelText}
              style={{
                ...(labelColor && { color: labelColor }),
                ...(labelSize && { fontSize: labelSize }),
                ...(labelWeight && { fontWeight: labelWeight }),
                ...(labelLineHeight && { lineHeight: labelLineHeight }),
              }}
            >
              {label}
            </span>
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
              <button
                type="button"
                onClick={onIconRightClick}
                disabled={isDisabled}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label={
                  onIconRightClick ? 'Toggle password visibility' : undefined
                }
              >
                <Icon
                  name={iconRight}
                  size={iconSize}
                  className={styles.inputIcon}
                  style={iconRightColor ? { color: iconRightColor } : undefined}
                />
              </button>
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
  }
);

Input.displayName = 'Input';

export default Input;
