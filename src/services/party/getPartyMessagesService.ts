import * as partyMessagesRepository from '@/repositories/partyMessages.repository';
import {
  ChatFetchError,
  ChatValidationError,
} from '@/commons/errors/chat/chatErrors';
import type { Database } from '@/types/supabase';

type PartyMessage = Database['public']['Tables']['party_messages']['Row'];

/**
 * 파티 메시지 목록 조회 Service
 *
 * 책임:
 * - 입력 검증 (postId, limit, offset)
 * - Repository 에러 처리
 *
 * 비책임:
 * - 권한 체크
 */
export const getPartyMessagesService = async (
  postId: number,
  limit: number = 50,
  offset: number = 0
): Promise<PartyMessage[]> => {
  // 입력 검증
  if (typeof postId !== 'number' || isNaN(postId) || postId <= 0) {
    throw new ChatValidationError('postId는 양수여야 합니다.');
  }

  if (typeof limit !== 'number' || isNaN(limit) || limit < 1) {
    throw new ChatValidationError('limit은 1 이상의 숫자여야 합니다.');
  }

  if (typeof offset !== 'number' || isNaN(offset) || offset < 0) {
    throw new ChatValidationError('offset은 0 이상의 숫자여야 합니다.');
  }

  try {
    const messages = await partyMessagesRepository.getPartyMessages(
      postId,
      limit,
      offset
    );
    return messages;
  } catch (error) {
    throw new ChatFetchError(
      'messages',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
