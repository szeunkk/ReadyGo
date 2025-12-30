import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getTraitsResult } from '@/services/traits/getTraitsResult.service';

/**
 * GET /api/traits/result
 *
 * 책임:
 * - 인증 확인
 * - Service 호출
 * - 응답 반환
 */

export const GET = async (request: NextRequest) => {
  try {
    // 1. 인증 확인 (쿠키 우선, Authorization 헤더 대체)
    const cookieStore = await cookies();
    const accessToken =
      cookieStore.get('sb-access-token')?.value ||
      request.headers.get('Authorization')?.replace('Bearer ', '') ||
      '';

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    // 2. 비로그인 상태면 즉시 401 반환
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
    const result = await getTraitsResult(userId);

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
