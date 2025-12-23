'use client';

import { useRef, useEffect } from 'react';

import { supabase } from '@/lib/supabase/client';
import { URL_PATHS } from '@/commons/constants/url';
import { useModal } from '@/commons/providers/modal';

/**
 * 구글 로그인 Hook
 * - 구글 로그인 버튼 클릭 핸들러 제공
 * - Supabase OAuth 로그인 호출 (signInWithOAuth)
 * - OAuth 콜백 처리 (리다이렉트 후 세션 확인)
 * - localStorage 저장 처리 (accessToken, user)
 * - user_profiles 조회 처리
 * - 실패 모달 오픈 및 중복 방지
 */
export const useGoogleLogin = () => {
  const { openModal, closeAllModals } = useModal();
  const hasShownErrorModalRef = useRef(false);
  const hasProcessedCallbackRef = useRef(false);

  /**
   * 에러 메시지를 한글로 변환
   */
  const translateErrorMessage = (errorMessage: string): string => {
    if (
      errorMessage.includes('Invalid login credentials') ||
      errorMessage.includes('invalid_grant')
    ) {
      return '로그인에 실패했습니다. 다시 시도해주세요.';
    } else if (errorMessage.includes('Email not confirmed')) {
      return '이메일 인증이 완료되지 않았습니다.';
    } else if (errorMessage.includes('Too many requests')) {
      return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    } else if (errorMessage.includes('OAuth')) {
      return '구글 로그인에 실패했습니다. 다시 시도해주세요.';
    }
    return errorMessage || '로그인에 실패했습니다.';
  };

  /**
   * OAuth 콜백 처리 (리다이렉트 후 세션 확인 및 처리)
   * - 세션 확인
   * - localStorage 저장 (accessToken, user)
   * - user_profiles 조회
   * - 실패 시 모달 표시
   */
  const handleOAuthCallback = async (): Promise<void> => {
    try {
      // 세션 확인
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session?.access_token) {
        throw new Error(sessionError?.message || '세션을 받지 못했습니다.');
      }

      const { session } = sessionData;

      // localStorage에 accessToken 저장
      localStorage.setItem('accessToken', session.access_token);

      // user 정보 가져오기
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          userError?.message || '사용자 정보를 가져오지 못했습니다.'
        );
      }

      // user_profiles에서 _id(id), name(nickname) 조회
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, nickname')
        .eq('id', user.id)
        .single();

      // 프로필 조회 실패해도 로그인은 성공으로 처리
      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      // localStorage에 user 정보 저장
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: user.id,
          email: user.email,
          _id: userProfile?.id || user.id,
          name: userProfile?.nickname || null,
        })
      );

      // 성공 시 홈 페이지로 이동 (이미 홈 페이지에 있으므로 리다이렉트는 필요 없음)
      // 단, 다른 페이지에서 호출된 경우를 대비하여 처리
    } catch (error) {
      // 에러 모달 표시 (한 번만)
      if (!hasShownErrorModalRef.current) {
        hasShownErrorModalRef.current = true;
        const errorMessage =
          error instanceof Error ? error.message : '로그인에 실패했습니다.';
        openModal({
          variant: 'single',
          title: '로그인실패',
          description: translateErrorMessage(errorMessage),
          confirmText: '확인',
          onConfirm: () => {
            closeAllModals();
            hasShownErrorModalRef.current = false;
          },
        });
      }
      throw error;
    }
  };

  /**
   * 구글 로그인 버튼 클릭 핸들러
   * - Supabase OAuth 로그인 호출
   * - redirectTo 경로 설정 (현재 도메인 + /home)
   */
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      hasShownErrorModalRef.current = false;

      // 현재 도메인 가져오기
      const origin =
        typeof window !== 'undefined' ? window.location.origin : '';
      const redirectTo = `${origin}${URL_PATHS.HOME}`;

      // Supabase OAuth 로그인 호출
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        throw new Error(error.message || '구글 로그인에 실패했습니다.');
      }

      // signInWithOAuth는 Promise를 반환하지만, 실제 인증은 브라우저 리다이렉트로 처리됨
      // 리다이렉트 후 홈 페이지에서 handleOAuthCallback을 호출하여 세션 확인 및 처리
    } catch (error) {
      // 에러 모달 표시 (한 번만)
      if (!hasShownErrorModalRef.current) {
        hasShownErrorModalRef.current = true;
        const errorMessage =
          error instanceof Error
            ? error.message
            : '구글 로그인에 실패했습니다.';
        openModal({
          variant: 'single',
          title: '로그인실패',
          description: translateErrorMessage(errorMessage),
          confirmText: '확인',
          onConfirm: () => {
            closeAllModals();
            hasShownErrorModalRef.current = false;
          },
        });
      }
    }
  };

  // OAuth 콜백 자동 처리 (Hook이 마운트될 때 실행)
  useEffect(() => {
    // 이미 처리했으면 스킵
    if (hasProcessedCallbackRef.current) {
      return;
    }

    const processOAuthCallback = async () => {
      try {
        if (typeof window === 'undefined') {
          return;
        }

        // 현재 경로가 홈 페이지인지 확인
        const currentPath = window.location.pathname;
        if (currentPath !== URL_PATHS.HOME) {
          return;
        }

        // hash fragment가 있으면 제거 (깔끔한 URL 유지)
        if (window.location.hash) {
          const cleanUrl =
            window.location.pathname + (window.location.search || '');
          window.history.replaceState({}, '', cleanUrl);
        }

        // URL에 OAuth 콜백 파라미터가 있는지 확인 (code 파라미터)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const isOAuthCallback = code !== null;

        // OAuth 콜백이 아니면 스킵
        if (!isOAuthCallback) {
          return;
        }

        // 세션이 있는지 확인
        const { data: sessionData } = await supabase.auth.getSession();

        // 세션이 있고, localStorage에 accessToken이 없는 경우에만 처리
        // (OAuth 콜백인 경우)
        if (sessionData.session?.access_token) {
          const existingAccessToken = localStorage.getItem('accessToken');
          if (!existingAccessToken) {
            hasProcessedCallbackRef.current = true;
            await handleOAuthCallback();

            // URL에서 code 파라미터 제거 (깔끔한 URL 유지)
            urlParams.delete('code');
            const newUrl =
              window.location.pathname +
              (urlParams.toString() ? `?${urlParams.toString()}` : '');
            // hash fragment 제거 (OAuth 콜백 처리 후 불필요, 보안상 이미 사용된 정보)
            window.history.replaceState({}, '', newUrl);

            // hash fragment가 여전히 남아있는 경우 명시적으로 제거
            if (window.location.hash) {
              window.history.replaceState(
                {},
                '',
                window.location.pathname +
                  (urlParams.toString() ? `?${urlParams.toString()}` : '')
              );
            }
          }
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        // 에러는 handleOAuthCallback 내부에서 모달로 처리됨
      }
    };

    processOAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열로 한 번만 실행

  return {
    handleGoogleLogin,
    handleOAuthCallback,
  };
};
