'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { supabase } from '@/lib/supabase/client';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { generateNickname } from '@/lib/nickname/generateNickname';
import { URL_PATHS } from '@/commons/constants/url';
import { useModal } from '@/commons/providers/modal';
import { AnimalType } from '@/commons/constants/animal';
import { TierType } from '@/commons/constants/tierType.enum';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Zod 스키마 정의
const signupSchema = z
  .object({
    email: z
      .string()
      .email('올바른 이메일 형식이 아닙니다.')
      .refine((val) => val.includes('@'), {
        message: '이메일에는 @가 포함되어야 합니다.',
      }),
    password: z
      .string()
      .min(8, '비밀번호는 8자리 이상이어야 합니다.')
      .refine(
        (val) => /[a-zA-Z]/.test(val) && /[0-9]/.test(val),
        '비밀번호는 영문과 숫자를 포함해야 합니다.'
      ),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const useSignupForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasShownErrorModalRef = useRef(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const { handleSubmit, formState } = form;
  const { errors, isValid } = formState;

  // watch를 사용하여 폼 값 변경 시 리렌더링 트리거
  // watch()를 인자 없이 호출하면 모든 필드를 감시하고 리렌더링을 트리거함
  const watchedValues = form.watch();

  // 모든 필드가 입력되었는지 확인
  const email = watchedValues.email?.trim() || '';
  const password = watchedValues.password?.trim() || '';
  const passwordConfirm = watchedValues.passwordConfirm?.trim() || '';
  const allFieldsFilled =
    Boolean(email) && Boolean(password) && Boolean(passwordConfirm);

  // zod 검증을 통과하고 모든 필드가 채워져 있어야 버튼 활성화
  // isValid는 zod 스키마 검증을 통과했는지 확인
  const isFormValid = isValid && allFieldsFilled;

  const onSubmit = handleSubmit(async (data) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    hasShownErrorModalRef.current = false;

    try {
      // 1. Supabase Auth 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw new Error(authError.message || '회원가입에 실패했습니다.');
      }

      // 프롬프트 요구사항: data.user.id 존재 (필수)
      if (!authData.user?.id) {
        throw new Error(
          '회원가입에 실패했습니다. 사용자 ID를 받지 못했습니다.'
        );
      }

      const userId = authData.user.id;

      // 2. 초기 데이터 생성
      // 회원가입 직후에는 세션이 아직 설정되지 않았을 수 있으므로
      // authData.session을 사용하여 인증된 클라이언트 생성
      const authenticatedSupabase = authData.session
        ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
            global: {
              headers: {
                Authorization: `Bearer ${authData.session.access_token}`,
              },
            },
          })
        : supabase;

      const nickname = generateNickname();

      // user_profiles 생성
      // created_at, updated_at은 Supabase의 기본값 사용 (현재 UTC 시간)
      const { error: profileError } = await authenticatedSupabase
        .from('user_profiles')
        .insert({
          id: userId,
          nickname,
          avatar_url: null,
          bio: null,
          animal_type: AnimalType.bear,
          tier: TierType.silver,
          temperature_score: 30,
          status_message: null,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(
          profileError.message ||
            '프로필 생성에 실패했습니다. RLS 정책을 확인하세요.'
        );
      }

      // user_settings 생성
      // created_at, updated_at은 Supabase의 기본값 사용 (현재 UTC 시간)
      const { error: settingsError } = await authenticatedSupabase
        .from('user_settings')
        .insert({
          id: userId,
          theme_mode: 'dark',
          notification_push: true,
          notification_chat: true,
          notification_party: true,
          language: 'ko',
        });

      if (settingsError) {
        console.error('Settings creation error:', settingsError);
        throw new Error(
          settingsError.message ||
            '설정 생성에 실패했습니다. RLS 정책을 확인하세요.'
        );
      }

      // 3. 회원가입 후 자동 로그인 (세션 설정)
      if (authData.session?.access_token) {
        // API를 통해 세션 설정 (HttpOnly 쿠키에 저장)
        const loginResponse = await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 쿠키 포함
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        if (!loginResponse.ok) {
          console.warn(
            'Auto-login after signup failed, but signup was successful'
          );
        }
      }

      // 4. 성공 페이지로 이동
      router.push(URL_PATHS.SIGNUP_SUCCESS);
    } catch (error) {
      // 에러 모달 표시 (한 번만)
      if (!hasShownErrorModalRef.current) {
        hasShownErrorModalRef.current = true;
        openModal({
          variant: 'single',
          title: '가입실패',
          description:
            error instanceof Error ? error.message : '회원가입에 실패했습니다.',
          confirmText: '확인',
          onConfirm: () => {
            closeAllModals();
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    onSubmit,
    isFormValid,
    isSubmitting,
    errors,
  };
};
