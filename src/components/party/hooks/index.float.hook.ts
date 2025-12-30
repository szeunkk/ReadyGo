'use client';

import { useCallback } from 'react';

export const useFloatButton = () => {
  // 페이지 최상단으로 부드럽게 스크롤
  const scrollToTop = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Layout의 main 요소(스크롤 컨테이너) 찾기
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      return;
    }

    // 대체 방법: document.documentElement 스크롤
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    // 추가 대체 방법: document.body 스크롤
    document.body.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    // 최종 대체 방법: window.scrollTo
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return {
    scrollToTop,
  };
};
