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

    // Supabase 클라이언트 생성 (토큰을 헤더에 설정)
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
      },
      global: {
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      },
    });

    // 사용자 정보 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

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
                autoRefreshToken: true,
              },
              global: {
                headers: {
                  Authorization: `Bearer ${sessionData.session.access_token}`,
                },
              },
            }
          );

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
