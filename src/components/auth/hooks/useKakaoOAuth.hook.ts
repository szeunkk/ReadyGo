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
      const { origin } = window.location;
      // ✅ 서버 사이드 OAuth 콜백 사용 (안정적)
      const redirectTo = `${origin}/api/auth/oauth/callback`;

      // eslint-disable-next-line no-console
      console.log('=== Kakao OAuth Started ===', {
        origin,
        redirectTo,
        currentUrl: window.location.href,
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo,
          scopes: 'account_email',
          queryParams: {
            scope: 'account_email',
            prompt: 'login', // 기존 카카오 세션이 있더라도 다시 로그인하게 만듦
          },
        },
      });

      // eslint-disable-next-line no-console
      console.log('Kakao OAuth signInWithOAuth result', {
        hasData: !!data,
        data,
        error: error?.message,
        url: data?.url,
      });

      if (error) {
        // eslint-disable-next-line no-console
        console.error('Kakao OAuth error:', error);
        throw new Error(error.message || '카카오 로그인에 실패했습니다.');
      }

      // data.url이 있으면 수동으로 리다이렉트 (일부 경우 필요)
      if (data?.url) {
        // eslint-disable-next-line no-console
        console.log('Redirecting to OAuth provider:', data.url);
        window.location.href = data.url;
      } else {
        // eslint-disable-next-line no-console
        console.warn('No redirect URL returned from signInWithOAuth');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Kakao OAuth error:', error);
      throw error;
    }
  };

  return {
    handleKakaoOAuth,
  };
};
