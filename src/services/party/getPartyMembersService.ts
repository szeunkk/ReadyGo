import * as partyMessagesRepository from '@/repositories/partyMessages.repository';
import {
  ChatFetchError,
  ChatValidationError,
} from '@/commons/errors/chat/chatErrors';
import type { Database } from '@/types/supabase';

type PartyMember = Database['public']['Tables']['party_members']['Row'];

/**
 * 파티 참여자 목록 조회 Service
 *
 * 책임:
 * - 입력 검증 (postId)
 * - Repository 에러 처리
 *
 * 비책임:
 * - 권한 체크
 */
export const getPartyMembersService = async (
  postId: number
): Promise<PartyMember[]> => {
  // 입력 검증
  if (typeof postId !== 'number' || isNaN(postId) || postId <= 0) {
    throw new ChatValidationError('postId는 양수여야 합니다.');
  }

  try {
    const members = await partyMessagesRepository.getPartyMembers(postId);
    return members;
  } catch (error) {
    throw new ChatFetchError(
      'members',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
