/**
 * 벡터 간 거리 계산 유틸리티
 *
 * 사용자의 특성 벡터와 각 동물의 이상적 벡터 간의 유사도를 계산
 */

import type { TraitVector } from '@/commons/constants/animal/animal.vector';
import { TRAIT_KEYS } from '@/commons/constants/animal/animal.vector';

/**
 * 유클리드 거리 계산
 *
 * @param vector1 - 첫 번째 벡터 (사용자)
 * @param vector2 - 두 번째 벡터 (동물)
 * @returns 거리 (낮을수록 유사함)
 *
 * 공식: sqrt((v1.x - v2.x)^2 + (v1.y - v2.y)^2 + ...)
 *
 * @example
 * ```ts
 * const userVector = { cooperation: 70, exploration: 60, ... };
 * const wolfVector = { cooperation: 60, exploration: 85, ... };
 * const distance = calculateEuclideanDistance(userVector, wolfVector);
 * // distance = sqrt((70-60)^2 + (60-85)^2 + ...) = ...
 * ```
 */
export const calculateEuclideanDistance = (
  vector1: TraitVector,
  vector2: TraitVector
): number => {
  let sumOfSquares = 0;

  for (const key of TRAIT_KEYS) {
    const diff = vector1[key] - vector2[key];
    sumOfSquares += diff * diff;
  }

  return Math.sqrt(sumOfSquares);
};

/**
 * 코사인 유사도 계산
 *
 * @param vector1 - 첫 번째 벡터
 * @param vector2 - 두 번째 벡터
 * @returns 유사도 (1에 가까울수록 유사함, -1에 가까울수록 반대)
 *
 * 공식: (v1 · v2) / (||v1|| × ||v2||)
 *
 * @example
 * ```ts
 * const similarity = calculateCosineSimilarity(userVector, wolfVector);
 * // similarity = 0.95 (매우 유사함)
 * ```
 */
export const calculateCosineSimilarity = (
  vector1: TraitVector,
  vector2: TraitVector
): number => {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const key of TRAIT_KEYS) {
    dotProduct += vector1[key] * vector2[key];
    magnitude1 += vector1[key] * vector1[key];
    magnitude2 += vector2[key] * vector2[key];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
};

/**
 * 맨해튼 거리 (L1 거리) 계산
 *
 * @param vector1 - 첫 번째 벡터
 * @param vector2 - 두 번째 벡터
 * @returns 거리 (낮을수록 유사함)
 *
 * 공식: |v1.x - v2.x| + |v1.y - v2.y| + ...
 *
 * 특징: 유클리드 거리보다 계산이 빠르고, 차원별 차이를 동등하게 취급
 */
export const calculateManhattanDistance = (
  vector1: TraitVector,
  vector2: TraitVector
): number => {
  let sum = 0;

  for (const key of TRAIT_KEYS) {
    sum += Math.abs(vector1[key] - vector2[key]);
  }

  return sum;
};

/**
 * 가중 유클리드 거리 계산
 *
 * @param vector1 - 첫 번째 벡터
 * @param vector2 - 두 번째 벡터
 * @param weights - 각 특성의 가중치 (선택적)
 * @returns 거리 (낮을수록 유사함)
 *
 * 특정 특성을 더 중요하게 고려하고 싶을 때 사용
 *
 * @example
 * ```ts
 * // 리더십과 사교성을 더 중요하게 고려
 * const weights = {
 *   cooperation: 1.0,
 *   exploration: 1.0,
 *   strategy: 1.0,
 *   leadership: 1.5,
 *   social: 1.5,
 * };
 * const distance = calculateWeightedEuclideanDistance(v1, v2, weights);
 * ```
 */
export const calculateWeightedEuclideanDistance = (
  vector1: TraitVector,
  vector2: TraitVector,
  weights?: Partial<Record<keyof TraitVector, number>>
): number => {
  let sumOfSquares = 0;

  for (const key of TRAIT_KEYS) {
    const weight = weights?.[key] ?? 1.0;
    const diff = vector1[key] - vector2[key];
    sumOfSquares += weight * diff * diff;
  }

  return Math.sqrt(sumOfSquares);
};

/**
 * 벡터 정규화 (0~100 범위로 클램핑)
 *
 * @param vector - 정규화할 벡터
 * @returns 정규화된 벡터
 */
export const normalizeVector = (vector: TraitVector): TraitVector => {
  const normalized: Partial<TraitVector> = {};

  for (const key of TRAIT_KEYS) {
    normalized[key] = Math.max(0, Math.min(100, vector[key]));
  }

  return normalized as TraitVector;
};

/**
 * Radial Clipping: 중심에서 너무 멀어지지 않도록 제한
 *
 * @param vector - 클리핑할 벡터
 * @param maxDistance - 중심(50)에서 허용되는 최대 거리 (기본값: 120)
 * @returns 클리핑된 벡터
 *
 * 원리:
 * 1. 중심점(50, 50, 50, 50, 50)에서의 거리 계산
 * 2. maxDistance를 초과하면 방향은 유지하되 거리를 maxDistance로 제한
 * 3. 극단적인 조합을 방지하여 모든 동물이 도달 가능한 범위 유지
 *
 * @example
 * ```ts
 * const extreme = { cooperation: 10, exploration: 10, strategy: 90, leadership: 10, social: 10 };
 * const clipped = applyRadialClipping(extreme, 100);
 * // 중심에서 너무 멀면 방향은 유지하되 거리를 100으로 제한
 * ```
 */
export const applyRadialClipping = (
  vector: TraitVector,
  maxDistance: number = 120
): TraitVector => {
  const center: TraitVector = {
    cooperation: 50,
    exploration: 50,
    strategy: 50,
    leadership: 50,
    social: 50,
  };

  // 중심에서의 거리 계산
  const distance = calculateEuclideanDistance(vector, center);

  // 거리가 maxDistance 이내면 그대로 반환
  if (distance <= maxDistance) {
    return vector;
  }

  // maxDistance를 초과하면 방향은 유지하되 거리를 maxDistance로 제한
  const scale = maxDistance / distance;
  const clipped: Partial<TraitVector> = {};

  for (const key of TRAIT_KEYS) {
    // 중심에서의 벡터 방향 유지
    const offset = vector[key] - center[key];
    clipped[key] = center[key] + offset * scale;
    // 0~100 범위 유지
    clipped[key] = Math.max(0, Math.min(100, clipped[key]));
  }

  return clipped as TraitVector;
};

/**
 * 빈 벡터 생성 (모든 값 50으로 초기화)
 *
 * @returns 초기 벡터
 */
export const createInitialVector = (): TraitVector => {
  return {
    cooperation: 50,
    exploration: 50,
    strategy: 50,
    leadership: 50,
    social: 50,
  };
};
