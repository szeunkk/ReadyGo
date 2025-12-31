'use client';

import { useState, useCallback, useEffect } from 'react';
import { PartyCardProps } from '../ui/card/card';

// API 응답 타입
interface PartyPost {
  id: number;
  creator_id: string;
  game_title: string;
  party_title: string;
  start_date: string;
  start_time: string;
  description: string;
  max_members: number;
  control_level: string;
  difficulty: string;
  voice_chat: string | null;
  tags: string[] | null;
  status: string;
  created_at: string;
}

// Mock 데이터 타입
interface MockPartyMember {
  post_id: number;
  user_id: string;
  role: string;
  joined_at: string;
}

interface MockUserProfile {
  user_id: string;
  animal_type: string;
}

interface UseInfinitePartyListReturn {
  data: PartyCardProps[];
  hasMore: boolean;
  loadMore: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

// 상수 정의
const INITIAL_LIMIT = 10;
const SCROLL_LIMIT = 10;

// 날짜와 시간을 조합하여 "MM/DD 오전/오후 HH:mm" 또는 "MM/DD 새벽 HH:mm" 형식으로 변환
const formatDateTime = (dateString: string, timeString: string): string => {
  const dateMatch = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!dateMatch) {
    return `${dateString} ${timeString}`;
  }
  const [, , month, day] = dateMatch;
  const formattedDate = `${month}/${day}`;

  const timeMatch = timeString.match(/(\d{2}):(\d{2}):(\d{2})/);
  if (!timeMatch) {
    return `${formattedDate} ${timeString}`;
  }

  const [, hourStr, minuteStr] = timeMatch;
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr;

  if (hour >= 0 && hour < 6) {
    const displayHour = hour === 0 ? 12 : hour;
    return `${formattedDate} 새벽 ${displayHour}:${minute}`;
  }

  const period = hour < 12 ? '오전' : '오후';
  const displayHour =
    hour === 0 ? 12 : hour > 12 ? hour - 12 : hour === 12 ? 12 : hour;

  return `${formattedDate} ${period} ${displayHour.toString().padStart(2, '0')}:${minute}`;
};

// voice_chat 값을 한글로 변환
const getVoiceChatLabel = (voiceChat: string | null): string => {
  if (voiceChat === 'required') {
    return '필수 사용';
  }
  if (voiceChat === 'optional') {
    return '선택 사용';
  }
  return '사용 안함';
};

// control_level 값을 한글로 변환
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

// difficulty 값을 한글로 변환
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

// Mock 데이터: party_members
const mockPartyMembers: MockPartyMember[] = [
  {
    post_id: 1,
    user_id: 'user-1',
    role: 'member',
    joined_at: '2024-01-01T00:00:00Z',
  },
  {
    post_id: 1,
    user_id: 'user-2',
    role: 'member',
    joined_at: '2024-01-01T00:00:00Z',
  },
  {
    post_id: 2,
    user_id: 'user-3',
    role: 'member',
    joined_at: '2024-01-01T00:00:00Z',
  },
  {
    post_id: 2,
    user_id: 'user-4',
    role: 'member',
    joined_at: '2024-01-01T00:00:00Z',
  },
  {
    post_id: 2,
    user_id: 'user-5',
    role: 'member',
    joined_at: '2024-01-01T00:00:00Z',
  },
  {
    post_id: 3,
    user_id: 'user-6',
    role: 'member',
    joined_at: '2024-01-01T00:00:00Z',
  },
];

// Mock 데이터: user_profiles
const mockUserProfiles: MockUserProfile[] = [
  { user_id: 'user-1', animal_type: 'raven' },
  { user_id: 'user-2', animal_type: 'hedgehog' },
  { user_id: 'user-3', animal_type: 'dolphin' },
  { user_id: 'user-4', animal_type: 'fox' },
  { user_id: 'user-5', animal_type: 'bear' },
  { user_id: 'user-6', animal_type: 'tiger' },
];

// memberAvatars 생성 (Mock 데이터 사용)
const getMemberAvatars = (postId: number): string[] => {
  const members = mockPartyMembers.filter((m) => m.post_id === postId);
  const avatars = members.slice(0, 4).map((member) => {
    const profile = mockUserProfiles.find((p) => p.user_id === member.user_id);
    return profile?.animal_type || 'default';
  });
  return avatars;
};

// currentMembers 계산 (Mock 데이터 사용)
const getCurrentMembers = (postId: number): number => {
  return mockPartyMembers.filter((m) => m.post_id === postId).length;
};

// description이 카드 사이즈를 넘어가는 경우 "..."으로 표현
const truncateDescription = (
  description: string,
  maxLength: number = 100
): string => {
  if (description.length <= maxLength) {
    return description;
  }
  return `${description.substring(0, maxLength)}...`;
};

