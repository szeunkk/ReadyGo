'use client';

import React, { useState } from 'react';
import Question from './ui/question/question';
import AnalysisLoading from './ui/analysis-loading/analysisLoading';
import styles from './styles.module.css';

export default function TraitsPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleQuestionComplete = () => {
    // 분석 로딩 시작
    setIsAnalyzing(true);

    // 3초 후 다음 단계로 이동
    setTimeout(() => {
      setIsAnalyzing(false);
      // TODO: 결과 페이지로 이동
      // router.push('/traits/result')
      console.log('분석 완료 - 결과 페이지로 이동');
    }, 3000);
  };

  return (
    <div className={isAnalyzing ? styles.pageLoading : styles.page}>
      {isAnalyzing ? (
        <AnalysisLoading />
      ) : (
        <Question onComplete={handleQuestionComplete} />
      )}
    </div>
  );
}
