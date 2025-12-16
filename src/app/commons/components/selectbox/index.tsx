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
  label?: string;
  additionalInfo?: string;
  items?: SelectboxItem[];
  selectedItemId?: string;
  onSelect?: (itemId: string) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function Selectbox({
  variant = 'primary',
  state = 'default',
  theme = 'light',
  label,
  additionalInfo,
  items = [],
  selectedItemId,
  onSelect,
  className = '',
  children,
  disabled = false,
}: SelectboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedId, setInternalSelectedId] = useState<
    string | undefined
  >(selectedItemId);
  const selectboxRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDisabled = disabled || state === 'disabled' || variant === 'disabled';

  // 외부에서 selectedItemId가 변경되면 내부 상태도 업데이트
  useEffect(() => {
    if (selectedItemId !== undefined) {
      setInternalSelectedId(selectedItemId);
    }
  }, [selectedItemId]);

  // 외부 클릭 감지하여 드롭다운 닫기
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

  const handleItemClick = (itemId: string) => {
    setInternalSelectedId(itemId);
    setIsOpen(false);
    if (onSelect) {
      onSelect(itemId);
    }
  };

  const selectedItem = items.find((item) => item.id === internalSelectedId);

  const selectboxClasses = [
    styles.selectbox,
    styles[`variant-${variant}`],
    styles[`state-${state}`],
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
    isOpen && styles.dropdownOpen,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      {additionalInfo && (
        <div className={styles.additionalInfo}>{additionalInfo}</div>
      )}
      <div className={styles.selectboxWrapper} ref={selectboxRef}>
        <button
          type="button"
          className={selectboxClasses}
          onClick={handleSelectboxClick}
          disabled={isDisabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className={styles.content}>
            {selectedItem ? (
              <span className={styles.selectedValue}>{selectedItem.value}</span>
            ) : (
              children
            )}
          </div>
          <svg
            className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
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
        {isOpen && items.length > 0 && (
          <div className={dropdownClasses} ref={dropdownRef}>
            <ul className={styles.optionList} role="listbox">
              {items.map((item) => {
                const isSelected = item.id === internalSelectedId;
                const itemClasses = [
                  styles.optionItem,
                  isSelected && styles.optionItemSelected,
                  styles[`theme-${theme}`],
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <li
                    key={item.id}
                    className={itemClasses}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleItemClick(item.id)}
                  >
                    {item.value}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
