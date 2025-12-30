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
 * user_status 수동 변경 API
 * POST /api/user-status/update
 *
 * 유저가 직접 설정하는 상태를 Supabase DB에 upsert 수행합니다.
 */
export const POST = async function (request: NextRequest) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['online', 'away', 'dnd', 'offline'].includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태입니다.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // Supabase 클라이언트 생성 (토큰 포함)
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

    // refresh token이 있으면 세션에 설정
    if (refreshToken && !accessToken) {
      const { data: sessionData, error: refreshError } =
        await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });

      if (refreshError || !sessionData.session) {
        return NextResponse.json(
          { error: '세션 갱신에 실패했습니다.' },
          { status: 401 }
        );
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

      // 갱신된 토큰으로 클라이언트 재생성
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

      // 사용자 정보 조회
      const {
        data: { user },
        error: userError,
      } = await refreshedSupabase.auth.getUser();

      if (userError || !user) {
        return NextResponse.json(
          { error: '사용자 정보를 가져오지 못했습니다.' },
          { status: 401 }
        );
      }

      // user_status 테이블에 upsert 수행
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: upsertError } = await (refreshedSupabase as any)
        .from('user_status')
        .upsert(
          {
            user_id: user.id,
            status,
          },
          {
            onConflict: 'user_id',
          }
        );

      if (upsertError) {
        console.error('Failed to update user_status:', upsertError);
        return NextResponse.json(
          { error: 'user_status 업데이트에 실패했습니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // access token이 있는 경우
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
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

          // 갱신된 토큰으로 클라이언트 재생성
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
            // user_status 테이블에 upsert 수행
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: upsertError } = await (refreshedSupabase as any)
              .from('user_status')
              .upsert(
                {
                  user_id: refreshedUser.id,
                  status,
                },
                {
                  onConflict: 'user_id',
                }
              );

            if (upsertError) {
              console.error('Failed to update user_status:', upsertError);
              return NextResponse.json(
                { error: 'user_status 업데이트에 실패했습니다.' },
                { status: 500 }
              );
            }

            return NextResponse.json({ success: true });
          }
        }
      }

      return NextResponse.json(
        { error: '사용자 정보를 가져오지 못했습니다.' },
        { status: 401 }
      );
    }

    // user_status 테이블에 upsert 수행
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: upsertError } = await (supabase as any)
      .from('user_status')
      .upsert(
        {
          user_id: user.id,
          status,
        },
        {
          onConflict: 'user_id',
        }
      );

    if (upsertError) {
      console.error('Failed to update user_status:', upsertError);
      return NextResponse.json(
        { error: 'user_status 업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update user_status API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
