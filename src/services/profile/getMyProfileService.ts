import * as userProfilesRepository from '@/repositories/userProfiles.repository';
import * as userTraitsRepository from '@/repositories/userTraits.repository';
import * as userPlaySchedulesRepository from '@/repositories/userPlaySchedules.repository';
import {
  ProfileCoreDTO,
  PlayScheduleItem,
} from '@/commons/types/profile/profileCore.dto';
import { AnimalType } from '@/commons/constants/animal/animal.enum';
import { TraitVector } from '@/commons/constants/animal/animal.vector';
import {
  ProfileNotFoundError,
  ProfileDataInconsistencyError,
  ProfileFetchError,
} from '@/commons/errors/profile/profileErrors';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * 내 프로필 조회 Service
 *
 * 책임:
 * - user_profiles, user_traits, user_play_schedules 데이터 조회
 * - ProfileCoreDTO로 조립
 * - 데이터 일관성 검증 (traits/schedule 불일치)
 *
 * 비책임:
 * - UI 분기 판단
 * - 온보딩 상태 판단
 * - 권한/인증 체크
 */
export const getMyProfileService = async (
  client: SupabaseClient<Database>,
  userId: string
): Promise<ProfileCoreDTO> => {
  // 1. user_profiles 조회
  const profileResult = await userProfilesRepository.findByUserId(
    client,
    userId
  );

  // 1-1. Repository 에러 처리
  if (profileResult.error) {
    throw new ProfileFetchError('profile', profileResult.error.message);
  }

  // 1-2. profile이 없으면 NotFound 에러 throw (즉시 종료)
  if (!profileResult.data) {
    throw new ProfileNotFoundError(userId);
  }

  const profileRow = profileResult.data;

  // 2. user_traits 조회
  const traitsResult = await userTraitsRepository.findByUserId(client, userId);

  // 2-1. Repository 에러 처리
  if (traitsResult.error) {
    throw new ProfileFetchError('traits', traitsResult.error.message);
  }

  // 3. user_play_schedules 조회
  const schedulesResult = await userPlaySchedulesRepository.findByUserId(
    client,
    userId
  );

  // 3-1. Repository 에러 처리
  if (schedulesResult.error) {
    throw new ProfileFetchError('schedules', schedulesResult.error.message);
  }

  const traitsRow = traitsResult.data;
  const schedulesRows = schedulesResult.data || [];

  const hasTraits = traitsRow !== null;
  const hasSchedules = schedulesRows.length > 0;

  // 4. 데이터 일관성 검증
  // traits만 존재하고 schedule이 없는 경우 → DataInconsistency 에러
  if (hasTraits && !hasSchedules) {
    throw new ProfileDataInconsistencyError(userId, 'traits_only');
  }

  // schedule만 존재하고 traits가 없는 경우 → DataInconsistency 에러
  if (!hasTraits && hasSchedules) {
    throw new ProfileDataInconsistencyError(userId, 'schedules_only');
  }

  // 5. 정상 케이스 처리 및 ProfileCoreDTO 조립
  let traits: TraitVector | undefined = undefined;
  let schedule: PlayScheduleItem[] | undefined = undefined;

  if (hasTraits && hasSchedules) {
    // 5-1. traits + schedule 모두 있는 경우 - 정상 케이스
    traits = {
      cooperation: traitsRow.cooperation,
      exploration: traitsRow.exploration,
      strategy: traitsRow.strategy,
      leadership: traitsRow.leadership,
      social: traitsRow.social,
    };

    schedule = schedulesRows.map((row) => ({
      dayType: row.day_type,
      timeSlot: row.time_slot,
    }));
  }
  // 5-2. traits + schedule 모두 없는 경우 - 정상 케이스 (undefined로 유지)

  // 6. ProfileCoreDTO 반환
  // nickname, animalType 누락 허용 (기본값 자동 생성 ❌)
  return {
    userId: profileRow.id,
    nickname: profileRow.nickname ?? undefined,
    animalType: profileRow.animal_type as AnimalType | null | undefined,
    traits,
    schedule,
  };
};
