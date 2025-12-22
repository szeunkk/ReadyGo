/**
 * Animal Compatibility Data
 * 천생연분 / 궁합 데이터
 */

import { AnimalType } from './animal.enum';

// ============================================
// Compatibility Type Definition
// ============================================

export type AnimalCompatibility = {
  bestMatches: AnimalType[]; // 천생연분
  goodMatches: AnimalType[]; // 좋은 궁합
  neutralMatches: AnimalType[]; // 중립
  challengingMatches: AnimalType[]; // 도전적인 궁합
};

// ============================================
// Compatibility Data (현재 미정의)
// ============================================

/**
 * TODO: 향후 추가될 궁합 데이터
 * 각 동물 타입 간의 궁합 점수 및 추천 관계를 정의
 */
export const animalCompatibilities: Partial<
  Record<AnimalType, AnimalCompatibility>
> = {
  // 예시 구조:
  // [AnimalType.wolf]: {
  //   bestMatches: [AnimalType.dog, AnimalType.dolphin],
  //   goodMatches: [AnimalType.bear, AnimalType.tiger],
  //   neutralMatches: [],
  //   challengingMatches: [AnimalType.cat, AnimalType.leopard],
  // },
};

// ============================================
// Utilities
// ============================================

/**
 * 동물 타입의 궁합 데이터를 반환
 */
export const getAnimalCompatibility = (
  type: AnimalType
): AnimalCompatibility | undefined => {
  return animalCompatibilities[type];
};

/**
 * 두 동물 타입 간의 궁합 정도를 반환
 * @returns 'best' | 'good' | 'neutral' | 'challenging' | 'unknown'
 */
export const getCompatibilityLevel = (
  type1: AnimalType,
  type2: AnimalType
): 'best' | 'good' | 'neutral' | 'challenging' | 'unknown' => {
  const compat = animalCompatibilities[type1];
  if (!compat) return 'unknown';

  if (compat.bestMatches?.includes(type2)) return 'best';
  if (compat.goodMatches?.includes(type2)) return 'good';
  if (compat.challengingMatches?.includes(type2)) return 'challenging';
  if (compat.neutralMatches?.includes(type2)) return 'neutral';

  return 'unknown';
};

