'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase/client';
import { URL_PATHS } from '@/commons/constants/url';
import { useModal } from '@/commons/providers/modal';
import { generateNickname } from '@/lib/nickname/generateNickname';
import { AnimalType } from '@/commons/constants/animal';
import { TierType } from '@/commons/constants/tierType.enum';

const OAUTH_PROCESSING_KEY = 'kakao_oauth_processing';

export const useKakaoOAuth = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();
  const hasShownErrorModalRef = useRef(false);
  const hasProcessedSessionRef = useRef(false);

  // OAuth 콜백 처리: auth state change 감지 및 페이지 로드 시 세션 확인
  useEffect(() => {
    // 페이지 로드 시 현재 세션 확인 (OAuth 콜백 후 페이지 재로드된 경우)
    const checkInitialSession = async () => {
      try {
        // OAuth 처리 중인지 확인 (localStorage 사용)
        const isProcessingOAuth =
          typeof window !== 'undefined' &&
          localStorage.getItem(OAUTH_PROCESSING_KEY) === 'true';

        if (!isProcessingOAuth) {
          return;
        }

        // OAuth 콜백 후 URL에서 세션을 읽어오는 데 시간이 걸릴 수 있으므로 재시도
        let retryCount = 0;
        const maxRetries = 5;
        const retryDelay = 500; // 500ms

        const checkSession = async (): Promise<void> => {
          try {
            const {
              data: { session },
            } = await supabase.auth.getSession();

            if (
              session?.user &&
              session?.access_token &&
              session?.refresh_token &&
              !hasProcessedSessionRef.current
            ) {
              hasProcessedSessionRef.current = true;
              await processOAuthCallbackWithSession(session, session.user.id);
            } else if (
              retryCount < maxRetries &&
              !hasProcessedSessionRef.current
            ) {
              // 세션이 아직 없으면 재시도
              retryCount++;
              setTimeout(checkSession, retryDelay);
            } else if (retryCount >= maxRetries) {
              // 최대 재시도 횟수 초과 시 플래그 제거
              console.warn('OAuth session not found after retries');
              if (typeof window !== 'undefined') {
                localStorage.removeItem(OAUTH_PROCESSING_KEY);
              }
            }
          } catch (error) {
            console.error('Session check error:', error);
            if (retryCount < maxRetries) {
              retryCount++;
              setTimeout(checkSession, retryDelay);
            } else {
              if (typeof window !== 'undefined') {
                localStorage.removeItem(OAUTH_PROCESSING_KEY);
              }
            }
          }
        };

        // 초기 세션 확인 시작
        await checkSession();
      } catch (error) {
        console.error('Initial session check error:', error);
        // 에러 발생 시 플래그 제거
        if (typeof window !== 'undefined') {
          localStorage.removeItem(OAUTH_PROCESSING_KEY);
        }
      }
    };

    // OAuth 콜백 처리 로직 (세션을 파라미터로 받는 버전)
    const processOAuthCallbackWithSession = async (
      session: {
        access_token: string;
        refresh_token: string;
        user: { id: string };
      },
      userId: string
    ) => {
      try {
        // OAuth 콜백 후 세션을 HttpOnly 쿠키에 저장하기 위해 API 호출
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 쿠키 포함
          body: JSON.stringify({
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
          }),
        });

        if (!sessionResponse.ok) {
          throw new Error('세션 저장에 실패했습니다.');
        }

        const sessionData = await sessionResponse.json();

        if (!sessionData.user) {
          throw new Error('사용자 정보를 가져오지 못했습니다.');
        }

        // user_profiles 테이블에서 레코드 존재 여부 확인
        const { data: existingProfile, error: profileCheckError } =
          await supabase
            .from('user_profiles')
            .select('id, nickname')
            .eq('id', userId)
            .maybeSingle();

        if (profileCheckError) {
          console.error('Profile check error:', profileCheckError);
          throw new Error('프로필 확인 중 오류가 발생했습니다.');
        }

        // 최초 로그인: user_profiles 레코드가 없음
        if (!existingProfile) {
          const nickname = generateNickname();

          // 1. user_profiles 생성
          const { error: profileError } = await supabase
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

          // 2. user_settings 생성
          const { error: settingsError } = await supabase
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
            // profiles는 생성되었지만 settings 생성 실패
            throw new Error(
              settingsError.message ||
                '설정 생성에 실패했습니다. RLS 정책을 확인하세요.'
            );
          }

          // HttpOnly 쿠키에 세션이 저장되었으므로 페이지 새로고침으로 세션 상태 동기화
          // 초기 데이터 생성 성공 → signup-success로 이동
          // OAuth 처리 플래그 제거
          if (typeof window !== 'undefined') {
            localStorage.removeItem(OAUTH_PROCESSING_KEY);
          }
          // 쿠키가 브라우저에 반영될 시간을 주기 위해 약간의 지연 후 페이지 이동
          await new Promise((resolve) => setTimeout(resolve, 300));
          // 페이지 새로고침으로 세션 상태 동기화
          window.location.href = URL_PATHS.SIGNUP_SUCCESS;
        } else {
          // 기존 유저: HttpOnly 쿠키에 세션이 저장되었으므로 페이지 새로고침으로 세션 상태 동기화
          // 기존 유저: user_profiles 레코드가 이미 존재 → home으로 이동
          // OAuth 처리 플래그 제거
          if (typeof window !== 'undefined') {
            localStorage.removeItem(OAUTH_PROCESSING_KEY);
          }
          // 쿠키가 브라우저에 반영될 시간을 주기 위해 약간의 지연 후 페이지 이동
          await new Promise((resolve) => setTimeout(resolve, 300));
          // 페이지 새로고침으로 세션 상태 동기화
          window.location.href = URL_PATHS.HOME;
        }
      } catch (error) {
        // 에러 모달 표시 (한 번만)
        if (!hasShownErrorModalRef.current) {
          hasShownErrorModalRef.current = true;
          openModal({
            variant: 'single',
            title: '가입실패',
            description:
              error instanceof Error
                ? error.message
                : '카카오 로그인 처리 중 오류가 발생했습니다.',
            confirmText: '확인',
            onConfirm: () => {
              closeAllModals();
            },
          });
        }
        // OAuth 처리 플래그 제거
        if (typeof window !== 'undefined') {
          localStorage.removeItem(OAUTH_PROCESSING_KEY);
        }
      }
    };

    // 초기 세션 확인
    checkInitialSession();

    // auth state change 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // OAuth 처리 중인지 확인
      const isProcessingOAuth =
        typeof window !== 'undefined' &&
        localStorage.getItem(OAUTH_PROCESSING_KEY) === 'true';

      // 세션이 있고 SIGNED_IN 이벤트이고 OAuth 처리 중이며 아직 처리하지 않은 경우
      if (
        event === 'SIGNED_IN' &&
        session?.user &&
        session?.access_token &&
        session?.refresh_token &&
        isProcessingOAuth &&
        !hasProcessedSessionRef.current
      ) {
        hasProcessedSessionRef.current = true;
        // onAuthStateChange에서 받은 세션을 바로 사용
        await processOAuthCallbackWithSession(session, session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, openModal, closeAllModals]);

  const handleKakaoOAuth = async () => {
    // 에러 모달 플래그 리셋
    hasShownErrorModalRef.current = false;
    hasProcessedSessionRef.current = false;

    try {
      // OAuth 처리 시작 플래그 설정 (localStorage 사용하여 리다이렉트 후에도 유지)
      if (typeof window !== 'undefined') {
        localStorage.setItem(OAUTH_PROCESSING_KEY, 'true');
      }

      // Supabase 카카오 OAuth 로그인 API 호출
      // queryParams를 통해 카카오에 직접 scope 파라미터 전달
      // 앱 설정과 일치하도록 account_email만 요청
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}${URL_PATHS.LOGIN}`,
          scopes: 'account_email',
          queryParams: {
            scope: 'account_email',
            prompt: 'login', // 기존 카카오 세션이 있더라도 다시 로그인하게 만듦
          },
        },
      });

      if (authError) {
        // 에러 발생 시 플래그 제거
        if (typeof window !== 'undefined') {
          localStorage.removeItem(OAUTH_PROCESSING_KEY);
        }
        throw new Error(authError.message || '카카오 로그인에 실패했습니다.');
      }

      // signInWithOAuth는 리다이렉트를 수행하므로,
      // 실제 처리는 onAuthStateChange에서 수행됨
    } catch (error) {
      // 에러 모달 표시 (한 번만)
      if (!hasShownErrorModalRef.current) {
        hasShownErrorModalRef.current = true;
        openModal({
          variant: 'single',
          title: '가입실패',
          description:
            error instanceof Error
              ? error.message
              : '카카오 로그인에 실패했습니다.',
          confirmText: '확인',
          onConfirm: () => {
            closeAllModals();
          },
        });
      }
    }
  };

  return {
    handleKakaoOAuth,
  };
};
