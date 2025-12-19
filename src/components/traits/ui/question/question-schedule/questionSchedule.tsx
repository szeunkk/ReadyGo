'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface QuestionScheduleProps {
  onAnswerSelect?: (answer: { dayType: string; timeSlot: string }) => void;
  currentStep?: number;
  selectedAnswer?: { dayType: string; timeSlot: string };
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
  const [selectedDayType, setSelectedDayType] = useState<string | null>(
    selectedAnswer?.dayType || null
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(
    selectedAnswer?.timeSlot || null
  );
  const [clickedDayType, setClickedDayType] = useState<string | null>(null);
  const [clickedTimeSlot, setClickedTimeSlot] = useState<string | null>(null);

  // 질문이 바뀌면 클릭 상태 초기화
  useEffect(() => {
    setClickedDayType(null);
    setClickedTimeSlot(null);
  }, [currentStep]);

  const handleDayTypeSelect = (dayTypeId: string) => {
    setClickedDayType(dayTypeId);
    setSelectedDayType(dayTypeId);

    // 시간대도 선택되었으면 300ms 후 자동 제출
    if (selectedTimeSlot) {
      setTimeout(() => {
        if (onAnswerSelect) {
          onAnswerSelect({
            dayType: dayTypeId,
            timeSlot: selectedTimeSlot,
          });
        }
      }, 300);
    }
  };

  const handleTimeSlotSelect = (timeSlotId: string) => {
    setClickedTimeSlot(timeSlotId);
    setSelectedTimeSlot(timeSlotId);

    // 요일도 선택되었으면 300ms 후 자동 제출
    if (selectedDayType) {
      setTimeout(() => {
        if (onAnswerSelect) {
          onAnswerSelect({
            dayType: selectedDayType,
            timeSlot: timeSlotId,
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
              const isSelected =
                clickedDayType === dayType.id ||
                selectedDayType === dayType.id;
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
              const isSelected =
                clickedTimeSlot === timeSlot.id ||
                selectedTimeSlot === timeSlot.id;
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

