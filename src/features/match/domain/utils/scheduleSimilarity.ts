/**
 * ❗ Schedule Similarity Utilities
 *
 * 📌 책임 (Responsibility):
 * - Schedule 유사도 계산 전용 유틸리티
 * - 공통 플레이 시간대 비율 계산
 * - 순수 함수로 구현
 *
 * 📌 전제 조건 (Preconditions):
 * - Schedule은 { dayType, timeSlot } 구조
 * - 빈 배열 입력 가능 (Schedule 미설정 상태)
 */

import type { PlayScheduleInput } from '@/commons/types/match/matchContextCore.dto';

/**
 * Schedule 유사도 계산 (공통 시간대 비율)
 *
 * 📌 계산 원리:
 * - 두 사용자의 플레이 시간대 중 공통 시간대 비율 계산
 * - 공통 시간대 수 / max(viewer 시간대 수, target 시간대 수)
 * - 더 많은 시간대를 가진 사용자 기준으로 비율 계산
 *
 * 📌 반환값:
 * - 0: 공통 시간대 없음
 * - 100: 모든 시간대가 공통
 * - 50: 절반의 시간대가 공통
 *
 * @param viewerSchedule - viewer 플레이 시간대
 * @param targetSchedule - target 플레이 시간대
 * @returns 0~100 범위의 유사도 점수
 *
 * @example
 * ```typescript
 * const viewerSchedule = [
 *   { dayType: 'weekday', timeSlot: '18-24' },
 *   { dayType: 'weekend', timeSlot: '12-18' }
 * ];
 *
 * const targetSchedule = [
 *   { dayType: 'weekday', timeSlot: '18-24' }
 * ];
 *
 * const similarity = calculateScheduleSimilarity(viewerSchedule, targetSchedule);
 * // 50 (공통 1개 / max(2, 1) = 1/2 = 0.5 = 50%)
 * ```
 *
 * @example
 * ```typescript
 * // Schedule 미설정 (빈 배열)
 * const similarity = calculateScheduleSimilarity([], []);
 * // 0 (공통 시간대 없음)
 * ```
 */
export function calculateScheduleSimilarity(
  viewerSchedule: PlayScheduleInput[],
  targetSchedule: PlayScheduleInput[]
): number {
  // 빈 배열 처리: 0 반환
  if (viewerSchedule.length === 0 || targetSchedule.length === 0) {
    return 0;
  }

  // 공통 시간대 찾기
  const commonSlots = viewerSchedule.filter((vs) =>
    targetSchedule.some(
      (ts) => ts.dayType === vs.dayType && ts.timeSlot === vs.timeSlot
    )
  );

  // 공통 시간대 비율 계산
  // 더 많은 시간대를 가진 사용자 기준
  const totalSlots = Math.max(viewerSchedule.length, targetSchedule.length);
  const ratio = commonSlots.length / totalSlots;

  // 0~100 범위로 변환
  return Math.round(ratio * 100);
}

