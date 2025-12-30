import { supabaseAdmin } from '@/lib/supabase/server';
import { TraitKey } from '@/commons/constants/animal/trait.enum';

/**
 * user_traits Repository
 * 책임: user_traits 테이블 접근 전담
 */

export type TraitsRecord = Record<TraitKey, number>;

export type UserTraitsUpsertInput = {
  user_id: string;
  cooperation: number;
  exploration: number;
  strategy: number;
  leadership: number;
  social: number;
};

export type UserTraitsRow = {
  user_id: string;
  cooperation: number;
  exploration: number;
  strategy: number;
  leadership: number;
  social: number;
  created_at: string;
  updated_at: string;
};

/**
 * user_traits 레코드를 user_id로 조회한다
 * - RLS 기반 쿼리
 * - 존재하지 않으면 null 반환
 */
export const findByUserId = async (
  userId: string
): Promise<UserTraitsRow | null> => {
  const { data, error } = await supabaseAdmin
    .from('user_traits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to find user_traits: ${error.message}`);
  }

  return data;
};

/**
 * user_traits 레코드를 upsert한다
 * - user_id 기준으로 존재하면 업데이트, 없으면 삽입
 * - updated_at은 자동 갱신
 */
export const upsertUserTraits = async (
  userId: string,
  traits: TraitsRecord
): Promise<void> => {
  const input: UserTraitsUpsertInput = {
    user_id: userId,
    cooperation: traits.cooperation,
    exploration: traits.exploration,
    strategy: traits.strategy,
    leadership: traits.leadership,
    social: traits.social,
  };

  const { error } = await supabaseAdmin
    .from('user_traits')
    .upsert(input, { onConflict: 'user_id' });

  if (error) {
    throw new Error(`Failed to upsert user_traits: ${error.message}`);
  }
};
