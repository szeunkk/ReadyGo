import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { URL_PATHS } from '@/commons/constants/url';

export type NavigationButton = 'home' | 'chat' | 'match' | 'party';

export const useLayoutNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavigationButton>('home');

  useEffect(() => {
    if (pathname.startsWith(URL_PATHS.HOME)) {
      setActiveNav('home');
    } else if (pathname.startsWith(URL_PATHS.CHAT)) {
      setActiveNav('chat');
    } else if (pathname.startsWith(URL_PATHS.MATCH)) {
      setActiveNav('match');
    } else if (pathname.startsWith(URL_PATHS.PARTY)) {
      setActiveNav('party');
    } else if (pathname.startsWith(URL_PATHS.TRAITS)) {
      // traits 페이지는 홈에서 접근하는 기능이므로 home 활성화
      setActiveNav('home');
    }
  }, [pathname]);

  const handleNavClick = (nav: NavigationButton, path: string) => {
    setActiveNav(nav);
    router.push(path);
  };

  return { activeNav, handleNavClick };
};
