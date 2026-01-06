import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * user_blocks Repository
 * 책임: user_blocks 테이블 접근 전담
 */

/**
 * 사용자를 차단
 * - DB 접근만 수행, 에러 처리 없음
 */
export const blockUser = async (
  client: SupabaseClient<Database>,
  userId: string,
  blockedUserId: string
): Promise<void> => {
  // upsert를 사용하여 중복 차단 방지
  // (user_id, blocked_user_id) 조합의 유니크 제약이 있다는 전제
  const { error } = await client.from('user_blocks').upsert(
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
 * - DB 접근만 수행, 에러 처리 없음
 */
export const unblockUser = async (
  client: SupabaseClient<Database>,
  userId: string,
  blockedUserId: string
): Promise<void> => {
  const { error } = await client
    .from('user_blocks')
    .delete()
    .eq('user_id', userId)
    .eq('blocked_user_id', blockedUserId);

  if (error) {
    throw error;
  }
};

/**
 * 사용자가 다른 사용자를 차단했는지 확인
 * - DB 접근만 수행, 에러 처리 없음
 */
export const isUserBlocked = async (
  client: SupabaseClient<Database>,
  userId: string,
  otherUserId: string
): Promise<boolean> => {
  const { data, error } = await client
    .from('user_blocks')
    .select('id')
    .eq('user_id', userId)
    .eq('blocked_user_id', otherUserId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data !== null;
};

/**
 * 특정 사용자가 차단한 사용자들의 user_id 목록을 조회 (양방향)
 * - userId가 차단한 사용자들
 * - userId를 차단한 사용자들
 * - DB 접근만 수행, 에러 처리 없음
 * - N+1 방지를 위한 batch 조회용 함수
 */
export const getBlockedUserIds = async (
  client: SupabaseClient<Database>,
  userId: string
): Promise<string[]> => {
  // userId가 차단한 사용자들 조회
  const { data: blockedByMe, error: error1 } = await client
    .from('user_blocks')
    .select('blocked_user_id')
    .eq('user_id', userId);

  if (error1) {
    throw error1;
  }

  // userId를 차단한 사용자들 조회
  const { data: blockedMe, error: error2 } = await client
    .from('user_blocks')
    .select('user_id')
    .eq('blocked_user_id', userId);

  if (error2) {
    throw error2;
  }

  // 두 결과 합치기
  const userIds: string[] = [];

  if (blockedByMe) {
    for (const row of blockedByMe) {
      if (row.blocked_user_id) {
        userIds.push(row.blocked_user_id);
      }
    }
  }

  if (blockedMe) {
    for (const row of blockedMe) {
      if (row.user_id) {
        userIds.push(row.user_id);
      }
    }
  }

  return userIds;
};

