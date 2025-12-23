import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { URL_PATHS } from '@/commons/constants/url';

const getTopLevelRoute = (pathname: string) => {
  if (pathname.startsWith(URL_PATHS.HOME)) {
    return 'home';
  }
  if (pathname.startsWith(URL_PATHS.CHAT)) {
    return 'chat';
  }
  if (pathname.startsWith(URL_PATHS.MATCH)) {
    return 'match';
  }
  if (pathname.startsWith(URL_PATHS.PARTY)) {
    return 'party';
  }
  return 'etc';
};

export const useAutoClosePanels = (
  closeSidePanel: () => void,
  closeOverlay: () => void,
  currentOverlay: string | null
) => {
  const pathname = usePathname();
  const prevTopRouteRef = useRef<string | null>(null);

  // 일반 탭 간 이동 시에만 side panel 닫기
  useEffect(() => {
    const currentTop = getTopLevelRoute(pathname);
    const prevTop = prevTopRouteRef.current;

    if (prevTop && prevTop !== currentTop) {
      closeSidePanel();
    }

    prevTopRouteRef.current = currentTop;
  }, [pathname, closeSidePanel]);

  // 페이지 이동 시 overlay 자동 닫기
  useEffect(() => {
    if (currentOverlay) {
      closeOverlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
};
