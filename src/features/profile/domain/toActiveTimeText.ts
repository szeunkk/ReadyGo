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
 * ProfileCoreDTO의 schedule을 요약 텍스트로 변환
 *
 * @param schedule - ProfileCoreDTO['schedule'] (PlayScheduleItem[] | undefined)
 * @returns string | undefined - "WEEKDAY, WEEKEND / EVENING" 형식의 텍스트
 *
 * @example
 * ```typescript
 * const profile: ProfileCoreDTO = {
 *   userId: 'uuid-1234',
 *   schedule: [
 *     { dayType: 'WEEKDAY', timeSlot: 'EVENING' },
 *     { dayType: 'WEEKEND', timeSlot: 'EVENING' }
 *   ]
 * };
 *
 * const text = toActiveTimeText(profile.schedule);
 * // "WEEKDAY, WEEKEND / EVENING"
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

  // dayTypes 추출 (입력 순서 유지, 중복 제거)
  const dayTypes: string[] = [];
  for (const item of schedule) {
    if (!dayTypes.includes(item.dayType)) {
      dayTypes.push(item.dayType);
    }
  }

  // timeSlots 추출 (입력 순서 유지, 중복 제거)
  const timeSlots: string[] = [];
  for (const item of schedule) {
    if (!timeSlots.includes(item.timeSlot)) {
      timeSlots.push(item.timeSlot);
    }
  }

  // dayTypes 부분 생성
  const dayTypesText = dayTypes.join(', ');

  // timeSlots 부분 생성
  const timeSlotsText = timeSlots.join(', ');

  // 최종 텍스트 조합: "dayTypes / timeSlots"
  return `${dayTypesText} / ${timeSlotsText}`;
};
