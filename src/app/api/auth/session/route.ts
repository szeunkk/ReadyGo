import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * 로그인 API (일반 로그인 및 OAuth 콜백 처리)
 * POST /api/auth/session
 *
 * 클라이언트에서 직접 토큰을 읽지 않고 서버 API를 통해 처리:
 * - Supabase 인증 후 토큰을 HttpOnly 쿠키에 저장
 * - 클라이언트에는 최소 정보만 반환
 *
 * 요청 형식:
 * - 일반 로그인: { email, password }
 * - OAuth 콜백: { accessToken, refreshToken } (OAuth 콜백 후 세션 설정용)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, accessToken, refreshToken } = body;

    const cookieStore = await cookies();
    let sessionData: {
      access_token: string;
      refresh_token: string;
      user: any;
    } | null = null;

    // OAuth 콜백 처리: accessToken과 refreshToken이 제공된 경우
    if (accessToken && refreshToken) {
      // OAuth 콜백 후 세션을 HttpOnly 쿠키에 저장
      cookieStore.set('sb-access-token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24시간
        path: '/',
      });

      cookieStore.set('sb-refresh-token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: '/',
      });

      // 토큰으로 사용자 정보 조회
      const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return NextResponse.json(
          { error: '사용자 정보를 가져오지 못했습니다.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
        },
      });
    }

    // 일반 로그인 처리
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Supabase 클라이언트 생성
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // 서버에서는 세션을 저장하지 않음
      },
    });

    // 로그인 시도
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 에러 메시지를 한글로 변환
      let errorMessage = '로그인에 실패했습니다.';
      if (error.message) {
        if (
          error.message.includes('Invalid login credentials') ||
          error.message.includes('invalid_grant')
        ) {
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = '이메일 인증이 완료되지 않았습니다.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
        } else {
          errorMessage = error.message;
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    if (!data.session) {
      return NextResponse.json(
        { error: '로그인에 실패했습니다. 세션을 받지 못했습니다.' },
        { status: 401 }
      );
    }

    sessionData = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    };

    // HttpOnly 쿠키에 토큰 저장
    cookieStore.set('sb-access-token', sessionData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24시간
      path: '/',
    });

    cookieStore.set('sb-refresh-token', sessionData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    // 클라이언트에는 최소 정보만 반환 (토큰은 HttpOnly 쿠키에만 저장)
    return NextResponse.json({
      user: {
        id: sessionData.user.id,
        email: sessionData.user.email,
      },
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 세션 조회 API (토큰 자동 갱신 포함)
 * GET /api/auth/session
 *
 * Supabase의 autoRefreshToken을 활용하여:
 * - access token이 만료되었을 때 refresh token으로 자동 갱신
 * - 갱신된 토큰을 HttpOnly 쿠키에 저장
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Supabase 클라이언트 생성 (토큰 포함)
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: true, // 자동 토큰 갱신 활성화
      },
      global: {
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      },
    });

    // refresh token이 있으면 세션에 설정
    if (refreshToken && !accessToken) {
      // refresh token만 있는 경우 세션 복원 시도
      const { data: sessionData, error: refreshError } =
        await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });

      if (refreshError || !sessionData.session) {
        // refresh 실패 시 쿠키 삭제
        cookieStore.delete('sb-access-token');
        cookieStore.delete('sb-refresh-token');
        return NextResponse.json({ user: null }, { status: 200 });
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

      // 갱신된 토큰으로 사용자 정보 조회
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        cookieStore.delete('sb-access-token');
        cookieStore.delete('sb-refresh-token');
        return NextResponse.json({ user: null }, { status: 200 });
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
        },
      });
    }

    // access token이 있는 경우 사용자 정보 조회
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
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

          // 갱신된 토큰으로 사용자 정보 재조회
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

          if (!refreshedError && refreshedUser) {
            return NextResponse.json({
              user: {
                id: refreshedUser.id,
                email: refreshedUser.email,
              },
            });
          }
        }
      }

      // 토큰 갱신 실패 또는 refresh token이 없으면 쿠키 삭제
      cookieStore.delete('sb-access-token');
      cookieStore.delete('sb-refresh-token');
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Get session API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 로그아웃 API
 * DELETE /api/auth/session
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    if (accessToken) {
      // Supabase 클라이언트 생성하여 로그아웃 처리
      const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });

      // Supabase 세션 제거
      await supabase.auth.signOut();
    }

    // 쿠키 삭제
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout API error:', error);
    // 에러가 발생해도 쿠키는 삭제
    const cookieStore = await cookies();
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');
    return NextResponse.json({ success: true });
  }
}
