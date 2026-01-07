import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

type LinkRequestBody = {
  userId: string;
  steamId: string;
  force?: boolean;
};

/**
 * POST /api/admin/steam/link
 *
 * 책임:
 * - 관리자용 Steam ID 수동 연동 엔드포인트
 * - user_profiles 테이블의 steam_id 업데이트
 * - steam_sync_logs 테이블에 로그 기록
 *
 * 용도:
 * - 목업 데이터 생성
 * - 개발/테스트 환경에서 빠른 데이터 세팅
 *
 * 보안:
 * - API Key 기반 인증
 * - 개발 환경에서만 사용 권장
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
    let body: LinkRequestBody;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: '요청 본문을 파싱할 수 없습니다.',
          errorCode: 'invalid_json',
        },
        { status: 400 }
      );
    }

    const { userId, steamId, force = false } = body;

    // 4. 필수 파라미터 검증
    if (!userId || !steamId) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId와 steamId는 필수 항목입니다.',
          errorCode: 'missing_parameters',
        },
        { status: 400 }
      );
    }

    // UUID 형식 검증
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId는 유효한 UUID 형식이어야 합니다.',
          errorCode: 'invalid_user_id',
        },
        { status: 400 }
      );
    }

    // Steam ID 형식 검증 (17자리 숫자)
    const steamIdRegex = /^\d{17}$/;
    if (!steamIdRegex.test(steamId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'steamId는 17자리 숫자여야 합니다.',
          errorCode: 'invalid_steam_id',
        },
        { status: 400 }
      );
    }

    // 5. 유저 존재 확인
    const { data: userProfile, error: userCheckError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, steam_id')
      .eq('id', userId)
      .maybeSingle();

    if (userCheckError) {
      console.error('User check error:', userCheckError);
      return NextResponse.json(
        {
          success: false,
          error: '유저 조회 중 오류가 발생했습니다.',
          errorCode: 'user_check_failed',
        },
        { status: 500 }
      );
    }

    if (!userProfile) {
      return NextResponse.json(
        {
          success: false,
          error: '존재하지 않는 유저입니다.',
          errorCode: 'user_not_found',
        },
        { status: 404 }
      );
    }

    // 6. 중복 검증 (다른 유저에게 이미 연결된 Steam ID인지 확인)
    const { data: existingProfiles, error: duplicateCheckError } =
      await supabaseAdmin
        .from('user_profiles')
        .select('id, nickname')
        .eq('steam_id', steamId)
        .neq('id', userId)
        .limit(1);

    if (duplicateCheckError) {
      console.error('Duplicate check error:', duplicateCheckError);
      return NextResponse.json(
        {
          success: false,
          error: '중복 검사 중 오류가 발생했습니다.',
          errorCode: 'duplicate_check_failed',
        },
        { status: 500 }
      );
    }

    // 다른 유저에게 이미 연결되어 있는 경우
    if (existingProfiles && existingProfiles.length > 0) {
      if (!force) {
        const existingUser = existingProfiles[0];
        return NextResponse.json(
          {
            success: false,
            error: `이 Steam ID는 이미 다른 유저(${existingUser.nickname || existingUser.id})에게 연결되어 있습니다.`,
            errorCode: 'duplicate_steam_id',
            existingUserId: existingUser.id,
          },
          { status: 409 }
        );
      } else {
        // force=true인 경우 경고 로그 출력
        console.warn(
          `[ADMIN] Forcing Steam ID link. SteamID ${steamId} was already linked to user ${existingProfiles[0].id}, now linking to ${userId}`
        );
      }
    }

    // 7. user_profiles 업데이트
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({ steam_id: steamId })
      .eq('id', userId);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: '프로필 업데이트에 실패했습니다.',
          errorCode: 'update_failed',
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    // 8. steam_sync_logs 기록
    // 기존 'admin_linked' 로그가 있는지 확인
    const { data: existingLogs } = await supabaseAdmin
      .from('steam_sync_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'admin_linked')
      .limit(1);

    // 기존 로그가 없을 때만 insert
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
        // 로그 실패는 치명적이지 않으므로 경고만 출력
      }
    }

    // 9. 성공 응답
    return NextResponse.json(
      {
        success: true,
        userId,
        steamId,
        message: 'Steam ID가 성공적으로 업데이트되었습니다.',
        forced: force && existingProfiles && existingProfiles.length > 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin steam link API error:', error);
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

