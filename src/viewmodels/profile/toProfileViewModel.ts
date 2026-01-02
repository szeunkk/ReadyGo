/**
 * 📌 ViewModel Layer - ProfileCoreDTO to ProfileViewModel Converter
 *
 * - 순수 함수: 외부 의존성(API, hook, store, router) 참조 금지
 * - 기존 domain 변환 함수를 조합하여 UI 친화적 ViewModel 생성
 * - side effect 없음 (try/catch, throw, console 등 금지)
 *
 * 📌 책임 범위:
 * - Core DTO → ViewModel 단방향 변환만 수행
 * - 상태 판단 로직 (온보딩 여부, 완성도 등) 포함 금지
 * - API 호출, 데이터 fetch 포함 금지
 */

import type { ProfileCoreDTO } from '@/commons/types/profile/profileCore.dto';
import type { ProfileViewModel } from './ProfileViewModel';
import { toRadarData } from '@/features/profile/domain/toRadarData';
import { toActiveTimeText } from '@/features/profile/domain/toActiveTimeText';
import { toAnimalTypeMeta } from '@/features/profile/domain/toAnimalTypeMeta';

/**
 * ProfileCoreDTO를 ProfileViewModel로 변환
 *
 * @param coreDTO - ProfileCoreDTO
 * @returns ProfileViewModel - UI 렌더링에 최적화된 ViewModel
 *
 * @example
 * ```typescript
 * const coreDTO: ProfileCoreDTO = {
 *   userId: 'uuid-1234',
 *   nickname: '게이머호랑이',
 *   animalType: AnimalType.tiger,
 *   traits: { cooperation: 58, exploration: 85, strategy: 58, leadership: 85, social: 52 },
 *   schedule: [
 *     { dayType: 'WEEKDAY', timeSlot: 'EVENING' },
 *     { dayType: 'WEEKEND', timeSlot: 'EVENING' }
 *   ]
 * };
 *
 * const viewModel = toProfileViewModel(coreDTO);
 * // {
 * //   userId: 'uuid-1234',
 * //   nickname: '게이머호랑이',
 * //   animalType: AnimalType.tiger,
 * //   traits: { ... },
 * //   schedule: [ ... ],
 * //   radarData: [
 * //     { trait: 'social', value: 52 },
 * //     { trait: 'exploration', value: 85 },
 * //     ...
 * //   ],
 * //   activeTimeText: 'WEEKDAY, WEEKEND / EVENING',
 * //   animalMeta: { image: '/images/tiger_m.svg', label: '호랑이' }
 * // }
 * ```
 *
 * @example
 * ```typescript
 * // traits, schedule, animalType이 없는 경우
 * const minimalDTO: ProfileCoreDTO = {
 *   userId: 'uuid-5678',
 *   nickname: '신규유저'
 * };
 *
 * const viewModel = toProfileViewModel(minimalDTO);
 * // {
 * //   userId: 'uuid-5678',
 * //   nickname: '신규유저',
 * //   radarData: [],
 * //   activeTimeText: undefined,
 * //   animalMeta: undefined
 * // }
 * ```
 */
export function toProfileViewModel(
  coreDTO: ProfileCoreDTO
): ProfileViewModel {
  // 기존 domain 변환 함수를 사용하여 UI 데이터 생성
  const radarData = toRadarData(coreDTO.traits);
  const activeTimeText = toActiveTimeText(coreDTO.schedule);
  const animalMeta = toAnimalTypeMeta(coreDTO.animalType);

  // ProfileViewModel 구성
  return {
    // 필수 필드
    userId: coreDTO.userId,

    // 선택 필드 (Core DTO에서 그대로 전달)
    nickname: coreDTO.nickname,
    animalType: coreDTO.animalType,
    traits: coreDTO.traits,
    schedule: coreDTO.schedule,

    // 변환된 UI 데이터
    radarData,
    activeTimeText,
    animalMeta,
  };
}

