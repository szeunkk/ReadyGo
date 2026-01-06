'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase/client';
import { URL_PATHS } from '@/commons/constants/url';
import { useSteamOAuth } from '@/components/auth/hooks/useSteamOAuth.hook';
import { useAuth } from '@/commons/providers/auth/auth.provider';

export const useSignupSuccess = () => {
  const router = useRouter();
  const { handleSteamLink } = useSteamOAuth();
  const { user, isSessionSynced, syncSession } = useAuth();
  const [nickname, setNickname] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 세션 동기화 및 닉네임 조회
  useEffect(() => {
    const fetchNickname = async () => {
      // 세션 동기화가 완료되지 않았으면 동기화 시도
      if (!isSessionSynced) {
        await syncSession();
        return;
      }

      // 사용자 정보가 없으면 로그인 페이지로 리다이렉트
      if (!user) {
        console.error('No user session found');
        router.replace(URL_PATHS.LOGIN);
        return;
      }

      // user_profiles 테이블에서 닉네임 조회
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('nickname')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          console.error('Failed to fetch profile:', profileError);
          setNickname('');
          setIsLoading(false);
          return;
        }

        // 닉네임 설정 (null이거나 빈 문자열인 경우 fallback)
        if (profile.nickname && profile.nickname.trim()) {
          setNickname(profile.nickname.trim());
        } else {
          setNickname('');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Unexpected error while fetching nickname:', error);
        setNickname('');
        setIsLoading(false);
      }
    };

    fetchNickname();
  }, [isSessionSynced, user, syncSession, router]);

  const handleTraitsTest = async () => {
    // 세션 동기화가 완료될 때까지 대기
    if (!isSessionSynced) {
      await syncSession();
    }
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
