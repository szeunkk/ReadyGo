'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface QuestionScheduleProps {
  onAnswerSelect?: (answer: { dayTypes: string[]; timeSlots: string[] }) => void;
  currentStep?: number;
  selectedAnswer?: { dayTypes: string[]; timeSlots: string[] };
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
  onAnswerSelect,
  selectedAnswer,
  currentStep,
}: QuestionScheduleProps) {
  const [selectedDayTypes, setSelectedDayTypes] = useState<string[]>(
    selectedAnswer?.dayTypes || []
  );
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(
    selectedAnswer?.timeSlots || []
  );

  // 질문이 바뀌면 선택 상태 초기화
  useEffect(() => {
    setSelectedDayTypes(selectedAnswer?.dayTypes || []);
    setSelectedTimeSlots(selectedAnswer?.timeSlots || []);
  }, [currentStep, selectedAnswer]);

  const handleDayTypeSelect = (dayTypeId: string) => {
    const newSelected = selectedDayTypes.includes(dayTypeId)
      ? selectedDayTypes.filter((id) => id !== dayTypeId)
      : [...selectedDayTypes, dayTypeId];
    
    setSelectedDayTypes(newSelected);

    // 요일과 시간대가 모두 1개 이상 선택되었으면 300ms 후 자동 제출
    if (newSelected.length > 0 && selectedTimeSlots.length > 0) {
      setTimeout(() => {
        if (onAnswerSelect) {
          onAnswerSelect({
            dayTypes: newSelected,
            timeSlots: selectedTimeSlots,
          });
        }
      }, 300);
    }
  };

  const handleTimeSlotSelect = (timeSlotId: string) => {
    const newSelected = selectedTimeSlots.includes(timeSlotId)
      ? selectedTimeSlots.filter((id) => id !== timeSlotId)
      : [...selectedTimeSlots, timeSlotId];
    
    setSelectedTimeSlots(newSelected);

    // 요일과 시간대가 모두 1개 이상 선택되었으면 300ms 후 자동 제출
    if (selectedDayTypes.length > 0 && newSelected.length > 0) {
      setTimeout(() => {
        if (onAnswerSelect) {
          onAnswerSelect({
            dayTypes: selectedDayTypes,
            timeSlots: newSelected,
          });
        }
      }, 300);
    }
  };

  return (
    <div className={styles.questionBody}>
      <h2 className={styles.questionText}>주로 게임 플레이하는 시간대는?</h2>

      <div className={styles.sectionsWrapper}>
        {/* 요일 선택 섹션 */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>주로 플레이하는 요일</label>
          <div className={styles.buttonRow}>
            {DAY_TYPES.map((dayType) => {
              const isSelected = selectedDayTypes.includes(dayType.id);
              return (
                <button
                  key={dayType.id}
                  className={`${styles.scheduleButton} ${
                    isSelected ? styles.scheduleButtonSelected : ''
                  }`}
                  onClick={() => handleDayTypeSelect(dayType.id)}
                >
                  <span
                    className={`${styles.scheduleButtonText} ${
                      isSelected ? styles.scheduleButtonTextSelected : ''
                    }`}
                  >
                    {dayType.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 시간대 선택 섹션 */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>주로 플레이하는 시간대</label>
          <div className={styles.buttonGrid}>
            {TIME_SLOTS.map((timeSlot) => {
              const isSelected = selectedTimeSlots.includes(timeSlot.id);
              return (
                <button
                  key={timeSlot.id}
                  className={`${styles.scheduleButton} ${
                    isSelected ? styles.scheduleButtonSelected : ''
                  }`}
                  onClick={() => handleTimeSlotSelect(timeSlot.id)}
                >
                  <span
                    className={`${styles.scheduleButtonText} ${
                      isSelected ? styles.scheduleButtonTextSelected : ''
                    }`}
                  >
                    {timeSlot.label}
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

