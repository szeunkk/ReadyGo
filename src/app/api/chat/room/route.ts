import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '../utils/auth';
import { createChatRoomService } from '@/services/chat/createChatRoomService';
import {
  ChatCreateError,
  ChatFetchError,
  ChatValidationError,
} from '@/commons/errors/chat/chatErrors';

export const dynamic = 'force-dynamic';

/**
 * POST /api/chat/room
 *
 * 책임:
 * - 인증 확인 (supabase.auth.getUser)
 * - createChatRoomService 호출
 * - Service 에러를 HTTP 상태 코드로 매핑
 * - 응답 데이터는 Service 반환값 그대로 전달
 *
 * 비책임:
 * - Service 로직 재구현 금지
 */
export const POST = async (request: NextRequest) => {
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

    // 세션 확인 (디버깅용)
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log(
      '[API] /api/chat/room POST - Session check before service call:',
      {
        hasSession: !!session,
        userId: session?.user?.id || user?.id,
        accessToken: session?.access_token ? 'present' : 'missing',
      }
    );

    // 3. 요청 본문 파싱
    const body = await request.json();
    const { memberIds } = body;

    // 4. Service 호출
    const newRoom = await createChatRoomService(supabase, memberIds);

    // 5. 정상 응답
    return NextResponse.json({ data: newRoom }, { status: 201 });
  } catch (error) {
    // 서버 측 에러 로깅
    console.error('[API] /api/chat/room POST error:', error);

    // Supabase 에러인 경우 상세 정보 로깅
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('[API] Error details:', {
        message: (error as any).message,
        details: (error as any).details,
        hint: (error as any).hint,
        code: (error as any).code,
      });
    }

    // 6. Service 에러 매핑

    // 6-1. ChatValidationError → 400
    if (error instanceof ChatValidationError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: 400 }
      );
    }

    // 6-2. ChatCreateError → 500
    if (error instanceof ChatCreateError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // 6-3. ChatFetchError → 500
    if (error instanceof ChatFetchError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // 6-4. 기타 예상치 못한 에러 → 500 (fallback)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorDetails =
      error && typeof error === 'object' && 'details' in error
        ? (error as any).details
        : undefined;
    const errorHint =
      error && typeof error === 'object' && 'hint' in error
        ? (error as any).hint
        : undefined;

    return NextResponse.json(
      {
        code: 'INTERNAL_ERROR',
        message: errorMessage,
        ...(errorDetails && { details: errorDetails }),
        ...(errorHint && { hint: errorHint }),
      },
      { status: 500 }
    );
  }
};
