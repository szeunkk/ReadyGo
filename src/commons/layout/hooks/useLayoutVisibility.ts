import { usePathname } from 'next/navigation';
import { getUrlMetadata } from '@/commons/constants/url';

export const useLayoutVisibility = () => {
  const pathname = usePathname();
  const urlMetadata = getUrlMetadata(pathname);

  return {
    showSidebar: urlMetadata?.visibility.sidebar ?? false,
    showHeader: urlMetadata?.visibility.header ?? false,
  };
};
