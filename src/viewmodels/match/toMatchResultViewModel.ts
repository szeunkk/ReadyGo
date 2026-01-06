/**
 * 📌 ViewModel Layer - MatchResultCoreDTO to MatchResultViewModel Converter
 *
 * - 순수 함수: 외부 의존성(API, hook, store, router) 참조 금지
 * - Core DTO를 UI 친화적 ViewModel로 변환
 * - side effect 없음 (try/catch, throw, console 등 금지)
 *
 * 📌 책임 범위:
 * - Core DTO → ViewModel 단방향 변환만 수행
 * - 문구 조합, UI 표현 단위 변환 수행
 * - 상태 판단 로직 포함 금지
 * - API 호출, 데이터 fetch 포함 금지
 */

import type { MatchResultCoreDTO } from '@/commons/types/match/matchResultCore.dto';
import type { PartyMatchSummaryCoreDTO } from '@/commons/types/match/partyMatchSummaryCore.dto';
import type { MatchReasonCoreDTO } from '@/commons/types/match/matchReasonCore.dto';
import type { MatchTagCoreDTO } from '@/commons/types/match/matchTagCore.dto';
import type {
  MatchResultViewModel,
  PartyMatchSummaryViewModel,
  MatchReasonViewModel,
  MatchTagViewModel,
  MatchScoreViewModel,
  PartySuccessViewModel,
} from './MatchResultViewModel';

/**
 * MatchReasonCoreDTO를 MatchReasonViewModel로 변환
 *
 * @param reasonDTO - MatchReasonCoreDTO
 * @returns MatchReasonViewModel - UI 친화적 Reason
 */
const toReasonViewModel = (
  reasonDTO: MatchReasonCoreDTO
): MatchReasonViewModel => {
  const { detail } = reasonDTO;

  switch (detail.type) {
    case 'COMMON_GAME':
      return {
        type: detail.type,
        primaryText: `공통 게임 ${detail.gameCount}개 보유`,
        secondaryText:
          detail.topGames.length > 0 ? detail.topGames.join(', ') : undefined,
        isHighlight: detail.gameCount >= 3,
      };

    case 'PLAY_TIME':
      return {
        type: detail.type,
        primaryText: `플레이 시간 ${detail.matchScore}% 일치`,
        isHighlight: detail.matchScore >= 70,
      };

    case 'STYLE_SIMILARITY':
      const traitLabel = getTraitLabel(detail.topTrait);
      return {
        type: detail.type,
        primaryText: `플레이 스타일 ${detail.similarityScore}% 유사`,
        secondaryText: `${traitLabel} 성향 일치`,
        isHighlight: detail.similarityScore >= 70,
      };

    case 'PARTY_EXPERIENCE':
      return {
        type: detail.type,
        primaryText: `파티 경험 ${detail.experienceScore}% 유사`,
        isHighlight: detail.experienceScore >= 70,
      };

    case 'RELIABILITY':
      return {
        type: detail.type,
        primaryText: `신뢰도 ${detail.reliabilityScore}점`,
        isHighlight: detail.reliabilityScore >= 70,
      };

    case 'ONLINE_NOW':
      return {
        type: detail.type,
        primaryText: detail.isOnline ? '지금 온라인' : '오프라인',
        isHighlight: detail.isOnline,
      };

    case 'ACTIVITY_PATTERN':
      return {
        type: detail.type,
        primaryText: `활동 패턴 ${detail.patternScore}% 일치`,
        secondaryText:
          detail.commonTimeSlots.length > 0
            ? detail.commonTimeSlots.join(', ')
            : undefined,
        isHighlight: detail.patternScore >= 70,
      };

    default:
      return {
        type: 'UNKNOWN',
        primaryText: '알 수 없는 이유',
        isHighlight: false,
      };
  }
};

/**
 * Trait 이름을 한글 라벨로 변환
 *
 * @param traitName - Trait 이름 (예: 'cooperation', 'exploration')
 * @returns 한글 라벨 (예: '협동', '탐험')
 */
const getTraitLabel = (traitName: string): string => {
  const traitLabels: Record<string, string> = {
    cooperation: '협동',
    exploration: '탐험',
    strategy: '전략',
    leadership: '리더십',
    social: '사교',
  };

  return traitLabels[traitName] || traitName;
};

/**
 * MatchTagCoreDTO를 MatchTagViewModel로 변환
 *
 * @param tagDTO - MatchTagCoreDTO
 * @returns MatchTagViewModel - UI 스타일이 추가된 Tag
 */
const toTagViewModel = (tagDTO: MatchTagCoreDTO): MatchTagViewModel => {
  const { label } = tagDTO;

  // 라벨에 따른 색상 타입 매핑
  const colorTypeMap: Record<string, MatchTagViewModel['colorType']> = {
    같은게임: 'primary',
    플타임일치: 'success',
    스타일유사: 'info',
    시간대일치: 'info',
    신뢰높음: 'success',
    지금온라인: 'warning',
    활동패턴: 'info',
    경험유사: 'default',
  };

  return {
    label,
    colorType: colorTypeMap[label] || 'default',
  };
};

/**
 * similarityScore를 MatchScoreViewModel로 변환
 *
 * @param score - 유사도 점수 (0~100)
 * @returns MatchScoreViewModel - UI 표현 단위
 */
const toScoreViewModel = (score: number): MatchScoreViewModel => {
  const percentText = `${score}%`;
  const gaugeValue = score / 100;

  let gradeLabel: string;
  let gradeColor: MatchScoreViewModel['gradeColor'];

  if (score >= 61) {
    gradeLabel = '높은 매칭';
    gradeColor = 'high';
  } else if (score >= 31) {
    gradeLabel = '보통 매칭';
    gradeColor = 'medium';
  } else {
    gradeLabel = '낮은 매칭';
    gradeColor = 'low';
  }

  return {
    score,
    percentText,
    gaugeValue,
    gradeLabel,
    gradeColor,
  };
};

