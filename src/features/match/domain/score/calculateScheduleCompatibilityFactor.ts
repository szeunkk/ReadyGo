/**
 * ❗ Calculate Schedule Compatibility Factor
 *
 * 📌 책임 (Responsibility):
 * - viewer와 target의 플레이 시간대 겹침 정도를 팩터로 계산
 * - Schedule 유사도에 따라 "시간대 궁합"을 비율로 반환
 * - 성향 점수가 아닌 시간대 호환성 가중치 개념
 *
 * 📌 입력:
 * - context: MatchContext 입력
 *
 * 📌 출력:
 * - number: 스케줄 호환성 팩터 (1.0 ~ 1.05)
 *
 * 📌 계산 로직:
 * - scheduleScore < 60: 1.0 (의미 없는 겹침, 보정 없음)
 * - scheduleScore = 60: 1.0 (임계값, 보정 없음)
 * - scheduleScore = 80: 1.025 (2.5% 증가)
 * - scheduleScore = 100: 1.05 (5% 증가, 최대)
 * - Schedule 미설정: 1.0 (보정 없음)
 *
 * 📌 설계 의도:
 * - 시간대가 잘 맞으면 약간의 가중치 부여
 * - 의미 없는 겹침(< 60점)은 무시
 * - 최대 5% 증가로 과도한 영향 방지
 * - 성향이 잘 맞는 것이 여전히 가장 중요
 */

import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';
import { calculateScheduleSimilarity } from '../utils/scheduleSimilarity';

/**
 * 스케줄 호환성 팩터 계산
 *
 * @param context - MatchContext 입력
 * @returns 스케줄 호환성 팩터 (1.0 ~ 1.05)
 *
 * @example
 * ```typescript
 * // Schedule이 완벽하게 겹치는 경우
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     activity: {
 *       schedule: [
 *         { dayType: 'weekday', timeSlot: '18-24' },
 *         { dayType: 'weekend', timeSlot: '12-18' }
 *       ]
 *     }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     activity: {
 *       schedule: [
 *         { dayType: 'weekday', timeSlot: '18-24' },
 *         { dayType: 'weekend', timeSlot: '12-18' }
 *       ]
 *     }
 *   }
 * };
 *
 * const factor = calculateScheduleCompatibilityFactor(context); // 1.05
 * // 최종 점수 = baseScore × factor
 * // 예: 80점 × 1.05 = 84점 (시간대 완벽 호환)
 * ```
 *
 * @example
 * ```typescript
 * // Schedule이 부분적으로 겹치는 경우 (80점)
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     activity: {
 *       schedule: [
 *         { dayType: 'weekday', timeSlot: '18-24' },
 *         { dayType: 'weekend', timeSlot: '12-18' }
 *       ]
 *     }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     activity: {
 *       schedule: [
 *         { dayType: 'weekday', timeSlot: '18-24' }
 *       ]
 *     }
 *   }
 * };
 *
 * const factor = calculateScheduleCompatibilityFactor(context); // 1.025
 * // 예: 80점 × 1.025 = 82점 (시간대 부분 호환)
 * ```
 *
 * @example
 * ```typescript
 * // Schedule이 거의 겹치지 않는 경우 (40점)
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     activity: {
 *       schedule: [
 *         { dayType: 'weekday', timeSlot: '18-24' }
 *       ]
 *     }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     activity: {
 *       schedule: [
 *         { dayType: 'weekend', timeSlot: '06-12' }
 *       ]
 *     }
 *   }
 * };
 *
 * const factor = calculateScheduleCompatibilityFactor(context); // 1.0
 * // 의미 없는 겹침 (< 60점) → 보정 없음
 * ```
 *
 * @example
 * ```typescript
 * // Schedule 미설정
 * const context: MatchContextCoreDTO = {
 *   viewer: { userId: 'viewer-uuid' },
 *   target: { userId: 'target-uuid' }
 * };
 *
 * const factor = calculateScheduleCompatibilityFactor(context); // 1.0
 * // 보정 없음
 * ```
 *
 * @example
 * ```typescript
 * // 실제 사용 시나리오
 * // 시간대만 잘 맞는 경우: 60점 × 1.05 = 63점 (+3점)
 * // 성향 잘 맞고 시간대도 잘 맞는 경우: 85점 × 1.05 = 89.25 → 89점 (+4점)
 * // → 성향이 잘 맞는 것이 여전히 가장 중요
 * ```
 */
export const calculateScheduleCompatibilityFactor = (
  context: MatchContextCoreDTO
): number => {
  // Schedule 유사도 계산
  const scheduleScore =
    context.viewer.activity?.schedule && context.target.activity?.schedule
      ? calculateScheduleSimilarity(
          context.viewer.activity.schedule,
          context.target.activity.schedule
        )
      : undefined;

  // Schedule 미설정 또는 의미 없는 겹침 (< 60점)
  if (!scheduleScore || scheduleScore < 60) {
    return 1.0;
  }

  // 60~100점 → 1.0~1.025 (최대 2.5% 증가, 기존 5%에서 축소)
  // scheduleScore = 60 → bonus = 0 → factor = 1.0
  // scheduleScore = 80 → bonus = 0.0125 → factor = 1.0125
  // scheduleScore = 100 → bonus = 0.025 → factor = 1.025
  const bonus = ((scheduleScore - 60) / 40) * 0.025;
  return 1.0 + bonus;
};
