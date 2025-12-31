import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  markRoomAsRead,
  markMessagesAsRead,
} from '@/repositories/chat.repository';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * 채팅방의 메시지를 읽음 처리
 * POST /api/chat/message/read
 * body: { roomId: number, messageIds?: number[] }
 * - messageIds가 없으면: 해당 채팅방의 모든 메시지를 읽음 처리
 * - messageIds가 있으면: 특정 메시지들만 읽음 처리
 */
export const POST = async (request: NextRequest) => {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: '사용자 정보를 가져올 수 없습니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { roomId, messageIds } = body;

    if (!roomId || typeof roomId !== 'number') {
      return NextResponse.json(
        { error: 'roomId는 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    // messageIds가 제공된 경우: 특정 메시지들만 읽음 처리
    if (messageIds && Array.isArray(messageIds)) {
      // messageIds 유효성 검사
      if (
        !messageIds.every((id: unknown) => typeof id === 'number' && !isNaN(id))
      ) {
        return NextResponse.json(
          { error: 'messageIds는 숫자 배열이어야 합니다.' },
          { status: 400 }
        );
      }

      if (messageIds.length === 0) {
        return NextResponse.json({ success: true }, { status: 200 });
      }

      // Repository 함수를 통해 특정 메시지들 읽음 처리
      await markMessagesAsRead(roomId, user.id, messageIds);
    } else {
      // messageIds가 없는 경우: 해당 채팅방의 모든 메시지를 읽음 처리
      try {
        await markRoomAsRead(roomId, user.id);
      } catch (markError) {
        console.error('markRoomAsRead error:', markError);
        throw markError;
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('API /api/chat/message/read POST error:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : error instanceof Object && 'message' in error
          ? String(error.message)
          : 'Unknown error';

    // 에러 상세 정보 로깅
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        error: `메시지 읽음 처리 실패: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
};
