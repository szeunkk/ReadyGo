/**
 * 📌 Domain Layer - Trait to Radar Data Converter
 *
 * - 순수 함수: 외부 상태(useState, hook, fetch, console 등)에 의존하지 않음
 * - 입력 → 출력이 명확한 변환 함수
 * - UI 레이어(RadarChart)와 분리
 */

import type { ProfileCoreDTO } from '@/commons/types/profile/profileCore.dto';
import type { RadarTraitKey } from '@/commons/constants/animal';

/**
 * RadarChart 컴포넌트에서 사용하는 데이터 구조
 * (UI 레이어 타입을 그대로 재사용)
 */
export interface RadarChartData {
  trait: RadarTraitKey;
  value: number; // 0-100
}

/**
 * RadarChart에서 사용하는 고정 trait 순서
 * (RadarChart 컴포넌트의 orderedTraits와 동일)
 *
 * 순서 변경 시 RadarChart 컴포넌트와 함께 수정 필요
 */
const RADAR_TRAIT_ORDER: RadarTraitKey[] = [
  'social', // 교류성 (12시)
  'exploration', // 모험성 (약 2시)
  'cooperation', // 협동성 (약 5시)
  'strategy', // 전략성 (약 7시)
  'leadership', // 리더십 (약 10시)
];

/**
 * ProfileCoreDTO의 traits를 RadarChartData 배열로 변환
 *
 * @param traits - ProfileCoreDTO['traits'] (TraitVector | null | undefined)
 * @returns RadarChartData[] - 고정된 순서의 레이더 차트 데이터 배열
 *
 * @example
 * ```typescript
 * const profile: ProfileCoreDTO = {
 *   userId: 'uuid-1234',
 *   traits: { cooperation: 58, exploration: 85, strategy: 58, leadership: 85, social: 52 }
 * };
 *
 * const radarData = toRadarData(profile.traits);
 * // [
 * //   { trait: 'social', value: 52 },
 * //   { trait: 'exploration', value: 85 },
 * //   { trait: 'cooperation', value: 58 },
 * //   { trait: 'strategy', value: 58 },
 * //   { trait: 'leadership', value: 85 }
 * // ]
 * ```
 *
 * @example
 * ```typescript
 * // traits가 없는 경우
 * const emptyRadarData = toRadarData(null); // []
 * const emptyRadarData2 = toRadarData(undefined); // []
 * ```
 */
export function toRadarData(
  traits: ProfileCoreDTO['traits']
): RadarChartData[] {
  // traits가 없는 경우 빈 배열 반환
  if (!traits) {
    return [];
  }

  // 고정 순서에 따라 RadarChartData 배열 생성
  return RADAR_TRAIT_ORDER.map((trait) => ({
    trait,
    value: traits[trait], // 값 그대로 사용 (가공 X)
  }));
}

