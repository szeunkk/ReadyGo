'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const hasPromptedRef = useRef(false);

  const isTestEnv = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    if (
      typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_TEST_ENV === 'test'
    ) {
      return true;
    }

    return false;
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
    if (!isMounted || !isSessionSynced) {
      return;
    }

    const isMemberPath = isMemberOnlyPath(pathname || '');

    // 공개 경로는 인가 검증 불필요
    if (!isMemberPath) {
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

    // 비로그인 상태: 테스트 환경이 아니면 모달 표시
    if (!isTestEnv && !hasPromptedRef.current) {
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
  }, [
    isMounted,
    isSessionSynced,
    pathname,
    accessToken,
    isTestEnv,
    openModal,
    closeAllModals,
    loginRedirect,
  ]);

  // 테스트 환경: 항상 통과
  if (isTestEnv) {
    return <>{children}</>;
  }

  // 초기 마운트 또는 세션 동기화 전: 로딩 스피너 표시
  if (!isMounted || !isSessionSynced) {
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

  // 회원 전용 페이지 접근 제어
  if (pathname && isMemberOnlyPath(pathname) && !accessToken) {
    // 모달은 useEffect에서 표시, 빈 화면 유지
    return null;
  }

  return <>{children}</>;
};
