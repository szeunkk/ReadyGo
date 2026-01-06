import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { checkUserProfile } from '@/services/auth/checkUserProfile';
import { createUserProfile } from '@/services/auth/createUserProfile';
import { updateUserStatusOnline } from '@/services/auth/updateUserStatusOnline';
import { URL_PATHS } from '@/commons/constants/url';

/**
 * OAuth 세션 설정 API
 * POST /api/auth/oauth/session
 *
 * 클라이언트에서 받은 OAuth 세션 토큰을 서버 쿠키에 설정합니다.
 */
export async function POST(request: NextRequest) {
  console.log('=== OAuth Session API Called ===', {
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  });

  try {
    const body = await request.json();
    const { access_token, refresh_token } = body;

    console.log('OAuth session API - received tokens', {
      hasAccessToken: !!access_token,
      hasRefreshToken: !!refresh_token,
      accessTokenLength: access_token?.length,
      refreshTokenLength: refresh_token?.length,
    });

    if (!access_token || !refresh_token) {
      console.error('OAuth session API - missing tokens');
      return NextResponse.json(
        { error: '토큰이 필요합니다.' },
        { status: 400 }
      );
    }

    // Supabase SSR 클라이언트 생성
    const supabase = createClient();

    // 세션 설정 (쿠키에 자동 저장)
    console.log('OAuth session API - setting session...');
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    console.log('OAuth session API - setSession result', {
      hasData: !!data,
      hasSession: !!data?.session,
      hasUser: !!data?.user,
      error: error?.message,
    });

    if (error || !data.session || !data.user) {
      console.error('OAuth session API - Failed to set session:', error);
      return NextResponse.json(
        { error: '세션 설정에 실패했습니다.' },
        { status: 401 }
      );
    }

    console.log('OAuth session API - Session set successfully', {
      userId: data.user.id,
      email: data.user.email,
    });

    // 쿠키 확인
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    const supabaseCookies = allCookies.filter(
      (cookie) =>
        cookie.name.includes('supabase') ||
        cookie.name.includes('sb-') ||
        cookie.name.startsWith('sb')
    );

    console.log('OAuth session API - Cookies after setSession', {
      totalCookies: allCookies.length,
      supabaseCookies: supabaseCookies.length,
      cookieNames: allCookies.map((c) => c.name),
    });

    // user_status를 online으로 업데이트
    await updateUserStatusOnline(data.user.id);

    // 프로필 확인
    const hasProfile = await checkUserProfile(supabase, data.user.id);

    // 신규 유저면 프로필 생성
    if (!hasProfile) {
      try {
        console.log('OAuth session API - Creating profile for new user');
        await createUserProfile(supabase, data.user.id);

        const response = NextResponse.json({
          success: true,
          isNewUser: true,
          user: {
            id: data.user.id,
            email: data.user.email,
          },
        });

        // 쿠키를 명시적으로 응답에 포함
        supabaseCookies.forEach((cookie) => {
          response.cookies.set(cookie.name, cookie.value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
        });

        console.log('OAuth session API - Returning new user response', {
          cookiesIncluded: supabaseCookies.length,
        });
        return response;
      } catch (profileError) {
        console.error(
          'OAuth session API - Profile creation error:',
          profileError
        );
        return NextResponse.json(
          { error: '프로필 생성에 실패했습니다.' },
          { status: 500 }
        );
      }
    }

    // 기존 유저
    console.log('OAuth session API - Returning existing user response');
    const response = NextResponse.json({
      success: true,
      isNewUser: false,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });

    // 쿠키를 명시적으로 응답에 포함
    supabaseCookies.forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    });

    console.log('OAuth session API - Response prepared', {
      cookiesIncluded: supabaseCookies.length,
    });
    return response;
  } catch (error) {
    console.error('OAuth session API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
