'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

export type SelectboxVariant =
  | 'primary'
  | 'hover'
  | 'active'
  | 'filled'
  | 'danger'
  | 'disabled';
export type SelectboxState =
  | 'default'
  | 'hover'
  | 'filled'
  | 'error'
  | 'disabled';
export type SelectboxTheme = 'light' | 'dark';

export interface SelectboxItem {
  id: string;
  value: React.ReactNode;
}

export interface SelectboxProps {
  variant?: SelectboxVariant;
  state?: SelectboxState;
  theme?: SelectboxTheme;
  label?: React.ReactNode;
  additionalInfo?: React.ReactNode;
  required?: boolean;
  children?: React.ReactNode;
  items?: SelectboxItem[];
  value?: string;
  onChange?: (id: string) => void;
  placeholder?: string;
  gap?: number;
  className?: string;
  disabled?: boolean;
}

export default function Selectbox({
  variant = 'primary',
  state = 'default',
  theme = 'light',
  label,
  additionalInfo,
  required = false,
  children,
  items = [],
  value,
  onChange,
  placeholder = 'Placeholder',
  gap = 4,
  className = '',
  disabled,
}: SelectboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(value);
  const selectboxRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDisabled = disabled || state === 'disabled' || variant === 'disabled';

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectboxRef.current &&
        !selectboxRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // value prop 변경 감지
  useEffect(() => {
    if (value !== undefined) {
      setSelectedId(value);
    }
  }, [value]);

  const handleSelectboxClick = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (id: string) => {
    setSelectedId(id);
    setIsOpen(false);
    if (onChange) {
      onChange(id);
    }
  };

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
    if (variant === 'active') {
      return 'active';
    }
    if (state === 'hover' || variant === 'hover') {
      return 'hover';
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
    if (state === 'hover') {
      return 'hover';
    }
    return 'default';
  };

  const actualVariant = getVariantClass();
  const actualState = getStateClass();

  const selectboxClasses = [
    styles.selectbox,
    styles[`variant-${actualVariant}`],
    styles[`state-${actualState}`],
    styles[`theme-${theme}`],
    isOpen && styles.open,
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

  const selectedItem = items.find((item) => item.id === selectedId);
  const displayValue = selectedItem ? selectedItem.value : null;

  return (
    <div className={styles.container}>
      {label && (
        <div className={labelClasses} style={{ gap: `${gap}px` }}>
          <span className={styles.labelText}>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </div>
      )}
      <div className={styles.selectboxWrapper}>
        <div
          ref={selectboxRef}
          className={selectboxClasses}
          onClick={handleSelectboxClick}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className={styles.selectboxContent} style={{ gap: `${gap}px` }}>
            {children ? (
              <div className={styles.selectboxChildren}>{children}</div>
            ) : (
              <span
                className={`${styles.selectboxText} ${
                  !displayValue ? styles.placeholder : ''
                }`}
              >
                {displayValue || placeholder}
              </span>
            )}
            <svg
              className={`${styles.chevron} ${
                isOpen ? styles.chevronOpen : ''
              }`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {isOpen && items.length > 0 && (
          <div
            ref={dropdownRef}
            className={`${styles.dropdown} ${styles[`theme-${theme}`]}`}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={`${styles.dropdownItem} ${
                  selectedId === item.id ? styles.selected : ''
                }`}
                onClick={() => handleItemClick(item.id)}
                role="option"
                aria-selected={selectedId === item.id}
              >
                {item.value}
              </div>
            ))}
          </div>
        )}
      </div>
      {additionalInfo && (
        <div className={additionalInfoClasses} style={{ gap: `${gap}px` }}>
          <span className={styles.additionalInfoText}>{additionalInfo}</span>
        </div>
      )}
    </div>
  );
}

