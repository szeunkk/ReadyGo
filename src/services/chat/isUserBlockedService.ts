import * as chatRepository from '@/repositories/chat.repository';
import {
  ChatFetchError,
  ChatValidationError,
} from '@/commons/errors/chat/chatErrors';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * 사용자 차단 여부 확인 Service
 *
 * 책임:
 * - 입력 검증 (userId, otherUserId)
 * - Repository 에러 처리
 *
 * 비책임:
 * - 권한 체크
 */
export const isUserBlockedService = async (
  client: SupabaseClient<Database>,
  userId: string,
  otherUserId: string
): Promise<boolean> => {
  // 입력 검증
  if (!userId || typeof userId !== 'string') {
    throw new ChatValidationError('userId는 필수입니다.');
  }

  if (!otherUserId || typeof otherUserId !== 'string') {
    throw new ChatValidationError('otherUserId는 필수입니다.');
  }

  try {
    const isBlocked = await chatRepository.isUserBlocked(
      client,
      userId,
      otherUserId
    );
    return isBlocked;
  } catch (error) {
    throw new ChatFetchError(
      'members',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
