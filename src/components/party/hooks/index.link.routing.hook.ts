'use client';

import { useRouter } from 'next/navigation';
import { getPartyDetailUrl } from '@/commons/constants/url';

export const useLinkRouting = () => {
  const router = useRouter();

  // 파티 상세 페이지로 이동
  const navigateToPartyDetail = (partyId: string | number) => {
    const url = getPartyDetailUrl(partyId);
    router.push(url);
  };

  return {
    navigateToPartyDetail,
  };
};
