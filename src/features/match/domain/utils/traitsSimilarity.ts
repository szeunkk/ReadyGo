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
 *
 * 📌 개선 사항 (v2):
 * - Similarity/Complementary 축 분리
 * - 유사성 축: 비슷할수록 좋음 (cooperation, social, exploration)
 * - 보완성 축: 적당히 다를수록 시너지 (leadership, strategy)
 * - 팀 플레이 매칭에 최적화
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
 * 유사성이 좋은 축 (Similarity Traits)
 *
 * 이 축들은 비슷할수록 편안한 관계가 형성됨
 * - cooperation: 협동 성향이 비슷해야 팀워크가 자연스러움
 * - social: 사교성이 비슷해야 커뮤니케이션 스타일이 맞음
 * - exploration: 도전 성향이 비슷해야 게임 플레이 스타일이 맞음
 */
const SIMILARITY_TRAITS: TraitKey[] = ['cooperation', 'social', 'exploration'];

/**
 * 보완성이 좋은 축 (Complementary Traits)
 *
 * 이 축들은 적당히 다를수록 역할 분담이 잘 됨
 * - leadership: 한 명은 리더, 한 명은 팔로워일 때 충돌 없음
 * - strategy: 전략가와 실행가가 만나면 시너지 발생
 *
 * 📌 점수 계산 원리:
 * - 둘 다 높음 ❌ (충돌 가능성)
 * - 둘 다 낮음 ❌ (방향성 부족)
 * - 한 명 높고 한 명 낮음 ✅ (자연스러운 역할 분담)
 */
const COMPLEMENTARY_TRAITS: TraitKey[] = ['leadership', 'strategy'];

/**
 * 보완성 점수 계산 (Complementarity Score)
 *
 * 📌 계산 원리:
 * - 차이가 적당히 클 때 최고점 (종 모양 커브)
 * - 차이가 너무 작으면 역할 중복 (둘 다 리더 / 둘 다 소극적)
 * - 차이가 너무 크면 균형 깨짐
 * - 최적 차이: 30~50 범위
 *
 * 📌 점수 계산:
 * - |diff| < 20: 낮은 점수 (역할 중복)
 * - 20 ≤ |diff| ≤ 50: 높은 점수 (이상적 보완)
 * - |diff| > 50: 점수 감소 (너무 극단적)
 *
 * @param viewerValue - viewer의 특성 값 (0~100)
 * @param targetValue - target의 특성 값 (0~100)
 * @returns 0~1 범위의 보완성 점수
 *
 * @example
 * ```typescript
 * // 이상적 보완 (한 명 리더, 한 명 팔로워)
 * calculateComplementarityScore(80, 35); // ~0.95
 *
 * // 역할 중복 (둘 다 리더)
 * calculateComplementarityScore(85, 88); // ~0.2
 *
 * // 극단적 차이 (균형 깨짐)
 * calculateComplementarityScore(95, 5); // ~0.5
 * ```
 */
const calculateComplementarityScore = (
  viewerValue: number,
  targetValue: number
): number => {
  const diff = Math.abs(viewerValue - targetValue);

  // 종 모양 커브 (Bell Curve) 계산
  // 최적 차이: 35 (중심)
  // 표준편차: 20 (적당한 범위)
  const optimalDiff = 35;
  const stdDev = 20;

  // 가우시안 함수 (정규분포)
  const score = Math.exp(-((diff - optimalDiff) ** 2) / (2 * stdDev ** 2));

  return score;
};

