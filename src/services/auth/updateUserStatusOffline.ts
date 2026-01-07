import { createClient } from '@/lib/supabase/server';

/**
 * 로그아웃 시 user_status를 offline으로 업데이트
 * @param userId - 사용자 ID
 */
export const updateUserStatusOffline = async function (
  userId: string
): Promise<void> {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('user_status').upsert(
      {
        user_id: userId,
        status: 'offline',
      },
      {
        onConflict: 'user_id',
      }
    );
  } catch (error) {
    // user_status 업데이트 실패해도 로그아웃은 진행
    // eslint-disable-next-line no-console
    console.error('Failed to update user_status to offline:', error);
  }
};
