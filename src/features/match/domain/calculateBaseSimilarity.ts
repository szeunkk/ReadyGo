/**
 * ❗ Calculate Base Similarity
 *
 * 📌 책임 (Responsibility):
 * - MatchContext를 입력으로 받아 기본 유사도 점수를 계산
 * - Traits를 주 점수로, Schedule을 보조 시그널(보너스)로 처리
 * - Steam 미연동 / Cold Start 상태에서도 동작
 * - 계산 결과는 0~100 범위의 숫자
 *
 * 📌 입력:
 * - MatchContextCoreDTO: viewer와 target 사용자 간 매칭 계산 입력
 *
 * 📌 출력:
 * - number: 기본 유사도 점수 (0~100)
 *
 * 📌 계산 원칙:
 * - Traits: 주 점수 (기본 유사도의 핵심)
 * - Schedule: 보조 시그널 (있으면 보너스 추가)
 * - 가중치, 수식은 내부 정책 함수로 캡슐화
 */

import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';
import { calculateTraitsSimilarity } from './utils/traitsSimilarity';
import { calculateScheduleSimilarity } from './utils/scheduleSimilarity';

/**
 * 유사도 점수 조합 정책
 *
 * 📌 정책:
 * - Traits가 주 점수 (있으면 그대로 사용)
 * - Schedule은 보조 시그널 (있으면 보너스 추가)
 * - Traits 없으면 기본 점수 반환
 *
 * 📌 보너스 계산:
 * - Schedule이 높을수록 보너스 증가
 * - 최대 보너스: +10점
 * - 보너스 = (scheduleScore / 100) * 10
 *
 * @param scores - 개별 유사도 점수들
 * @returns 조합된 최종 점수 (0~100)
 *
 * @example
 * ```typescript
 * // Traits만 있는 경우
 * combineBaseSimilarity({ traitsScore: 85 }); // 85
 *
 * // Traits + Schedule (높은 일치도)
 * combineBaseSimilarity({ traitsScore: 85, scheduleScore: 100 }); // 95 (85 + 10)
 *
 * // Traits + Schedule (낮은 일치도)
 * combineBaseSimilarity({ traitsScore: 85, scheduleScore: 50 }); // 90 (85 + 5)
 *
 * // Traits 없음 (Cold Start)
 * combineBaseSimilarity({}); // 50 (기본 점수)
 * ```
 */
const combineBaseSimilarity = (scores: {
  traitsScore?: number;
  scheduleScore?: number;
}): number => {
  const { traitsScore, scheduleScore } = scores;

  // Traits가 없으면 기본 점수 반환 (Cold Start)
  if (traitsScore === undefined) {
    return 50;
  }

  // Traits를 주 점수로 사용
  let finalScore = traitsScore;

  // Schedule이 있으면 보너스 추가
  if (scheduleScore !== undefined && scheduleScore > 0) {
    // 보너스 계산: Schedule 점수에 비례 (최대 +10점)
    const bonus = Math.round((scheduleScore / 100) * 10);
    finalScore += bonus;
  }

  // 최종 점수는 0~100 범위 내로 제한
  return Math.min(100, Math.max(0, finalScore));
};

/**
 * 기본 유사도 계산
 *
 * 📌 계산 흐름:
 * 1. Traits 유사도 계산 (있을 경우)
 * 2. Schedule 유사도 계산 (있을 경우)
 * 3. 정책 함수로 점수 조합
 *
 * @param context - MatchContext 입력
 * @returns 0~100 범위의 기본 유사도 점수
 *
 * @example
 * ```typescript
 * // Traits만 있는 경우
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     traits: {
 *       traits: { cooperation: 58, exploration: 85, strategy: 72, leadership: 45, social: 90 }
 *     }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     traits: {
 *       traits: { cooperation: 62, exploration: 80, strategy: 68, leadership: 50, social: 88 }
 *     }
 *   }
 * };
 *
 * const score = calculateBaseSimilarity(context); // 95 (Traits 유사도)
 * ```
 *
 * @example
 * ```typescript
 * // Traits + Schedule이 있는 경우
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     traits: {
 *       traits: { cooperation: 58, exploration: 85, strategy: 72, leadership: 45, social: 90 }
 *     },
 *     activity: {
 *       schedule: [
 *         { dayType: 'weekday', timeSlot: '18-24' },
 *         { dayType: 'weekend', timeSlot: '12-18' }
 *       ]
 *     }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     traits: {
 *       traits: { cooperation: 62, exploration: 80, strategy: 68, leadership: 50, social: 88 }
 *     },
 *     activity: {
 *       schedule: [
 *         { dayType: 'weekday', timeSlot: '18-24' }
 *       ]
 *     }
 *   }
 * };
 *
 * const score = calculateBaseSimilarity(context); // 100 (Traits 95 + Schedule 보너스 5)
 * ```
 *
 * @example
 * ```typescript
 * // Cold Start (아무 데이터 없음)
 * const context: MatchContextCoreDTO = {
 *   viewer: { userId: 'viewer-uuid' },
 *   target: { userId: 'target-uuid' }
 * };
 *
 * const score = calculateBaseSimilarity(context); // 50 (기본 점수)
 * ```
 */
export const calculateBaseSimilarity = (
  context: MatchContextCoreDTO
): number => {
  // 1. Traits 유사도 계산 (있을 경우에만)
  const traitsScore =
    context.viewer.traits?.traits && context.target.traits?.traits
      ? calculateTraitsSimilarity(
          context.viewer.traits.traits,
          context.target.traits.traits
        )
      : undefined;

  // 2. Schedule 유사도 계산 (있을 경우에만)
  const scheduleScore =
    context.viewer.activity?.schedule && context.target.activity?.schedule
      ? calculateScheduleSimilarity(
          context.viewer.activity.schedule,
          context.target.activity.schedule
        )
      : undefined;

  // 3. 정책 함수로 점수 조합
  return combineBaseSimilarity({ traitsScore, scheduleScore });
};
