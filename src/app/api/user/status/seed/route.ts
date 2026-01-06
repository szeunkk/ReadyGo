import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';

/**
 * user_status 시딩 API
 * POST /api/user/status/seed
 *
 * 로그인 직후 user_status 테이블에 해당 user의 row가 없을 수 있으므로,
 * 1회 upsert를 수행합니다.
 */
export const POST = async function (_request: NextRequest) {
  try {
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
    // 이미 row가 존재하는 경우 status를 덮어쓰지 않도록
    // onConflict: user_id로 설정
    // 타입 정의에 user_status가 없을 수 있으므로 any로 캐스팅
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: upsertError } = await (supabase as any)
      .from('user_status')
      .upsert(
        {
          user_id: user.id,
          status: 'online',
        },
        {
          onConflict: 'user_id',
        }
      );

    if (upsertError) {
      console.error('Failed to seed user_status:', upsertError);
      return NextResponse.json(
        { error: 'user_status 시딩에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Seed user_status API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
