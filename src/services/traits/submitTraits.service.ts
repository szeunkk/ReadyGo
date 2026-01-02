import { AnimalType } from '@/commons/constants/animal/animal.enum';
import {
  upsertUserTraits,
  TraitsRecord,
} from '@/repositories/userTraits.repository';
import { updateAnimalType } from '@/repositories/userProfiles.repository';
import {
  deleteByUserId,
  insertMany,
  PlayScheduleRow,
} from '@/repositories/userPlaySchedules.repository';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * submitTraits Service
 * 책임: traits/profile/schedule 저장 흐름을 orchestration
 */

export type SubmitTraitsPayload = {
  traits: TraitsRecord;
  animalType: AnimalType;
  dayTypes: string[];
  timeSlots: string[];
};

/**
 * Traits 제출 결과를 저장한다
 *
 * 저장 흐름:
 * 1. user_traits upsert
 * 2. user_profiles.animal_type 업데이트
 * 3. user_play_schedules 교체 저장 (delete → insert)
 *
 * ⚠️ 주의: 다중 테이블 트랜잭션은 보장되지 않음
 * - 일부 단계 성공 후 실패가 발생할 수 있음
 * - 실패 시 즉시 중단하고 에러를 throw
 *
 * @param client - Supabase 클라이언트
 * @param userId - 인증된 유저 ID
 * @param payload - 검증된 traits 제출 데이터
 * @throws Error - 저장 중 에러 발생 시
 */
export const submitTraits = async (
  client: SupabaseClient<Database>,
  userId: string,
  payload: SubmitTraitsPayload
): Promise<void> => {
  const { traits, animalType, dayTypes, timeSlots } = payload;

  // (1) user_traits upsert
  const upsertResult = await upsertUserTraits(client, userId, traits);
  if (upsertResult.error) {
    throw new Error(`Failed to upsert traits: ${upsertResult.error.message}`);
  }

  // (2) user_profiles.animal_type 업데이트
  const updateResult = await updateAnimalType(client, userId, animalType);
  if (updateResult.error) {
    throw new Error(
      `Failed to update animal_type: ${updateResult.error.message}`
    );
  }

  // (3) user_play_schedules 교체 저장
  // - 먼저 기존 스케줄 삭제
  const deleteResult = await deleteByUserId(client, userId);
  if (deleteResult.error) {
    throw new Error(
      `Failed to delete schedules: ${deleteResult.error.message}`
    );
  }

  // - dayTypes와 timeSlots 중복 제거
  const uniqueDayTypes = Array.from(new Set(dayTypes));
  const uniqueTimeSlots = Array.from(new Set(timeSlots));

  // - 조합 생성
  const scheduleRows: PlayScheduleRow[] = [];
  for (const dayType of uniqueDayTypes) {
    for (const timeSlot of uniqueTimeSlots) {
      scheduleRows.push({
        user_id: userId,
        day_type: dayType,
        time_slot: timeSlot,
      });
    }
  }

  // - 조합이 있는 경우에만 insert
  if (scheduleRows.length > 0) {
    const insertResult = await insertMany(client, scheduleRows);
    if (insertResult.error) {
      throw new Error(
        `Failed to insert schedules: ${insertResult.error.message}`
      );
    }
  }
};
