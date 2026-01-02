import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMyProfileService } from '@/services/profile/getMyProfileService';
import {
  ProfileNotFoundError,
  ProfileDataInconsistencyError,
  ProfileFetchError,
} from '@/commons/errors/profile/profileErrors';

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
          message: 'Profile not found',
          detail: error.message,
        },
        { status: 404 }
      );
    }

    // 6-2. ProfileDataInconsistencyError → 500
    if (error instanceof ProfileDataInconsistencyError) {
      return NextResponse.json(
        {
          message: 'Profile data inconsistency',
          detail: error.message,
        },
        { status: 500 }
      );
    }

    // 6-3. ProfileFetchError → 500
    if (error instanceof ProfileFetchError) {
      return NextResponse.json(
        {
          message: 'Profile fetch failed',
          detail: error.message,
        },
        { status: 500 }
      );
    }

    // 6-4. 기타 예상치 못한 에러 → 500
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
