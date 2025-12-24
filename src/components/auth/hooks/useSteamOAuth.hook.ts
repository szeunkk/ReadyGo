'use client';

import { URL_PATHS } from '@/commons/constants/url';

/**
 * Steam OAuth 연동을 위한 Hook
 * Steam OpenID를 사용하여 외부 로그인 페이지로 리다이렉트합니다.
 */
export const useSteamOAuth = () => {
  /**
   * Steam 연동을 시작합니다.
   * Steam OpenID 로그인 URL을 생성하고 외부 로그인 페이지로 리다이렉트합니다.
   */
  const handleSteamLink = () => {
    // 현재 origin 확인
    const { origin } = window.location;

    // 콜백 URL 구성 (URL_PATHS 사용)
    const returnTo = `${origin}${URL_PATHS.STEAM_CALLBACK}`;
    const realm = origin;

    // Steam OpenID 필수 파라미터 구성
    const params = new URLSearchParams({
      'openid.mode': 'checkid_setup',
      'openid.return_to': returnTo,
      'openid.realm': realm,
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    });

    // Steam OpenID 엔드포인트로 리다이렉트
    const steamOpenIdUrl = `https://steamcommunity.com/openid/login?${params.toString()}`;

    // 즉시 Steam 외부 로그인 페이지로 이동
    window.location.assign(steamOpenIdUrl);
  };

  return {
    handleSteamLink,
  };
};
