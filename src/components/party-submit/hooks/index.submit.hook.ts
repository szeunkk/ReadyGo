'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { useAuth } from '@/commons/providers/auth/auth.provider';
import { useModal } from '@/commons/providers/modal';
import { getPartyDetailUrl, URL_PATHS } from '@/commons/constants/url';

// 날짜 형식 변환: antd DatePicker의 Dayjs 객체를 Supabase date 형식(YYYY-MM-DD)으로 변환
const convertDateToSupabaseFormat = (date: Dayjs | null): string | null => {
  if (!date) {
    return null;
  }
  // dayjs의 format을 사용하여 YYYY-MM-DD 형식으로 변환
  return date.format('YYYY-MM-DD');
};

// 시간 형식 변환: "오후 11:00", "오전 09:30" 형식을 Supabase time 형식(HH:mm:ss)으로 변환
const convertTimeToSupabaseFormat = (
  timeString: string | null
): string | null => {
  if (!timeString) {
    return null;
  }

  // "오전 09:30" 또는 "오후 11:00" 형식 파싱
  const match = timeString.match(/(오전|오후)\s+(\d{1,2}):(\d{2})/);
  if (!match) {
    return null;
  }

  const [, period, hourStr, minuteStr] = match;
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  // 오후인 경우 12를 더함 (단, 12시는 그대로 유지)
  if (period === '오후' && hour !== 12) {
    hour += 12;
  }
  // 오전 12시는 0시로 변환
  if (period === '오전' && hour === 12) {
    hour = 0;
  }

  // HH:mm:ss 형식으로 변환
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
};

// 태그 형식 변환: "#금요일#가보자#빡겜" 형식을 "#" 기호로 분리하여 string[] 형태로 변환
const convertTagsToArray = (
  tagsString: string | null | undefined
): string[] | null => {
  if (!tagsString || tagsString.trim() === '') {
    return null;
  }

  // "#" 기호로 분리하고, 빈 문자열 제거
  const tags = tagsString
    .split('#')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return tags.length > 0 ? tags : null;
};

// Supabase 날짜 형식을 Dayjs 객체로 변환: YYYY-MM-DD → Dayjs
const convertSupabaseDateToDayjs = (
  dateString: string | null
): Dayjs | null => {
  if (!dateString) {
    return null;
  }
  return dayjs(dateString);
};

// Supabase 시간 형식을 폼 형식으로 변환: HH:mm:ss → "오전 hh:mm" 또는 "오후 hh:mm"
const convertSupabaseTimeToFormFormat = (
  timeString: string | null
): string | null => {
  if (!timeString) {
    return null;
  }

  const match = timeString.match(/(\d{2}):(\d{2}):(\d{2})/);
  if (!match) {
    return null;
  }

  const [, hourStr, minuteStr] = match;
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const period = hour < 12 ? '오전' : '오후';
  const displayHour =
    hour === 0 ? 12 : hour > 12 ? hour - 12 : hour === 12 ? 12 : hour;

  return `${period} ${displayHour.toString().padStart(2, '0')}:${minute}`;
};

// 태그 배열을 폼 형식으로 변환: string[] → "#태그1#태그2" 형식
const convertTagsArrayToFormFormat = (
  tags: string[] | null | undefined
): string => {
  if (!tags || tags.length === 0) {
    return '';
  }
  return tags.map((tag) => `#${tag}`).join('');
};

// Zod 스키마 정의
const partySubmitSchema = z.object({
  game_title: z.string().min(1, '게임을 선택해주세요.'),
  party_title: z.string().min(1, '파티 제목을 입력해주세요.'),
  start_date: z.custom<Dayjs | null>((val) => val !== null, {
    message: '시작일을 선택해주세요.',
  }),
  start_time: z.string().min(1, '시작시간을 선택해주세요.'), // "오전 09:00" 형식의 value
  description: z
    .string()
    .min(1, '설명을 입력해주세요.')
    .max(100, '설명은 100자 이하여야 합니다.'),
  max_members: z
    .number()
    .min(1, '최소 1명 이상이어야 합니다.')
    .max(10, '최대 10명까지 가능합니다.'),
  control_level: z.string().min(1, '컨트롤 수준을 선택해주세요.'),
  difficulty: z.string().min(1, '난이도를 선택해주세요.'),
  voice_chat: z.enum(['required', 'optional']).nullable().optional(),
  tags: z.string().optional(), // "#금요일#가보자#빡겜" 형식으로 입력받음
});

export type PartySubmitFormData = z.infer<typeof partySubmitSchema>;

interface UsePartySubmitOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  isEdit?: boolean;
  partyId?: number;
  onRefetch?: () => Promise<void>;
}

