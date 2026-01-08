import * as chatRepository from '@/repositories/chat.repository';
import { ChatFetchError } from '@/commons/errors/chat/chatErrors';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { ChatRoom } from '@/types/chat';

/**
 * 두 사용자 간의 1:1 채팅방 조회 Service
 *
 * 책임:
 * - 두 사용자 간 기존 채팅방 조회
 * - Repository 에러 처리
 *
 * 비책임:
 * - 채팅방 생성
 * - 권한 체크
 */
export const getChatRoomByMembersService = async (
  client: SupabaseClient<Database>,
  userId1: string,
  userId2: string
): Promise<ChatRoom | null> => {
  try {
    const room = await chatRepository.getChatRoomByMembers(
      client,
      userId1,
      userId2
    );

    return room;
  } catch (error) {
    throw new ChatFetchError(
      'room',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
