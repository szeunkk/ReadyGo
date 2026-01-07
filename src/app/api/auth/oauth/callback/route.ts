import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { checkUserProfile } from '@/services/auth/checkUserProfile';
import { createUserProfile } from '@/services/auth/createUserProfile';
import { updateUserStatusOnline } from '@/services/auth/updateUserStatusOnline';
import { URL_PATHS } from '@/commons/constants/url';

/**
 * OAuth 콜백 API
 * GET /api/auth/oauth/callback
 *
 * OAuth 인증 후 콜백 처리:
 * 1. OAuth code로 세션 교환 (Supabase가 쿠키 자동 저장)
 * 2. 세션 및 사용자 정보 명시적 검증
 * 3. 프로필 확인 및 생성
 * 4. 신규 유저 → /signup-success, 기존 유저 → /home 리다이렉트
 *
 * 중요: exchangeCodeForSession 후 세션을 명시적으로 확인하여
 * 쿠키가 제대로 설정되었는지 검증합니다.
 */
export const GET = async function (request: NextRequest) {
  // OAuth 콜백 호출 확인 로그
  // eslint-disable-next-line no-console
  console.log('=== OAuth Callback Called ===', {
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  });

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // eslint-disable-next-line no-console
    console.log('OAuth callback params:', {
      hasCode: !!code,
      hasError: !!error,
      error,
      errorDescription,
    });

    // OAuth 에러 처리
    if (error) {
      // eslint-disable-next-line no-console
      console.error('OAuth error:', error, errorDescription);
      const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
      loginUrl.searchParams.set('error', errorDescription || error);
      return NextResponse.redirect(loginUrl.toString());
    }

    if (!code) {
      const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
      loginUrl.searchParams.set('error', 'OAuth code가 없습니다.');
      return NextResponse.redirect(loginUrl.toString());
    }

    // Supabase SSR 클라이언트 생성 (쿠키 자동 관리)
    const supabase = createClient();

    // 1. OAuth code로 세션 교환 (쿠키 자동 저장)
    const {
      data: { session, user },
      error: exchangeError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      // eslint-disable-next-line no-console
      console.error('OAuth code exchange error:', exchangeError);
      const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
      loginUrl.searchParams.set('error', '세션 교환에 실패했습니다.');
      return NextResponse.redirect(loginUrl.toString());
    }

    // 세션이 제대로 설정되었는지 명시적으로 확인
    if (!session || !user) {
      // eslint-disable-next-line no-console
      console.error('Session or user not found after code exchange', {
        hasSession: !!session,
        hasUser: !!user,
      });
      const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
      loginUrl.searchParams.set('error', '세션을 설정하지 못했습니다.');
      return NextResponse.redirect(loginUrl.toString());
    }

    // 세션 토큰 유효성 확인
    if (!session.access_token || !session.refresh_token) {
      // eslint-disable-next-line no-console
      console.error('Session tokens missing', {
        hasAccessToken: !!session.access_token,
        hasRefreshToken: !!session.refresh_token,
      });
      const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
      loginUrl.searchParams.set('error', '세션 토큰을 받지 못했습니다.');
      return NextResponse.redirect(loginUrl.toString());
    }

    // eslint-disable-next-line no-console
    console.log('OAuth session exchange successful', {
      userId: user.id,
      email: user.email,
      hasAccessToken: !!session.access_token,
    });

    // 세션 설정 확인을 위한 추가 검증 (쿠키가 제대로 설정되었는지 확인)
    const {
      data: { user: verifiedUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !verifiedUser) {
      // eslint-disable-next-line no-console
      console.error('Get user error after session exchange:', userError, {
        sessionUserId: user.id,
      });
      const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
      loginUrl.searchParams.set('error', '사용자 정보를 가져오지 못했습니다.');
      return NextResponse.redirect(loginUrl.toString());
    }

    // 사용자 ID 일치 확인
    if (verifiedUser.id !== user.id) {
      // eslint-disable-next-line no-console
      console.error('User ID mismatch after session exchange', {
        sessionUserId: user.id,
        verifiedUserId: verifiedUser.id,
      });
      const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
      loginUrl.searchParams.set('error', '세션 검증에 실패했습니다.');
      return NextResponse.redirect(loginUrl.toString());
    }

    // eslint-disable-next-line no-console
    console.log('OAuth session verification successful', {
      userId: verifiedUser.id,
      email: verifiedUser.email,
    });

    // OAuth 로그인 성공 후 user_status를 online으로 업데이트
    await updateUserStatusOnline(verifiedUser.id);

    // 3. 프로필 확인 (동일 supabase 인스턴스 재사용)
    const hasProfile = await checkUserProfile(supabase, verifiedUser.id);

    // 세션에서 직접 토큰 추출 (쿠키 타이밍 이슈 해결)
    // exchangeCodeForSession이 반환한 세션을 사용
    const sessionData = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
    };

    // eslint-disable-next-line no-console
    console.log('OAuth callback: Session tokens extracted', {
      hasAccessToken: !!sessionData.access_token,
      hasRefreshToken: !!sessionData.refresh_token,
      expiresAt: sessionData.expires_at,
    });

    // 4. 신규 유저면 프로필 생성 (동일 supabase 인스턴스 재사용)
    if (!hasProfile) {
      try {
        await createUserProfile(supabase, verifiedUser.id);
        const signupSuccessUrl = new URL(URL_PATHS.SIGNUP_SUCCESS, request.url);

        // 리다이렉트 응답 생성
        const redirectResponse = NextResponse.redirect(
          signupSuccessUrl.toString()
        );

        // 세션 토큰을 직접 쿠키로 설정 (타이밍 이슈 해결)
        const cookiePrefix = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`;
        
        redirectResponse.cookies.set(cookiePrefix, JSON.stringify({
          access_token: sessionData.access_token,
          refresh_token: sessionData.refresh_token,
          expires_at: sessionData.expires_at,
          expires_in: sessionData.expires_in,
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // eslint-disable-next-line no-console
        console.log(
          'OAuth callback: Redirecting to signup-success with session cookie',
          {
            cookieName: cookiePrefix,
            redirectUrl: signupSuccessUrl.toString(),
          }
        );
        return redirectResponse;
      } catch (profileError) {
        // eslint-disable-next-line no-console
        console.error('Profile creation error:', profileError);
        const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
        loginUrl.searchParams.set('error', '프로필 생성에 실패했습니다.');
        return NextResponse.redirect(loginUrl.toString());
      }
    }

    // 5. 기존 유저는 홈으로
    const homeUrl = new URL(URL_PATHS.HOME, request.url);

    // 리다이렉트 응답 생성
    const redirectResponse = NextResponse.redirect(homeUrl.toString());

    // 세션 토큰을 직접 쿠키로 설정 (타이밍 이슈 해결)
    const cookiePrefix = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`;
    
    redirectResponse.cookies.set(cookiePrefix, JSON.stringify({
      access_token: sessionData.access_token,
      refresh_token: sessionData.refresh_token,
      expires_at: sessionData.expires_at,
      expires_in: sessionData.expires_in,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // eslint-disable-next-line no-console
    console.log('OAuth callback: Redirecting to home with session cookie', {
      cookieName: cookiePrefix,
      redirectUrl: homeUrl.toString(),
    });
    return redirectResponse;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('OAuth callback error:', error);
    const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
    loginUrl.searchParams.set('error', 'OAuth 처리 중 오류가 발생했습니다.');
    return NextResponse.redirect(loginUrl.toString());
  }
};
