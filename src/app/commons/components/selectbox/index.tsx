'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

export type SelectboxState =
  | 'default'
  | 'hover'
  | 'filled'
  | 'error'
  | 'disabled'
  | 'active';

export type SelectboxTheme = 'light' | 'dark';

export interface SelectboxItem {
  id: string;
  value: string;
}

export interface SelectboxProps {
  state?: SelectboxState;
  theme?: SelectboxTheme;
  label?: string;
  additionalInfo?: string;
  items: SelectboxItem[];
  selectedId?: string;
  onSelect?: (item: SelectboxItem) => void;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function Selectbox({
  state = 'default',
  theme = 'light',
  label,
  additionalInfo,
  items,
  selectedId,
  onSelect,
  placeholder = 'Placeholder',
  className = '',
  children,
}: SelectboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalState, setInternalState] = useState<SelectboxState>(state);
  const selectboxRef = useRef<HTMLDivElement>(null);
  const isDisabled = state === 'disabled';

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectboxRef.current &&
        !selectboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (state === 'default') {
          setInternalState('default');
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, state]);

  // hover 상태 관리
  const handleMouseEnter = () => {
    if (!isDisabled && state === 'default' && !isOpen) {
      setInternalState('hover');
    }
  };

  const handleMouseLeave = () => {
    if (!isDisabled && state === 'default' && !isOpen) {
      setInternalState('default');
    }
  };

  const handleClick = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
      if (!isOpen && state === 'default') {
        setInternalState('active');
      } else if (isOpen && state === 'default') {
        setInternalState('default');
      }
    }
  };

  const handleItemClick = (item: SelectboxItem) => {
    if (onSelect) {
      onSelect(item);
    }
    setIsOpen(false);
    if (state === 'default') {
      setInternalState('default');
    }
  };

  const selectedItem = items.find((item) => item.id === selectedId);
  const displayValue = selectedItem ? selectedItem.value : placeholder;
  const isFilled = selectedItem !== undefined;

  // 실제 사용할 state 결정
  const actualState =
    state !== 'default' ? state : isOpen ? 'active' : internalState;

  const selectboxClasses = [
    styles.selectbox,
    styles[`state-${actualState}`],
    styles[`theme-${theme}`],
    isDisabled && styles.disabled,
    isFilled && styles.filled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const optionGroupClasses = [
    styles.optionGroup,
    styles[`theme-${theme}`],
    isOpen && styles.open,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper} ref={selectboxRef}>
      {label && (
        <label className={styles.label}>
          {label}
          {label.includes('*') && <span className={styles.required}>*</span>}
        </label>
      )}
      <div
        className={selectboxClasses}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={isDisabled}
      >
        <div className={styles.content}>
          {children || (
            <span
              className={`${styles.value} ${
                !selectedItem ? styles.placeholder : ''
              }`}
            >
              {displayValue}
            </span>
          )}
        </div>
        <div className={styles.chevron}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {additionalInfo && !isOpen && (
        <div
          className={`${styles.additionalInfo} ${
            actualState === 'error' ? styles.error : ''
          }`}
        >
          {additionalInfo}
        </div>
      )}
      {isOpen && (
        <div className={optionGroupClasses} role="listbox">
          {items.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <div
                key={item.id}
                className={`${styles.optionItem} ${
                  isSelected ? styles.selected : ''
                }`}
                onClick={() => handleItemClick(item)}
                role="option"
                aria-selected={isSelected}
              >
                {isSelected && (
                  <span className={styles.checkIcon}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.3333 4L6 11.3333L2.66667 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
                <span className={styles.optionValue}>{item.value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
