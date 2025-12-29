'use client';

import { useEffect, useState } from 'react';
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

interface UsePartyListBindingReturn {
  data: PartyCardProps[];
  isLoading: boolean;
  error: Error | null;
}

// 날짜와 시간을 조합하여 "MM/DD 오전/오후 HH:mm" 또는 "MM/DD 새벽 HH:mm" 형식으로 변환
// - 날짜 형식: YYYY-MM-DD → MM/DD
// - 시간 형식: HH:mm:ss → "오전/오후/새벽 HH:mm"
const formatDateTime = (dateString: string, timeString: string): string => {
  // 날짜 파싱: YYYY-MM-DD → MM/DD
  const dateMatch = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!dateMatch) {
    return `${dateString} ${timeString}`;
  }
  const [, , month, day] = dateMatch;
  const formattedDate = `${month}/${day}`;

  // 시간 파싱: HH:mm:ss → 오전/오후/새벽 HH:mm
  const timeMatch = timeString.match(/(\d{2}):(\d{2}):(\d{2})/);
  if (!timeMatch) {
    return `${formattedDate} ${timeString}`;
  }

  const [, hourStr, minuteStr] = timeMatch;
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr;

  // 새벽 시간대 처리 (0시~5시)
  if (hour >= 0 && hour < 6) {
    const displayHour = hour === 0 ? 12 : hour;
    return `${formattedDate} 새벽 ${displayHour}:${minute}`;
  }

  // 오전/오후 처리
  const period = hour < 12 ? '오전' : '오후';
  const displayHour =
    hour === 0 ? 12 : hour > 12 ? hour - 12 : hour === 12 ? 12 : hour;

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

// control_level 값을 한글로 변환: 영어 id를 한국어 label로 변환
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

// difficulty 값을 한글로 변환: 영어 id를 한국어 label로 변환
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
  { post_id: 1, user_id: 'user-1', role: 'member', joined_at: '2024-01-01T00:00:00Z' },
  { post_id: 1, user_id: 'user-2', role: 'member', joined_at: '2024-01-01T00:00:00Z' },
  { post_id: 2, user_id: 'user-3', role: 'member', joined_at: '2024-01-01T00:00:00Z' },
  { post_id: 2, user_id: 'user-4', role: 'member', joined_at: '2024-01-01T00:00:00Z' },
  { post_id: 2, user_id: 'user-5', role: 'member', joined_at: '2024-01-01T00:00:00Z' },
  { post_id: 3, user_id: 'user-6', role: 'member', joined_at: '2024-01-01T00:00:00Z' },
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

// memberAvatars 생성 (Mock 데이터 사용): party_posts의 id를 기반으로 Mock party_members 데이터에서 해당 파티의 참여자 정보를 가져옴
// - 참여자 수만큼 동물 아바타를 표시 (최대 4개)
// - 참여자가 없는 경우 빈 배열로 처리
const getMemberAvatars = (postId: number): string[] => {
  // 해당 파티의 참여자 찾기
  const members = mockPartyMembers.filter((m) => m.post_id === postId);
  
  // 참여자 수만큼 동물 아바타 생성 (최대 4개)
  const avatars = members
    .slice(0, 4)
    .map((member) => {
      const profile = mockUserProfiles.find((p) => p.user_id === member.user_id);
      return profile?.animal_type || 'default';
    });

  return avatars;
};

// currentMembers 계산 (Mock 데이터 사용): Mock party_members 데이터에서 해당 post_id의 참여자 수를 계산
const getCurrentMembers = (postId: number): number => {
  return mockPartyMembers.filter((m) => m.post_id === postId).length;
};

// description이 카드 사이즈를 넘어가는 경우 "..."으로 표현하여 카드 사이즈를 넘어가지 않도록 처리
const truncateDescription = (description: string, maxLength: number = 100): string => {
  if (description.length <= maxLength) {
    return description;
  }
  return `${description.substring(0, maxLength)}...`;
};

export const usePartyListBinding = (): UsePartyListBindingReturn => {
  const [data, setData] = useState<PartyCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPartyList = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // API 호출: GET /api/party
        // 주의: party_posts 테이블에 status 컬럼이 없으므로 status 파라미터 제거
        const response = await fetch('/api/party', {
          method: 'GET',
          credentials: 'include', // 쿠키 자동 포함
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // HTTP 상태 코드 확인
        if (!response.ok) {
          if (response.status >= 400 && response.status < 500) {
            const errorData = await response.json().catch(() => ({}));
            console.error('파티 목록 조회 실패:', errorData.error || '클라이언트 오류');
            setData([]);
            return;
          }
          if (response.status >= 500) {
            const errorData = await response.json().catch(() => ({}));
            console.error('파티 목록 조회 실패:', errorData.error || '서버 오류');
            setData([]);
            return;
          }
        }

        // JSON 파싱
        const result = await response.json();

        // 에러 응답 확인
        if (result.error) {
          console.error('파티 목록 조회 실패:', result.error);
          setData([]);
          return;
        }

        // 데이터 변환
        const partyList: PartyPost[] = result.data || [];

        const transformedData: PartyCardProps[] = partyList.map((party) => {
          // memberAvatars 생성 (Mock 데이터 사용)
          const memberAvatars = getMemberAvatars(party.id);
          
          // currentMembers 계산 (Mock 데이터 사용)
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

        setData(transformedData);
      } catch (err) {
        console.error('파티 목록 조회 중 오류:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('데이터를 불러오는 중 오류가 발생했습니다.')
        );
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartyList();
  }, []);

  return { data, isLoading, error };
};

