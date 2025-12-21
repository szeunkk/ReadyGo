'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Question from './ui/question/question';
import styles from './styles.module.css';

export default function TraitsPage() {
  const router = useRouter();

  const handleQuestionComplete = async () => {
    // TODO: 실제로는 여기서 API 호출로 분석 데이터 저장
    // const result = await analyzeTraits(answers);
    // await saveTraitsResult(result);

    // 개발 단계: 로딩 UI 확인을 위한 3초 딜레이
    // (프로덕션에서는 실제 API 응답 시간만큼 자동으로 loading.tsx가 표시됩니다)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Next.js의 /traits/loading.tsx가 자동으로 표시되는 동안 페이지 전환
    router.push('/traits/result');
  };

  return (
    <div className={styles.page}>
      <Question onComplete={handleQuestionComplete} />
    </div>
  );
}
