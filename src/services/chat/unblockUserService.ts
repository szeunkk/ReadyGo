import * as chatRepository from '@/repositories/chat.repository';
import {
  ChatUpdateError,
  ChatValidationError,
} from '@/commons/errors/chat/chatErrors';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * 사용자 차단 해제 Service
 *
 * 책임:
 * - 입력 검증 (userId, blockedUserId)
 * - Repository 에러 처리
 *
 * 비책임:
 * - 권한 체크
 */
export const unblockUserService = async (
  client: SupabaseClient<Database>,
  userId: string,
  blockedUserId: string
): Promise<void> => {
  // 입력 검증
  if (!userId || typeof userId !== 'string') {
    throw new ChatValidationError('userId는 필수입니다.');
  }

  if (!blockedUserId || typeof blockedUserId !== 'string') {
    throw new ChatValidationError('blockedUserId는 필수입니다.');
  }

  try {
    await chatRepository.unblockUser(client, userId, blockedUserId);
  } catch (error) {
    throw new ChatUpdateError(
      'message',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
