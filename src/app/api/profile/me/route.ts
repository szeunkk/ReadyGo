import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
// import { createClient } from '@/lib/supabase/server'; // TODO: server.ts 리팩토링 후 재도입
import { Database } from '@/types/supabase';
import { getMyProfileService } from '@/services/profile/getMyProfileService';
import {
  ProfileNotFoundError,
  ProfileDataInconsistencyError,
  ProfileFetchError,
} from '@/commons/errors/profile/profileErrors';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const dynamic = 'force-dynamic';

/**
 * GET /api/profile/me
 *
 * 책임:
 * - 인증 확인 (supabase.auth.getUser)
 * - userId는 auth.uid()에서만 추출
 * - getMyProfileService 호출
 * - Service 에러를 HTTP 상태 코드로 매핑
 * - 응답 데이터는 Service 반환값 그대로 전달
 *
 * 비책임:
 * - Service 로직 재구현 금지
 * - UI 가공, ViewModel 변환, 상태 판단 로직 금지
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

    // TODO: server.ts 리팩토링 이후 SSR client 재도입 검토
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

    // 3. userId는 auth.uid()에서만 추출 (request param/query/body 사용 안 함)
    const userId = user.id;

    // 4. Service 호출
    const profile = await getMyProfileService(supabase, userId);

    // 5. 정상 응답: ProfileCoreDTO 그대로 반환
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    // 6. Service 에러 매핑

    // 6-1. ProfileNotFoundError → 404
    if (error instanceof ProfileNotFoundError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: 404 }
      );
    }

    // 6-2. ProfileDataInconsistencyError → 500
    if (error instanceof ProfileDataInconsistencyError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // 6-3. ProfileFetchError → 500
    if (error instanceof ProfileFetchError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // 6-4. 기타 예상치 못한 에러 → 500 (fallback)
    return NextResponse.json(
      {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
