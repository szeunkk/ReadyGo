import * as chatRepository from '@/repositories/chat.repository';
import {
  ChatUpdateError,
  ChatValidationError,
} from '@/commons/errors/chat/chatErrors';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * 메시지 읽음 처리 Service
 *
 * 책임:
 * - 입력 검증 (roomId, userId, messageIds)
 * - Repository 에러 처리
 *
 * 비책임:
 * - 권한 체크
 */
export const markMessagesAsReadService = async (
  client: SupabaseClient<Database>,
  roomId: number,
  userId: string,
  messageIds: number[]
): Promise<void> => {
  // 입력 검증
  if (typeof roomId !== 'number' || isNaN(roomId) || roomId <= 0) {
    throw new ChatValidationError('roomId는 양수여야 합니다.');
  }

  if (!userId || typeof userId !== 'string') {
    throw new ChatValidationError('userId는 필수입니다.');
  }

  if (!Array.isArray(messageIds)) {
    throw new ChatValidationError('messageIds는 배열이어야 합니다.');
  }

  // 빈 배열이면 아무것도 하지 않음
  if (messageIds.length === 0) {
    return;
  }

  // 유효한 messageIds만 필터링
  const validMessageIds = messageIds.filter(
    (id) => typeof id === 'number' && !isNaN(id) && id > 0
  );

  if (validMessageIds.length === 0) {
    return;
  }

  try {
    await chatRepository.markMessagesAsRead(
      client,
      roomId,
      userId,
      validMessageIds
    );
  } catch (error) {
    throw new ChatUpdateError(
      'read_status',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
