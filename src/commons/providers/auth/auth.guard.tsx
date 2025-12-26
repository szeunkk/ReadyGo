'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useAuth } from './auth.provider';
import { useModal } from '../modal/modal.provider';
import { isMemberOnlyPath, URL_PATHS } from '@/commons/constants/url';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const { isLoggedIn } = useAuth();
  const { openModal, closeAllModals } = useModal();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const hasShownModalRef = useRef(false);
  const isSessionSyncedRef = useRef(false);
  const hasCheckedSessionRef = useRef(false);

  // 테스트 환경 변수 확인
  const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === 'test';

  // 세션 동기화 완료 확인 (auth.provider의 세션 동기화 완료 대기)
  useEffect(() => {
    if (isSessionSyncedRef.current) {
      return;
    }

    if (!hasCheckedSessionRef.current) {
      hasCheckedSessionRef.current = true;
      const timer = setTimeout(() => {
        isSessionSyncedRef.current = true;
      }, 150);

      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  // 세션 동기화 완료 후 인가 진행 및 경로 변경 시 인가 재검증
  useEffect(() => {
    if (!isSessionSyncedRef.current) {
      return;
    }

    setIsChecking(true);
    hasShownModalRef.current = false;

    // 테스트 환경: 모든 페이지 접근 허용
    if (isTestEnv) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // 공개 경로: 인가 검증 건너뛰기
    if (!isMemberOnlyPath(pathname)) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // 회원 전용 경로: 로그인 여부 확인
    const isAuthenticated = Boolean(accessToken) || isLoggedIn;

    if (isAuthenticated) {
      setIsAuthorized(true);
      setIsChecking(false);
      hasShownModalRef.current = false;
    } else {
      setIsAuthorized(false);
      setIsChecking(false);

      // 모달은 한 번만 표시
      if (!hasShownModalRef.current) {
        hasShownModalRef.current = true;

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
    }
  }, [
    pathname,
    accessToken,
    isLoggedIn,
    isTestEnv,
    openModal,
    closeAllModals,
    router,
  ]);

  // 인가 진행 중이거나 인가 실패 시 빈 화면 표시
  if (isChecking || !isAuthorized) {
    return null;
  }

  // 인가 성공 시 children 표시
  return <>{children}</>;
};
