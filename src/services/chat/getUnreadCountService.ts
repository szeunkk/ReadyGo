import * as chatRepository from '@/repositories/chat.repository';
import {
  ChatFetchError,
  ChatValidationError,
} from '@/commons/errors/chat/chatErrors';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * 채팅방의 읽지 않은 메시지 수 조회 Service
 *
 * 책임:
 * - 입력 검증 (roomId, userId)
 * - Repository 에러 처리
 *
 * 비책임:
 * - 권한 체크
 */
export const getUnreadCountService = async (
  client: SupabaseClient<Database>,
  roomId: number,
  userId: string
): Promise<number> => {
  // 입력 검증
  if (typeof roomId !== 'number' || isNaN(roomId) || roomId <= 0) {
    throw new ChatValidationError('roomId는 양수여야 합니다.');
  }

  if (!userId || typeof userId !== 'string') {
    throw new ChatValidationError('userId는 필수입니다.');
  }

  try {
    const count = await chatRepository.getUnreadCount(client, roomId, userId);
    return count;
  } catch (error) {
    throw new ChatFetchError(
      'messages',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
