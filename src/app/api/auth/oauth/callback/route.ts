import { NextRequest, NextResponse } from 'next/server';
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
 * 2. 사용자 정보 가져오기
 * 3. 프로필 확인 및 생성
 * 4. 신규 유저 → /signup-success, 기존 유저 → /home 리다이렉트
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // OAuth 에러 처리
    if (error) {
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
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('OAuth code exchange error:', exchangeError);
      const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
      loginUrl.searchParams.set('error', '세션 교환에 실패했습니다.');
      return NextResponse.redirect(loginUrl.toString());
    }

    // 2. 사용자 정보 가져오기
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Get user error:', userError);
      const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
      loginUrl.searchParams.set('error', '사용자 정보를 가져오지 못했습니다.');
      return NextResponse.redirect(loginUrl.toString());
    }

    // OAuth 로그인 성공 후 user_status를 online으로 업데이트
    await updateUserStatusOnline(user.id);

    // 3. 프로필 확인 (동일 supabase 인스턴스 재사용)
    const hasProfile = await checkUserProfile(supabase, user.id);

    // 4. 신규 유저면 프로필 생성 (동일 supabase 인스턴스 재사용)
    if (!hasProfile) {
      try {
        await createUserProfile(supabase, user.id);
        const signupSuccessUrl = new URL(URL_PATHS.SIGNUP_SUCCESS, request.url);
        return NextResponse.redirect(signupSuccessUrl.toString());
      } catch (profileError) {
        console.error('Profile creation error:', profileError);
        const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
        loginUrl.searchParams.set('error', '프로필 생성에 실패했습니다.');
        return NextResponse.redirect(loginUrl.toString());
      }
    }

    // 5. 기존 유저는 홈으로
    const homeUrl = new URL(URL_PATHS.HOME, request.url);
    return NextResponse.redirect(homeUrl.toString());
  } catch (error) {
    console.error('OAuth callback error:', error);
    const loginUrl = new URL(URL_PATHS.LOGIN, request.url);
    loginUrl.searchParams.set('error', 'OAuth 처리 중 오류가 발생했습니다.');
    return NextResponse.redirect(loginUrl.toString());
  }
}
