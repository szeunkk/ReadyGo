import { supabaseAdmin } from '@/lib/supabase/admin';

export type SteamGameSyncStatus = 'success' | 'skipped' | 'failed';

/* =========================
 * INSERT LOG
 * ========================= */
export const insertSteamGameSyncLog = async (params: {
  app_id: number;
  user_id?: string;
  status: SteamGameSyncStatus;
  reason?: string;
}) => {
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
};

/* =========================
 * SELECT: SUCCESS APP IDS
 * ========================= */
export const getSuccessAppIds = async (appIds: number[]) => {
  if (appIds.length === 0) {
    return new Set<number>();
  }

  const { data, error } = await supabaseAdmin
    .from('steam_game_sync_logs')
    .select('app_id')
    .eq('status', 'success')
    .in('app_id', appIds);

  if (error) {
    throw error;
  }

  return new Set<number>((data ?? []).map((r) => r.app_id).filter((id): id is number => id !== null));
};