/**
 * Traits 유사도 계산 (v2: Similarity + Complementary 통합)
 *
 * 📌 계산 원리:
 * - Similarity 축: 비슷할수록 좋음 (cooperation, social, exploration)
 * - Complementary 축: 적당히 다를수록 좋음 (leadership, strategy)
 * - 두 점수를 합성하여 팀 매칭에 최적화된 점수 제공
 *
 * 📌 기존 문제점:
 * - 모든 축을 "비슷할수록 좋다"로 처리
 * - 둘 다 리더십이 강하거나, 둘 다 소극적인 경우 충돌
 * - 성향 점수는 높은데 실제로 안 맞는 케이스 발생
 *
 * 📌 개선 방식:
 * - Similarity 축: 코사인 유사도 70% + 유클리드 유사도 30%
 * - Complementary 축: 종 모양 커브로 보완성 측정
 * - 최종 점수: similarityScore × 0.7 + complementScore × 0.3
 *
 * 📌 왜 이렇게 계산하는가:
 * - 게임·협업·파티 매칭은 "비슷해서 편한 관계"와 "달라서 시너지 나는 관계"가 동시에 필요
 * - 전략가 + 실행가, 리더 + 서포터 조합이 실제로 더 잘 맞음
 * - 체감 만족도와 점수의 괴리 해소
 *
 * @param viewer - viewer 특성 벡터 (각 trait 0~100)
 * @param target - target 특성 벡터 (각 trait 0~100)
 * @returns 0~100 범위의 유사도 점수
 *
 * @example
 * ```typescript
 * // Case 1: 유사 축은 비슷, 보완 축은 역할 분담
 * const viewer: TraitVector = {
 *   cooperation: 80,  // 비슷
 *   exploration: 70,  // 비슷
 *   strategy: 85,     // 전략가
 *   leadership: 40,   // 팔로워
 *   social: 75        // 비슷
 * };
 *
 * const target: TraitVector = {
 *   cooperation: 75,  // 비슷
 *   exploration: 68,  // 비슷
 *   strategy: 45,     // 실행가
 *   leadership: 80,   // 리더
 *   social: 78        // 비슷
 * };
 *
 * const similarity = calculateTraitsSimilarity(viewer, target);
 * // 높은 점수 (유사성 ✅ + 보완성 ✅)
 * ```
 *
 * @example
 * ```typescript
 * // Case 2: 둘 다 리더십 강함 (역할 충돌)
 * const viewer: TraitVector = {
 *   cooperation: 80,
 *   exploration: 70,
 *   strategy: 85,
 *   leadership: 90,   // 둘 다 리더
 *   social: 75
 * };
 *
 * const target: TraitVector = {
 *   cooperation: 75,
 *   exploration: 68,
 *   strategy: 82,
 *   leadership: 88,   // 둘 다 리더
 *   social: 78
 * };
 *
 * const similarity = calculateTraitsSimilarity(viewer, target);
 * // 이전보다 낮은 점수 (보완성 ❌로 인한 감점)
 * ```
 */
export const calculateTraitsSimilarity = (
  viewer: TraitVector,
  target: TraitVector
): number => {
  // ========== Step 0: 완전히 동일한 경우 조기 반환 ==========
  const allTraits: TraitKey[] = [
    'cooperation',
    'exploration',
    'strategy',
    'leadership',
    'social',
  ];
  const isIdentical = allTraits.every(
    (trait) => viewer[trait] === target[trait]
  );

  if (isIdentical) {
    return 100;
  }

  // ========== Step 1: Similarity 축 점수 계산 ==========
  // Similarity 축만 추출
  let similarityDotProduct = 0;
  let similarityViewerMagSq = 0;
  let similarityTargetMagSq = 0;
  let similarityEuclideanSq = 0;

  for (const trait of SIMILARITY_TRAITS) {
    const v = viewer[trait];
    const t = target[trait];
    similarityDotProduct += v * t;
    similarityViewerMagSq += v ** 2;
    similarityTargetMagSq += t ** 2;
    similarityEuclideanSq += (v - t) ** 2;
  }

  // 코사인 유사도
  const similarityCosineSim =
    similarityDotProduct /
    (Math.sqrt(similarityViewerMagSq * similarityTargetMagSq) || 1);

  // 유클리드 유사도
  const maxSimilarityDistance = Math.sqrt(SIMILARITY_TRAITS.length * 100 ** 2);
  const similarityEuclideanDist = Math.sqrt(similarityEuclideanSq);
  const similarityEuclideanSim =
    1 - similarityEuclideanDist / maxSimilarityDistance;

  // Similarity 축 하이브리드 점수 (코사인 70% + 유클리드 30%)
  const similarityScore =
    similarityCosineSim * 0.7 + similarityEuclideanSim * 0.3;

  // ========== Step 2: Complementary 축 점수 계산 ==========
  let complementScoreSum = 0;

  for (const trait of COMPLEMENTARY_TRAITS) {
    const score = calculateComplementarityScore(viewer[trait], target[trait]);
    complementScoreSum += score;
  }

  // 평균 보완성 점수 (0~1)
  const complementScore = complementScoreSum / COMPLEMENTARY_TRAITS.length;

  // ========== Step 3: 두 점수 합성 ==========
  // Similarity 85% + Complementary 15%
  // 유사성을 주된 지표로, 보완성은 보조 지표로 활용
  const finalScore = similarityScore * 0.85 + complementScore * 0.15;

  // ========== Step 4: 0~100 범위로 변환 ==========
  const result = Math.round(finalScore * 100);

  // 디버깅: 계산 과정 로깅 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development' && result >= 85) {
    // eslint-disable-next-line no-console
    console.log('[Traits Similarity v2 Debug]:', {
      finalScore: result,
      similarityScore: Math.round(similarityScore * 100),
      complementScore: Math.round(complementScore * 100),
      details: {
        similarityCosineSim: Math.round(similarityCosineSim * 100),
        similarityEuclideanSim: Math.round(similarityEuclideanSim * 100),
        leadershipDiff: Math.abs(viewer.leadership - target.leadership),
        strategyDiff: Math.abs(viewer.strategy - target.strategy),
      },
    });
  }

  return result;
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
