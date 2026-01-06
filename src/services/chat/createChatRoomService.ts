import * as chatRepository from '@/repositories/chat.repository';
import {
  ChatCreateError,
  ChatFetchError,
  ChatValidationError,
} from '@/commons/errors/chat/chatErrors';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { ChatRoom } from '@/types/chat';

/**
 * 새로운 1:1 채팅방 생성 Service
 *
 * 책임:
 * - 중복 방지: 기존 채팅방 확인 후 생성
 * - 입력 검증 (2명의 멤버 필요)
 * - Repository 에러 처리
 *
 * 비책임:
 * - 권한 체크
 * - 사용자 존재 여부 확인
 */
export const createChatRoomService = async (
  client: SupabaseClient<Database>,
  memberIds: string[]
): Promise<ChatRoom> => {
  // 입력 검증
  if (!Array.isArray(memberIds) || memberIds.length !== 2) {
    throw new ChatValidationError(
      '1:1 채팅방은 정확히 2명의 멤버가 필요합니다.'
    );
  }

  // 중복 방지: 기존 채팅방 확인
  try {
    const existingRoom = await chatRepository.getChatRoomByMembers(
      client,
      memberIds[0],
      memberIds[1]
    );

    if (existingRoom) {
      return existingRoom;
    }
  } catch (error) {
    console.error('[Service] Error checking existing room:', error);
    interface ErrorWithMessage {
      message?: unknown;
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'message' in error
          ? String((error as ErrorWithMessage).message)
          : 'Unknown error';
    throw new ChatFetchError('room', errorMessage);
  }

  // 새 채팅방 생성
  try {
    const newRoom = await chatRepository.createChatRoom(client, memberIds);

    if (!newRoom) {
      throw new ChatCreateError('room', '채팅방 생성에 실패했습니다.');
    }

    return newRoom;
  } catch (error) {
    console.error('[Service] Error creating chat room:', error);

    if (error instanceof ChatCreateError || error instanceof ChatFetchError) {
      throw error;
    }

    interface ErrorWithDetails {
      message?: unknown;
      details?: unknown;
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'message' in error
          ? String((error as ErrorWithDetails).message)
          : 'Unknown error';

    const errorDetails =
      error && typeof error === 'object' && 'details' in error
        ? String((error as ErrorWithDetails).details)
        : undefined;

    throw new ChatCreateError(
      'room',
      errorDetails ? `${errorMessage} (${errorDetails})` : errorMessage
    );
  }
};
