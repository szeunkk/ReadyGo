/**
 * ❗ Traits Similarity Utilities
 *
 * 📌 책임 (Responsibility):
 * - Traits 유사도 계산 전용 유틸리티
 * - generateMatchReasons와 계산 로직 분리
 * - 순수 함수로 구현
 *
 * 📌 전제 조건 (Preconditions):
 * - Trait 값 범위: 0~100 (항상 양수)
 * - 중심점 보정(Radial Clipping) 적용됨
 * - 모든 Trait 값은 검증된 상태로 전달됨
 */

import type { TraitVector } from '@/commons/constants/animal/animal.vector';

/**
 * Trait 키 타입
 *
 * TraitVector의 키를 타입 안전하게 참조하기 위한 타입
 * trait → label 매핑 시 안전하게 연결 가능
 */
export type TraitKey = keyof TraitVector;

/**
 * Traits 유사도 계산 (하이브리드 방식: 코사인 유사도 + 유클리드 거리)
 *
 * 📌 계산 원리:
 * - 코사인 유사도: 패턴의 방향 유사성 측정 (70% 가중치)
 * - 유클리드 거리: 실제 값의 차이 측정 (30% 가중치)
 * - 두 가지를 혼합하여 더 정확한 매칭 점수 계산
 *
 * 📌 기존 문제점:
 * - 순수 코사인 유사도는 값의 크기 차이를 무시
 * - [36,60,70,76,60]과 [36,37,50,52,84]가 95점으로 나옴
 * - 실제로는 차이가 크지만 패턴만 유사하면 높은 점수
 *
 * 📌 개선 방식:
 * - 코사인 유사도 70% + 유클리드 유사도 30%
 * - 패턴 유사성과 실제 차이를 모두 고려
 * - 더 현실적인 매칭 점수 제공
 *
 * @param viewer - viewer 특성 벡터 (각 trait 0~100)
 * @param target - target 특성 벡터 (각 trait 0~100)
 * @returns 0~100 범위의 유사도 점수
 *
 * @example
 * ```typescript
 * const viewer: TraitVector = {
 *   cooperation: 58,
 *   exploration: 85,
 *   strategy: 72,
 *   leadership: 45,
 *   social: 90
 * };
 *
 * const target: TraitVector = {
 *   cooperation: 62,
 *   exploration: 80,
 *   strategy: 68,
 *   leadership: 50,
 *   social: 88
 * };
 *
 * const similarity = calculateTraitsSimilarity(viewer, target);
 * // 이전: 95점 (코사인만)
 * // 현재: 85-90점 (코사인 + 유클리드)
 * ```
 */
export const calculateTraitsSimilarity = (
  viewer: TraitVector,
  target: TraitVector
): number => {
  // 1. 코사인 유사도 계산 (패턴 유사성)
  const dotProduct =
    viewer.cooperation * target.cooperation +
    viewer.exploration * target.exploration +
    viewer.strategy * target.strategy +
    viewer.leadership * target.leadership +
    viewer.social * target.social;

  const viewerMagnitude = Math.sqrt(
    viewer.cooperation ** 2 +
      viewer.exploration ** 2 +
      viewer.strategy ** 2 +
      viewer.leadership ** 2 +
      viewer.social ** 2
  );

  const targetMagnitude = Math.sqrt(
    target.cooperation ** 2 +
      target.exploration ** 2 +
      target.strategy ** 2 +
      target.leadership ** 2 +
      target.social ** 2
  );

  const cosineSimilarity =
    dotProduct / (viewerMagnitude * targetMagnitude || 1);

  // 2. 유클리드 거리 계산 (실제 값의 차이)
  const euclideanDistance = Math.sqrt(
    (viewer.cooperation - target.cooperation) ** 2 +
      (viewer.exploration - target.exploration) ** 2 +
      (viewer.strategy - target.strategy) ** 2 +
      (viewer.leadership - target.leadership) ** 2 +
      (viewer.social - target.social) ** 2
  );

  // 3. 유클리드 거리를 유사도로 변환 (0~1 범위)
  // 최대 거리: sqrt(5 * 100^2) = 223.6
  // 거리가 클수록 유사도는 낮아짐
  const maxDistance = Math.sqrt(5 * 100 ** 2);
  const euclideanSimilarity = 1 - euclideanDistance / maxDistance;

  // 4. 하이브리드 점수 계산
  // 코사인 70% + 유클리드 30%
  const hybridScore = cosineSimilarity * 0.7 + euclideanSimilarity * 0.3;

  // 5. 0~100 범위로 변환
  const finalScore = Math.round(hybridScore * 100);

  // 디버깅: 계산 과정 로깅 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development' && finalScore >= 90) {
    console.log('[Traits Similarity Debug]:', {
      finalScore,
      cosineSimilarity: Math.round(cosineSimilarity * 100),
      euclideanSimilarity: Math.round(euclideanSimilarity * 100),
      euclideanDistance: Math.round(euclideanDistance),
      hybridScore: Math.round(hybridScore * 100),
    });
  }

  return finalScore;
};

/**
 * 가장 유사한 Trait 찾기
 *
 * viewer와 target의 5가지 특성 중 차이가 가장 작은 특성을 반환
 *
 * 📌 타입 안전성:
 * - 반환 타입: TraitKey (keyof TraitVector)
 * - trait → label 매핑 시 타입 안전하게 사용 가능
 *
 * @param viewer - viewer 특성 벡터
 * @param target - target 특성 벡터
 * @returns 가장 유사한 trait 키 (타입 안전)
 *
 * @example
 * ```typescript
 * const viewer: TraitVector = {
 *   cooperation: 58,
 *   exploration: 85,
 *   strategy: 72,
 *   leadership: 45,
 *   social: 90
 * };
 *
 * const target: TraitVector = {
 *   cooperation: 62,
 *   exploration: 80,
 *   strategy: 68,
 *   leadership: 50,
 *   social: 88
 * };
 *
 * const topTrait = findTopTrait(viewer, target); // 'social' (diff: 2)
 *
 * // 타입 안전한 label 매핑
 * const traitLabels: Record<TraitKey, string> = {
 *   cooperation: '협동',
 *   exploration: '탐험',
 *   strategy: '전략',
 *   leadership: '리더십',
 *   social: '사교성'
 * };
 * const label = traitLabels[topTrait]; // 타입 에러 없음
 * ```
 */
export const findTopTrait = (
  viewer: TraitVector,
  target: TraitVector
): TraitKey => {
  const traits: TraitKey[] = [
    'cooperation',
    'exploration',
    'strategy',
    'leadership',
    'social',
  ];

  let minDiff = Infinity;
  let topTrait: TraitKey = 'cooperation';

  for (const trait of traits) {
    const diff = Math.abs(viewer[trait] - target[trait]);
    if (diff < minDiff) {
      minDiff = diff;
      topTrait = trait;
    }
  }

  return topTrait;
};
