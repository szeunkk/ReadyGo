import { supabaseAdmin } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

// 타입 정의
type ChatRoom = Database['public']['Tables']['chat_rooms']['Row'];
type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export interface ChatRoomListItem {
  room: ChatRoom;
  otherMember?: UserProfile;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

// ============================================
// 채팅방 관련 함수
// ============================================

/**
 * 두 사용자 간의 1:1 채팅방이 존재하는지 조회
 */
export const getChatRoomByMembers = async (
  userId1: string,
  userId2: string
): Promise<ChatRoom | null> => {
  // chat_room_members를 기준으로 두 사용자가 모두 참여한 채팅방 조회
  const { data: members1, error: error1 } = await supabaseAdmin
    .from('chat_room_members')
    .select('room_id')
    .eq('user_id', userId1);

  if (error1) {
    throw error1;
  }

  if (!members1 || members1.length === 0) {
    return null;
  }

  const roomIds = members1
    .map((m) => m.room_id)
    .filter((id): id is number => id !== null);

  // 두 번째 사용자가 참여한 채팅방 중에서 교집합 찾기
  const { data: members2, error: error2 } = await supabaseAdmin
    .from('chat_room_members')
    .select('room_id')
    .eq('user_id', userId2)
    .in('room_id', roomIds);

  if (error2) {
    throw error2;
  }

  if (!members2 || members2.length === 0) {
    return null;
  }

  // 공통 room_id로 chat_rooms 조회 (type='direct'만)
  const commonRoomIds = members2
    .map((m) => m.room_id)
    .filter((id): id is number => id !== null);

  const { data: rooms, error: error3 } = await supabaseAdmin
    .from('chat_rooms')
    .select('*')
    .in('id', commonRoomIds)
    .eq('type', 'direct')
    .limit(1)
    .maybeSingle();

  if (error3) {
    throw error3;
  }

  return rooms;
};

/**
 * 새로운 1:1 채팅방 생성 (중복 방지)
 */
export const createChatRoom = async (
  memberIds: string[]
): Promise<ChatRoom> => {
  if (memberIds.length !== 2) {
    throw new Error('1:1 채팅방은 정확히 2명의 멤버가 필요합니다.');
  }

  // 중복 방지: 기존 채팅방 확인
  const existingRoom = await getChatRoomByMembers(memberIds[0], memberIds[1]);
  if (existingRoom) {
    return existingRoom;
  }

  // 새 채팅방 생성
  const { data: newRoom, error: roomError } = await supabaseAdmin
    .from('chat_rooms')
    .insert({ type: 'direct' })
    .select()
    .single();

  if (roomError) {
    throw roomError;
  }

  if (!newRoom) {
    throw new Error('채팅방 생성에 실패했습니다.');
  }

  // 채팅방 멤버 추가
  const now = new Date().toISOString();
  const membersData = memberIds.map((userId) => ({
    room_id: newRoom.id,
    user_id: userId,
    joined_at: now,
  }));

  const { error: membersError } = await supabaseAdmin
    .from('chat_room_members')
    .insert(membersData);

  if (membersError) {
    throw membersError;
  }

  return newRoom;
};

/**
 * 특정 사용자가 참여한 모든 채팅방 목록 조회 (성능 최적화)
 */
export const getUserChatRooms = async (
  userId: string
): Promise<ChatRoomListItem[]> => {
  // 1차: chat_room_members를 기준으로 chat_rooms 목록 조회 (room_ids 수집)
  const { data: members, error: membersError } = await supabaseAdmin
    .from('chat_room_members')
    .select('room_id')
    .eq('user_id', userId);

  if (membersError) {
    throw membersError;
  }

  if (!members || members.length === 0) {
    return [];
  }

  const roomIds = members
    .map((m) => m.room_id)
    .filter((id): id is number => id !== null);

  // chat_rooms 조회
  const { data: rooms, error: roomsError } = await supabaseAdmin
    .from('chat_rooms')
    .select('*')
    .in('id', roomIds)
    .eq('type', 'direct');

  if (roomsError) {
    throw roomsError;
  }

  if (!rooms || rooms.length === 0) {
    return [];
  }

  // 2차: 마지막 메시지 조회 (room_ids를 IN 조건으로 처리하여 N+1 문제 방지)
  const { data: lastMessages, error: messagesError } = await supabaseAdmin
    .from('chat_messages')
    .select('*')
    .in('room_id', roomIds)
    .order('created_at', { ascending: false });

  if (messagesError) {
    throw messagesError;
  }

  // room_id별 최신 메시지 1개만 추출
  const lastMessageMap = new Map<number, ChatMessage>();
  if (lastMessages) {
    for (const message of lastMessages) {
      if (message.room_id && !lastMessageMap.has(message.room_id)) {
        lastMessageMap.set(message.room_id, message);
      }
    }
  }

  // 3차: unreadCount 집계 (N+1 문제 방지를 위해 한 번에 조회)
  // chat_messages에서 sender_id가 userId가 아닌 메시지 중
  // chat_message_reads에 없는 메시지 카운트
  const unreadCountMap = new Map<number, number>();

  // 모든 room_id에 대해 한 번에 메시지 조회
  const { data: allUnreadMessages, error: unreadError } = await supabaseAdmin
    .from('chat_messages')
    .select('id, room_id')
    .in('room_id', roomIds)
    .neq('sender_id', userId);

  if (unreadError) {
    throw unreadError;
  }

  if (!allUnreadMessages || allUnreadMessages.length === 0) {
    // 모든 방의 unreadCount를 0으로 설정
    roomIds.forEach((roomId) => unreadCountMap.set(roomId, 0));
  } else {
    // room_id별로 메시지 ID 그룹화
    const messageIdsByRoom = new Map<number, number[]>();
    for (const msg of allUnreadMessages) {
      if (msg.room_id) {
        const existing = messageIdsByRoom.get(msg.room_id) || [];
        existing.push(msg.id);
        messageIdsByRoom.set(msg.room_id, existing);
      }
    }

    // 모든 메시지 ID 수집
    const allMessageIds = allUnreadMessages.map((m) => m.id);

    // 읽음 처리된 메시지 ID 조회 (한 번에)
    const { data: readMessages, error: readError } = await supabaseAdmin
      .from('chat_message_reads')
      .select('message_id')
      .eq('user_id', userId)
      .in('message_id', allMessageIds);

    if (readError) {
      throw readError;
    }

    const readMessageIds = new Set(
      (readMessages || [])
        .map((r) => r.message_id)
        .filter((id): id is number => id !== null)
    );

    // 각 room_id별로 읽지 않은 메시지 수 계산
    for (const roomId of roomIds) {
      const messageIds = messageIdsByRoom.get(roomId) || [];
      const unreadCount = messageIds.filter(
        (id) => !readMessageIds.has(id)
      ).length;
      unreadCountMap.set(roomId, unreadCount);
    }
  }

  // 4차: 상대방 사용자 정보 조회 (1:1 채팅의 경우, N+1 문제 방지를 위해 한 번에 조회)
  const otherMemberMap = new Map<number, UserProfile>();

  // 모든 방의 다른 멤버 조회 (한 번에)
  const { data: allOtherMembers, error: otherMembersError } =
    await supabaseAdmin
      .from('chat_room_members')
      .select('room_id, user_id')
      .in('room_id', roomIds)
      .neq('user_id', userId);

  if (otherMembersError) {
    throw otherMembersError;
  }

  if (allOtherMembers && allOtherMembers.length > 0) {
    // room_id별로 첫 번째 멤버만 선택 (1:1 채팅이므로 각 방당 1명)
    const roomToUserIdMap = new Map<number, string>();
    for (const member of allOtherMembers) {
      if (
        member.room_id &&
        member.user_id &&
        !roomToUserIdMap.has(member.room_id)
      ) {
        roomToUserIdMap.set(member.room_id, member.user_id);
      }
    }

    // 모든 상대방 user_id 수집
    const otherUserIds = Array.from(roomToUserIdMap.values());

    if (otherUserIds.length > 0) {
      // user_profiles 조회 (한 번에)
      const { data: profiles, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .in('id', otherUserIds);

      if (profileError) {
        throw profileError;
      }

      // user_id를 키로 하는 Map 생성
      const profileMap = new Map<string, UserProfile>();
      if (profiles) {
        for (const profile of profiles) {
          profileMap.set(profile.id, profile);
        }
      }

      // room_id별로 상대방 프로필 매핑
      Array.from(roomToUserIdMap.keys()).forEach((roomId) => {
        const otherUserId = roomToUserIdMap.get(roomId);
        if (otherUserId) {
          const profile = profileMap.get(otherUserId);
          if (profile) {
            otherMemberMap.set(roomId, profile);
          }
        }
      });
    }
  }

  // 결과 조합
  const result: ChatRoomListItem[] = rooms.map((room) => {
    const lastMessage = room.id ? lastMessageMap.get(room.id) : undefined;
    const unreadCount = room.id ? unreadCountMap.get(room.id) || 0 : 0;
    const otherMember = room.id ? otherMemberMap.get(room.id) : undefined;

    return {
      room,
      otherMember,
      lastMessage,
      unreadCount,
    };
  });

  // 최신 메시지 기준으로 정렬 (내림차순)
  result.sort((a, b) => {
    const aTime = a.lastMessage?.created_at || a.room.created_at || '';
    const bTime = b.lastMessage?.created_at || b.room.created_at || '';
    return bTime.localeCompare(aTime);
  });

  return result;
};

// ============================================
// 메시지 관련 함수
// ============================================

/**
 * 특정 채팅방의 메시지 목록 조회
 */
export const getChatMessages = async (
  roomId: number,
  limit: number = 50,
  offset: number = 0
): Promise<ChatMessage[]> => {
  const { data, error } = await supabaseAdmin
    .from('chat_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return data || [];
};

/**
 * 새로운 메시지 저장
 */
export const sendMessage = async (
  roomId: number,
  senderId: string,
  content: string,
  contentType: string = 'text'
): Promise<ChatMessage> => {
  const { data, error } = await supabaseAdmin
    .from('chat_messages')
    .insert({
      room_id: roomId,
      sender_id: senderId,
      content,
      content_type: contentType,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('메시지 생성에 실패했습니다.');
  }

  return data;
};

/**
 * 메시지 삭제 (hard delete)
 */
export const deleteMessage = async (messageId: number): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('chat_messages')
    .delete()
    .eq('id', messageId);

  if (error) {
    throw error;
  }
};

// ============================================
// 읽음 처리 관련 함수
// ============================================

/**
 * 특정 메시지들을 읽음 처리
 */
export const markMessagesAsRead = async (
  roomId: number,
  userId: string,
  messageIds: number[]
): Promise<void> => {
  if (messageIds.length === 0) {
    return;
  }

  // 유효한 messageIds만 필터링
  const validMessageIds = messageIds.filter(
    (id) => typeof id === 'number' && !isNaN(id) && id > 0
  );

  if (validMessageIds.length === 0) {
    console.warn('markMessagesAsRead: 유효한 messageIds가 없습니다.');
    return;
  }

  const now = new Date().toISOString();
  const readsData = validMessageIds.map((messageId) => ({
    message_id: messageId,
    user_id: userId,
    read_at: now,
  }));

  try {
    // upsert를 사용하여 중복 생성 방지
    // UNIQUE 제약조건 (message_id, user_id)이 데이터베이스에 설정되어 있음
    // 이미 읽음 처리된 메시지는 자동으로 업데이트됨
    const { error: upsertError } = await supabaseAdmin
      .from('chat_message_reads')
      .upsert(readsData, {
        onConflict: 'message_id,user_id',
        ignoreDuplicates: false,
      });

    if (upsertError) {
      console.error(
        'markMessagesAsRead - chat_message_reads upsert error:',
        upsertError
      );
      console.error('upsert data:', readsData);
      console.error(
        'roomId:',
        roomId,
        'userId:',
        userId,
        'messageIds:',
        validMessageIds
      );
      throw upsertError;
    }

    // chat_messages 테이블의 is_read 필드도 업데이트
    const { error: updateError } = await supabaseAdmin
      .from('chat_messages')
      .update({ is_read: true })
      .in('id', validMessageIds);

    if (updateError) {
      console.error(
        'markMessagesAsRead - chat_messages update error:',
        updateError
      );
      throw updateError;
    }
  } catch (error) {
    console.error('markMessagesAsRead - 전체 에러:', error);
    throw error;
  }
};

/**
 * 특정 채팅방에서 읽지 않은 메시지 수 계산
 */
export const getUnreadCount = async (
  roomId: number,
  userId: string
): Promise<number> => {
  // chat_messages에서 room_id로 필터링하고, sender_id가 userId가 아닌 메시지 조회
  const { data: messages, error: messagesError } = await supabaseAdmin
    .from('chat_messages')
    .select('id')
    .eq('room_id', roomId)
    .neq('sender_id', userId);

  if (messagesError) {
    throw messagesError;
  }

  if (!messages || messages.length === 0) {
    return 0;
  }

  const messageIds = messages.map((m) => m.id);

  // chat_message_reads 테이블과 조인하여 읽음 처리되지 않은 메시지만 카운트
  const { data: readMessages, error: readError } = await supabaseAdmin
    .from('chat_message_reads')
    .select('message_id')
    .eq('user_id', userId)
    .in('message_id', messageIds);

  if (readError) {
    throw readError;
  }

  const readMessageIds = new Set(
    (readMessages || [])
      .map((r) => r.message_id)
      .filter((id): id is number => id !== null)
  );

  // 읽지 않은 메시지 수
  const unreadCount = messageIds.filter((id) => !readMessageIds.has(id)).length;

  return unreadCount;
};

/**
 * 특정 채팅방의 모든 읽지 않은 메시지를 읽음 처리
 */
export const markRoomAsRead = async (
  roomId: number,
  userId: string
): Promise<void> => {
  // 해당 채팅방에서 현재 사용자가 읽지 않은 모든 메시지 ID 조회
  const { data: unreadMessages, error: messagesError } = await supabaseAdmin
    .from('chat_messages')
    .select('id')
    .eq('room_id', roomId)
    .neq('sender_id', userId)
    .not('id', 'is', null);

  if (messagesError) {
    console.error('markRoomAsRead - messagesError:', messagesError);
    throw messagesError;
  }

  if (!unreadMessages || unreadMessages.length === 0) {
    return;
  }

  // null이 아닌 id만 필터링
  const messageIds = unreadMessages
    .map((m) => m.id)
    .filter((id): id is number => id !== null && typeof id === 'number');

  if (messageIds.length === 0) {
    return;
  }

  // markMessagesAsRead 함수를 활용하여 일괄 읽음 처리
  await markMessagesAsRead(roomId, userId, messageIds);
};

// ============================================
// 차단 관련 함수
// ============================================

/**
 * 사용자를 차단
 */
export const blockUser = async (
  userId: string,
  blockedUserId: string
): Promise<void> => {
  // upsert를 사용하여 중복 차단 방지
  // (user_id, blocked_user_id) 조합의 유니크 제약이 있다는 전제
  const { error } = await supabaseAdmin.from('chat_blocks').upsert(
    {
      user_id: userId,
      blocked_user_id: blockedUserId,
    },
    { onConflict: 'user_id,blocked_user_id' }
  );

  if (error) {
    throw error;
  }
};

/**
 * 사용자 차단 해제
 */
export const unblockUser = async (
  userId: string,
  blockedUserId: string
): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('chat_blocks')
    .delete()
    .eq('user_id', userId)
    .eq('blocked_user_id', blockedUserId);

  if (error) {
    throw error;
  }
};

/**
 * 사용자가 다른 사용자를 차단했는지 확인
 */
export const isUserBlocked = async (
  userId: string,
  otherUserId: string
): Promise<boolean> => {
  const { data, error } = await supabaseAdmin
    .from('chat_blocks')
    .select('id')
    .eq('user_id', userId)
    .eq('blocked_user_id', otherUserId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data !== null;
};
