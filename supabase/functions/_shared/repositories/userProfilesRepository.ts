import type { DbClient } from '../types/dbClient.ts';

/**
 * user_profiles Repository
 * 책임: user_profiles 테이블 접근 전담
 */

/**
 * user_profiles 레코드를 user_id(id)로 조회한다
 * - DB 접근만 수행, 에러 처리 및 데이터 가공 없음
 * - Supabase 응답 구조를 그대로 반환
 */
export const findByUserId = async (client: DbClient, userId: string) => {
  return await client
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
};
