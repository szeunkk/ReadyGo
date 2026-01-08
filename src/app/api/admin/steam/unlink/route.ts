import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

type UnlinkRequestBody = {
  userId: string;
};

/**
 * DELETE /api/admin/steam/unlink
 *
 * 책임:
 * - 관리자용 Steam ID 연결 해제 엔드포인트
 * - user_profiles 테이블의 steam_id를 NULL로 설정
 * - steam_sync_logs 테이블에 로그 기록
 *
 * 용도:
 * - 잘못 연결된 Steam ID 해제
 * - 테스트 데이터 정리
 */
export const DELETE = async (request: NextRequest) => {
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
    let body: UnlinkRequestBody;
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

    const { userId } = body;

    // 4. 필수 파라미터 검증
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId는 필수 항목입니다.',
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

    // 5. 유저 존재 확인 및 현재 steam_id 조회
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

    // 이미 연결된 Steam ID가 없는 경우
    if (!userProfile.steam_id) {
      return NextResponse.json(
        {
          success: false,
          error: '이 유저는 연결된 Steam ID가 없습니다.',
          errorCode: 'no_steam_id',
        },
        { status: 400 }
      );
    }

    const previousSteamId = userProfile.steam_id;

    // 6. user_profiles 업데이트 (steam_id를 NULL로)
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({ steam_id: null })
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

    // 7. steam_sync_logs 기록
    const { error: logError } = await supabaseAdmin
      .from('steam_sync_logs')
      .insert({
        user_id: userId,
        status: 'admin_unlinked',
        synced_games_count: 0,
        synced_at: new Date().toISOString(),
      });

    if (logError) {
      console.error('Sync log insert error:', logError);
      // 로그 실패는 치명적이지 않으므로 경고만 출력
    }

    // 8. 성공 응답
    return NextResponse.json(
      {
        success: true,
        userId,
        previousSteamId,
        message: 'Steam ID 연결이 성공적으로 해제되었습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin steam unlink API error:', error);
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
