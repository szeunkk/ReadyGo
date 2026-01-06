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
 * Traits 유사도 계산 (코사인 유사도)
 *
 * 📌 계산 원리:
 * - 두 벡터 간의 코사인 유사도를 계산하여 방향 유사성을 측정
 * - 코사인 유사도 = (A · B) / (||A|| × ||B||)
 * - 결과 범위: -1 ~ 1 (일반적인 경우)
 *
 * 📌 전제 조건:
 * - Trait 값은 항상 양수 (0~100 범위)
 * - 중심점 보정(Radial Clipping)이 적용된 상태
 * - 따라서 코사인 유사도는 항상 0~1 범위 (음수 불가능)
 * - 0: 완전히 다름 (직각)
 * - 1: 완전히 같음 (평행)
 *
 * 📌 0~1 범위 보장 근거:
 * - 모든 Trait 값이 양수이므로 내적(dot product)도 항상 양수
 * - 벡터 크기(magnitude)도 항상 양수
 * - 따라서 cosineSimilarity = 양수 / 양수 = 양수 (0~1 범위)
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
 * const similarity = calculateTraitsSimilarity(viewer, target); // 95
 * // 95 = round(0.95 * 100)
 * // 0.95 = 코사인 유사도 (매우 유사함)
 * ```
 */
export const calculateTraitsSimilarity = (
  viewer: TraitVector,
  target: TraitVector
): number => {
  // 5가지 특성의 내적 계산
  // 모든 trait 값이 양수이므로 dotProduct도 항상 양수
  const dotProduct =
    viewer.cooperation * target.cooperation +
    viewer.exploration * target.exploration +
    viewer.strategy * target.strategy +
    viewer.leadership * target.leadership +
    viewer.social * target.social;

  // 벡터 크기 계산
  // 모든 trait 값이 양수이므로 magnitude도 항상 양수
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

  // 코사인 유사도 계산
  // 결과: 0~1 범위 (trait 값이 모두 양수이므로 음수 불가능)
  // - 0: 완전히 다른 특성 (직각 벡터)
  // - 1: 완전히 같은 특성 (평행 벡터)
  // - 0.5~0.7: 어느 정도 유사
  // - 0.8~1.0: 매우 유사
  const cosineSimilarity =
    dotProduct / (viewerMagnitude * targetMagnitude || 1);

  // 0~100 범위로 변환
  // 예: 0.95 → 95점
  return Math.round(cosineSimilarity * 100);
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
