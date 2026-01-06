'use client';

import { useState, useCallback, useEffect } from 'react';
import { PartyCardProps } from '../ui/card/card';
import { supabase } from '@/lib/supabase/client';
import { AnimalType } from '@/commons/constants/animal';
import { useAuth } from '@/commons/providers/auth/auth.provider';

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

// 실제 데이터 타입
interface PartyMember {
  post_id: number;
  user_id: string;
  role: string;
  joined_at: string;
}

interface UserProfile {
  id: string;
  animal_type: string | null;
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

// 날짜와 시간을 조합하여 "MM/DD 오전/오후/새벽 HH:mm" 형식으로 변환
// - 날짜 형식: YYYY-MM-DD → MM/DD
// - 시간 형식: HH:mm:ss → "오전/오후/새벽 HH:mm"
// - 예: start_date="2024-12-25", start_time="18:30:00" → "12/25 오후 6:30"
// - 예: start_date="2024-12-26", start_time="02:00:00" → "12/26 새벽 2:00"
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

  // 새벽/오전/오후 처리
  let period: string;
  let displayHour: number;

  if (hour >= 0 && hour < 6) {
    // 새벽 (0시~5시)
    period = '새벽';
    displayHour = hour === 0 ? 12 : hour;
  } else if (hour < 12) {
    // 오전 (6시~11시)
    period = '오전';
    displayHour = hour;
  } else {
    // 오후 (12시~23시)
    period = '오후';
    displayHour = hour === 12 ? 12 : hour - 12;
  }

  return `${formattedDate} ${period} ${displayHour.toString().padStart(2, '0')}:${minute}`;
};

