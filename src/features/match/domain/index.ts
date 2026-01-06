/**
 * Match Domain - 통합 외부 인터페이스
 *
 * 📌 매칭 도메인의 모든 기능을 외부에 노출
 *
 * 📦 Score: 매칭 점수 계산
 * - calculateFinalMatchScore: 단일 진입점 (MatchContext → MatchResult)
 *
 * 📦 Explanation: 매칭 설명 생성
 * - generateMatchReasons: 매칭 이유
 * - generateMatchTags: 매칭 태그
 */

// Score Domain
export {
  calculateFinalMatchScore,
  // 필요시 개별 함수들도 export (테스트, 디버깅용)
  calculateBaseSimilarity,
  calculateAnimalCompatibilityFactor,
  calculateScheduleCompatibilityFactor,
  calculateOnlineFactor,
} from './score';

// Explanation Domain
export { generateMatchReasons, generateMatchTags } from './explanation';
