'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { supabase } from '@/lib/supabase/client';
import { URL_PATHS } from '@/commons/constants/url';
import { useModal } from '@/commons/providers/modal';

// Zod 스키마 정의
const loginSchema = z.object({
  email: z.string().refine((val) => val.includes('@'), {
    message: '이메일에는 @가 포함되어야 합니다.',
  }),
  password: z.string().min(1, '비밀번호는 최소 1글자 이상이어야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasShownSuccessModalRef = useRef(false);
  const hasShownErrorModalRef = useRef(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit, formState } = form;
  const { errors } = formState;

  // watch를 사용하여 폼 값 변경 시 리렌더링 트리거
  // watch()를 인자 없이 호출하면 모든 필드를 감시하고 리렌더링을 트리거함
  const watchedValues = form.watch();

  // 모든 필드가 입력되고 유효한지 확인
  const email = watchedValues.email?.trim() || '';
  const password = watchedValues.password?.trim() || '';

  // 간단한 validation: 필드가 모두 입력되면 유효
  // react-hook-form의 errors는 onChange 모드에서 즉시 업데이트되지 않을 수 있으므로
  // 필드 값만 확인하고, 실제 validation은 submit 시점에 수행
  const allFieldsFilled = Boolean(email) && Boolean(password);

  // 에러가 있는 경우에만 비활성화 (에러가 없으면 활성화)
  const isFormValid = allFieldsFilled;

  const onSubmit = handleSubmit(async (data) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    hasShownSuccessModalRef.current = false;
    hasShownErrorModalRef.current = false;

    try {
      // 1. Supabase Auth 로그인
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        // Supabase Auth 에러 메시지를 한글로 변환
        let errorMessage = '로그인에 실패했습니다.';
        if (authError.message) {
          if (
            authError.message.includes('Invalid login credentials') ||
            authError.message.includes('invalid_grant')
          ) {
            errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
          } else if (authError.message.includes('Email not confirmed')) {
            errorMessage = '이메일 인증이 완료되지 않았습니다.';
          } else if (authError.message.includes('Too many requests')) {
            errorMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
          } else {
            errorMessage = authError.message;
          }
        }
        throw new Error(errorMessage);
      }

      // 2. 로그인 성공 판단
      if (!authData.session?.access_token) {
        throw new Error('로그인에 실패했습니다. 세션을 받지 못했습니다.');
      }

      // 3. 로그인 성공 후 처리
      // localStorage에 저장
      localStorage.setItem('accessToken', authData.session.access_token);

      // user 정보 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('사용자 정보를 가져오지 못했습니다.');
      }

      // fetchUserLoggedIn API: user_profiles에서 _id, name 조회
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, nickname')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // 프로필 조회 실패해도 로그인은 성공으로 처리
      }

      localStorage.setItem(
        'user',
        JSON.stringify({
          id: user.id,
          email: user.email,
          _id: userProfile?.id || user.id,
          name: userProfile?.nickname || null,
        })
      );

      // 로그인완료모달 노출 (한 번만)
      if (!hasShownSuccessModalRef.current) {
        hasShownSuccessModalRef.current = true;
        openModal({
          variant: 'single',
          title: '로그인완료',
          description: '로그인이 완료되었습니다.',
          confirmText: '확인',
          onConfirm: () => {
            closeAllModals();
            router.push(URL_PATHS.HOME);
          },
        });
      }
    } catch (error) {
      // 에러 모달 표시 (한 번만)
      if (!hasShownErrorModalRef.current) {
        hasShownErrorModalRef.current = true;
        openModal({
          variant: 'single',
          title: '로그인실패',
          description:
            error instanceof Error ? error.message : '로그인에 실패했습니다.',
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
