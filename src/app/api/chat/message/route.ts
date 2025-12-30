import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  sendMessage as sendMessageToRepository,
  getChatMessages,
} from '@/repositories/chat.repository';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * 메시지 목록 조회
 * GET /api/chat/message?roomId={roomId}&limit={limit}&offset={offset}
 */
export const GET = async (request: NextRequest) => {
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

    const { searchParams } = new URL(request.url);
    const roomIdParam = searchParams.get('roomId');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    if (!roomIdParam) {
      return NextResponse.json(
        { error: 'roomId는 필수입니다.' },
        { status: 400 }
      );
    }

    const roomId = parseInt(roomIdParam, 10);
    if (isNaN(roomId)) {
      return NextResponse.json(
        { error: 'roomId는 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 50;
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'limit은 1 이상의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'offset은 0 이상의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    // Repository 함수를 통해 메시지 조회
    const messages = await getChatMessages(roomId, limit, offset);

    return NextResponse.json({ data: messages }, { status: 200 });
  } catch (error) {
    console.error('API /api/chat/message GET error:', error);
    return NextResponse.json(
      {
        error: `메시지 조회 실패: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
      { status: 500 }
    );
  }
};

/**
 * 메시지 전송
 * POST /api/chat/message
 * body: { roomId: number, content: string, contentType?: string }
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
    const { roomId, content, contentType = 'text' } = body;

    if (!roomId || typeof roomId !== 'number') {
      return NextResponse.json(
        { error: 'roomId는 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: 'content는 비어있을 수 없습니다.' },
        { status: 400 }
      );
    }

    // Repository 함수를 통해 메시지 저장
    const savedMessage = await sendMessageToRepository(
      roomId,
      user.id,
      content.trim(),
      contentType
    );

    return NextResponse.json({ data: savedMessage }, { status: 201 });
  } catch (error) {
    console.error('API /api/chat/message POST error:', error);
    return NextResponse.json(
      {
        error: `메시지 전송 실패: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
      { status: 500 }
    );
  }
};
