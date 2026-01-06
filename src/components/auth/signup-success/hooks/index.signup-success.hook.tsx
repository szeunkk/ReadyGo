'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase/client';
import { URL_PATHS } from '@/commons/constants/url';
import { useSteamOAuth } from '@/components/auth/hooks/useSteamOAuth.hook';

export const useSignupSuccess = () => {
  const router = useRouter();
  const { handleSteamLink } = useSteamOAuth();
  const [nickname, setNickname] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNickname = async () => {
      // OAuth 콜백 직후 쿠키가 아직 반영되지 않았을 수 있으므로 재시도 로직 추가
      let retryCount = 0;
      const maxRetries = 5;
      const retryDelay = 500; // 500ms

      const tryFetchSession = async (): Promise<void> => {
        try {
          // 1. API를 통해 현재 로그인한 유저 정보 조회
          const sessionResponse = await fetch('/api/auth/session', {
            method: 'GET',
            credentials: 'include', // 쿠키 포함
          });

          if (!sessionResponse.ok) {
            // 재시도 가능한 경우 재시도
            if (retryCount < maxRetries) {
              retryCount++;
              setTimeout(tryFetchSession, retryDelay);
              return;
            }
            console.error('Failed to get session');
            router.replace(URL_PATHS.LOGIN);
            return;
          }

          const sessionData = await sessionResponse.json();

          // 로그인 세션이 없는 경우 재시도 또는 리다이렉트
          if (!sessionData.user || !sessionData.user.id) {
            // 재시도 가능한 경우 재시도
            if (retryCount < maxRetries) {
              retryCount++;
              setTimeout(tryFetchSession, retryDelay);
              return;
            }
            console.error('No user session found');
            router.replace(URL_PATHS.LOGIN);
            return;
          }

          const userId = sessionData.user.id;

          // 2. user_profiles 테이블에서 닉네임 조회
          // Supabase 클라이언트는 데이터베이스 쿼리용으로 계속 사용
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('nickname')
            .eq('id', userId)
            .single();

          if (profileError || !profile) {
            console.error('Failed to fetch profile:', profileError);
            setNickname('');
            setIsLoading(false);
            return;
          }

          // 3. 닉네임 설정 (null이거나 빈 문자열인 경우 fallback)
          if (profile.nickname && profile.nickname.trim()) {
            setNickname(profile.nickname.trim());
          } else {
            setNickname('');
          }
          // 성공적으로 세션과 프로필을 가져온 경우 로딩 종료
          setIsLoading(false);
        } catch (error) {
          // 재시도 가능한 경우 재시도
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(tryFetchSession, retryDelay);
            return;
          }
          console.error('Unexpected error while fetching nickname:', error);
          setNickname('');
          setIsLoading(false);
        }
      };

      tryFetchSession();
    };

    fetchNickname();
  }, [router]);

  const handleTraitsTest = () => {
    router.push(URL_PATHS.TRAITS);
  };

  // handleSteamLink는 useSteamOAuth에서 제공됨

  const handleLater = () => {
    router.push(URL_PATHS.HOME);
  };

  return {
    nickname,
    isLoading,
    handleTraitsTest,
    handleSteamLink,
    handleLater,
  };
};
