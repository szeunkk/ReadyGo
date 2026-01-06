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
      createdAt: data.user.created_at,
      lastSignInAt: data.user.last_sign_in_at,
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
    
    // 사용자 생성 시점과 마지막 로그인 시점 비교로 신규 유저 판단
    const userCreatedAt = new Date(data.user.created_at);
    const lastSignInAt = data.user.last_sign_in_at 
      ? new Date(data.user.last_sign_in_at) 
      : null;
    
    // 생성 시점과 마지막 로그인 시점이 같거나 매우 가까우면 신규 유저로 판단 (5초 이내)
    const isNewUserByTime = !lastSignInAt || 
      (lastSignInAt.getTime() - userCreatedAt.getTime()) < 5000;
    
    // 프로필이 없거나, 생성 시점이 최근이면 신규 유저
    const isNewUser = !hasProfile || isNewUserByTime;
    
    console.log('OAuth session API - Profile check result', {
      userId: data.user.id,
      hasProfile,
      userCreatedAt: userCreatedAt.toISOString(),
      lastSignInAt: lastSignInAt?.toISOString() || null,
      isNewUserByTime,
      isNewUser,
    });

    // 신규 유저면 프로필 생성
    if (isNewUser && !hasProfile) {
      try {
        console.log('OAuth session API - Creating profile for new user');
        await createUserProfile(supabase, data.user.id);
        
        // 프로필 생성 성공
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
      } catch (profileError: any) {
        // 중복 키 에러는 이미 프로필이 생성된 것으로 간주 (race condition)
        if (profileError?.code === '23505') {
          console.log('OAuth session API - Profile already exists (race condition)');
          // 프로필이 이미 있으므로 다시 확인
          const hasProfileAfterError = await checkUserProfile(supabase, data.user.id);
          
          if (hasProfileAfterError) {
            // 프로필이 있으면 기존 유저로 처리
            const response = NextResponse.json({
              success: true,
              isNewUser: false,
              user: {
                id: data.user.id,
                email: data.user.email,
              },
            });

            supabaseCookies.forEach((cookie) => {
              response.cookies.set(cookie.name, cookie.value, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
              });
            });

            console.log('OAuth session API - Returning existing user response (after race condition)', {
              cookiesIncluded: supabaseCookies.length,
            });
            return response;
          }
        }
        
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

    // 기존 유저 또는 프로필이 있는 경우
    // 프로필이 이미 있으면 무조건 기존 유저로 처리
    const finalIsNewUser = hasProfile ? false : isNewUser;
    
    console.log('OAuth session API - Returning response', {
      isNewUser,
      hasProfile,
      finalIsNewUser,
    });
    const response = NextResponse.json({
      success: true,
      isNewUser: finalIsNewUser,
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
