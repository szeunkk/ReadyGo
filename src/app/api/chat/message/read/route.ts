import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { markRoomAsReadService } from '@/services/chat/markRoomAsReadService';
import { markMessagesAsReadService } from '@/services/chat/markMessagesAsReadService';
import {
  ChatUpdateError,
  ChatValidationError,
} from '@/commons/errors/chat/chatErrors';

export const dynamic = 'force-dynamic';

/**
 * POST /api/chat/message/read
 *
 * 책임:
 * - 인증 확인 (supabase.auth.getUser)
 * - userId는 auth.uid()에서만 추출
 * - 요청 본문 파싱 (roomId, messageIds)
 * - messageIds가 없으면: markRoomAsReadService 호출
 * - messageIds가 있으면: markMessagesAsReadService 호출
 * - Service 에러를 HTTP 상태 코드로 매핑
 *
 * 비책임:
 * - Service 로직 재구현 금지
 */
export const POST = async (request: NextRequest) => {
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

    // 4. 요청 본문 파싱
    const body = await request.json();
    const { roomId, messageIds } = body;

    // 5. Service 호출
    // messageIds가 제공된 경우: 특정 메시지들만 읽음 처리
    if (messageIds && Array.isArray(messageIds)) {
      await markMessagesAsReadService(
        supabase as any,
        roomId,
        userId,
        messageIds
      );
    } else {
      // messageIds가 없는 경우: 해당 채팅방의 모든 메시지를 읽음 처리
      await markRoomAsReadService(supabase as any, roomId, userId);
    }

    // 6. 정상 응답
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // 7. Service 에러 매핑

    // 7-1. ChatValidationError → 400
    if (error instanceof ChatValidationError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: 400 }
      );
    }

    // 7-2. ChatUpdateError → 500
    if (error instanceof ChatUpdateError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // 7-3. 기타 예상치 못한 에러 → 500 (fallback)
    return NextResponse.json(
      {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
