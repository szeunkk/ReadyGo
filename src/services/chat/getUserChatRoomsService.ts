import * as chatRepository from '@/repositories/chat.repository';
import { ChatFetchError } from '@/commons/errors/chat/chatErrors';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { ChatRoomListItem } from '@/repositories/chat.repository';

/**
 * 사용자의 채팅방 목록 조회 Service
 *
 * 책임:
 * - 사용자가 참여한 모든 채팅방 목록 조회
 * - Repository 에러 처리
 *
 * 비책임:
 * - 권한 체크
 */
export const getUserChatRoomsService = async (
  client: SupabaseClient<Database>,
  userId: string
): Promise<ChatRoomListItem[]> => {
  try {
    const chatRooms = await chatRepository.getUserChatRooms(client, userId);
    return chatRooms;
  } catch (error) {
    throw new ChatFetchError(
      'rooms',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

