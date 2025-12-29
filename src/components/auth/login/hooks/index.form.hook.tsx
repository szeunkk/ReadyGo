'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { URL_PATHS } from '@/commons/constants/url';
import { useModal } from '@/commons/providers/modal';
import { CheckboxStatus } from '@/commons/components/checkbox';

// Zod 스키마 정의
const loginSchema = z.object({
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
});

type LoginFormData = z.infer<typeof loginSchema>;

const REMEMBERED_EMAIL_KEY = 'rememberedEmail';

export const useLoginForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasShownSuccessModalRef = useRef(false);
  const hasShownErrorModalRef = useRef(false);

  // localStorage에서 저장된 이메일 불러오기
  const getRememberedEmail = (): string => {
    if (typeof window === 'undefined') {
      return '';
    }
    const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    return rememberedEmail || '';
  };

  // 초기 체크박스 상태는 항상 'unselected'로 설정 (hydration 오류 방지)
  // 실제 값은 useEffect에서 클라이언트에서만 설정
  const [rememberIdStatus, setRememberIdStatus] =
    useState<CheckboxStatus>('unselected');

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit, formState, setValue } = form;
  const { errors, isValid } = formState;

  // 클라이언트에서만 localStorage 확인하여 초기 상태 설정
  useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      setRememberIdStatus('selected');
      setValue('email', rememberedEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // watch를 사용하여 폼 값 변경 시 리렌더링 트리거
  // watch()를 인자 없이 호출하면 모든 필드를 감시하고 리렌더링을 트리거함
  const watchedValues = form.watch();
  const watchedEmail = form.watch('email');

  // 모든 필드가 입력되었는지 확인
  const email = watchedValues.email?.trim() || '';
  const password = watchedValues.password?.trim() || '';
  const allFieldsFilled = Boolean(email) && Boolean(password);

  // zod 검증을 통과하고 모든 필드가 채워져 있어야 버튼 활성화
  // isValid는 zod 스키마 검증을 통과했는지 확인
  const isFormValid = isValid && allFieldsFilled;

  // 체크박스 상태 변경 핸들러
  const handleRememberIdChange = (status: CheckboxStatus) => {
    setRememberIdStatus(status);

    if (status === 'selected') {
      // 체크박스가 selected로 변경될 때: 현재 이메일 저장
      const currentEmail = watchedEmail?.trim() || '';
      if (currentEmail) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, currentEmail);
      }
    } else {
      // 체크박스가 unselected로 변경될 때: localStorage에서 삭제
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  };

  // 이메일 값 변경 시 localStorage 업데이트 (체크박스가 selected일 때만)
  useEffect(() => {
    if (rememberIdStatus === 'selected') {
      const currentEmail = watchedEmail?.trim() || '';
      if (currentEmail) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, currentEmail);
      } else {
        // 이메일이 비워지면 localStorage에서 삭제
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
    }
  }, [watchedEmail, rememberIdStatus]);

  const onSubmit = handleSubmit(async (data) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    hasShownSuccessModalRef.current = false;
    hasShownErrorModalRef.current = false;

    try {
      // 1. API를 통해 로그인
      const response = await fetch('/api/auth/session', {
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

      const responseData = await response.json();

      if (!response.ok) {
        // API 에러 메시지 사용
        const errorMessage =
          responseData.error || '로그인에 실패했습니다.';
        throw new Error(errorMessage);
      }

      // 2. 로그인 성공 판단
      if (!responseData.user) {
        throw new Error('로그인에 실패했습니다. 사용자 정보를 받지 못했습니다.');
      }

      // 3. 로그인 성공 후 처리
      // HttpOnly 쿠키에 토큰이 저장되므로 별도 처리 불필요
      // 페이지 새로고침으로 세션 상태 동기화

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
            // 페이지 새로고침으로 세션 상태 동기화
            window.location.href = URL_PATHS.HOME;
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
    rememberIdStatus,
    handleRememberIdChange,
  };
};
