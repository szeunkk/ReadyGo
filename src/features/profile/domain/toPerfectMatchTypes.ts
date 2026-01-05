/**
 * 📌 Domain Layer - AnimalType to Perfect Match Types Converter
 *
 * - 순수 함수: 외부 상태(useState, hook, fetch, console 등)에 의존하지 않음
 * - 입력 → 출력이 명확한 변환 함수
 * - UI 레이어와 분리
 * - bestMatches + goodMatches를 합쳐서 반환
 */

import type { ProfileCoreDTO } from '@/commons/types/profile/profileCore.dto';
import type { AnimalType } from '@/commons/constants/animal/animal.enum';
import { getAnimalCompatibility } from '@/commons/constants/animal/animal.compat';

/**
 * ProfileCoreDTO의 animalType을 기반으로 천생연분 동물 타입 배열 반환
 *
 * @param animalType - ProfileCoreDTO['animalType'] (AnimalType | null | undefined)
 * @returns AnimalType[] | undefined - bestMatches + goodMatches 합친 배열
 *
 * @example
 * ```typescript
 * const profile: ProfileCoreDTO = {
 *   userId: 'uuid-1234',
 *   animalType: AnimalType.wolf
 * };
 *
 * const perfectMatches = toPerfectMatchTypes(profile.animalType);
 * // [AnimalType.bear, AnimalType.fox] (bestMatches + goodMatches)
 * ```
 *
 * @example
 * ```typescript
 * // animalType이 없는 경우
 * const noMatches1 = toPerfectMatchTypes(null); // undefined
 * const noMatches2 = toPerfectMatchTypes(undefined); // undefined
 * ```
 */
export const toPerfectMatchTypes = (
  animalType: ProfileCoreDTO['animalType']
): AnimalType[] | undefined => {
  // animalType이 없는 경우 undefined 반환
  if (!animalType) {
    return undefined;
  }

  // 궁합 데이터 조회
  const compatibility = getAnimalCompatibility(animalType);
  
  // 궁합 데이터가 없는 경우 undefined 반환
  if (!compatibility) {
    return undefined;
  }

  // bestMatches + goodMatches 합치기
  const perfectMatches: AnimalType[] = [
    ...(compatibility.bestMatches || []),
    ...(compatibility.goodMatches || []),
  ];

  // 빈 배열인 경우 undefined 반환
  if (perfectMatches.length === 0) {
    return undefined;
  }

  return perfectMatches;
};

