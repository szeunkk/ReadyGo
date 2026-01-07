import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { syncSteamGames } from '../_shared/services/steam/syncSteamGames.service.ts';

/**
 * Steam 배치 동기화 Edge Function
 *
 * 책임:
 * - Service Role Supabase Client 생성
 * - steam_id 있는 유저 목록 조회
 * - 각 유저별 syncSteamGames Service 호출
 * - 결과 집계 및 반환
 *
 * 비책임:
 * - Steam API 호출 (Service에서 처리)
 * - DB 저장 로직 (Repository에서 처리)
 * - SteamID 검증 (Service에서 처리)
 */

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

type BatchSyncResult = {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ userId: string; status: string }>;
};

/**
 * steam_id가 있는 유저 목록 조회
 */
const fetchTargetUsers = async (supabase: ReturnType<typeof createClient>) => {
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('id')
    .not('steam_id', 'is', null)
    .limit(100);

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return users || [];
};

/**
 * 배치 동기화 실행
 */
const runBatchSync = async (
  supabase: ReturnType<typeof createClient>,
  users: Array<{ id: string }>
): Promise<BatchSyncResult> => {
  const results: BatchSyncResult = {
    total: users.length,
    success: 0,
    failed: 0,
    errors: [],
  };

  console.log(`[Batch Sync] Starting sync for ${users.length} users`);

  for (const user of users) {
    try {
      const result = await syncSteamGames(supabase, user.id);

      if (result.status === 'success') {
        results.success++;
        console.log(
          `[${user.id}] ✓ Success - ${result.syncedGamesCount} games`
        );
      } else {
        results.failed++;
        results.errors.push({
          userId: user.id,
          status: result.status,
        });
        console.log(`[${user.id}] ✗ Failed - ${result.status}`);
      }
    } catch (error) {
      // 예상치 못한 에러 (Service는 throw하지 않지만 만약을 위해)
      results.failed++;
      results.errors.push({
        userId: user.id,
        status: 'unexpected_error',
      });
      console.error(`[${user.id}] ✗ Unexpected error:`, error);
    }
  }

  console.log(
    `[Batch Sync] Completed - Success: ${results.success}, Failed: ${results.failed}`
  );

  return results;
};

/**
 * Edge Function 핸들러
 */
Deno.serve(async (req) => {
  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('[Batch Sync] Starting batch sync...');

    // 1. Service Role Supabase Client 생성
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 2. 대상 유저 조회
    const users = await fetchTargetUsers(supabase);

    if (users.length === 0) {
      return new Response(
        JSON.stringify({
          total: 0,
          success: 0,
          failed: 0,
          errors: [],
          message: 'No users with steam_id found',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // 3. 배치 동기화 실행
    const results = await runBatchSync(supabase, users);

    // 4. 결과 반환
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('[Batch Sync] Fatal error:', error);

    return new Response(
      JSON.stringify({
        error: 'Batch sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
