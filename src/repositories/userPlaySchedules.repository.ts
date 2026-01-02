import { supabaseAdmin } from '@/lib/supabase/server';

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
export const findByUserId = async (userId: string) => {
  return await supabaseAdmin
    .from('user_play_schedules')
    .select('*')
    .eq('user_id', userId);
};

/**
 * 특정 유저의 모든 play_schedules를 삭제한다
 */
export const deleteByUserId = async (userId: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('user_play_schedules')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to delete user_play_schedules: ${error.message}`);
  }
};

/**
 * 여러 play_schedule 레코드를 일괄 삽입한다
 * - rows가 빈 배열인 경우 아무 작업도 하지 않음
 */
export const insertMany = async (rows: PlayScheduleRow[]): Promise<void> => {
  if (rows.length === 0) {
    return;
  }

  const { error } = await supabaseAdmin
    .from('user_play_schedules')
    .insert(rows);

  if (error) {
    throw new Error(`Failed to insert user_play_schedules: ${error.message}`);
  }
};
