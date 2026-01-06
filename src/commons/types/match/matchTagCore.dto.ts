/**
 * ❗ Match Tag Core DTO
 *
 * 📌 책임 (Responsibility):
 * - 매칭 결과를 요약하는 짧은 태그 제공
 * - UI에서 그대로 출력 가능한 문자열
 * - 계산 로직 포함하지 않음
 *
 * 📌 데이터 원칙:
 * - 5~6자 이내의 짧은 문자열
 * - 요약용 데이터
 * - Steam 미연동 여부에 따른 Tag 구분 필드 없음
 * - 최소 3개 항상 생성 가능
 */

/**
 * MatchTagCoreDTO
 *
 * 매칭 결과를 요약하는 태그 하나
 *
 * 📌 필수 필드:
 * - label: UI에서 그대로 출력 가능한 짧은 문자열
 *
 * 📌 사용 예시:
 * ```typescript
 * // Steam 연동된 경우
 * const tags: MatchTagCoreDTO[] = [
 *   { label: '같은게임' },
 *   { label: '플타임일치' },
 *   { label: '스타일유사' }
 * ];
 *
 * // Steam 미연동 Cold Start 경우
 * const tags: MatchTagCoreDTO[] = [
 *   { label: '스타일유사' },
 *   { label: '시간대일치' },
 *   { label: '신뢰높음' }
 * ];
 * ```
 *
 * 📌 태그 예시:
 * - '같은게임'
 * - '플타임일치'
 * - '스타일유사'
 * - '시간대일치'
 * - '신뢰높음'
 * - '지금온라인'
 * - '활동패턴'
 * - '경험유사'
 */
export interface MatchTagCoreDTO {
  /**
   * 태그 라벨
   *
   * 5~6자 이내의 짧은 문자열
   * UI에서 Badge, Chip 등으로 그대로 출력 가능
   */
  label: string;
}

/**
 * 📌 생성 정책 (Generation Policy):
 *
 * 1. 최소 3개 이상 항상 생성 가능
 * 2. Steam 미연동 상태에서도 생성 가능한 태그:
 *    - '스타일유사' (Traits 기반)
 *    - '시간대일치' (플레이 시간대 기반)
 *    - '신뢰높음' (사용자 신뢰도 기반)
 *    - '지금온라인' (현재 접속 상태)
 *
 * 3. Steam 연동 시 추가 가능한 태그:
 *    - '같은게임' (공통 게임 보유)
 *    - '플타임일치' (게임 플레이 시간 유사)
 *
 * 4. Tag는 항상 동일 구조 유지
 * 5. Steam 미연동 여부에 따른 구분 필드 없음
 */
