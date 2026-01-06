import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';

/**
 * user_status 수동 변경 API
 * POST /api/user/status/update
 *
 * 유저가 직접 설정하는 상태를 Supabase DB에 upsert 수행합니다.
 */
export const POST = async function (request: NextRequest) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['online', 'away', 'dnd', 'offline'].includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태입니다.' },
        { status: 400 }
      );
    }

    // Supabase SSR 클라이언트 생성 (쿠키 자동 관리)
    const supabase = createClient();

    // 사용자 정보 조회 (토큰 갱신은 자동으로 처리됨)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // user_status 테이블에 upsert 수행
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: upsertError } = await (supabase as any)
      .from('user_status')
      .upsert(
        {
          user_id: user.id,
          status,
        },
        {
          onConflict: 'user_id',
        }
      );

    if (upsertError) {
      console.error('Failed to update user_status:', upsertError);
      return NextResponse.json(
        { error: 'user_status 업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update user_status API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
