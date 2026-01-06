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
      // Supabase 리다이렉트 URL이 루트만 등록되어 있으므로 루트로 리다이렉트
      const redirectTo = origin;

      console.log('=== Google OAuth Started ===', {
        origin,
        redirectTo,
        currentUrl: window.location.href,
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            prompt: 'select_account', // 항상 계정 선택 화면 표시
          },
        },
      });

      console.log('Google OAuth signInWithOAuth result', {
        hasData: !!data,
        data,
        error: error?.message,
        url: data?.url,
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw new Error(error.message || '구글 로그인에 실패했습니다.');
      }

      // data.url이 있으면 수동으로 리다이렉트 (일부 경우 필요)
      if (data?.url) {
        console.log('Redirecting to OAuth provider:', data.url);
        window.location.href = data.url;
      } else {
        console.warn('No redirect URL returned from signInWithOAuth');
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
