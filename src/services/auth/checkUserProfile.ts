import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * 사용자 프로필 존재 여부 확인
 * @param supabase - Supabase 클라이언트 인스턴스
 * @param userId - 사용자 ID
 * @returns 프로필 존재 여부
 */
export const checkUserProfile = async function (
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Profile check error:', error);
    throw new Error('프로필 확인 중 오류가 발생했습니다.');
  }

  const hasProfile = data !== null;
  // eslint-disable-next-line no-console
  console.log('checkUserProfile result:', {
    userId,
    hasProfile,
    data: data ? 'exists' : 'null',
    error: error ? (error as { message?: string }).message : undefined,
  });

  return hasProfile;
};
