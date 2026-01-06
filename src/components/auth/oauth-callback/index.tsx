'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { URL_PATHS } from '@/commons/constants/url';
import { useAuth } from '@/commons/providers/auth/auth.provider';
import { useAuthStore } from '@/stores/auth.store';

/**
 * OAuth 콜백 처리 컴포넌트
 *
 * 루트 경로(`/`)에서 OAuth 콜백을 감지하고 처리합니다.
 * - Supabase 리다이렉트 URL이 루트(http://localhost:3000)만 등록되어 있으므로
 * - 루트에서 OAuth 콜백을 감지하고 처리
 */
export function OAuthCallbackHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const { syncSession } = useAuth();

  useEffect(() => {
    // 루트 경로에서만 OAuth 콜백 처리
    if (pathname !== '/') {
      return;
    }

    const handleOAuthCallback = async () => {
      // URL에서 OAuth 관련 파라미터 확인
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // URL hash에서도 확인 (Supabase가 hash에 세션 정보를 넣을 수 있음)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashCode = hashParams.get('code');
      const hashAccessToken = hashParams.get('access_token');
      const hashRefreshToken = hashParams.get('refresh_token');

      console.log('=== OAuth Callback Handler - Root Page ===', {
        hasCode: !!code,
        hasError: !!error,
        hasHashCode: !!hashCode,
        hasHashAccessToken: !!hashAccessToken,
        hasHashRefreshToken: !!hashRefreshToken,
        currentUrl: window.location.href,
      });

      // OAuth 콜백인지 확인 (code, hash에 토큰, 또는 error가 있으면 OAuth 콜백)
      const isOAuthCallback = code || hashCode || hashAccessToken || error;

      if (!isOAuthCallback) {
        // OAuth 콜백이 아니면 처리하지 않음 (기본 리다이렉트 동작 유지)
        return;
      }

      setIsProcessing(true);

      // OAuth 에러 처리
      if (error) {
        console.error('OAuth error:', error, errorDescription);
        const loginUrl = new URL(URL_PATHS.LOGIN, window.location.origin);
        loginUrl.searchParams.set('error', errorDescription || error);
        router.replace(loginUrl.toString());
        return;
      }

      // onAuthStateChange로 세션 변경 감지
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('OAuth callback - Auth state changed', {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
        });

        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in via onAuthStateChange', {
            userId: session.user.id,
            email: session.user.email,
          });

          try {
            // 서버로 세션 전달
            const response = await fetch('/api/auth/oauth/session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error('Failed to set session on server', errorData);
              throw new Error('Failed to set session on server');
            }

            const data = await response.json();
            console.log('Server session set successfully', data);

            // 세션 동기화 (AuthProvider의 store 업데이트)
            await syncSession();

            // store 업데이트 대기 (최대 2초)
            let retries = 0;
            const maxRetries = 20; // 2초 (100ms * 20)
            while (retries < maxRetries) {
              const accessToken = useAuthStore.getState().accessToken;
              if (accessToken) {
                console.log('Access token confirmed in store, redirecting...');
                break;
              }
              await new Promise((resolve) => setTimeout(resolve, 100));
              retries++;
            }

            // URL 정리
            window.history.replaceState({}, '', window.location.pathname);

            // 프로필 확인 및 리다이렉트
            if (data.isNewUser) {
              router.replace(URL_PATHS.SIGNUP_SUCCESS);
            } else {
              router.replace(URL_PATHS.HOME);
            }
          } catch (error) {
            console.error('Error setting session', error);
            const loginUrl = new URL(URL_PATHS.LOGIN, window.location.origin);
            loginUrl.searchParams.set('error', '세션 설정에 실패했습니다.');
            router.replace(loginUrl.toString());
          }
        }
      });

      // Hash에서 직접 토큰이 있으면 즉시 처리
      if (hashAccessToken && hashRefreshToken) {
        console.log('Found tokens in hash, setting session directly');
        try {
          const response = await fetch('/api/auth/oauth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              access_token: hashAccessToken,
              refresh_token: hashRefreshToken,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to set session');
          }

          const data = await response.json();
          console.log('Server session set successfully from hash', data);

          // 세션 동기화 (AuthProvider의 store 업데이트)
          await syncSession();

          // store 업데이트 대기 (최대 2초)
          let retries = 0;
          const maxRetries = 20; // 2초 (100ms * 20)
          while (retries < maxRetries) {
            const accessToken = useAuthStore.getState().accessToken;
            if (accessToken) {
              console.log('Access token confirmed in store, redirecting...');
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
            retries++;
          }

          // URL 정리
          window.history.replaceState({}, '', window.location.pathname);

          // 프로필 확인 및 리다이렉트
          if (data.isNewUser) {
            router.replace(URL_PATHS.SIGNUP_SUCCESS);
          } else {
            router.replace(URL_PATHS.HOME);
          }
          subscription.unsubscribe();
          setIsProcessing(false);
          return;
        } catch (error) {
          console.error('Error setting session from hash', error);
        }
      }

      // code가 있으면 exchangeCodeForSession 시도
      if (code || hashCode) {
        console.log('Attempting exchangeCodeForSession...', {
          code: code || hashCode,
        });
        try {
          const { data: exchangeData, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code || hashCode || '');

          if (exchangeError || !exchangeData.session) {
            console.error('exchangeCodeForSession failed', exchangeError);
            // onAuthStateChange가 처리할 수 있도록 대기
            return;
          }

          console.log('exchangeCodeForSession successful', {
            userId: exchangeData.user?.id,
          });

          // 서버로 세션 전달
          const response = await fetch('/api/auth/oauth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              access_token: exchangeData.session.access_token,
              refresh_token: exchangeData.session.refresh_token,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to set session on server');
          }

          const data = await response.json();
          console.log('Server session set successfully from code', data);

          // 세션 동기화 (AuthProvider의 store 업데이트)
          await syncSession();

          // store 업데이트 대기 (최대 2초)
          let retries = 0;
          const maxRetries = 20; // 2초 (100ms * 20)
          while (retries < maxRetries) {
            const accessToken = useAuthStore.getState().accessToken;
            if (accessToken) {
              console.log('Access token confirmed in store, redirecting...');
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
            retries++;
          }

          // URL 정리
          window.history.replaceState({}, '', window.location.pathname);

          // 프로필 확인 및 리다이렉트
          if (data.isNewUser) {
            router.replace(URL_PATHS.SIGNUP_SUCCESS);
          } else {
            router.replace(URL_PATHS.HOME);
          }
          subscription.unsubscribe();
          setIsProcessing(false);
          return;
        } catch (error) {
          console.error('exchangeCodeForSession error', error);
        }
      }

      // getSession 시도
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (session && session.user) {
        console.log('Session found via getSession', {
          userId: session.user.id,
        });

        try {
          const response = await fetch('/api/auth/oauth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to set session on server');
          }

          const data = await response.json();
          console.log('Server session set successfully from getSession', data);

          // 세션 동기화 (AuthProvider의 store 업데이트)
          await syncSession();

          // store 업데이트 대기 (최대 2초)
          let retries = 0;
          const maxRetries = 20; // 2초 (100ms * 20)
          while (retries < maxRetries) {
            const accessToken = useAuthStore.getState().accessToken;
            if (accessToken) {
              console.log('Access token confirmed in store, redirecting...');
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
            retries++;
          }

          // URL 정리
          window.history.replaceState({}, '', window.location.pathname);

          // 프로필 확인 및 리다이렉트
          if (data.isNewUser) {
            router.replace(URL_PATHS.SIGNUP_SUCCESS);
          } else {
            router.replace(URL_PATHS.HOME);
          }
          subscription.unsubscribe();
          setIsProcessing(false);
          return;
        } catch (error) {
          console.error('Error setting session from getSession', error);
        }
      }

      // Cleanup
      return () => {
        subscription.unsubscribe();
      };
    };

    handleOAuthCallback().finally(() => {
      setIsProcessing(false);
    });
  }, [router, pathname, searchParams, syncSession]);

  // OAuth 로딩 UI 제거 (리다이렉트가 빠르게 완료되므로 불필요)
  return null;
}
