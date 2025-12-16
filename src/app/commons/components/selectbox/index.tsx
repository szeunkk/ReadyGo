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

export interface SelectboxOption {
  id: string;
  value: React.ReactNode;
}

export interface SelectboxProps {
  variant?: SelectboxVariant;
  state?: SelectboxState;
  theme?: SelectboxTheme;
  label?: string;
  additionalInfo?: string;
  placeholder?: string;
  items?: SelectboxOption[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  children?: React.ReactNode;
  gap?: number;
}

export default function Selectbox({
  variant = 'primary',
  state = 'default',
  theme = 'light',
  label,
  additionalInfo,
  placeholder = '선택하세요',
  items = [],
  selectedId,
  onSelect,
  className = '',
  children,
  gap = 8,
}: SelectboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedId, setInternalSelectedId] = useState<
    string | undefined
  >(selectedId);
  const selectboxRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDisabled = state === 'disabled' || variant === 'disabled';

  useEffect(() => {
    setInternalSelectedId(selectedId);
  }, [selectedId]);

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

  const handleSelectboxClick = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (id: string) => {
    setInternalSelectedId(id);
    setIsOpen(false);
    if (onSelect) {
      onSelect(id);
    }
  };

  const selectedItem = items.find((item) => item.id === internalSelectedId);

  const selectboxClasses = [
    styles.selectbox,
    styles[`variant-${variant}`],
    styles[`state-${state}`],
    styles[`theme-${theme}`],
    isDisabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const dropdownClasses = [styles.dropdown, styles[`theme-${theme}`]]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {additionalInfo && (
            <span className={styles.additionalInfo}>{additionalInfo}</span>
          )}
        </label>
      )}
      <div className={styles.selectboxContainer} ref={selectboxRef}>
        <button
          type="button"
          className={selectboxClasses}
          onClick={handleSelectboxClick}
          disabled={isDisabled}
          style={{ gap: `${gap}px` }}
        >
          <span className={styles.content}>
            {children || (
              <span className={styles.text}>
                {selectedItem ? selectedItem.value : placeholder}
              </span>
            )}
          </span>
          <span className={styles.icon}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={isOpen ? styles.iconRotated : ''}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
        {isOpen && items.length > 0 && (
          <div className={dropdownClasses} ref={dropdownRef}>
            <div className={styles.optionGroup}>
              {items.map((item) => {
                const isSelected = item.id === internalSelectedId;
                const optionClasses = [
                  styles.option,
                  isSelected && styles.selected,
                  styles[`theme-${theme}`],
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={optionClasses}
                    onClick={() => handleOptionClick(item.id)}
                  >
                    {item.value}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
