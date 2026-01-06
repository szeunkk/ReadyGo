'use client';

import { supabase } from '@/lib/supabase/client';

/**
 * Kakao OAuth Hook
 *
 * 단순히 OAuth 시작만 수행합니다.
 * 실제 콜백 처리는 /api/auth/oauth/callback에서 서버 사이드로 처리됩니다.
 */
export const useKakaoOAuth = () => {
  const handleKakaoOAuth = async () => {
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${origin}/api/auth/oauth/callback`,
          scopes: 'account_email',
          queryParams: {
            scope: 'account_email',
            prompt: 'login', // 기존 카카오 세션이 있더라도 다시 로그인하게 만듦
          },
        },
      });

      if (error) {
        throw new Error(error.message || '카카오 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Kakao OAuth error:', error);
      throw error;
    }
  };

  return {
    handleKakaoOAuth,
  };
};
