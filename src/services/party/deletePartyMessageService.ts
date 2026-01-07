import * as partyMessagesRepository from '@/repositories/partyMessages.repository';
import {
  ChatUpdateError,
  ChatValidationError,
} from '@/commons/errors/chat/chatErrors';

/**
 * 파티 메시지 삭제 Service
 *
 * 책임:
 * - 입력 검증 (messageId)
 * - Repository 에러 처리
 *
 * 비책임:
 * - 권한 체크
 * - 메시지 존재 여부 확인
 */
export const deletePartyMessageService = async (
  messageId: number
): Promise<void> => {
  // 입력 검증
  if (typeof messageId !== 'number' || isNaN(messageId) || messageId <= 0) {
    throw new ChatValidationError('messageId는 양수여야 합니다.');
  }

  try {
    await partyMessagesRepository.deletePartyMessage(messageId);
  } catch (error) {
    throw new ChatUpdateError(
      'message',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
