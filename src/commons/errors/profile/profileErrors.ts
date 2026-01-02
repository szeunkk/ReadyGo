/**
 * Profile 도메인 전용 에러 정의
 *
 * 책임:
 * - Service 레이어에서만 사용되는 명시적 에러 클래스 제공
 * - 에러 코드와 메시지를 통일된 규칙으로 관리
 *
 * 비책임:
 * - UI 노출 메시지 (i18n / 사용자 문구)
 * - Repository 레벨 에러 정의
 */

/**
 * ProfileNotFoundError
 *
 * 발생 조건:
 * - user_profiles 테이블에 해당 userId의 레코드가 존재하지 않음
 *
 * 처리 방침:
 * - 즉시 throw, 이후 traits/schedule 조회 로직 실행하지 않음
 * - UI에서는 404 페이지 또는 "프로필을 찾을 수 없습니다" 메시지 표시
 */
export class ProfileNotFoundError extends Error {
  readonly code = 'PROFILE_NOT_FOUND';
  readonly statusCode = 404;

  constructor(userId: string) {
    super(`User profile not found for userId: ${userId}`);
    this.name = 'ProfileNotFoundError';

    // Error 클래스 상속 시 prototype chain 보정
    Object.setPrototypeOf(this, ProfileNotFoundError.prototype);
  }
}

/**
 * ProfileDataInconsistencyError
 *
 * 발생 조건:
 * - user_traits와 user_play_schedules 중 하나만 존재하는 경우
 * - traits만 있고 schedule 없음 → 에러
 * - schedule만 있고 traits 없음 → 에러
 *
 * 정상 케이스:
 * - traits + schedule 모두 없음 → 정상 (온보딩 미완료)
 * - traits + schedule 모두 있음 → 정상 (온보딩 완료)
 *
 * 처리 방침:
 * - 데이터 정합성 문제로 간주, 즉시 throw
 * - 개발 환경에서는 DB 상태 점검 필요
 * - 운영 환경에서는 에러 로그 수집 후 관리자 알림
 */
export class ProfileDataInconsistencyError extends Error {
  readonly code = 'PROFILE_DATA_INCONSISTENCY';
  readonly statusCode = 500;

  constructor(userId: string, reason: 'traits_only' | 'schedules_only') {
    const message =
      reason === 'traits_only'
        ? `Data inconsistency for userId ${userId}: traits exist but schedules are missing`
        : `Data inconsistency for userId ${userId}: schedules exist but traits are missing`;

    super(message);
    this.name = 'ProfileDataInconsistencyError';

    // Error 클래스 상속 시 prototype chain 보정
    Object.setPrototypeOf(this, ProfileDataInconsistencyError.prototype);
  }
}

/**
 * ProfileFetchError
 *
 * 발생 조건:
 * - Repository 호출 시 Supabase 에러 발생
 * - 네트워크 문제, DB 연결 실패, 권한 문제 등
 *
 * 처리 방침:
 * - 즉시 throw, 원본 에러 메시지 포함
 * - UI에서는 500 에러 페이지 또는 "일시적인 오류" 메시지 표시
 * - 재시도 로직은 상위 레이어에서 처리
 */
export class ProfileFetchError extends Error {
  readonly code = 'PROFILE_FETCH_ERROR';
  readonly statusCode = 500;
  readonly originalError?: string;

  constructor(
    resource: 'profile' | 'traits' | 'schedules',
    originalError?: string
  ) {
    super(`Failed to fetch ${resource}: ${originalError || 'Unknown error'}`);
    this.name = 'ProfileFetchError';
    this.originalError = originalError;

    // Error 클래스 상속 시 prototype chain 보정
    Object.setPrototypeOf(this, ProfileFetchError.prototype);
  }
}
