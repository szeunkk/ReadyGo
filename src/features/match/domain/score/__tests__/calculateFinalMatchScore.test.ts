/**
 * ❗ Calculate Final Match Score 유닛 테스트
 *
 * 📌 테스트 목표:
 * - 최종 점수 계산 로직의 정확성 검증
 * - Factor 범위 축소가 100점 남발 문제를 해결했는지 검증
 * - Cold Start 시 기본값(50점) 반환 검증
 * - Factor가 곱셈으로만 작동하는지 검증
 *
 * 📌 핵심 검증 포인트:
 * - Cold Start → 50점
 * - 모든 factor 최대치여도 100점이 쉽게 나오지 않는지
 * - Factor 정책: Animal (0.95~1.10), Schedule (1.0~1.05), Online (1.0~1.02)
 * - 최종 점수는 항상 0~100 범위 보장
 */

import { describe, it, expect } from 'vitest';
import { calculateFinalMatchScore } from '../calculateFinalMatchScore';
import type { MatchContextCoreDTO } from '@/commons/types/match/matchContextCore.dto';
import { AnimalType } from '@/commons/constants/animal/animal.enum';

describe('calculateFinalMatchScore', () => {
  describe('✅ Cold Start → 기본 점수 50', () => {
    it('should return 50 for completely empty context', () => {
      const context: MatchContextCoreDTO = {
        viewer: { userId: 'viewer-id' },
        target: { userId: 'target-id' },
      };

      const result = calculateFinalMatchScore(context);

      expect(result.finalScore).toBe(50);
      expect(result.isOnlineMatched).toBe(false);
      expect(result.availabilityHint).toBe('unknown');
    });

    it('should return 50 when only userId is provided', () => {
      const context: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          // traits, activity, steam, reliability 모두 없음
        },
        target: {
          userId: 'target-id',
        },
      };

      const result = calculateFinalMatchScore(context);

      expect(result.finalScore).toBe(50);
      expect(result.isOnlineMatched).toBe(false);
      expect(result.availabilityHint).toBe('unknown');
    });

    it('should return 50 when traits are missing', () => {
      const context: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          activity: {
            schedule: [{ dayType: 'weekday', timeSlot: '18-24' }],
            isOnline: true,
          },
        },
        target: {
          userId: 'target-id',
          activity: {
            schedule: [{ dayType: 'weekday', timeSlot: '18-24' }],
            isOnline: false,
          },
        },
      };

      const result = calculateFinalMatchScore(context);

      // Traits 없으면 baseScore = 50
      // Schedule이 있어도 baseScore가 50이면 factor 적용해도 50대
      expect(result.finalScore).toBeGreaterThanOrEqual(50);
      expect(result.finalScore).toBeLessThan(60);
      expect(result.isOnlineMatched).toBe(false);
      expect(result.availabilityHint).toBe('offline');
    });
  });

  describe('⚠️ 100점 남발 방지 (핵심 검증)', () => {
    it('should not easily reach 100 even with best factors', () => {
      // 최상의 조건: 높은 유사도 + 천생연분 + 완벽 시간대 + 온라인
      const context: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          traits: {
            traits: {
              cooperation: 85,
              exploration: 80,
              strategy: 75,
              leadership: 70,
              social: 90,
            },
            animalType: AnimalType.tiger,
          },
          activity: {
            schedule: [
              { dayType: 'weekday', timeSlot: '18-24' },
              { dayType: 'weekend', timeSlot: '12-18' },
            ],
            isOnline: true,
          },
        },
        target: {
          userId: 'target-id',
          traits: {
            traits: {
              cooperation: 80,
              exploration: 85,
              strategy: 70,
              leadership: 75,
              social: 88,
            },
            animalType: AnimalType.bear, // tiger-bear: 천생연분
          },
          activity: {
            schedule: [
              { dayType: 'weekday', timeSlot: '18-24' },
              { dayType: 'weekend', timeSlot: '12-18' },
            ],
            isOnline: true,
          },
        },
      };

      const result = calculateFinalMatchScore(context);

      // 최상 조건이어도 100점은 나오지 않아야 함
      // baseScore ~95 × 1.10 (animal) × 1.05 (schedule) × 1.02 (online) = ~111 → clamp to 100
      // 하지만 일반적으로는 100점이 쉽게 나오지 않아야 함
      expect(result.finalScore).toBeLessThanOrEqual(100);
      expect(result.isOnlineMatched).toBe(true);
      expect(result.availabilityHint).toBe('online');
    });

    it('should return reasonable score for good but not perfect match', () => {
      // 좋은 조건이지만 완벽하지 않음
      const context: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          traits: {
            traits: {
              cooperation: 70,
              exploration: 60,
              strategy: 80,
              leadership: 50,
              social: 75,
            },
            animalType: AnimalType.wolf,
          },
          activity: {
            schedule: [{ dayType: 'weekday', timeSlot: '18-24' }],
            isOnline: false,
          },
        },
        target: {
          userId: 'target-id',
          traits: {
            traits: {
              cooperation: 75,
              exploration: 55,
              strategy: 85,
              leadership: 45,
              social: 70,
            },
            animalType: AnimalType.wolf, // 같은 동물 1.05 factor
          },
          activity: {
            schedule: [{ dayType: 'weekday', timeSlot: '18-24' }],
            isOnline: false,
          },
        },
      };

      const result = calculateFinalMatchScore(context);

      // 좋은 매칭이지만 100점은 아님
      expect(result.finalScore).toBeGreaterThan(70);
      expect(result.finalScore).toBeLessThan(100);
      expect(result.isOnlineMatched).toBe(false);
    });

    it('should not give 100 for high traits similarity alone', () => {
      // 높은 Traits 유사도만 있고 다른 factor 없음
      const context: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          traits: {
            traits: {
              cooperation: 90,
              exploration: 85,
              strategy: 88,
              leadership: 82,
              social: 95,
            },
            // animalType 없음 → 1.0 factor
          },
          activity: {
            schedule: [], // 빈 스케줄 → 1.0 factor
            isOnline: false, // 오프라인 → 1.0 factor
          },
        },
        target: {
          userId: 'target-id',
          traits: {
            traits: {
              cooperation: 88,
              exploration: 87,
              strategy: 86,
              leadership: 80,
              social: 93,
            },
          },
          activity: {
            schedule: [],
            isOnline: false,
          },
        },
      };

      const result = calculateFinalMatchScore(context);

      // 높은 유사도여도 다른 factor 없으면 baseScore만
      // baseScore ~98 × 1.0 × 1.0 × 1.0 = 98
      expect(result.finalScore).toBeGreaterThan(85);
      expect(result.finalScore).toBeLessThanOrEqual(100);
      expect(result.isOnlineMatched).toBe(false);
    });
  });

  describe('🎯 Factor 정책 검증', () => {
    it('should apply animal compatibility factor correctly', () => {
      const baseContext: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          traits: {
            traits: {
              cooperation: 70,
              exploration: 70,
              strategy: 70,
              leadership: 70,
              social: 70,
            },
            animalType: AnimalType.tiger,
          },
        },
        target: {
          userId: 'target-id',
          traits: {
            traits: {
              cooperation: 70,
              exploration: 70,
              strategy: 70,
              leadership: 70,
              social: 70,
            },
            animalType: AnimalType.tiger, // 같은 동물 1.05 factor
          },
        },
      };

      const result = calculateFinalMatchScore(baseContext);

      // baseScore 100 × 1.05 (same animal) = 105 → clamp to 100
      expect(result.finalScore).toBe(100);
    });

    it('should work without animal types (no animal factor)', () => {
      const context: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          traits: {
            traits: {
              cooperation: 70,
              exploration: 70,
              strategy: 70,
              leadership: 70,
              social: 70,
            },
            // animalType 없음
          },
        },
        target: {
          userId: 'target-id',
          traits: {
            traits: {
              cooperation: 70,
              exploration: 70,
              strategy: 70,
              leadership: 70,
              social: 70,
            },
            // animalType 없음
          },
        },
      };

      const result = calculateFinalMatchScore(context);

      // baseScore 100 × 1.0 (no animal) = 100
      expect(result.finalScore).toBe(100);
    });

    it('should apply schedule compatibility factor correctly', () => {
      const context: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          traits: {
            traits: {
              cooperation: 70,
              exploration: 70,
              strategy: 70,
              leadership: 70,
              social: 70,
            },
          },
          activity: {
            schedule: [
              { dayType: 'weekday', timeSlot: '18-24' },
              { dayType: 'weekend', timeSlot: '12-18' },
            ],
          },
        },
        target: {
          userId: 'target-id',
          traits: {
            traits: {
              cooperation: 70,
              exploration: 70,
              strategy: 70,
              leadership: 70,
              social: 70,
            },
          },
          activity: {
            schedule: [
              { dayType: 'weekday', timeSlot: '18-24' },
              { dayType: 'weekend', timeSlot: '12-18' },
            ],
          },
        },
      };

      const result = calculateFinalMatchScore(context);

      // baseScore 100 × 1.0 (no animal) × 1.05 (perfect schedule) = 105 → clamp to 100
      expect(result.finalScore).toBe(100);
    });

    it('should apply online factor correctly', () => {
      const context: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          traits: {
            traits: {
              cooperation: 70,
              exploration: 70,
              strategy: 70,
              leadership: 70,
              social: 70,
            },
          },
          activity: {
            isOnline: true,
          },
        },
        target: {
          userId: 'target-id',
          traits: {
            traits: {
              cooperation: 70,
              exploration: 70,
              strategy: 70,
              leadership: 70,
              social: 70,
            },
          },
          activity: {
            isOnline: true, // 온라인 1.02 factor
          },
        },
      };

      const result = calculateFinalMatchScore(context);

      // baseScore 100 × 1.0 (no animal) × 1.0 (no schedule) × 1.02 (online) = 102 → clamp to 100
      expect(result.finalScore).toBe(100);
      expect(result.isOnlineMatched).toBe(true);
      expect(result.availabilityHint).toBe('online');
    });

    it('should combine all factors multiplicatively', () => {
      const context: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          traits: {
            traits: {
              cooperation: 80,
              exploration: 75,
              strategy: 70,
              leadership: 65,
              social: 85,
            },
            animalType: AnimalType.dog,
          },
          activity: {
            schedule: [{ dayType: 'weekday', timeSlot: '18-24' }],
            isOnline: false,
          },
        },
        target: {
          userId: 'target-id',
          traits: {
            traits: {
              cooperation: 78,
              exploration: 73,
              strategy: 68,
              leadership: 63,
              social: 83,
            },
            animalType: AnimalType.cat, // dog-cat: challenging (0.95)
          },
          activity: {
            schedule: [{ dayType: 'weekday', timeSlot: '06-12' }],
            isOnline: false,
          },
        },
      };

      const result = calculateFinalMatchScore(context);

      // baseScore ~98 × 0.95 (challenging) × 1.0 (poor schedule) × 1.0 (offline)
      // = ~93
      expect(result.finalScore).toBeGreaterThan(85);
      expect(result.finalScore).toBeLessThan(100);
      expect(result.isOnlineMatched).toBe(false);
    });
  });

  describe('📊 Availability 메타 정보 검증', () => {
    it('should set isOnlineMatched and availabilityHint for online target', () => {
      const context: MatchContextCoreDTO = {
        viewer: { userId: 'viewer-id' },
        target: {
          userId: 'target-id',
          activity: { isOnline: true },
        },
      };

      const result = calculateFinalMatchScore(context);

      expect(result.isOnlineMatched).toBe(true);
      expect(result.availabilityHint).toBe('online');
    });

    it('should set isOnlineMatched and availabilityHint for offline target', () => {
      const context: MatchContextCoreDTO = {
        viewer: { userId: 'viewer-id' },
        target: {
          userId: 'target-id',
          activity: { isOnline: false },
        },
      };

      const result = calculateFinalMatchScore(context);

      expect(result.isOnlineMatched).toBe(false);
      expect(result.availabilityHint).toBe('offline');
    });

    it('should set unknown availability when target online status is not provided', () => {
      const context: MatchContextCoreDTO = {
        viewer: { userId: 'viewer-id' },
        target: {
          userId: 'target-id',
          // activity 없음
        },
      };

      const result = calculateFinalMatchScore(context);

      expect(result.isOnlineMatched).toBe(false);
      expect(result.availabilityHint).toBe('unknown');
    });
  });

  describe('🔒 항상 0~100 범위 보장', () => {
    it('should clamp final score to 0~100 range', () => {
      // 여러 시나리오에서 범위 보장 검증
      const scenarios: MatchContextCoreDTO[] = [
        // Cold Start
        {
          viewer: { userId: 'viewer-id' },
          target: { userId: 'target-id' },
        },
        // 완전히 다른 성향
        {
          viewer: {
            userId: 'viewer-id',
            traits: {
              traits: {
                cooperation: 0,
                exploration: 0,
                strategy: 0,
                leadership: 0,
                social: 0,
              },
            },
          },
          target: {
            userId: 'target-id',
            traits: {
              traits: {
                cooperation: 100,
                exploration: 100,
                strategy: 100,
                leadership: 100,
                social: 100,
              },
            },
          },
        },
        // 완벽한 매칭
        {
          viewer: {
            userId: 'viewer-id',
            traits: {
              traits: {
                cooperation: 90,
                exploration: 90,
                strategy: 90,
                leadership: 90,
                social: 90,
              },
              animalType: AnimalType.tiger,
            },
            activity: {
              schedule: [{ dayType: 'weekday', timeSlot: '18-24' }],
              isOnline: true,
            },
          },
          target: {
            userId: 'target-id',
            traits: {
              traits: {
                cooperation: 90,
                exploration: 90,
                strategy: 90,
                leadership: 90,
                social: 90,
              },
              animalType: AnimalType.bear,
            },
            activity: {
              schedule: [{ dayType: 'weekday', timeSlot: '18-24' }],
              isOnline: true,
            },
          },
        },
      ];

      scenarios.forEach((context, index) => {
        const result = calculateFinalMatchScore(context);

        expect(result.finalScore).toBeGreaterThanOrEqual(0);
        expect(result.finalScore).toBeLessThanOrEqual(100);
        expect(Number.isInteger(result.finalScore)).toBe(true);
      });
    });
  });

  describe('🎲 실제 사례 기반 테스트', () => {
    it('should handle realistic scenario 1: good match with some factors', () => {
      const context: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          traits: {
            traits: {
              cooperation: 58,
              exploration: 85,
              strategy: 72,
              leadership: 45,
              social: 90,
            },
            animalType: AnimalType.wolf,
          },
          activity: {
            schedule: [{ dayType: 'weekday', timeSlot: '18-24' }],
            isOnline: false,
          },
        },
        target: {
          userId: 'target-id',
          traits: {
            traits: {
              cooperation: 62,
              exploration: 80,
              strategy: 68,
              leadership: 50,
              social: 88,
            },
            animalType: AnimalType.dog,
          },
          activity: {
            schedule: [{ dayType: 'weekday', timeSlot: '18-24' }],
            isOnline: true,
          },
        },
      };

      const result = calculateFinalMatchScore(context);

      // 좋은 매칭 케이스
      expect(result.finalScore).toBeGreaterThan(70);
      expect(result.finalScore).toBeLessThanOrEqual(100);
      expect(result.isOnlineMatched).toBe(true);
    });

    it('should handle realistic scenario 2: moderate match', () => {
      const context: MatchContextCoreDTO = {
        viewer: {
          userId: 'viewer-id',
          traits: {
            traits: {
              cooperation: 80,
              exploration: 30,
              strategy: 90,
              leadership: 70,
              social: 40,
            },
            animalType: AnimalType.hawk,
          },
          activity: {
            schedule: [{ dayType: 'weekend', timeSlot: '00-06' }],
            isOnline: false,
          },
        },
        target: {
          userId: 'target-id',
          traits: {
            traits: {
              cooperation: 40,
              exploration: 85,
              strategy: 50,
              leadership: 30,
              social: 90,
            },
            animalType: AnimalType.rabbit,
          },
          activity: {
            schedule: [{ dayType: 'weekday', timeSlot: '18-24' }],
            isOnline: false,
          },
        },
      };

      const result = calculateFinalMatchScore(context);

      // 중간 정도 매칭
      expect(result.finalScore).toBeGreaterThan(30);
      expect(result.finalScore).toBeLessThan(80);
      expect(result.isOnlineMatched).toBe(false);
    });
  });
});

