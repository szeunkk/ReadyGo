import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createUserProfile } from '@/services/auth/createUserProfile';

/**
 * 회원가입 API
 * POST /api/auth/signup
 *
 * Supabase SSR 클라이언트를 사용하여:
 * - Supabase Auth 회원가입
 * - 사용자 프로필 및 설정 생성
 * - 세션을 HttpOnly 쿠키에 자동 저장 (자동 로그인)
 *
 * 요청 형식:
 * { email, password }
 */
export const POST = async function (request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Supabase SSR 클라이언트 생성 (쿠키 자동 관리)
    const supabase = createClient();

    // 1. Supabase Auth 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      // 에러 메시지를 한글로 변환
      let errorMessage = '회원가입에 실패했습니다.';
      if (authError.message) {
        if (authError.message.includes('User already registered')) {
          errorMessage = '이미 등록된 이메일입니다.';
        } else if (authError.message.includes('Password')) {
          errorMessage = '비밀번호 형식이 올바르지 않습니다.';
        } else if (authError.message.includes('Email')) {
          errorMessage = '이메일 형식이 올바르지 않습니다.';
        } else {
          errorMessage = authError.message;
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // 프롬프트 요구사항: data.user.id 존재 (필수)
    if (!authData.user?.id) {
      return NextResponse.json(
        { error: '회원가입에 실패했습니다. 사용자 ID를 받지 못했습니다.' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // 2. 사용자 프로필 및 설정 생성
    try {
      await createUserProfile(supabase, userId);
    } catch (profileError) {
      console.error('Profile creation error:', profileError);
      // 프로필 생성 실패 시에도 회원가입은 성공했으므로 에러 반환
      // (나중에 프로필 생성 API를 별도로 호출할 수 있음)
      return NextResponse.json(
        {
          error:
            profileError instanceof Error
              ? profileError.message
              : '프로필 생성에 실패했습니다.',
        },
        { status: 500 }
      );
    }

    // 3. 세션은 Supabase가 자동으로 설정 (쿠키에 저장됨)
    // 클라이언트에는 최소 정보만 반환
    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
