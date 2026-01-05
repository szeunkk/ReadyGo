/**
 * 📌 Domain Layer - Schedule to Active Time Text Converter
 *
 * - 순수 함수: 외부 상태(useState, hook, fetch, console 등)에 의존하지 않음
 * - 입력 → 출력이 명확한 변환 함수
 * - UI 레이어와 분리
 * - i18n / 번역 키 처리 미포함
 */

import type { ProfileCoreDTO } from '@/commons/types/profile/profileCore.dto';

/**
 * 시간대 → 한글 시간 표시 매핑
 */
const TIME_SLOT_LABEL_MAP: Record<string, string> = {
  dawn: '00 - 06시',
  morning: '06 - 12시',
  afternoon: '12 - 18시',
  evening: '18 - 24시',
};

/**
 * ProfileCoreDTO의 schedule을 요약 텍스트로 변환
 *
 * @param schedule - ProfileCoreDTO['schedule'] (PlayScheduleItem[] | undefined)
 * @returns string | undefined - "18시 - 24시" 형식의 시간대 텍스트
 *
 * @example
 * ```typescript
 * const profile: ProfileCoreDTO = {
 *   userId: 'uuid-1234',
 *   schedule: [
 *     { dayType: 'weekday', timeSlot: 'evening' },
 *     { dayType: 'weekend', timeSlot: 'evening' }
 *   ]
 * };
 *
 * const text = toActiveTimeText(profile.schedule);
 * // "18시 - 24시"
 * ```
 *
 * @example
 * ```typescript
 * // schedule이 없는 경우
 * const noSchedule = toActiveTimeText(undefined); // undefined
 * ```
 *
 * @example
 * ```typescript
 * // 빈 schedule 배열인 경우
 * const emptySchedule = toActiveTimeText([]); // undefined
 * ```
 */
export const toActiveTimeText = (
  schedule: ProfileCoreDTO['schedule']
): string | undefined => {
  // schedule이 undefined인 경우 → undefined 반환
  if (!schedule) {
    return undefined;
  }

  // 빈 배열인 경우 → undefined 반환
  if (schedule.length === 0) {
    return undefined;
  }

  // timeSlots 추출 (입력 순서 유지, 중복 제거)
  const timeSlots: string[] = [];
  for (const item of schedule) {
    if (!timeSlots.includes(item.timeSlot)) {
      timeSlots.push(item.timeSlot);
    }
  }

  // timeSlots를 한글 시간 표시로 변환
  const timeSlotsLabels = timeSlots
    .map((timeSlot) => TIME_SLOT_LABEL_MAP[timeSlot.toLowerCase()] || timeSlot)
    .join(', ');

  // 시간대만 반환
  return timeSlotsLabels;
};
