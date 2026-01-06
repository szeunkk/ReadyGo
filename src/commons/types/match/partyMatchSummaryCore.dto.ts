/**
 * ❗ Party Match Summary Core DTO
 *
 * 📌 책임 (Responsibility):
 * - 파티 매칭 성공 확률 요약 정보 제공
 * - MatchResultCoreDTO와 별도 응답으로도 사용 가능
 * - 계산 근거 요약용 reason 목록 포함
 * - 실시간 online 상태가 반영된 결과값
 *
 * 📌 데이터 원칙:
 * - 성공 확률은 단일 숫자 (0~100)
 * - 성공/보통/낮음 해석은 VM 책임
 * - 계산 과정, 가중치, 수식은 포함하지 않음
 * - Party 성공률 로직을 Match 로직과 분리 가능
 */

import type { MatchReasonCoreDTO } from './matchReasonCore.dto';

/**
 * PartyMatchSummaryCoreDTO
 *
 * 파티 매칭 성공 확률 요약
 *
 * 📌 필수 필드:
 * - userId: viewer의 사용자 ID
 * - targetUserId: 매칭 대상 사용자 ID
 * - successProbability: 파티 성공 확률 (0~100 정수)
 * - reasons: 성공 확률 계산 근거 요약 (최소 3개)
 *
 * 📌 선택 필드:
 * - computedAt: 계산 시점 (캐시/재계산 판단용)
 *
 * 📌 재사용성:
 * - MatchResultCoreDTO와 함께 사용
 * - 또는 별도 API 응답으로 사용
 *
 * 📌 사용 예시:
 * ```typescript
 * // Steam 연동된 경우
 * const summary: PartyMatchSummaryCoreDTO = {
 *   userId: 'viewer-uuid',
 *   targetUserId: 'target-uuid',
 *   successProbability: 85,
 *   reasons: [
 *     { detail: { type: 'COMMON_GAME', gameCount: 5, topGames: ['Dota 2', 'CS2'] } },
 *     { detail: { type: 'STYLE_SIMILARITY', similarityScore: 82, topTrait: 'cooperation' } },
 *     { detail: { type: 'ONLINE_NOW', isOnline: true } }
 *   ],
 *   computedAt: '2026-01-05T10:30:00Z'
 * };
 *
 * // Steam 미연동 Cold Start 경우
 * const summary: PartyMatchSummaryCoreDTO = {
 *   userId: 'viewer-uuid',
 *   targetUserId: 'target-uuid',
 *   successProbability: 68,
 *   reasons: [
 *     { detail: { type: 'STYLE_SIMILARITY', similarityScore: 82, topTrait: 'cooperation' } },
 *     { detail: { type: 'ACTIVITY_PATTERN', patternScore: 75, commonTimeSlots: ['주중 저녁'] } },
 *     { detail: { type: 'RELIABILITY', reliabilityScore: 68 } }
 *   ],
 *   computedAt: '2026-01-05T10:30:00Z'
 * };
 * ```
 */
export interface PartyMatchSummaryCoreDTO {
  /**
   * Viewer 사용자 ID (UUID)
   *
   * 필수 필드
   * 파티 매칭을 요청한 사용자
   */
  userId: string;

  /**
   * 매칭 대상 사용자 ID (UUID)
   *
   * 필수 필드
   * 파티 매칭의 대상이 되는 사용자
   */
  targetUserId: string;

  /**
   * 파티 성공 확률
   *
   * 필수 필드
   * 범위: 0~100 정수
   *
   * - 0~40: 낮은 성공률
   * - 41~70: 보통 성공률
   * - 71~100: 높은 성공률
   *
   * 해석 로직은 ViewModel에서 처리
   * 계산 과정, 가중치는 포함하지 않음
   */
  successProbability: number;

  /**
   * 성공 확률 계산 근거 요약
   *
   * 필수 필드
   * 최소 3개 이상 항상 포함
   *
   * MatchReasonCoreDTO 배열 재사용
   * 공통 Reason 타입 사용 가능
   * DTO 간 직접 참조는 강제하지 않음
   */
  reasons: MatchReasonCoreDTO[];

  /**
   * 계산 시점
   *
   * 선택 필드
   * ISO 8601 형식 (예: '2026-01-05T10:30:00Z')
   *
   * 캐시/재계산 판단용
   * 실시간 online 상태가 반영된 결과값
   */
  computedAt?: string;
}

/**
 * 📌 생성 정책 (Generation Policy):
 *
 * 1. Steam 미연동 상태에서도 생성 가능
 * 2. reasons는 최소 3개 이상 항상 생성
 * 3. successProbability는 항상 0~100 범위 내 정수
 * 4. 실시간 online 상태가 반영된 결과값
 * 5. MatchReasonCoreDTO의 Reason 타입 재사용 가능
 *
 * 📌 확장성 (Extensibility):
 *
 * 1. Party 성공률 로직을 Match 로직과 분리 가능
 * 2. MatchResultCoreDTO와 함께 사용하거나 별도 사용 가능
 * 3. 향후 Party 관련 추가 정보 확장 가능
 */
