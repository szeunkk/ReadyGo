'use client';

import { supabase } from '@/lib/supabase/client';

/**
 * Google OAuth Hook
 *
 * 단순히 OAuth 시작만 수행합니다.
 * 실제 콜백 처리는 /api/auth/oauth/callback에서 서버 사이드로 처리됩니다.
 */
export const useGoogleOAuth = () => {
  const handleGoogleOAuth = async () => {
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/api/auth/oauth/callback`,
          queryParams: {
            prompt: 'select_account', // 항상 계정 선택 화면 표시
          },
        },
      });

      if (error) {
        throw new Error(error.message || '구글 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  };

  return {
    handleGoogleOAuth,
  };
};
