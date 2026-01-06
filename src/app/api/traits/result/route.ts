import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
// import { createClient } from '@/lib/supabase/server'; // TODO: server.ts 리팩토링 후 재도입
import { Database } from '@/types/supabase';
import { getTraitsResult } from '@/services/traits/getTraitsResult.service';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}


export const dynamic = 'force-dynamic';

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
    const cookieStore = cookies();
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;
    const cookieToken = cookieStore.get('sb-access-token')?.value;
    const accessToken = cookieToken || headerToken;

    if (!accessToken) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
          detail: 'Authentication required',
        },
        { status: 401 }
      );
    }

    // TODO: server.ts 개선 후 공용 SSR client 재사용 검토
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

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
