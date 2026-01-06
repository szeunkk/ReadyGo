/**
 * Match Score Domain - 외부 노출 인터페이스
 *
 * 📌 외부에는 단일 진입점만 노출
 * - calculateFinalMatchScore: MatchContext → MatchResult (최종 점수 + 메타 정보)
 *
 * 📌 내부 구현 상세는 캡슐화
 * - 개별 계산 함수들은 외부에서 직접 사용하지 않음
 * - 점수 계산 정책 변경 시 이 모듈 내부만 수정
 *
 * 📌 설계 원칙
 * - 모든 보정은 multiplicative factor로만 적용
 * - additive 방식 절대 사용 X
 * - 각 factor는 독립적으로 계산
 */

export { calculateFinalMatchScore } from './calculateFinalMatchScore';

// 필요시 개별 함수들도 export 가능 (테스트, 디버깅용)
export { calculateBaseSimilarity } from './calculateBaseSimilarity';
export { calculateAnimalCompatibilityFactor } from './applyAnimalCompatibility';
export { calculateScheduleCompatibilityFactor } from './calculateScheduleCompatibilityFactor';
export { calculateOnlineFactor } from './calculateAvailabilityFactor';

