import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

type BulkLinkUser = {
  userId: string;
  steamId: string;
};

type BulkLinkRequestBody = {
  users: BulkLinkUser[];
  force?: boolean;
};

type BulkLinkResult = {
  userId: string;
  steamId: string;
  success: boolean;
  error?: string;
  errorCode?: string;
};

/**
 * POST /api/admin/steam/bulk-link
 *
 * 책임:
 * - 여러 유저의 Steam ID를 한 번에 연동
 * - 각 유저별 결과를 개별적으로 반환
 * - 일부 실패해도 나머지는 계속 처리
 *
 * 용도:
 * - 대량의 목업 데이터 생성
 * - 마이그레이션 작업
 */
export const POST = async (request: NextRequest) => {
  try {
    // 1. 프로덕션 환경 체크
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: '프로덕션 환경에서는 사용할 수 없습니다.',
          errorCode: 'production_disabled',
        },
        { status: 403 }
      );
    }

    // 2. API Key 검증
    const apiKey = request.headers.get('x-admin-api-key');
    const validApiKey = process.env.ADMIN_API_KEY;

    if (!validApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'ADMIN_API_KEY가 설정되지 않았습니다.',
          errorCode: 'server_config_error',
        },
        { status: 500 }
      );
    }

    if (!apiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: '유효하지 않은 API Key입니다.',
          errorCode: 'invalid_api_key',
        },
        { status: 401 }
      );
    }

    // 3. 요청 본문 파싱
    let body: BulkLinkRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: '요청 본문을 파싱할 수 없습니다.',
          errorCode: 'invalid_json',
        },
        { status: 400 }
      );
    }

    const { users, force = false } = body;

    // 4. 필수 파라미터 검증
    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'users 배열은 필수이며 비어있지 않아야 합니다.',
          errorCode: 'missing_parameters',
        },
        { status: 400 }
      );
    }

    // 최대 처리 개수 제한 (성능 보호)
    const MAX_BATCH_SIZE = 100;
    if (users.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `한 번에 최대 ${MAX_BATCH_SIZE}개까지만 처리할 수 있습니다.`,
          errorCode: 'batch_size_exceeded',
        },
        { status: 400 }
      );
    }

    // 5. 각 유저별로 처리
    const results: BulkLinkResult[] = [];
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const steamIdRegex = /^\d{17}$/;

    for (const user of users) {
      const { userId, steamId } = user;

      // 기본 검증
      if (!userId || !steamId) {
        results.push({
          userId: userId || 'unknown',
          steamId: steamId || 'unknown',
          success: false,
          error: 'userId와 steamId는 필수 항목입니다.',
          errorCode: 'missing_parameters',
        });
        continue;
      }

      // UUID 형식 검증
      if (!uuidRegex.test(userId)) {
        results.push({
          userId,
          steamId,
          success: false,
          error: 'userId는 유효한 UUID 형식이어야 합니다.',
          errorCode: 'invalid_user_id',
        });
        continue;
      }

      // Steam ID 형식 검증
      if (!steamIdRegex.test(steamId)) {
        results.push({
          userId,
          steamId,
          success: false,
          error: 'steamId는 17자리 숫자여야 합니다.',
          errorCode: 'invalid_steam_id',
        });
        continue;
      }

      try {
        // 유저 존재 확인
        const { data: userProfile, error: userCheckError } = await supabaseAdmin
          .from('user_profiles')
          .select('id, steam_id')
          .eq('id', userId)
          .maybeSingle();

        if (userCheckError) {
          console.error('User check error:', userCheckError);
          results.push({
            userId,
            steamId,
            success: false,
            error: '유저 조회 중 오류가 발생했습니다.',
            errorCode: 'user_check_failed',
          });
          continue;
        }

        if (!userProfile) {
          results.push({
            userId,
            steamId,
            success: false,
            error: '존재하지 않는 유저입니다.',
            errorCode: 'user_not_found',
          });
          continue;
        }

        // 중복 검증
        const { data: existingProfiles, error: duplicateCheckError } =
          await supabaseAdmin
            .from('user_profiles')
            .select('id, nickname')
            .eq('steam_id', steamId)
            .neq('id', userId)
            .limit(1);

        if (duplicateCheckError) {
          console.error('Duplicate check error:', duplicateCheckError);
          results.push({
            userId,
            steamId,
            success: false,
            error: '중복 검사 중 오류가 발생했습니다.',
            errorCode: 'duplicate_check_failed',
          });
          continue;
        }

        if (existingProfiles && existingProfiles.length > 0) {
          if (!force) {
            const [existingUser] = existingProfiles;
            results.push({
              userId,
              steamId,
              success: false,
              error: `이 Steam ID는 이미 다른 유저(${existingUser.nickname || existingUser.id})에게 연결되어 있습니다.`,
              errorCode: 'duplicate_steam_id',
            });
            continue;
          } else {
            console.warn(
              `[ADMIN BULK] Forcing Steam ID link. SteamID ${steamId} was already linked to user ${existingProfiles[0].id}, now linking to ${userId}`
            );
          }
        }

        // user_profiles 업데이트
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({ steam_id: steamId })
          .eq('id', userId);

        if (updateError) {
          console.error('Profile update error:', updateError);
          results.push({
            userId,
            steamId,
            success: false,
            error: '프로필 업데이트에 실패했습니다.',
            errorCode: 'update_failed',
          });
          continue;
        }

        // steam_sync_logs 기록
        const { data: existingLogs } = await supabaseAdmin
          .from('steam_sync_logs')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'admin_linked')
          .limit(1);

        if (!existingLogs || existingLogs.length === 0) {
          const { error: logError } = await supabaseAdmin
            .from('steam_sync_logs')
            .insert({
              user_id: userId,
              status: 'admin_linked',
              synced_games_count: 0,
              synced_at: new Date().toISOString(),
            });

          if (logError) {
            console.error('Sync log insert error:', logError);
          }
        }

        // 성공
        results.push({
          userId,
          steamId,
          success: true,
        });
      } catch (error) {
        console.error(`Error processing user ${userId}:`, error);
        results.push({
          userId,
          steamId,
          success: false,
          error: '처리 중 오류가 발생했습니다.',
          errorCode: 'processing_error',
        });
      }
    }

    // 6. 결과 집계
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return NextResponse.json(
      {
        success: true,
        message: `총 ${users.length}개 중 ${successCount}개 성공, ${failureCount}개 실패`,
        summary: {
          total: users.length,
          success: successCount,
          failure: failureCount,
        },
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin steam bulk-link API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다.',
        errorCode: 'server_error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
