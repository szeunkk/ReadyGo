import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserChatRoomsService } from '@/services/chat/getUserChatRoomsService';
import { ChatFetchError } from '@/commons/errors/chat/chatErrors';

export const dynamic = 'force-dynamic';

/**
 * GET /api/chat/rooms
 *
 * 책임:
 * - 인증 확인 (supabase.auth.getUser)
 * - userId는 auth.uid()에서만 추출
 * - getUserChatRoomsService 호출
 * - Service 에러를 HTTP 상태 코드로 매핑
 * - 응답 데이터는 Service 반환값 그대로 전달
 *
 * 비책임:
 * - Service 로직 재구현 금지
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

    // 3. userId는 auth.uid()에서만 추출
    const userId = user.id;

    // 4. Service 호출
    const chatRooms = await getUserChatRoomsService(supabase as any, userId);

    // 5. 정상 응답
    return NextResponse.json({ data: chatRooms }, { status: 200 });
  } catch (error) {
    // 6. Service 에러 매핑

    // 6-1. ChatFetchError → 500
    if (error instanceof ChatFetchError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // 6-2. 기타 예상치 못한 에러 → 500 (fallback)
    return NextResponse.json(
      {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