export const useInfinitePartyList = (): UseInfinitePartyListReturn => {
  const [data, setData] = useState<PartyCardProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 데이터 변환 함수
  const transformPartyData = useCallback(
    (partyList: PartyPost[]): PartyCardProps[] => {
      return partyList.map((party) => {
        const memberAvatars = getMemberAvatars(party.id);
        const currentMembers = getCurrentMembers(party.id);

        return {
          title: party.party_title,
          description: truncateDescription(party.description),
          gameTag: party.game_title,
          memberAvatars,
          currentMembers,
          maxMembers: party.max_members,
          categories: {
            startTime: formatDateTime(party.start_date, party.start_time),
            voiceChat: getVoiceChatLabel(party.voice_chat),
            difficulty: getDifficultyLabel(party.difficulty),
            controlLevel: getControlLevelLabel(party.control_level),
          },
          partyId: party.id,
        };
      });
    },
    []
  );

  // 초기 로드
  useEffect(() => {
    if (!isInitialLoad) {
      return;
    }

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/party?limit=${INITIAL_LIMIT}&offset=0`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          if (response.status >= 400 && response.status < 500) {
            const errorData = await response.json().catch(() => ({}));
            console.error(
              '파티 목록 조회 실패:',
              errorData.error || '클라이언트 오류'
            );
            setData([]);
            setHasMore(false);
            setIsInitialLoad(false);
            setIsLoading(false);
            return;
          }
          if (response.status >= 500) {
            const errorData = await response.json().catch(() => ({}));
            console.error(
              '파티 목록 조회 실패:',
              errorData.error || '서버 오류'
            );
            setData([]);
            setHasMore(false);
            setIsInitialLoad(false);
            setIsLoading(false);
            return;
          }
        }

        const result = await response.json();

        if (result.error) {
          console.error('파티 목록 조회 실패:', result.error);
          setData([]);
          setHasMore(false);
          setIsInitialLoad(false);
          setIsLoading(false);
          return;
        }

        const partyList: PartyPost[] = result.data || [];
        const transformedData = transformPartyData(partyList);

        // 초기 로드: 6개 미만이 와도 그 데이터는 표시
        setData(transformedData);
        setOffset(INITIAL_LIMIT);
        // 받은 데이터가 limit(6개)보다 적으면 더 이상 데이터가 없다는 의미
        // limit과 같거나 더 많으면 더 불러올 데이터가 있을 수 있음
        setHasMore(partyList.length >= INITIAL_LIMIT);
        setIsInitialLoad(false);
      } catch (err) {
        console.error('파티 목록 조회 중 오류:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('데이터를 불러오는 중 오류가 발생했습니다.')
        );
        setData([]);
        setHasMore(false);
        setIsInitialLoad(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialLoad]);

  // 추가 데이터 로드
  const loadMore = useCallback(async () => {
    // 초기 로드 중이거나 이미 로딩 중이거나 더 이상 데이터가 없으면 리턴
    if (isInitialLoad || isLoadingMore || !hasMore) {
      return;
    }

    try {
      setIsLoadingMore(true);
      setError(null);

      const response = await fetch(
        `/api/party?limit=${SCROLL_LIMIT}&offset=${offset}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            '파티 목록 조회 실패:',
            errorData.error || '클라이언트 오류'
          );
          setHasMore(false);
          return;
        }
        if (response.status >= 500) {
          const errorData = await response.json().catch(() => ({}));
          console.error('파티 목록 조회 실패:', errorData.error || '서버 오류');
          setHasMore(false);
          return;
        }
      }

      const result = await response.json();

      if (result.error) {
        console.error('파티 목록 조회 실패:', result.error);
        setHasMore(false);
        return;
      }

      const partyList: PartyPost[] = result.data || [];
      const transformedData = transformPartyData(partyList);

      if (partyList.length === 0) {
        // 데이터가 없으면 더 이상 불러올 데이터가 없음
        setHasMore(false);
      } else {
        // 10개 미만이 와도 그 데이터는 표시하고, 더 이상 데이터가 없으면 hasMore를 false로 설정
        setData((prev) => [...prev, ...transformedData]);
        setOffset((prev) => prev + partyList.length);
        // 받은 데이터가 limit(10개)보다 적으면 더 이상 데이터가 없다는 의미
        // limit과 같거나 더 많으면 더 불러올 데이터가 있을 수 있음
        setHasMore(partyList.length >= SCROLL_LIMIT);
      }
    } catch (err) {
      console.error('파티 목록 조회 중 오류:', err);
      setError(
        err instanceof Error
          ? err
          : new Error('데이터를 불러오는 중 오류가 발생했습니다.')
      );
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
    // transformPartyData는 useCallback으로 감싸져 있고 의존성이 없으므로 안정적
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialLoad, isLoadingMore, hasMore, offset]);

  // reset 함수
  const reset = useCallback(() => {
    setData([]);
    setHasMore(true);
    setError(null);
    setOffset(0);
    setIsInitialLoad(true);
    setIsLoading(true);
    setIsLoadingMore(false);
  }, []);

  return {
    data,
    hasMore,
    loadMore,
    isLoading: isLoading || isLoadingMore,
    error,
    reset,
  };
};
