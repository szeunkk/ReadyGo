'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export interface PartyDetailData {
  id: number;
  party_title: string;
  game_title: string;
  description: string;
  start_date: string; // mm/dd 형식
  start_time: string; // "오전 hh:mm" 또는 "오후 hh:mm" 형식
  max_members: number;
  control_level: string; // 한국어 값
  difficulty: string; // 한국어 값
  voice_chat: string | null;
  tags: string[]; // 배열로 변환
  created_at: string;
  creator_id: string;
}

interface UsePartyBindingReturn {
  data: PartyDetailData | null;
  isLoading: boolean;
  error: Error | null;
}

// 날짜 형식 변환: YYYY-MM-DD → mm/dd
const formatDate = (dateString: string): string => {
  const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return dateString;
  }
  return `${match[2]}/${match[3]}`;
};

// 시간 형식 변환: HH:mm:ss → "오전 hh:mm" 또는 "오후 hh:mm"
const formatTime = (timeString: string): string => {
  const match = timeString.match(/(\d{2}):(\d{2}):(\d{2})/);
  if (!match) {
    return timeString;
  }

  const [, hourStr, minuteStr] = match;
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const period = hour < 12 ? '오전' : '오후';
  const displayHour =
    hour === 0 ? 12 : hour > 12 ? hour - 12 : hour === 12 ? 12 : hour;

  return `${period} ${displayHour.toString().padStart(2, '0')}:${minute}`;
};

// 컨트롤 수준 한국어 변환
const getControlLevelLabel = (controlLevel: string): string => {
  const controlLevelMap: Record<string, string> = {
    beginner: '미숙',
    intermediate: '반숙',
    advanced: '완숙',
    expert: '빡숙',
    master: '장인',
  };
  return controlLevelMap[controlLevel] || controlLevel;
};

// 난이도 한국어 변환
const getDifficultyLabel = (difficulty: string): string => {
  const difficultyMap: Record<string, string> = {
    undefined: '미정',
    flexible: '유동',
    easy: '이지',
    normal: '노멀',
    hard: '하드',
    hell: '지옥',
  };
  return difficultyMap[difficulty] || difficulty;
};

// voice_chat 표시 텍스트 변환
const getVoiceChatLabel = (voiceChat: string | null): string => {
  if (voiceChat === null) {
    return '사용 안함';
  }
  if (voiceChat === 'required') {
    return '필수 사용';
  }
  if (voiceChat === 'optional') {
    return '선택적 사용';
  }
  return voiceChat;
};

// tags 배열 변환
const parseTags = (tags: unknown): string[] => {
  if (tags === null || tags === undefined) {
    return [];
  }
  if (Array.isArray(tags)) {
    return tags.filter((tag) => typeof tag === 'string');
  }
  return [];
};

export const usePartyBinding = (): UsePartyBindingReturn => {
  const params = useParams();
  const partyId = params?.id as string | undefined;
  const [data, setData] = useState<PartyDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!partyId) {
      setError(new Error('파티 ID가 없습니다.'));
      setIsLoading(false);
      return;
    }

    const fetchPartyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const id = parseInt(partyId, 10);
        if (isNaN(id)) {
          throw new Error('유효하지 않은 파티 ID입니다.');
        }

        // Supabase에서 데이터 조회
        const { data: partyData, error: fetchError } = await supabase
          .from('party_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (!partyData) {
          throw new Error('파티 데이터를 찾을 수 없습니다.');
        }

        // 데이터 변환
        const transformedData: PartyDetailData = {
          id: partyData.id,
          party_title: partyData.party_title,
          game_title: partyData.game_title,
          description: partyData.description,
          start_date: formatDate(partyData.start_date),
          start_time: formatTime(partyData.start_time),
          max_members: partyData.max_members,
          control_level: getControlLevelLabel(partyData.control_level),
          difficulty: getDifficultyLabel(partyData.difficulty),
          voice_chat: getVoiceChatLabel(partyData.voice_chat),
          tags: parseTags(partyData.tags),
          created_at: partyData.created_at,
          creator_id: partyData.creator_id,
        };

        setData(transformedData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('데이터를 불러오는 중 오류가 발생했습니다.')
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartyData();
  }, [partyId]);

  return { data, isLoading, error };
};
