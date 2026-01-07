import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * steam_sync_logs Repository
 * 책임: steam_sync_logs 테이블 접근 전담
 */

export type SyncLogStatus =
  | 'success'
  | 'failed'
  | 'private'
  | 'not_linked'
  | 'invalid_steam_id';

export type SyncLogInput = {
  userId: string;
  status: SyncLogStatus;
  syncedGamesCount: number;
};

/**
 * steam_sync_logs 테이블에 로그 기록
 *
 * 책임:
 * - 모든 sync 시도에 대해 로그 삽입
 * - DB 접근만 수행
 *
 * 비책임:
 * - 로그 내용 판단
 * - 비즈니스 로직
 *
 * @param client - Supabase 클라이언트
 * @param params - 로그 입력 데이터
 * @returns Supabase 응답 구조를 그대로 반환
 */
export const insertLog = async (
  client: SupabaseClient<Database>,
  params: SyncLogInput
) => {
  return await client.from('steam_sync_logs').insert({
    user_id: params.userId,
    status: params.status,
    synced_games_count: params.syncedGamesCount,
    synced_at: new Date().toISOString(),
  });
};
