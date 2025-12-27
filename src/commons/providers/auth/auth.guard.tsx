'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useModal } from '../modal/modal.provider';
import { isMemberOnlyPath, URL_PATHS } from '@/commons/constants/url';
import { UnauthorizedPage } from './ui/UnauthorizedPage';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 페이지 접근 권한을 제어하는 가드 컴포넌트
 * - 초기 인가 완료 전까지는 빈 화면 유지
 * - 비회원의 회원 전용 경로 접근 시, 1회 모달 노출 후 로그인 페이지로 안내
 * - 테스트 환경(NEXT_PUBLIC_TEST_ENV=test)에서는 항상 통과
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const { openModal, closeAllModals } = useModal();

  const [isMounted, setIsMounted] = useState(false);
  const [didAuthorize, setDidAuthorize] = useState(false);
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

  // AuthProvider 초기화 시점 이후에 인가 진행을 보장하기 위해 다음 틱으로 미룸
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    // AuthProvider의 세션 동기화를 기다리기 위해 약간의 지연 추가
    let raf = 0;
    raf = window.requestAnimationFrame(() => {
      // 추가 지연으로 AuthProvider의 초기 세션 동기화 완료 대기
      setTimeout(() => {
        setDidAuthorize(true);
      }, 100);
    });
    return () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
    };
  }, [isMounted]);

  // 경로 변경 시 모달 플래그 리셋
  useEffect(() => {
    hasPromptedRef.current = false;
  }, [pathname]);

  // 회원 전용 페이지 접근 제어
  useEffect(() => {
    if (!isMounted || !didAuthorize) {
      return;
    }

    const isMemberPath = isMemberOnlyPath(pathname);

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
          router.push(URL_PATHS.LOGIN);
        },
      });
    }
  }, [
    isMounted,
    didAuthorize,
    pathname,
    accessToken,
    isTestEnv,
    openModal,
    closeAllModals,
    router,
  ]);

  // 테스트 환경: 항상 통과
  if (isTestEnv) {
    return <>{children}</>;
  }

  // 초기 마운트 또는 인가 전: 빈 화면
  if (!isMounted || !didAuthorize) {
    return null;
  }

  // 회원 전용 페이지 접근 제어
  if (pathname && isMemberOnlyPath(pathname) && !accessToken) {
    // 빈 화면 유지 (모달은 useEffect에서 표시)
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};
