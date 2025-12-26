import { supabaseAdmin } from '@/lib/supabase/server';

export type SteamGameSyncStatus = 'success' | 'skipped' | 'failed';

export async function insertSteamGameSyncLog(params: {
  app_id: number;
  user_id?: string;
  status: SteamGameSyncStatus;
  reason?: string;
}) {
  try {
    await supabaseAdmin.from('steam_game_sync_logs').insert({
      app_id: params.app_id,
      user_id: params.user_id ?? null,
      status: params.status,
      reason: params.reason ?? null,
    });
  } catch {
    // ❗ 로그 실패로 메인 로직이 깨지면 안 됨
  }
}
