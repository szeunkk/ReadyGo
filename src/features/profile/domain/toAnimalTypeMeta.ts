/**
 * 📌 Domain Layer - AnimalType to UI Meta Converter
 *
 * - 순수 함수: 외부 상태(useState, hook, fetch, console 등)에 의존하지 않음
 * - 입력 → 출력이 명확한 enum → meta 단방향 변환
 * - UI 레이어와 분리: 조건 분기, 해석, 점수 계산 로직 포함 안 함
 * - Source of Truth: animal.assets.ts (image), animal.copy.ts (label)
 */

import type { ProfileCoreDTO } from '@/commons/types/profile/profileCore.dto';
import { AnimalType } from '@/commons/constants/animal/animal.enum';
import { animalAssets } from '@/commons/constants/animal/animal.assets';
import { animalCopies } from '@/commons/constants/animal/animal.copy';

/**
 * AnimalType UI 메타 정보
 * UI 컴포넌트에서 직접 사용 가능한 형태
 */
export interface AnimalTypeMeta {
  /** 이미지 경로 (중간 크기) */
  image: string;
  /** 표시용 라벨 (한글명) */
  label: string;
}

/**
 * AnimalType enum → UI 메타 매핑
 *
 * - image: animal.assets.ts의 imageM 사용
 * - label: animal.copy.ts의 label 사용
 *
 * 📌 Source of Truth:
 * - animalAssets[type].imageM
 * - animalCopies[type].label
 */
const ANIMAL_TYPE_META_MAP: Record<AnimalType, AnimalTypeMeta> = Object.values(
  AnimalType
).reduce(
  (acc, type) => {
    acc[type] = {
      image: animalAssets[type].imageM,
      label: animalCopies[type].label,
    };
    return acc;
  },
  {} as Record<AnimalType, AnimalTypeMeta>
);

/**
 * ProfileCoreDTO의 animalType을 AnimalTypeMeta로 변환
 *
 * @param animalType - ProfileCoreDTO['animalType'] (AnimalType | null | undefined)
 * @returns AnimalTypeMeta | undefined - enum 값이 있으면 메타 정보, 없으면 undefined
 *
 * @example
 * ```typescript
 * const profile: ProfileCoreDTO = {
 *   userId: 'uuid-1234',
 *   animalType: AnimalType.tiger
 * };
 *
 * const meta = toAnimalTypeMeta(profile.animalType);
 * // { image: '/images/tiger_m.svg', label: '호랑이' }
 * ```
 *
 * @example
 * ```typescript
 * // animalType이 없는 경우
 * const noMeta1 = toAnimalTypeMeta(null); // undefined
 * const noMeta2 = toAnimalTypeMeta(undefined); // undefined
 * ```
 */
export function toAnimalTypeMeta(
  animalType: ProfileCoreDTO['animalType']
): AnimalTypeMeta | undefined {
  // animalType이 없는 경우 undefined 반환
  if (!animalType) {
    return undefined;
  }

  // enum → meta 단방향 매핑
  return ANIMAL_TYPE_META_MAP[animalType];
}
