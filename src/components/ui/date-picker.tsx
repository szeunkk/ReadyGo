'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import dayjs, { type Dayjs } from 'dayjs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import Icon from '@/commons/components/icon';
import styles from './date-picker.module.css';

export type DatePickerState =
  | 'default'
  | 'hover'
  | 'active'
  | 'filled'
  | 'error';

export interface DatePickerProps {
  value?: Dayjs | null;
  onChange?: (date: Dayjs | null) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledDate?: (date: Date) => boolean;
  state?: DatePickerState;
  className?: string;
}

export const DatePicker = ({
  value,
  onChange,
  placeholder = '날짜 선택',
  disabled = false,
  disabledDate,
  state = 'default',
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalState, setInternalState] =
    React.useState<DatePickerState>(state);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = React.useState<number | undefined>(
    undefined
  );
  const isFilled = value !== null && value !== undefined;

  // 날짜 포맷팅: YYYY-MM-DD
  const formattedValue = value ? format(value.toDate(), 'yyyy-MM-dd') : '';

  // hover 상태 관리
  const handleMouseEnter = () => {
    if (!disabled && state === 'default' && !isOpen) {
      setInternalState('hover');
    }
  };

  const handleMouseLeave = () => {
    if (!disabled && state === 'default' && !isOpen) {
      setInternalState('default');
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!disabled) {
      setIsOpen(open);
      if (open && state === 'default') {
        setInternalState('active');
        // DatePicker trigger의 width를 가져와서 PopoverContent에 적용
        if (triggerRef.current) {
          const width = triggerRef.current.offsetWidth;
          setPopoverWidth(width);
        }
      } else if (!open && state === 'default') {
        setInternalState('default');
      }
    }
  };

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const dayjsDate = dayjs(date);
      onChange?.(dayjsDate);
      setIsOpen(false);
      if (state === 'default') {
        setInternalState('default');
      }
    } else {
      onChange?.(null);
    }
  };

  // 실제 사용할 state 결정
  const actualState =
    state !== 'default' ? state : isOpen ? 'active' : internalState;

  const datePickerClasses = [
    styles.datePicker,
    styles[`state-${actualState}`],
    isFilled && styles.filled,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className={datePickerClasses}
          disabled={disabled}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label={placeholder}
          data-testid="date-picker-trigger"
        >
          <span className={cn(styles.value, !isFilled && styles.placeholder)}>
            {isFilled ? formattedValue : placeholder}
          </span>
          <div className={styles.icon}>
            <Icon name="calendar" size={20} />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={styles.popoverContent}
        align="start"
        sideOffset={4}
        style={popoverWidth ? { width: `${popoverWidth}px` } : undefined}
        data-testid="date-picker-popover"
      >
        <div
          className={styles.calendarWrapper}
          data-testid="date-picker-calendar"
        >
          <Calendar
            mode="single"
            selected={value?.toDate()}
            onSelect={handleSelect}
            disabled={disabledDate}
            locale={ko}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
