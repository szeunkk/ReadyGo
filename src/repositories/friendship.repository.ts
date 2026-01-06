import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * friendship Repository
 * 책임: friendships 테이블 접근 전담
 */

/**
 * 특정 사용자의 친구 user_id 목록을 조회한다 (status='accepted'만)
 * - DB 접근만 수행, 에러 처리 및 데이터 가공 없음
 * - Supabase 응답 구조를 그대로 반환
 * - friendships 테이블은 user_a, user_b 양방향 관계이므로 두 경우 모두 조회
 */
export const getFriendUserIds = async (
  client: SupabaseClient<Database>,
  userId: string
): Promise<string[]> => {
  // user_a인 경우 조회
  const { data: friendsA, error: errorA } = await client
    .from('friendships')
    .select('user_b')
    .eq('user_a', userId)
    .eq('status', 'accepted');

  if (errorA) {
    throw errorA;
  }

  // user_b인 경우 조회
  const { data: friendsB, error: errorB } = await client
    .from('friendships')
    .select('user_a')
    .eq('user_b', userId)
    .eq('status', 'accepted');

  if (errorB) {
    throw errorB;
  }

  // 두 결과 합치기
  const userIds: string[] = [];

  if (friendsA) {
    for (const row of friendsA) {
      if (row.user_b) {
        userIds.push(row.user_b);
      }
    }
  }

  if (friendsB) {
    for (const row of friendsB) {
      if (row.user_a) {
        userIds.push(row.user_a);
      }
    }
  }

  return userIds;
};

