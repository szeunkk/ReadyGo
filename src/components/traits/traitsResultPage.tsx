'use client';

import React, { useMemo } from 'react';
import Result from './ui/result/result';
import { AnimalType, getAnimalTypeMeta } from '@/commons/constants/animal';
import { RadarChartData } from '@/commons/components/radar-chart';
import styles from './styles.module.css';

// Mock 데이터 - 실제로는 API나 상태 관리를 통해 전달받아야 합니다
const MOCK_ANIMAL_TYPE = AnimalType.fox;
const MOCK_NICKNAME = '전략적인 여우';
const MOCK_MATCH_TYPES = ['늑대', '올빼미', '호랑이']; // 궁합 데이터 (추후 animal.compat.ts에서 가져올 예정)

const getMockData = () => {
  const animalMeta = getAnimalTypeMeta(MOCK_ANIMAL_TYPE);

  // Trait 값을 실제 성향 데이터 기반으로 생성
  // dominantTraits: 85, secondaryTraits: 65, avoidTraits: 35
  const radarData: RadarChartData[] = [
    { trait: 'cooperation', value: 65 }, // secondaryTraits
    { trait: 'exploration', value: 65 }, // secondaryTraits
    { trait: 'strategy', value: 85 }, // dominantTraits
    { trait: 'leadership', value: 35 }, // avoidTraits
    { trait: 'social', value: 65 }, // secondaryTraits
  ];

  return {
    animalType: MOCK_ANIMAL_TYPE,
    nickname: MOCK_NICKNAME,
    radarData,
    mainRole: {
      label: animalMeta.mainRole.name,
      description: animalMeta.mainRole.description,
    },
    subRole: {
      label: animalMeta.subRole.name,
      description: animalMeta.subRole.description,
    },
    matchTypes: MOCK_MATCH_TYPES,
    characteristics: animalMeta.checkSentences,
  };
};

export default function TraitsResultPage() {
  const mockData = useMemo(() => getMockData(), []);

  const handlePrevious = () => {
    // TODO: 이전 페이지로 이동
  };

  const handleComplete = () => {
    // TODO: 홈으로 이동
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
