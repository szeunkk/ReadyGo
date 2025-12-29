'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Dayjs } from 'dayjs';

import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/commons/providers/auth/auth.provider';
import { useModal } from '@/commons/providers/modal';
import { getPartyDetailUrl, URL_PATHS } from '@/commons/constants/url';

// 날짜 변환: antd DatePicker의 "yy-mm-dd" 형식을 Supabase date 형식으로 변환
const convertDateToSupabaseFormat = (date: Dayjs | null): string | null => {
  if (!date) {
    return null;
  }
  // dayjs의 format을 사용하여 YYYY-MM-DD 형식으로 변환
  return date.format('YYYY-MM-DD');
};

// 시간 변환: "오후 11:00", "오전 09:30" 형식을 Supabase time 형식(HH:mm:ss)으로 변환
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
  tags: z.array(z.string()).optional(),
});

export type PartySubmitFormData = z.infer<typeof partySubmitSchema>;

interface UsePartySubmitOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const usePartySubmit = (options?: UsePartySubmitOptions) => {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { openModal, closeAllModals } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      tags: [],
    },
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { errors, isValid } = formState;

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
      // 날짜/시간 변환
      const supabaseDate = convertDateToSupabaseFormat(data.start_date);
      const supabaseTime = convertTimeToSupabaseFormat(data.start_time);

      if (!supabaseDate || !supabaseTime) {
        throw new Error('날짜 또는 시간 형식이 올바르지 않습니다.');
      }

      // Supabase에 insert
      const { data: insertData, error } = await supabase
        .from('party_posts')
        .insert({
          creator_id: user.id,
          game_title: data.game_title,
          party_title: data.party_title,
          start_date: supabaseDate,
          start_time: supabaseTime,
          description: data.description,
          max_members: data.max_members,
          control_level: data.control_level,
          difficulty: data.difficulty,
          voice_chat: data.voice_chat || null,
          tags: data.tags && data.tags.length > 0 ? data.tags : null,
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      if (!insertData || !insertData.id) {
        throw new Error('등록된 파티 ID를 가져올 수 없습니다.');
      }

      // 성공 모달 표시
      openModal({
        variant: 'dual',
        title: '등록 완료',
        description: '파티가 성공적으로 등록되었습니다.',
        onConfirm: () => {
          // 모든 모달 닫기
          closeAllModals();
          // 상세 페이지로 이동
          router.push(getPartyDetailUrl(insertData.id));
          options?.onSuccess?.();
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
        title: '등록 실패',
        description: `파티 등록 중 오류가 발생했습니다. ${errorMessage}`,
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
  };
};
