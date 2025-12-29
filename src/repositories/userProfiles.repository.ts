import { supabaseAdmin } from '@/lib/supabase/server';
import { AnimalType } from '@/commons/constants/animal/animal.enum';

/**
 * user_profiles Repository
 * 책임: user_profiles 테이블 접근 전담
 */

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
