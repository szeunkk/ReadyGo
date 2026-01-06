import { createClient } from '@/lib/supabase/server';

/**
 * 로그인 시 user_status를 online으로 업데이트
 * @param userId - 사용자 ID
 */
export const updateUserStatusOnline = async function (userId: string): Promise<void> {
  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('user_status').upsert(
      {
        user_id: userId,
        status: 'online',
      },
      {
        onConflict: 'user_id',
      }
    );
  } catch (error) {
    // user_status 업데이트 실패해도 로그인은 진행
    // eslint-disable-next-line no-console
    console.error('Failed to update user_status to online:', error);
  }
};

