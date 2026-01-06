// api/chat/utils/auth.ts
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * 인증된 Supabase 클라이언트 생성
 * /api/auth/session과 동일한 방식으로 쿠키에서 토큰을 읽어 클라이언트 생성
 */
export const createAuthenticatedClient = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;

    if (!accessToken && !refreshToken) {
      return { supabase: null, user: null, error: 'No tokens found' };
    }

    // Supabase 클라이언트 생성
    // 중요: setSession과 global.headers 둘 다 설정해야 PostgREST 요청에 토큰이 포함됨
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false, // 수동으로 세션 관리
      },
      global: {
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      },
    });

    // access token이 있으면 세션 설정 (RLS를 위해 필수)
    // setSession과 global.headers 둘 다 설정하여 이중 보장
    if (accessToken) {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

      if (sessionError) {
        console.error(
          '[createAuthenticatedClient] setSession error:',
          sessionError
        );
        // setSession 실패해도 global.headers에 토큰이 있으면 계속 진행
      }

      if (sessionData?.session) {
        console.log(
          '[createAuthenticatedClient] Session set successfully, user_id:',
          sessionData.user?.id
        );
      } else {
        console.warn(
          '[createAuthenticatedClient] setSession returned no session, but global.headers has token'
        );
      }
    }

    // access token이 없고 refresh token만 있는 경우
    if (!accessToken && refreshToken) {
      const { data: sessionData, error: refreshError } =
        await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });

      if (refreshError || !sessionData.session) {
        console.error(
          '[createAuthenticatedClient] refreshSession error:',
          refreshError
        );
        return { supabase: null, user: null, error: 'Token refresh failed' };
      }

      // 갱신된 토큰을 쿠키에 저장
      cookieStore.set('sb-access-token', sessionData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24시간
        path: '/',
      });

      cookieStore.set('sb-refresh-token', sessionData.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: '/',
      });

      // 갱신된 토큰으로 새 클라이언트 생성
      const refreshedSupabase = createClient<Database>(
        supabaseUrl,
        supabaseAnonKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );

      // 세션 설정 (RLS를 위해 필수)
      const { error: setSessionError } =
        await refreshedSupabase.auth.setSession({
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
        });

      if (setSessionError) {
        console.error(
          '[createAuthenticatedClient] setSession after refresh error:',
          setSessionError
        );
        return { supabase: null, user: null, error: 'Token refresh failed' };
      }

      console.log(
        '[createAuthenticatedClient] Session refreshed and set, user_id:',
        sessionData.user?.id
      );

      // 갱신된 클라이언트로 사용자 정보 확인
      const {
        data: { user: refreshedUser },
        error: refreshedError,
      } = await refreshedSupabase.auth.getUser();

      if (refreshedError || !refreshedUser) {
        return {
          supabase: null,
          user: null,
          error: 'Token refresh failed',
        };
      }

      return {
        supabase: refreshedSupabase,
        user: refreshedUser,
        error: null,
      };
    }

    // 사용자 정보 확인 (setSession으로 설정된 세션 사용)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log(
      '[createAuthenticatedClient] getUser result (using header token):',
      {
        hasUser: !!user,
        userId: user?.id,
        error: authError?.message,
        hasAccessToken: !!accessToken,
      }
    );

    if (authError || !user) {
      // access token이 유효하지 않으면 refresh token으로 갱신 시도
      if (refreshToken) {
        const { data: sessionData, error: refreshError } =
          await supabase.auth.refreshSession({
            refresh_token: refreshToken,
          });

        if (!refreshError && sessionData.session) {
          // 갱신 성공: 새 토큰을 쿠키에 저장
          cookieStore.set('sb-access-token', sessionData.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24시간
            path: '/',
          });

          cookieStore.set(
            'sb-refresh-token',
            sessionData.session.refresh_token,
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7, // 7일
              path: '/',
            }
          );

          // 갱신된 토큰으로 새 클라이언트 생성
          const refreshedSupabase = createClient<Database>(
            supabaseUrl,
            supabaseAnonKey,
            {
              auth: {
                persistSession: false,
                autoRefreshToken: false,
              },
            }
          );

          // 세션 설정 (RLS를 위해 필수)
          const { error: setSessionError } =
            await refreshedSupabase.auth.setSession({
              access_token: sessionData.session.access_token,
              refresh_token: sessionData.session.refresh_token,
            });

          if (setSessionError) {
            console.error(
              '[createAuthenticatedClient] setSession after refresh error:',
              setSessionError
            );
            return {
              supabase: null,
              user: null,
              error: 'Token refresh failed',
            };
          }

          // 갱신된 클라이언트로 사용자 정보 재조회
          const {
            data: { user: refreshedUser },
            error: refreshedError,
          } = await refreshedSupabase.auth.getUser();

          if (refreshedError || !refreshedUser) {
            return {
              supabase: null,
              user: null,
              error: 'Token refresh failed',
            };
          }

          return {
            supabase: refreshedSupabase,
            user: refreshedUser,
            error: null,
          };
        }
      }

      return { supabase: null, user: null, error: 'Authentication failed' };
    }

    return { supabase, user, error: null };
  } catch (error) {
    console.error('Error in createAuthenticatedClient:', error);
    return {
      supabase: null,
      user: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