/**
 * successProbability를 PartySuccessViewModel로 변환
 *
 * @param probability - 파티 성공 확률 (0~100)
 * @returns PartySuccessViewModel - UI 표현 단위
 */
const toSuccessViewModel = (
  probability: number
): PartySuccessViewModel => {
  const percentText = `${probability}%`;

  let successLabel: string;
  let successColor: PartySuccessViewModel['successColor'];

  if (probability >= 71) {
    successLabel = '높은 성공률';
    successColor = 'high';
  } else if (probability >= 41) {
    successLabel = '보통 성공률';
    successColor = 'medium';
  } else {
    successLabel = '낮은 성공률';
    successColor = 'low';
  }

  return {
    probability,
    percentText,
    successLabel,
    successColor,
  };
};

/**
 * computedAt을 상대 시간 문구로 변환
 *
 * @param computedAt - ISO 8601 형식의 계산 시점
 * @returns 상대 시간 문구 (예: '5분 전', '1시간 전', '오늘')
 */
const toComputedTimeText = (computedAt?: string): string | undefined => {
  if (!computedAt) return undefined;

  const now = new Date();
  const computed = new Date(computedAt);
  const diffMs = now.getTime() - computed.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';

  return `${diffDays}일 전`;
};

/**
 * MatchResultCoreDTO를 MatchResultViewModel로 변환
 *
 * @param coreDTO - MatchResultCoreDTO
 * @returns MatchResultViewModel - UI 렌더링에 최적화된 ViewModel
 *
 * @example
 * ```typescript
 * const coreDTO: MatchResultCoreDTO = {
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
 * const viewModel = toMatchResultViewModel(coreDTO);
 * // {
 * //   userId: 'viewer-uuid',
 * //   targetUserId: 'target-uuid',
 * //   score: {
 * //     score: 87,
 * //     percentText: '87%',
 * //     gaugeValue: 0.87,
 * //     gradeLabel: '높은 매칭',
 * //     gradeColor: 'high'
 * //   },
 * //   reasons: [
 * //     { type: 'COMMON_GAME', primaryText: '공통 게임 5개 보유', secondaryText: 'Dota 2, CS2', isHighlight: true },
 * //     { type: 'PLAY_TIME', primaryText: '플레이 시간 85% 일치', isHighlight: true },
 * //     { type: 'STYLE_SIMILARITY', primaryText: '플레이 스타일 82% 유사', secondaryText: '협동 성향 일치', isHighlight: true }
 * //   ],
 * //   tags: [
 * //     { label: '같은게임', colorType: 'primary' },
 * //     { label: '플타임일치', colorType: 'success' },
 * //     { label: '스타일유사', colorType: 'info' }
 * //   ],
 * //   onlineBadge: '지금 온라인',
 * //   computedTimeText: '5분 전'
 * // }
 * ```
 */
export const toMatchResultViewModel = (
  coreDTO: MatchResultCoreDTO
): MatchResultViewModel => {
  // Core DTO의 각 필드를 ViewModel로 변환
  const score = toScoreViewModel(coreDTO.similarityScore);
  const reasons = coreDTO.reasons.map(toReasonViewModel);
  const tags = coreDTO.tags.map(toTagViewModel);
  const onlineBadge = coreDTO.isOnlineMatched ? '지금 온라인' : undefined;
  const computedTimeText = toComputedTimeText(coreDTO.computedAt);

  return {
    userId: coreDTO.userId,
    targetUserId: coreDTO.targetUserId,
    score,
    reasons,
    tags,
    onlineBadge,
    computedTimeText,
  };
};

/**
 * PartyMatchSummaryCoreDTO를 PartyMatchSummaryViewModel로 변환
 *
 * @param coreDTO - PartyMatchSummaryCoreDTO
 * @returns PartyMatchSummaryViewModel - UI 렌더링에 최적화된 ViewModel
 *
 * @example
 * ```typescript
 * const coreDTO: PartyMatchSummaryCoreDTO = {
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
 * const viewModel = toPartyMatchSummaryViewModel(coreDTO);
 * // {
 * //   userId: 'viewer-uuid',
 * //   targetUserId: 'target-uuid',
 * //   success: {
 * //     probability: 85,
 * //     percentText: '85%',
 * //     successLabel: '높은 성공률',
 * //     successColor: 'high'
 * //   },
 * //   reasons: [
 * //     { type: 'COMMON_GAME', primaryText: '공통 게임 5개 보유', secondaryText: 'Dota 2, CS2', isHighlight: true },
 * //     { type: 'STYLE_SIMILARITY', primaryText: '플레이 스타일 82% 유사', secondaryText: '협동 성향 일치', isHighlight: true },
 * //     { type: 'ONLINE_NOW', primaryText: '지금 온라인', isHighlight: true }
 * //   ],
 * //   computedTimeText: '5분 전'
 * // }
 * ```
 */
export const toPartyMatchSummaryViewModel = (
  coreDTO: PartyMatchSummaryCoreDTO
): PartyMatchSummaryViewModel => {
  const success = toSuccessViewModel(coreDTO.successProbability);
  const reasons = coreDTO.reasons.map(toReasonViewModel);
  const computedTimeText = toComputedTimeText(coreDTO.computedAt);

  return {
    userId: coreDTO.userId,
    targetUserId: coreDTO.targetUserId,
    success,
    reasons,
    computedTimeText,
  };
};

