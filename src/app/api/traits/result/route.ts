import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTraitsResult } from '@/services/traits/getTraitsResult.service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/traits/result
 *
 * 책임:
 * - 인증 확인
 * - Service 호출
 * - 응답 반환
 */

export const GET = async (_request: NextRequest) => {
  try {
    // 1. Supabase 클라이언트 생성 (쿠키 자동 처리)
    const supabase = createClient();

    // 2. 사용자 정보 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
          detail: 'Authentication required',
        },
        { status: 401 }
      );
    }

    // 3. user_id는 auth.user.id만 사용 (query/body 무시)
    const userId = user.id;

    // 4. Service 호출
    const result = await getTraitsResult(supabase, userId);

    // 5. 성공 응답
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // 6. user_traits row가 없으면 404 반환
    if (error instanceof Error && error.message === 'traits not found') {
      return NextResponse.json(
        {
          message: 'traits not found',
          detail: 'User traits data does not exist',
        },
        { status: 404 }
      );
    }

    // 7. 기타 에러는 500 반환
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
