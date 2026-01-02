import { supabaseAdmin } from '@/lib/supabase/server';
import { AnimalType } from '@/commons/constants/animal/animal.enum';

/**
 * user_profiles Repository
 * 책임: user_profiles 테이블 접근 전담
 */

export type UserProfileRow = {
  id: string;
  animal_type: string | null;
  nickname: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * user_profiles 레코드를 user_id(id)로 조회한다
 * - DB 접근만 수행, 에러 처리 및 데이터 가공 없음
 * - Supabase 응답 구조를 그대로 반환
 */
export const findByUserId = async (userId: string) => {
  return await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
};

/**
 * user_profiles의 animal_type을 업데이트한다
 * - user_profiles.id = user_id
 */
export const updateAnimalType = async (
  userId: string,
  animalType: AnimalType
): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({ animal_type: animalType })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to update animal_type: ${error.message}`);
  }
};
