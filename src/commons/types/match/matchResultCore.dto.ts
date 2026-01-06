/**
 * ❗ Single Source of Truth - Match Result Core DTO
 *
 * 📌 영향 범위 (Change Impact Scope):
 * - API Layer: /api/match/*
 * - Service Layer: match.service.ts
 * - Frontend Layer: MatchPage, HomeDashboard 등 매칭 표시 컴포넌트
 *
 * 📌 책임 (Responsibility):
 * - 매칭 결과의 핵심 정보만 포함
 * - 계산 과정, 가중치, 수식은 절대 포함하지 않음
 * - Steam/외부 플랫폼 연동 여부는 결과 반영 후 상태값으로만 표현
 * - 차단/친구 제외는 DTO 생성 이전 로직임을 전제
 *
 * 📌 데이터 원칙:
 * - "결과 데이터만" 포함
 * - online 보정은 결과 값으로만 표현
 * - Steam 미연동 상태에서도 항상 완결된 DTO 생성 가능
 */

import type { MatchReasonCoreDTO } from './matchReasonCore.dto';
import type { MatchTagCoreDTO } from './matchTagCore.dto';

/**
 * MatchResultCoreDTO
 *
 * viewer와 targetUser 간의 매칭 결과를 표현하는 Core DTO
 *
 * 📌 필수 필드:
 * - userId: viewer의 사용자 ID
 * - targetUserId: 매칭 대상 사용자 ID
 * - similarityScore: 유사도 점수 (0~100 정수)
 * - isOnlineMatched: 온라인 보정 적용 여부
 * - reasons: 매칭 이유 목록 (최소 3개)
 * - tags: 매칭 태그 목록 (최소 3개)
 *
 * 📌 선택 필드:
 * - computedAt: 매칭 결과가 계산된 시점 (캐시/재계산 판단용)
 *
 * 📌 재사용성:
 * - match 페이지에서 상세 매칭 결과 표시
 * - home 대시보드에서 추천 사용자 목록 표시
 *
 * 📌 사용 예시:
 * ```typescript
 * // Steam 연동된 경우
 * const matchResult: MatchResultCoreDTO = {
 *   userId: 'viewer-uuid',
 *   targetUserId: 'target-uuid',
 *   similarityScore: 87,
 *   isOnlineMatched: true,
 *   reasons: [
 *     { detail: { type: 'COMMON_GAME', gameCount: 5, topGames: ['Dota 2', 'CS2'] } },
 *     { detail: { type: 'PLAY_TIME', matchScore: 85 } },
 *     { detail: { type: 'STYLE_SIMILARITY', similarityScore: 82, topTrait: 'cooperation' } }
 *   ],
 *   tags: [
 *     { label: '같은게임' },
 *     { label: '플타임일치' },
 *     { label: '스타일유사' }
 *   ],
 *   computedAt: '2026-01-05T10:30:00Z'
 * };
 *
 * // Steam 미연동 Cold Start 경우
 * const matchResult: MatchResultCoreDTO = {
 *   userId: 'viewer-uuid',
 *   targetUserId: 'target-uuid',
 *   similarityScore: 72,
 *   isOnlineMatched: false,
 *   reasons: [
 *     { detail: { type: 'STYLE_SIMILARITY', similarityScore: 82, topTrait: 'cooperation' } },
 *     { detail: { type: 'ACTIVITY_PATTERN', patternScore: 75, commonTimeSlots: ['주중 저녁'] } },
 *     { detail: { type: 'RELIABILITY', reliabilityScore: 68 } }
 *   ],
 *   tags: [
 *     { label: '스타일유사' },
 *     { label: '시간대일치' },
 *     { label: '신뢰높음' }
 *   ],
 *   computedAt: '2026-01-05T10:30:00Z'
 * };
 * ```
 */
export interface MatchResultCoreDTO {
  /**
   * Viewer 사용자 ID (UUID)
   *
   * 필수 필드
   * 매칭 결과를 요청한 사용자
   */
  userId: string;

  /**
   * 매칭 대상 사용자 ID (UUID)
   *
   * 필수 필드
   * 매칭 결과의 대상이 되는 사용자
   */
  targetUserId: string;

  /**
   * 유사도 점수
   *
   * 필수 필드
   * 범위: 0~100 정수
   * 계산 과정, 가중치, 수식은 포함하지 않음
   *
   * - 0~30: 낮은 매칭
   * - 31~60: 보통 매칭
   * - 61~100: 높은 매칭
   *
   * 해석 로직은 ViewModel에서 처리
   */
  similarityScore: number;

  /**
   * 온라인 보정 적용 여부
   *
   * 필수 필드
   * boolean으로 고정
   *
   * - true: 현재 온라인 상태이며 보정이 적용됨
   * - false: 오프라인이거나 보정 미적용
   *
   * ⚠️ 주의: 온라인 보정의 강도/점수는 절대 포함하지 않음
   */
  isOnlineMatched: boolean;

  /**
   * 매칭 이유 목록
   *
   * 필수 필드
   * 최소 3개 이상 항상 포함
   *
   * MatchReasonCoreDTO 배열
   * Reason의 의미 해석은 ViewModel 책임
   */
  reasons: MatchReasonCoreDTO[];

  /**
   * 매칭 태그 목록
   *
   * 필수 필드
   * 최소 3개 이상 항상 포함
   *
   * MatchTagCoreDTO 배열
   * UI에서 Badge, Chip 등으로 그대로 출력 가능
   */
  tags: MatchTagCoreDTO[];

  /**
   * 매칭 결과 계산 시점
   *
   * 선택 필드
   * ISO 8601 형식 (예: '2026-01-05T10:30:00Z')
   *
   * 캐시/재계산 판단용
   * - 값 존재: 캐시된 결과
   * - undefined: 실시간 계산 결과
   */
  computedAt?: string;
}

/**
 * 📌 생성 정책 (Generation Policy):
 *
 * 1. Steam 미연동 상태를 기본 시나리오로 포함
 * 2. 차단/친구 제외는 DTO 생성 이전에 필터링 완료
 * 3. reasons, tags는 최소 3개 이상 항상 생성
 * 4. similarityScore는 항상 0~100 범위 내 정수
 * 5. isOnlineMatched는 boolean만 허용 (점수/강도 노출 금지)
 * 6. computedAt은 캐시 전략에 따라 선택적으로 포함
 *
 * 📌 확장성 (Extensibility):
 *
 * 1. AI/ML 없이도 설명 가능한 구조
 * 2. 향후 AI 설명 추가 시 DTO 계약 유지
 * 3. 새 Reason 타입 추가 시 UI 수정 최소화
 * 4. reasons, tags는 배열이므로 확장 가능
 */
