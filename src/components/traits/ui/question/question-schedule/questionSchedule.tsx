'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface ScheduleAnswer {
  dayTypes: string[];
  timeSlots: string[];
}

interface QuestionScheduleProps {
  selectedAnswer?: ScheduleAnswer;
  onAnswerSelect?: (answer: ScheduleAnswer) => void;
}

const DAY_TYPES = [
  { id: 'weekday', label: '평일' },
  { id: 'weekend', label: '주말' },
];

const TIME_SLOTS = [
  { id: 'dawn', label: '새벽 (00:00-06:00)' },
  { id: 'morning', label: '아침 (06:00-12:00)' },
  { id: 'afternoon', label: '오후 (12:00-18:00)' },
  { id: 'evening', label: '저녁 (18:00-24:00)' },
];

export default function QuestionSchedule({
  selectedAnswer,
  onAnswerSelect,
}: QuestionScheduleProps) {
  const [selectedDayTypes, setSelectedDayTypes] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  // 🔹 질문이 "새로 렌더링"될 때 외부 상태와 동기화
  useEffect(() => {
    setSelectedDayTypes(selectedAnswer?.dayTypes || []);
    setSelectedTimeSlots(selectedAnswer?.timeSlots || []);
  }, [selectedAnswer]);

  const trySubmit = (dayTypes: string[], timeSlots: string[]) => {
    if (dayTypes.length > 0 && timeSlots.length > 0) {
      setTimeout(() => {
        onAnswerSelect?.({ dayTypes, timeSlots });
      }, 300);
    }
  };

  const handleDayTypeSelect = (id: string) => {
    const next = selectedDayTypes.includes(id)
      ? selectedDayTypes.filter((d) => d !== id)
      : [...selectedDayTypes, id];

    setSelectedDayTypes(next);
    trySubmit(next, selectedTimeSlots);
  };

  const handleTimeSlotSelect = (id: string) => {
    const next = selectedTimeSlots.includes(id)
      ? selectedTimeSlots.filter((t) => t !== id)
      : [...selectedTimeSlots, id];

    setSelectedTimeSlots(next);
    trySubmit(selectedDayTypes, next);
  };

  return (
    <div className={styles.questionBody}>
      <h2 className={styles.questionText}>주로 게임 플레이하는 시간대는?</h2>

      <div className={styles.sectionsWrapper}>
        {/* 요일 */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>주로 플레이하는 요일</label>
          <div className={styles.buttonRow}>
            {DAY_TYPES.map(({ id, label }) => {
              const isSelected = selectedDayTypes.includes(id);
              return (
                <button
                  key={id}
                  className={`${styles.scheduleButton} ${
                    isSelected ? styles.scheduleButtonSelected : ''
                  }`}
                  onClick={() => handleDayTypeSelect(id)}
                  data-testid={`schedule-day-${id}`}
                >
                  <span
                    className={`${styles.scheduleButtonText} ${
                      isSelected ? styles.scheduleButtonTextSelected : ''
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 시간대 */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>주로 플레이하는 시간대</label>
          <div className={styles.buttonGrid}>
            {TIME_SLOTS.map(({ id, label }) => {
              const isSelected = selectedTimeSlots.includes(id);
              return (
                <button
                  key={id}
                  className={`${styles.scheduleButton} ${
                    isSelected ? styles.scheduleButtonSelected : ''
                  }`}
                  onClick={() => handleTimeSlotSelect(id)}
                  data-testid={`schedule-time-${id}`}
                >
                  <span
                    className={`${styles.scheduleButtonText} ${
                      isSelected ? styles.scheduleButtonTextSelected : ''
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
