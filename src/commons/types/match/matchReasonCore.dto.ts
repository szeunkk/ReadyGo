/**
 * ❗ Match Reason Core DTO
 *
 * 📌 책임 (Responsibility):
 * - 매칭 이유를 설명하는 구조화된 데이터 제공
 * - UI 문구 조합에 필요한 최소 정보만 포함
 * - 자연어 문장, 설명 텍스트는 포함하지 않음
 * - Steam 데이터 유무에 의존하지 않음
 *
 * 📌 데이터 원칙:
 * - key-value 기반의 구조화된 데이터
 * - 계산 과정, 가중치, 수식은 절대 포함하지 않음
 * - 결과 값만 포함
 * - 최소 3개 이상 항상 생성 가능하도록 설계
 */

/**
 * 매칭 이유 타입
 *
 * - COMMON_GAME: 공통 게임 보유
 * - PLAY_TIME: 플레이 시간 유사성
 * - STYLE_SIMILARITY: 플레이 스타일 유사성 (Traits 기반)
 * - PARTY_EXPERIENCE: 파티 경험 유사성
 * - RELIABILITY: 신뢰도 점수
 * - ONLINE_NOW: 현재 온라인 상태
 * - ACTIVITY_PATTERN: 활동 패턴 유사성 (플레이 시간대 기반)
 */
export type MatchReasonType =
  | 'COMMON_GAME'
  | 'PLAY_TIME'
  | 'STYLE_SIMILARITY'
  | 'PARTY_EXPERIENCE'
  | 'RELIABILITY'
  | 'ONLINE_NOW'
  | 'ACTIVITY_PATTERN';

/**
 * Reason 상세 데이터 타입
 *
 * 각 Reason 타입별로 필요한 최소 데이터만 포함
 */
export type MatchReasonDetail =
  | {
      type: 'COMMON_GAME';
      /**
       * 공통 게임 수
       * Steam 미연동 시: 0
       */
      gameCount: number;
      /**
       * 대표 게임 이름 (최대 2개)
       * Steam 미연동 시: []
       */
      topGames: string[];
    }
  | {
      type: 'PLAY_TIME';
      /**
       * 플레이 시간 일치도 (0~100)
       * 플레이 시간대(schedule) 기반 계산 결과
       */
      matchScore: number;
    }
  | {
      type: 'STYLE_SIMILARITY';
      /**
       * 스타일 유사도 (0~100)
       * Traits 기반 계산 결과
       */
      similarityScore: number;
      /**
       * 가장 유사한 Trait 이름
       * 예: 'cooperation', 'exploration'
       */
      topTrait: string;
    }
  | {
      type: 'PARTY_EXPERIENCE';
      /**
       * 파티 경험 유사도 (0~100)
       */
      experienceScore: number;
    }
  | {
      type: 'RELIABILITY';
      /**
       * 신뢰도 점수 (0~100)
       */
      reliabilityScore: number;
    }
  | {
      type: 'ONLINE_NOW';
      /**
       * 현재 온라인 여부
       */
      isOnline: boolean;
    }
  | {
      type: 'ACTIVITY_PATTERN';
      /**
       * 활동 패턴 일치도 (0~100)
       */
      patternScore: number;
      /**
       * 공통 활동 시간대 (예: '주중 저녁', '주말 오후')
       */
      commonTimeSlots: string[];
    };

/**
 * MatchReasonCoreDTO
 *
 * 매칭 이유 하나를 표현하는 Core DTO
 *
 * 📌 필수 필드:
 * - detail: 구조화된 데이터 (type별로 다른 구조)
 *
 * 📌 사용 예시:
 * ```typescript
 * // Steam 연동된 경우
 * const reason1: MatchReasonCoreDTO = {
 *   detail: {
 *     type: 'COMMON_GAME',
 *     gameCount: 5,
 *     topGames: ['Dota 2', 'Counter-Strike 2']
 *   }
 * };
 *
 * // Steam 미연동 Cold Start 경우
 * const reason2: MatchReasonCoreDTO = {
 *   detail: {
 *     type: 'STYLE_SIMILARITY',
 *     similarityScore: 82,
 *     topTrait: 'cooperation'
 *   }
 * };
 *
 * const reason3: MatchReasonCoreDTO = {
 *   detail: {
 *     type: 'ACTIVITY_PATTERN',
 *     patternScore: 75,
 *     commonTimeSlots: ['주중 저녁', '주말 오후']
 *   }
 * };
 * ```
 */
export interface MatchReasonCoreDTO {
  /**
   * 이유 상세 데이터
   *
   * type에 따라 구조가 달라지는 구조화된 데이터
   * UI에서 문구 조합에 필요한 최소 정보만 포함
   */
  detail: MatchReasonDetail;
}

/**
 * 📌 생성 정책 (Generation Policy):
 *
 * 1. 최소 3개 이상 항상 생성 가능
 * 2. Steam 미연동 Cold Start 시나리오:
 *    - STYLE_SIMILARITY (Traits 기반)
 *    - ACTIVITY_PATTERN (플레이 시간대 기반)
 *    - RELIABILITY (사용자 신뢰도 기반)
 *    - ONLINE_NOW (현재 접속 상태)
 *
 * 3. Steam 연동 시나리오:
 *    - COMMON_GAME (공통 게임 기반)
 *    - PLAY_TIME (게임 플레이 시간 기반)
 *    - 위의 Cold Start Reason들도 함께 생성 가능
 *
 * 4. "데이터 부족" 같은 표현 노출 금지
 * 5. Reason은 "데이터 존재 여부"가 아니라 "비교 가능성"이 있으면 생성
 */

