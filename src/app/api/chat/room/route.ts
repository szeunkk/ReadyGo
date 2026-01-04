import { NextRequest, NextResponse } from 'next/server';
import { createChatRoom } from '@/repositories/chat.repository';

/**
 * 채팅방 생성
 * POST /api/chat/room
 * body: { memberIds: string[] }
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { memberIds } = body;

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length !== 2) {
      return NextResponse.json(
        { error: 'memberIds는 2명의 사용자 ID 배열이어야 합니다.' },
        { status: 400 }
      );
    }

    // 채팅방 생성 (Repository 함수 사용)
    const newRoom = await createChatRoom(memberIds);

    return NextResponse.json({ data: newRoom }, { status: 201 });
  } catch (error) {
    console.error('Chat room create API error:', error);

    // 에러 메시지 추출
    const errorMessage =
      error instanceof Error ? error.message : '채팅방 생성에 실패했습니다.';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};


