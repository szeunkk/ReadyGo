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
      try {
        // 1. 현재 로그인한 유저의 ID 확보
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        // 로그인 세션이 없는 경우 로그인 페이지로 리다이렉트
        if (userError || !user || !user.id) {
          console.error('Failed to get user:', userError);
          router.replace(URL_PATHS.LOGIN);
          return;
        }

        const userId = user.id;

        // 2. user_profiles 테이블에서 닉네임 조회
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
      } catch (error) {
        console.error('Unexpected error while fetching nickname:', error);
        setNickname('');
      } finally {
        setIsLoading(false);
      }
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
