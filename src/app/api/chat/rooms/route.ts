import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserChatRooms } from '@/repositories/chat.repository';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * 현재 사용자가 참여한 모든 채팅방 목록 조회
 * GET /api/chat/rooms
 */
export const GET = async (_request: NextRequest) => {
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

    // Repository 함수를 통해 채팅방 목록 조회
    const chatRooms = await getUserChatRooms(user.id);

    return NextResponse.json({ data: chatRooms }, { status: 200 });
  } catch (error) {
    console.error('API /api/chat/rooms GET error:', error);
    return NextResponse.json(
      {
        error: `채팅방 목록 조회 실패: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
      { status: 500 }
    );
  }
};
