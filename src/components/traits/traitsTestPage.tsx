'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Question from './ui/question/question';
import AnalysisLoading from './ui/analysis-loading/analysisLoading';
import type { TraitSubmitPayload } from './hooks';
import { URL_PATHS } from '@/commons/constants/url';
import styles from './styles.module.css';

export default function TraitsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const handleQuestionComplete = async (payload: TraitSubmitPayload) => {
    // 중복 submit 차단
    if (isSubmittingRef.current || isLoading) {
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/traits/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit traits');
      }

      const result = await response.json();

      if (result.ok) {
        // 성공 시 결과 페이지로 이동 (로딩 상태 유지)
        router.push(URL_PATHS.TRAITS_RESULT);
        // 성공 시에는 isLoading을 false로 설정하지 않음 (페이지 전환까지 로딩 유지)
      } else {
        throw new Error(result.message || 'Unexpected response format');
      }
    } catch (err) {
      // 에러 처리 - 화면 유지, 결과 페이지로 이동하지 않음
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Traits submission error:', err);
      // 에러 시에만 로딩 해제
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  // 로딩 중일 때 로딩 UI 표시
  if (isLoading) {
    return (
      <div className={styles.page}>
        <AnalysisLoading />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {error && (
        <div className={styles.errorMessage}>오류가 발생했습니다: {error}</div>
      )}
      <Question onComplete={handleQuestionComplete} />
    </div>
  );
}
