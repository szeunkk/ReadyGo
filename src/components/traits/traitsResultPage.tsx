'use client';

import React from 'react';
import Result from './ui/result/result';
import { AnimalType } from '@/commons/constants/animalType.enum';
import { RadarChartData } from '@/commons/components/radar-chart';
import styles from './styles.module.css';

// Mock 데이터 - 실제로는 API나 상태 관리를 통해 전달받아야 합니다
const mockData = {
  animalType: AnimalType.fox,
  nickname: '전략적인 여우',
  radarData: [
    { trait: 'strategy', value: 85 },
    { trait: 'cooperation', value: 70 },
    { trait: 'exploration', value: 75 },
    { trait: 'leadership', value: 60 },
    { trait: 'social', value: 80 },
  ] as RadarChartData[],
  mainRole: {
    label: '전략가',
    description: '팀의 전략을 수립하고 전술적 판단을 내립니다.',
  },
  subRole: {
    label: '서포터',
    description: '팀원들을 지원하며 전체적인 흐름을 조율합니다.',
  },
  matchTypes: ['늑대', '올빼미', '호랑이'],
  characteristics: [
    '전략적 사고로 게임을 분석합니다',
    '팀원들과의 협업을 중시합니다',
    '새로운 전략을 시도하는 것을 즐깁니다',
  ],
};

export default function TraitsResultPage() {
  const handlePrevious = () => {
    // TODO: 이전 페이지로 이동
    console.log('이전 페이지로 이동');
  };

  const handleComplete = () => {
    // TODO: 홈으로 이동
    console.log('홈으로 이동');
  };

  return (
    <div className={styles.page}>
      <Result
        animalType={mockData.animalType}
        nickname={mockData.nickname}
        radarData={mockData.radarData}
        mainRole={mockData.mainRole}
        subRole={mockData.subRole}
        matchTypes={mockData.matchTypes}
        characteristics={mockData.characteristics}
        onPrevious={handlePrevious}
        onComplete={handleComplete}
      />
    </div>
  );
}
