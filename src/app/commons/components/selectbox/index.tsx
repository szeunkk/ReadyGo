'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

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
  label?: string;
}

export interface SelectboxProps {
  state?: SelectboxState;
  theme?: SelectboxTheme;
  label?: string | React.ReactNode;
  additionalInfo?: string | React.ReactNode;
  items?: SelectboxItem[];
  selectedId?: string;
  onSelect?: (item: SelectboxItem) => void;
  children?: React.ReactNode;
  className?: string;
}

export default function Selectbox({
  state = 'default',
  theme = 'light',
  label,
  additionalInfo,
  items = [],
  selectedId,
  onSelect,
  children,
  className = '',
}: SelectboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalState, setInternalState] = useState<SelectboxState>(state);
  const selectboxRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDisabled = state === 'disabled';
  const selectedItem = items.find((item) => item.id === selectedId);

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

  useEffect(() => {
    setInternalState(state);
  }, [state]);

  const handleMouseEnter = () => {
    if (!isDisabled && internalState === 'default') {
      setInternalState('hover');
    }
  };

  const handleMouseLeave = () => {
    if (!isDisabled && internalState === 'hover') {
      setInternalState('default');
    }
  };

  const handleSelectboxClick = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
      if (!isOpen && internalState === 'default') {
        setInternalState('filled');
      }
    }
  };

  const handleItemClick = (item: SelectboxItem) => {
    if (!isDisabled) {
      onSelect?.(item);
      setIsOpen(false);
      setInternalState('filled');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isDisabled) {
      return;
    }

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setInternalState('filled');
        }
        break;
      case 'Escape':
        if (isOpen) {
          setIsOpen(false);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setInternalState('filled');
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setIsOpen(false);
        }
        break;
    }
  };

  const selectboxClasses = [
    styles.selectbox,
    styles[`state-${internalState}`],
    styles[`theme-${theme}`],
    isDisabled && styles.disabled,
    isOpen && styles.open,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const dropdownClasses = [
    styles.dropdown,
    styles[`theme-${theme}`],
    isOpen && styles.open,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}
      {additionalInfo && (
        <div className={styles.additionalInfo}>{additionalInfo}</div>
      )}
      <div className={styles.selectboxWrapper} ref={selectboxRef}>
        <button
          type="button"
          className={selectboxClasses}
          onClick={handleSelectboxClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label ? String(label) : 'Selectbox'}
        >
          <div className={styles.content}>
            {children || (
              <span className={styles.text}>
                {selectedItem?.value || '선택하세요'}
              </span>
            )}
          </div>
          <svg
            className={styles.arrowIcon}
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
        </button>
        {items.length > 0 && (
          <div
            className={dropdownClasses}
            ref={dropdownRef}
            role="listbox"
            aria-label="Options"
          >
            {items.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  className={[styles.optionItem, isSelected && styles.selected]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleItemClick(item)}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleItemClick(item);
                    }
                  }}
                >
                  {isSelected && (
                    <svg
                      className={styles.checkIcon}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 4L6 11L3 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <div className={styles.optionContent}>{item.value}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
