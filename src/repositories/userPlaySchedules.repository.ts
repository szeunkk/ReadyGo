import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * user_play_schedules Repository
 * 책임: user_play_schedules 테이블 접근 전담
 */

export type PlayScheduleRow = {
  user_id: string;
  day_type: string;
  time_slot: string;
};

/**
 * 특정 유저의 모든 play_schedules를 조회한다
 * - DB 접근만 수행, 에러 처리 및 데이터 가공 없음
 * - Supabase 응답 구조를 그대로 반환
 */
export const findByUserId = async (
  client: SupabaseClient<Database>,
  userId: string
) => {
  return await client
    .from('user_play_schedules')
    .select('*')
    .eq('user_id', userId);
};

/**
 * 특정 유저의 모든 play_schedules를 삭제한다
 * - DB 접근만 수행, 에러 처리는 상위 레이어에서 담당
 * - Supabase 응답 구조를 그대로 반환
 */
export const deleteByUserId = async (
  client: SupabaseClient<Database>,
  userId: string
) => {
  return await client
    .from('user_play_schedules')
    .delete()
    .eq('user_id', userId);
};

/**
 * 여러 play_schedule 레코드를 일괄 삽입한다
 * - DB 접근만 수행, 에러 처리는 상위 레이어에서 담당
 * - Supabase 응답 구조를 그대로 반환
 */
export const insertMany = async (
  client: SupabaseClient<Database>,
  rows: PlayScheduleRow[]
) => {
  return await client.from('user_play_schedules').insert(rows);
};
