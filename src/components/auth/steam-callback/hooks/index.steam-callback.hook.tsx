'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useModal } from '@/commons/providers/modal';
import { URL_PATHS } from '@/commons/constants/url';
import { useSteamOAuth } from '@/components/auth/hooks/useSteamOAuth.hook';
import { supabase } from '@/lib/supabase/client';

/**
 * Steam 콜백 처리를 위한 Hook
 * Steam OpenID 인증 완료 후 콜백 URL에서 호출됩니다.
 */
export const useSteamCallback = (initialParams?: Record<string, string>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal, closeAllModals } = useModal();
  const { handleSteamLink } = useSteamOAuth();
  const hasShownErrorModalRef = useRef(false);
  const isProcessingRef = useRef(false); // API 요청 진행 중 플래그

  useEffect(() => {
    const processCallback = async () => {
      // 중복 실행 방지: 이미 처리 중이거나 에러 모달을 보여준 경우
      if (isProcessingRef.current || hasShownErrorModalRef.current) {
        return;
      }

      // 처리 시작 플래그 설정
      isProcessingRef.current = true;

      try {
        // URL query 파라미터 수집 (서버에서 전달된 파라미터 우선 사용)
        const openIdParams: Record<string, string> = initialParams || {};

        // 클라이언트에서도 searchParams 수집 (fallback)
        if (!initialParams || Object.keys(initialParams).length === 0) {
          searchParams.forEach((value, key) => {
            openIdParams[key] = value;
          });
        }

        // 디버깅: 수집된 파라미터 로깅 (제거됨)

        // OpenID 파라미터가 없는 경우 (취소/거부)
        if (!openIdParams['openid.mode'] || !openIdParams['openid.identity']) {
          hasShownErrorModalRef.current = true;
          openModal({
            variant: 'dual',
            title: '연동 취소',
            description: '연동이 취소되었습니다.',
            confirmText: '다시 시도',
            cancelText: '나중에 하기',
            onConfirm: () => {
              closeAllModals();
              hasShownErrorModalRef.current = false;
              // Steam 연동 재시작
              handleSteamLink();
            },
            onCancel: () => {
              closeAllModals();
              hasShownErrorModalRef.current = false;
            },
          });
          return;
        }

        // 서버 API Route로 OpenID 검증 요청
        // 현재 세션의 access token 가져오기
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        const requestBody = JSON.stringify(openIdParams);

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // access token이 있으면 Authorization 헤더에 추가
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch('/api/auth/steam/callback', {
          method: 'POST',
          headers,
          body: requestBody,
          credentials: 'include', // cookies 포함
        });

        if (!response.ok) {
          // eslint-disable-next-line no-console
          console.error('API request failed:', {
            status: response.status,
            statusText: response.statusText,
          });
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          // 에러 처리
          hasShownErrorModalRef.current = true;

          if (data.errorCode === 'duplicate_steam_id') {
            // 이미 다른 계정에 연결된 Steam 계정
            openModal({
              variant: 'single',
              title: '연동 실패',
              description:
                '이 Steam 계정은 이미 다른 계정에 연결되어 있습니다.',
              confirmText: '확인',
              onConfirm: () => {
                closeAllModals();
                hasShownErrorModalRef.current = false;
              },
            });
          } else {
            // 기타 서버/검증 오류
            openModal({
              variant: 'single',
              title: '연동 실패',
              description: data.error || 'Steam 연동에 실패했습니다.',
              confirmText: '확인',
              onConfirm: () => {
                closeAllModals();
                hasShownErrorModalRef.current = false;
              },
            });
          }
          return;
        }

        // 성공 시 홈으로 이동
        router.push(URL_PATHS.HOME);
      } catch (error) {
        console.error('Steam callback error:', error);
        if (!hasShownErrorModalRef.current) {
          hasShownErrorModalRef.current = true;
          openModal({
            variant: 'single',
            title: '연동 실패',
            description: 'Steam 연동 처리 중 오류가 발생했습니다.',
            confirmText: '확인',
            onConfirm: () => {
              closeAllModals();
              hasShownErrorModalRef.current = false;
              isProcessingRef.current = false; // 플래그 리셋
            },
          });
        }
      } finally {
        // 처리 완료 후 플래그 리셋 (성공/실패 모두)
        isProcessingRef.current = false;
      }
    };

    processCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
