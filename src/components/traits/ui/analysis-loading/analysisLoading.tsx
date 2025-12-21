import React from 'react';
import styles from './styles.module.css';

/**
 * AnalysisLoading Component
 * 
 * 사용자의 성향 분석 중 표시되는 로딩 화면 컴포넌트
 * - 회전하는 스피너 애니메이션
 * - 분석 진행 상태 메시지
 */
export function AnalysisLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Spinner */}
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinnerBackground}>
            <svg
              width="112"
              height="112"
              viewBox="0 0 112 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="var(--color-gray-900)"
                strokeWidth="8"
                fill="none"
              />
            </svg>
          </div>
          <div className={styles.spinnerAnimation}>
            <svg
              width="112"
              height="112"
              viewBox="0 0 112 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.spinnerSvg}
            >
              <path
                d="M 56 8 A 48 48 0 0 1 104 56"
                stroke="var(--color-teal-500)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className={styles.textWrapper}>
          <h2 className={styles.heading}>당신의 성향을 분석 중...</h2>
          <p className={styles.paragraph}>잠시만 기다려주세요</p>
        </div>
      </div>
    </div>
  );
}

export default AnalysisLoading;

