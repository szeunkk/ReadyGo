/**
 * ❗ Generate Match Tags
 *
 * 📌 책임 (Responsibility):
 * - MatchContext를 입력으로 받아 매칭 태그 목록 생성
 * - 최소 3개 이상의 Tag 항상 생성
 * - Steam 미연동 / Cold Start 상태에서도 동작
 * - UI에서 그대로 출력 가능한 5~6자 이내 짧은 문자열
 * - 계산 로직은 별도 유틸 함수 사용
 *
 * 📌 입력:
 * - MatchContextCoreDTO: viewer와 target 사용자 간 매칭 계산 입력
 *
 * 📌 출력:
 * - MatchTagCoreDTO[]: 매칭 태그 목록 (최소 3개)
 *
 * 📌 생성 정책:
 * - Steam 연동 시: '같은게임', '플타임일치' 등
 * - Steam 미연동 시: '스타일유사', '시간대일치' 등
 * - 항상 가능: '지금온라인', '신뢰높음' 등
 */

import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';
import type { MatchTagCoreDTO } from '@/commons/types/match/matchTagCore.dto';
import { calculateTraitsSimilarity } from '../utils/traitsSimilarity';
import { calculateScheduleSimilarity } from '../utils/scheduleSimilarity';

/**
 * 매칭 태그 생성
 *
 * @param context - MatchContext 입력
 * @returns 매칭 태그 목록 (최소 3개)
 *
 * @example
 * ```typescript
 * // Steam 연동된 경우
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     traits: { traits: { cooperation: 58, exploration: 85, strategy: 72, leadership: 45, social: 90 } },
 *     activity: { isOnline: true },
 *     steam: { steamGames: [570, 730, 440] }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     traits: { traits: { cooperation: 62, exploration: 80, strategy: 68, leadership: 50, social: 88 } },
 *     steam: { steamGames: [570, 730] }
 *   }
 * };
 *
 * const tags = generateMatchTags(context);
 * // [
 * //   { label: '같은게임' },
 * //   { label: '스타일유사' },
 * //   { label: '신뢰높음' }
 * // ]
 * ```
 *
 * @example
 * ```typescript
 * // Steam 미연동 Cold Start 경우
 * const context: MatchContextCoreDTO = {
 *   viewer: {
 *     userId: 'viewer-uuid',
 *     traits: { traits: { cooperation: 58, exploration: 85, strategy: 72, leadership: 45, social: 90 } },
 *     activity: {
 *       schedule: [{ dayType: 'weekday', timeSlot: '18-24' }],
 *       isOnline: true
 *     }
 *   },
 *   target: {
 *     userId: 'target-uuid',
 *     traits: { traits: { cooperation: 62, exploration: 80, strategy: 68, leadership: 50, social: 88 } },
 *     activity: {
 *       schedule: [{ dayType: 'weekday', timeSlot: '18-24' }]
 *     }
 *   }
 * };
 *
 * const tags = generateMatchTags(context);
 * // [
 * //   { label: '스타일유사' },
 * //   { label: '시간대일치' },
 * //   { label: '지금온라인' }
 * // ]
 * ```
 */
export const generateMatchTags = (
  context: MatchContextCoreDTO
): MatchTagCoreDTO[] => {
  const tags: MatchTagCoreDTO[] = [];

  // 1. 같은게임 (Steam 공통 게임)
  const viewerGames = context.viewer.steam?.steamGames ?? [];
  const targetGames = context.target.steam?.steamGames ?? [];
  if (viewerGames.length > 0 && targetGames.length > 0) {
    const commonGames = viewerGames.filter((game) =>
      targetGames.includes(game)
    );
    if (commonGames.length > 0) {
      tags.push({ label: '같은게임' });
    }
  }

  // 2. 플타임일치 (Steam 플레이 시간 유사)
  const viewerPlayTime = context.viewer.steam?.totalPlayTime;
  const targetPlayTime = context.target.steam?.totalPlayTime;
  if (
    viewerPlayTime !== undefined &&
    targetPlayTime !== undefined &&
    viewerPlayTime > 0 &&
    targetPlayTime > 0
  ) {
    const ratio =
      Math.min(viewerPlayTime, targetPlayTime) /
      Math.max(viewerPlayTime, targetPlayTime);
    if (ratio >= 0.6) {
      tags.push({ label: '플타임일치' });
    }
  }

  // 3. 스타일유사 (Traits 유사도)
  const viewerTraits = context.viewer.traits?.traits;
  const targetTraits = context.target.traits?.traits;
  if (viewerTraits && targetTraits) {
    const similarityScore = calculateTraitsSimilarity(
      viewerTraits,
      targetTraits
    );
    if (similarityScore >= 70) {
      tags.push({ label: '스타일유사' });
    }
  }

  // 4. 시간대일치 (플레이 시간대 공통)
  const viewerSchedule = context.viewer.activity?.schedule ?? [];
  const targetSchedule = context.target.activity?.schedule ?? [];
  if (viewerSchedule.length > 0 && targetSchedule.length > 0) {
    const scheduleScore = calculateScheduleSimilarity(
      viewerSchedule,
      targetSchedule
    );
    if (scheduleScore > 0) {
      tags.push({ label: '시간대일치' });
    }
  }

  // 5. 지금온라인 (Target 온라인 상태)
  const targetOnline = context.target.activity?.isOnline ?? false;
  if (targetOnline) {
    tags.push({ label: '지금온라인' });
  }

  // 6. 신뢰높음 (신뢰도 점수)
  const reliabilityScore = context.target.reliability?.reliabilityScore;
  if (reliabilityScore !== undefined && reliabilityScore >= 70) {
    tags.push({ label: '신뢰높음' });
  }

  // 7. 경험유사 (파티 경험 유사)
  const viewerPartyCount = context.viewer.reliability?.partyCount;
  const targetPartyCount = context.target.reliability?.partyCount;
  if (
    viewerPartyCount !== undefined &&
    targetPartyCount !== undefined &&
    viewerPartyCount > 0 &&
    targetPartyCount > 0
  ) {
    const ratio =
      Math.min(viewerPartyCount, targetPartyCount) /
      Math.max(viewerPartyCount, targetPartyCount);
    if (ratio >= 0.6) {
      tags.push({ label: '경험유사' });
    }
  }

  // 최소 3개 보장: 부족하면 기본 Tag 추가
  if (tags.length < 3) {
    // '스타일유사'가 없으면 추가 (기본)
    if (!tags.some((t) => t.label === '스타일유사')) {
      tags.push({ label: '스타일유사' });
    }
    // '활동패턴'이 없으면 추가 (기본)
    if (!tags.some((t) => t.label === '활동패턴') && tags.length < 3) {
      tags.push({ label: '활동패턴' });
    }
    // '신뢰높음'이 없으면 추가 (기본)
    if (!tags.some((t) => t.label === '신뢰높음') && tags.length < 3) {
      tags.push({ label: '신뢰높음' });
    }
  }

  // 상위 5개로 제한
  return tags.slice(0, 5);
};