export const usePartySubmit = (options?: UsePartySubmitOptions) => {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { openModal, closeAllModals } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPartyData, setIsLoadingPartyData] = useState(false);
  const isEdit = options?.isEdit ?? false;
  const partyId = options?.partyId;

  const form = useForm<PartySubmitFormData>({
    resolver: zodResolver(partySubmitSchema),
    defaultValues: {
      game_title: '',
      party_title: '',
      start_date: null,
      start_time: '',
      description: '',
      max_members: 4,
      control_level: '',
      difficulty: '',
      voice_chat: null,
      tags: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, formState, reset } = form;
  const { errors, isValid } = formState;

  // 수정 모드일 경우 파티 데이터 조회 및 폼 초기값 설정
  useEffect(() => {
    if (!isEdit || !partyId) {
      return;
    }

    const fetchPartyData = async () => {
      try {
        setIsLoadingPartyData(true);

        const response = await fetch(`/api/party/${partyId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('파티 데이터를 불러올 수 없습니다.');
        }

        const { data: partyData } = await response.json();

        if (!partyData) {
          throw new Error('파티 데이터를 찾을 수 없습니다.');
        }

        // 폼 초기값 설정
        reset({
          game_title: partyData.game_title || '',
          party_title: partyData.party_title || '',
          start_date: convertSupabaseDateToDayjs(partyData.start_date),
          start_time:
            convertSupabaseTimeToFormFormat(partyData.start_time) || '',
          description: partyData.description || '',
          max_members: partyData.max_members || 4,
          control_level: partyData.control_level || '',
          difficulty: partyData.difficulty || '',
          voice_chat: partyData.voice_chat || null,
          tags: convertTagsArrayToFormFormat(
            Array.isArray(partyData.tags) ? partyData.tags : null
          ),
        });
      } catch (error) {
        console.error('파티 데이터 조회 실패:', error);
        openModal({
          variant: 'dual',
          title: '데이터 로드 실패',
          description:
            error instanceof Error
              ? error.message
              : '파티 데이터를 불러오는 중 오류가 발생했습니다.',
          onConfirm: () => {
            closeAllModals();
          },
        });
      } finally {
        setIsLoadingPartyData(false);
      }
    };

    fetchPartyData();
  }, [isEdit, partyId, reset, openModal, closeAllModals]);

  const onSubmit = handleSubmit(async (data: PartySubmitFormData) => {
    // 인증 확인
    if (!isLoggedIn || !user) {
      openModal({
        variant: 'dual',
        title: '등록 실패',
        description: '로그인이 필요합니다.',
        onConfirm: () => {
          router.push(URL_PATHS.LOGIN);
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 날짜/시간/태그 변환
      const supabaseDate = convertDateToSupabaseFormat(data.start_date);
      const supabaseTime = convertTimeToSupabaseFormat(data.start_time);
      const supabaseTags = convertTagsToArray(data.tags);

      if (!supabaseDate || !supabaseTime) {
        throw new Error('날짜 또는 시간 형식이 올바르지 않습니다.');
      }

      // 수정 모드일 경우 PATCH, 작성 모드일 경우 POST
      const apiUrl = isEdit && partyId ? `/api/party/${partyId}` : '/api/party';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // HttpOnly 쿠키 포함 (중요!)
        body: JSON.stringify({
          game_title: data.game_title,
          party_title: data.party_title,
          start_date: supabaseDate,
          start_time: supabaseTime,
          description: data.description,
          max_members: data.max_members,
          control_level: data.control_level,
          difficulty: data.difficulty,
          voice_chat: data.voice_chat || null,
          tags: supabaseTags,
        }),
      });

      // 응답 상태 확인
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('인증이 필요합니다.');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || '파티 등록 중 오류가 발생했습니다.');
      }

      // JSON 파싱
      const { data: responseData } = await response.json();

      if (!responseData || !responseData.id) {
        throw new Error(
          isEdit
            ? '수정된 파티 ID를 가져올 수 없습니다.'
            : '등록된 파티 ID를 가져올 수 없습니다.'
        );
      }

      // 성공 모달 표시
      openModal({
        variant: 'dual',
        title: isEdit ? '수정 완료' : '등록 완료',
        description: isEdit
          ? '파티가 성공적으로 수정되었습니다.'
          : '파티가 성공적으로 등록되었습니다.',
        onConfirm: () => {
          // 모든 모달 닫기
          closeAllModals();

          if (isEdit) {
            // 수정 모드일 경우: 페이지 이동 없이 모달만 닫고 refetch 호출
            options?.onRefetch?.();
            options?.onSuccess?.();
          } else {
            // 작성 모드일 경우: 상세 페이지로 이동
            router.push(getPartyDetailUrl(responseData.id));
            options?.onSuccess?.();
          }
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '파티 등록 중 오류가 발생했습니다.';

      // 에러 모달 표시
      openModal({
        variant: 'dual',
        title: isEdit ? '수정 실패' : '등록 실패',
        description: `파티 ${isEdit ? '수정' : '등록'} 중 오류가 발생했습니다. ${errorMessage}`,
        onConfirm: () => {
          // 모달만 닫고 페이지 이동하지 않음
        },
      });

      options?.onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting,
    isLoggedIn,
    errors,
    isValid,
    isLoadingPartyData,
  };
};