// voice_chat 값을 한글로 변환: 'required' → "필수 사용", 'optional' → "선택 사용", null → "선택 사용" (기본값)
const getVoiceChatLabel = (voiceChat: string | null): string => {
  if (voiceChat === 'required') {
    return '필수 사용';
  }
  if (voiceChat === 'optional') {
    return '선택 사용';
  }
  // null인 경우 기본값
  return '선택 사용';
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

// animal_type 값을 아바타 아이콘 파일명으로 변환
// animal_type 값은 AnimalType enum 값이며, 이를 아바타 아이콘 파일명으로 변환
const getAnimalTypeFromProfile = (animalType: string | null): string => {
  if (!animalType) {
    return 'default';
  }
  // AnimalType enum 값과 일치하는지 확인
  const validAnimalTypes: string[] = Object.values(AnimalType);
  if (validAnimalTypes.includes(animalType)) {
    return animalType;
  }
  return 'default';
};

// party_members 및 user_profiles 데이터를 실제 Supabase에서 조회
const fetchPartyMembersAndProfiles = async (
  postIds: number[]
): Promise<{
  membersMap: Map<number, PartyMember[]>;
  profilesMap: Map<string, UserProfile>;
}> => {
  const membersMap = new Map<number, PartyMember[]>();
  const profilesMap = new Map<string, UserProfile>();

  if (postIds.length === 0) {
    return { membersMap, profilesMap };
  }

  try {
    // 1. party_members 조회: 모든 post_id에 대한 멤버 조회
    const { data: partyMembers, error: membersError } = await supabase
      .from('party_members')
      .select('post_id, user_id, role, joined_at')
      .in('post_id', postIds);

    if (membersError) {
      console.error('party_members 조회 실패:', membersError);
      return { membersMap, profilesMap };
    }

    // post_id별로 멤버 그룹화
    if (partyMembers) {
      for (const member of partyMembers) {
        const postId = member.post_id;
        const userId = member.user_id;
        if (postId && userId) {
          if (!membersMap.has(postId)) {
            membersMap.set(postId, []);
          }
          membersMap.get(postId)!.push({
            post_id: postId,
            user_id: userId,
            role: member.role || '',
            joined_at: member.joined_at || '',
          });
        }
      }
    }

    // 2. user_profiles 조회: 모든 user_id에 대한 프로필 조회
    const userIds = Array.from(
      new Set(
        partyMembers
          ?.map((m) => m.user_id)
          .filter((id): id is string => Boolean(id)) || []
      )
    );

    if (userIds.length > 0) {
      const { data: userProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, animal_type')
        .in('id', userIds);

      if (profilesError) {
        console.error('user_profiles 조회 실패:', profilesError);
      } else if (userProfiles) {
        // user_id를 키로 하는 Map 생성
        for (const profile of userProfiles) {
          if (profile.id) {
            profilesMap.set(profile.id, {
              id: profile.id,
              animal_type: profile.animal_type,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('파티 멤버 및 프로필 조회 중 오류:', error);
  }

  return { membersMap, profilesMap };
};

// memberAvatars 생성 (실제 데이터 사용): party_posts의 id를 기반으로 실제 party_members 데이터에서 해당 파티의 참여자 정보를 가져옴
// - party_members의 user_id를 사용하여 실제 user_profiles 데이터에서 animal_type을 조회
// - animal_type 값을 아바타 아이콘 파일명과 매칭
// - 참여자 수만큼 동물 아바타를 표시 (최대 4개)
// - 참여자가 없는 경우 빈 배열로 처리
const getMemberAvatars = (
  postId: number,
  membersMap: Map<number, PartyMember[]>,
  profilesMap: Map<string, UserProfile>
): string[] => {
  const members = membersMap.get(postId) || [];
  const avatars = members.slice(0, 4).map((member) => {
    const profile = profilesMap.get(member.user_id);
    return getAnimalTypeFromProfile(profile?.animal_type || null);
  });
  return avatars;
};

// currentMembers 계산 (실제 데이터 사용): party_members 테이블에서 같은 post_id의 row 개수로 계산
const getCurrentMembers = (
  postId: number,
  membersMap: Map<number, PartyMember[]>
): number => {
  return membersMap.get(postId)?.length || 0;
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

export const useInfinitePartyList = (
  genre?: string,
  search?: string
): UseInfinitePartyListReturn => {
  const { user } = useAuth();
  const [data, setData] = useState<PartyCardProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // 원본 파티 데이터 저장 (user 변경 시 isLeader 재계산용)
  const [originalPartyData, setOriginalPartyData] = useState<PartyPost[]>([]);

  // 데이터 변환 함수 (실제 데이터 사용)
  const transformPartyData = useCallback(
    async (partyList: PartyPost[]): Promise<PartyCardProps[]> => {
      if (partyList.length === 0) {
        return [];
      }

      // party_members 및 user_profiles 조회
      const postIds = partyList.map((party) => party.id);
      const { membersMap, profilesMap } =
        await fetchPartyMembersAndProfiles(postIds);

      return partyList.map((party) => {
        // memberAvatars 생성 (실제 데이터 사용)
        const memberAvatars = getMemberAvatars(
          party.id,
          membersMap,
          profilesMap
        );

        // currentMembers 계산 (실제 데이터 사용)
        const currentMembers = getCurrentMembers(party.id, membersMap);

        // isLeader 계산: 로그인한 유저의 ID와 party_posts.creator_id가 같을 때만 true
        // 로그인하지 않은 경우(user가 null인 경우) 또는 creator_id가 없는 경우 false
        const isLeader =
          user?.id && party.creator_id && user.id === party.creator_id;

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
          isLeader,
        };
      });
    },
    [user]
  );

  // 필터 변경 시 리셋
  useEffect(() => {
    // 필터가 변경되면 데이터 리셋 및 재로드
    setData([]);
    setOriginalPartyData([]);
    setHasMore(true);
    setError(null);
    setOffset(0);
    setIsInitialLoad(true);
    setIsLoading(true);
    setIsLoadingMore(false);
  }, [genre, search]);

  // user 변경 시 기존 데이터의 isLeader 값 재계산
  useEffect(() => {
    if (originalPartyData.length === 0) {
      return;
    }

    // 원본 데이터를 partyId를 키로 하는 Map으로 변환
    const originalPartyMap = new Map<number, PartyPost>();
    originalPartyData.forEach((party) => {
      originalPartyMap.set(party.id, party);
    });

    // 기존 데이터의 isLeader만 업데이트
    setData((prevData) => {
      return prevData.map((card) => {
        if (!card.partyId) {
          return card;
        }

        const originalParty = originalPartyMap.get(
          typeof card.partyId === 'string'
            ? parseInt(card.partyId, 10)
            : card.partyId
        );

        if (!originalParty) {
          return card;
        }

        // isLeader 재계산
        const isLeader =
          user?.id &&
          originalParty.creator_id &&
          user.id === originalParty.creator_id;

        return {
          ...card,
          isLeader,
        };
      });
    });
  }, [user, originalPartyData]);

  // 초기 로드
  useEffect(() => {
    if (!isInitialLoad) {
      return;
    }

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 필터 파라미터 구성
        const params = new URLSearchParams({
          limit: String(INITIAL_LIMIT),
          offset: '0',
        });
        if (genre && genre !== 'all') {
          params.append('genre', genre);
        }
        if (search && search.trim()) {
          params.append('search', search.trim());
        }

        const response = await fetch(`/api/party?${params.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

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
        // 원본 데이터 저장
        setOriginalPartyData(partyList);
        const transformedData = await transformPartyData(partyList);

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
  }, [isInitialLoad, genre, search]);

  // 추가 데이터 로드
  const loadMore = useCallback(async () => {
    // 초기 로드 중이거나 이미 로딩 중이거나 더 이상 데이터가 없으면 리턴
    if (isInitialLoad || isLoadingMore || !hasMore) {
      return;
    }

    try {
      setIsLoadingMore(true);
      setError(null);

      // 필터 파라미터 구성
      const params = new URLSearchParams({
        limit: String(SCROLL_LIMIT),
        offset: String(offset),
      });
      if (genre && genre !== 'all') {
        params.append('genre', genre);
      }
      if (search && search.trim()) {
        params.append('search', search.trim());
      }

      const response = await fetch(`/api/party?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

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
      // 원본 데이터 추가 저장
      setOriginalPartyData((prev) => [...prev, ...partyList]);
      const transformedData = await transformPartyData(partyList);

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
  }, [isInitialLoad, isLoadingMore, hasMore, offset, genre, search]);

  // reset 함수
  const reset = useCallback(() => {
    setData([]);
    setOriginalPartyData([]);
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
