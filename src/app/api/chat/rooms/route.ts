import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '../utils/auth';
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
    // 1. 인증된 클라이언트 생성
    const {
      supabase,
      user,
      error: authError,
    } = await createAuthenticatedClient();

    if (authError || !supabase || !user) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
          detail: 'Authentication required',
        },
        { status: 401 }
      );
    }

    // 2. userId는 auth.uid()에서만 추출
    const userId = user.id;

    // 3. Service 호출
    const chatRooms = await getUserChatRoomsService(supabase, userId);

    // 4. 정상 응답
    return NextResponse.json({ data: chatRooms }, { status: 200 });
  } catch (error) {
    // 5. Service 에러 매핑

    // 5-1. ChatFetchError → 500
    if (error instanceof ChatFetchError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // 5-2. 기타 예상치 못한 에러 → 500 (fallback)
    return NextResponse.json(
      {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
