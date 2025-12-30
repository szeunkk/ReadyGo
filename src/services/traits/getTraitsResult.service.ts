import { findByUserId as findUserTraits } from '@/repositories/userTraits.repository';
import { findByUserId as findUserProfile } from '@/repositories/userProfiles.repository';
import { findByUserId as findPlaySchedules } from '@/repositories/userPlaySchedules.repository';

/**
 * getTraitsResult Service
 *
 * 책임:
 * - userId를 입력으로 받는다
 * - traits/profile/schedule 조회 흐름을 orchestration 한다
 * - repository 함수들을 조합하여 결과 DTO를 구성한다
 * - 조회 실패 시 에러를 throw 한다
 */

export type TraitsResultDTO = {
  traits: {
    cooperation: number;
    exploration: number;
    strategy: number;
    leadership: number;
    social: number;
  };
  animalType: string;
  schedule: {
    dayTypes: string[];
    timeSlots: string[];
  };
};

export const getTraitsResult = async (
  userId: string
): Promise<TraitsResultDTO> => {
  // 1. user_traits 조회 (필수)
  const userTraits = await findUserTraits(userId);
  if (!userTraits) {
    throw new Error('traits not found');
  }

  // 2. user_profiles 조회 (animal_type)
  const userProfile = await findUserProfile(userId);
  const animalType = userProfile?.animal_type || '';

  // 3. user_play_schedules 조회
  const playSchedules = await findPlaySchedules(userId);

  // 4. schedule 데이터 가공 (중복 제거)
  const dayTypesSet = new Set<string>();
  const timeSlotsSet = new Set<string>();

  for (const schedule of playSchedules) {
    if (schedule.day_type) {
      dayTypesSet.add(schedule.day_type);
    }
    if (schedule.time_slot) {
      timeSlotsSet.add(schedule.time_slot);
    }
  }

  // 5. traits 객체 매핑
  const traits = {
    cooperation: userTraits.cooperation,
    exploration: userTraits.exploration,
    strategy: userTraits.strategy,
    leadership: userTraits.leadership,
    social: userTraits.social,
  };

  // 6. 최종 DTO 구성
  return {
    traits,
    animalType,
    schedule: {
      dayTypes: Array.from(dayTypesSet),
      timeSlots: Array.from(timeSlotsSet),
    },
  };
};
