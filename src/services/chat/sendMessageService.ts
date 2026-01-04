import * as chatRepository from '@/repositories/chat.repository';
import {
  ChatCreateError,
  ChatValidationError,
} from '@/commons/errors/chat/chatErrors';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { ChatMessage } from '@/types/supabase';

/**
 * 메시지 전송 Service
 *
 * 책임:
 * - 입력 검증 (roomId, content)
 * - Repository 에러 처리
 *
 * 비책임:
 * - 권한 체크
 * - 채팅방 존재 여부 확인
 */
export const sendMessageService = async (
  client: SupabaseClient<Database>,
  roomId: number,
  senderId: string,
  content: string,
  contentType: string = 'text'
): Promise<ChatMessage> => {
  // 입력 검증
  if (typeof roomId !== 'number' || isNaN(roomId) || roomId <= 0) {
    throw new ChatValidationError('roomId는 양수여야 합니다.');
  }

  if (!senderId || typeof senderId !== 'string') {
    throw new ChatValidationError('senderId는 필수입니다.');
  }

  if (!content || typeof content !== 'string' || !content.trim()) {
    throw new ChatValidationError('content는 비어있을 수 없습니다.');
  }

  try {
    const message = await chatRepository.sendMessage(
      client,
      roomId,
      senderId,
      content.trim(),
      contentType
    );

    if (!message) {
      throw new ChatCreateError('message', '메시지 생성에 실패했습니다.');
    }

    return message;
  } catch (error) {
    if (
      error instanceof ChatCreateError ||
      error instanceof ChatValidationError
    ) {
      throw error;
    }

    throw new ChatCreateError(
      'message',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
