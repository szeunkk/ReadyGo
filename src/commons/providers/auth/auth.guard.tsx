'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useAuth } from './auth.provider';
import { useModal } from '../modal/modal.provider';
import { isMemberOnlyPath } from '@/commons/constants/url';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 페이지 접근 권한을 제어하는 가드 컴포넌트
 * - 초기 인가 완료 전까지는 로딩 스피너 표시
 * - 비회원의 회원 전용 경로 접근 시, 모달 노출 후 로그인 페이지로 안내
 * - 테스트 환경(NEXT_PUBLIC_TEST_ENV=test)에서는 항상 통과
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const { isSessionSynced, loginRedirect } = useAuth();
  const { openModal, closeAllModals } = useModal();

  const [isMounted, setIsMounted] = useState(false);
  const [isOAuthCallback, setIsOAuthCallback] = useState(false);
  const hasPromptedRef = useRef(false);

  // ✅ OAuth 콜백 중인지 감지 (client-side에서만 실행)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setIsOAuthCallback(urlParams.has('code'));
    }
  }, []);

  const [isTestEnv, setIsTestEnv] = useState(false);

  // 테스트 환경 체크 (client-side에서만 실행)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTestEnv(
        typeof process !== 'undefined' &&
          process.env.NEXT_PUBLIC_TEST_ENV === 'test'
      );
    }
  }, []);

  // 클라이언트 마운트 체크
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 경로 변경 시 모달 플래그 리셋
  useEffect(() => {
    hasPromptedRef.current = false;
  }, [pathname]);

  // 회원 전용 페이지 접근 제어
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const isMemberPath = isMemberOnlyPath(pathname || '');

    // 공개 경로는 인가 검증 불필요
    if (!isMemberPath) {
      return;
    }

    // 회원 전용 경로에서만 세션 동기화 대기
    if (!isSessionSynced) {
      return;
    }

    // 로그인 상태면 인가 허용
    if (accessToken) {
      // 로그인 상태로 변경된 경우 모달 닫기
      if (hasPromptedRef.current) {
        closeAllModals();
        hasPromptedRef.current = false;
      }
      return;
    }

    // 비로그인 상태: OAuth 콜백 후 세션 동기화 지연을 고려하여 대기 후 확인
    if (!isTestEnv && !hasPromptedRef.current) {
      // ✅ OAuth 콜백 중이면 더 오래 대기 (최대 8초)
      // ✅ 일반 페이지는 짧게 대기 (최대 1초)
      const checkAccessToken = async () => {
        let retries = 0;
        const maxRetries = isOAuthCallback ? 80 : 10; // OAuth: 8초, 일반: 1초

        while (retries < maxRetries) {
          const currentAccessToken = useAuthStore.getState().accessToken;
          if (currentAccessToken) {
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
          retries++;
        }

        // 대기 시간 후에도 accessToken이 없으면 모달 표시
        if (!useAuthStore.getState().accessToken && !hasPromptedRef.current) {
          hasPromptedRef.current = true;

          openModal({
            variant: 'single',
            title: '로그인이 필요합니다',
            description: '이 페이지에 접근하려면 로그인이 필요합니다.',
            confirmText: '확인',
            onConfirm: () => {
              closeAllModals();
              loginRedirect();
            },
          });
        }
      };

      checkAccessToken();
    }
  }, [
    isMounted,
    isSessionSynced,
    pathname,
    accessToken,
    isTestEnv,
    isOAuthCallback,
    openModal,
    closeAllModals,
    loginRedirect,
  ]);

  // 테스트 환경: 항상 통과
  if (isTestEnv) {
    return <>{children}</>;
  }

  // ✅ 회원 전용 경로만 세션 동기화 대기
  const isMemberPath = pathname && isMemberOnlyPath(pathname);

  // ✅ 공개 페이지는 즉시 렌더링 (로딩 없음)
  if (!isMemberPath) {
    return <>{children}</>;
  }

  // 초기 마운트 전: 회원 전용 페이지에서만 로딩 스피너 표시
  if (!isMounted) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // 회원 전용 페이지에서만 세션 동기화 및 OAuth 콜백 대기
  const shouldShowLoading =
    !isSessionSynced || (isOAuthCallback && !accessToken);

  if (shouldShowLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // 회원 전용 페이지 접근 제어 (이미 isMemberPath는 true)
  if (!accessToken) {
    // 모달은 useEffect에서 표시, 빈 화면 유지
    return null;
  }

  return <>{children}</>;
};
