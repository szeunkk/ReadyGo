# Traits E2E Tests

Traits 설문 기능에 대한 End-to-End 테스트입니다.

## 환경 설정

### 필수 환경 변수

E2E 테스트 실행을 위해 `.env.local` 파일에 다음 환경 변수를 추가해야 합니다:

```bash
# Playwright E2E Test User
TEST_USER_EMAIL=your-test-email@example.com
TEST_USER_PASSWORD=your-test-password
```

⚠️ **보안 주의사항**:

- 실제 사용자 계정이 아닌 **테스트 전용 계정**을 사용하세요.
- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

## 테스트 실행

### 전체 Traits E2E 테스트 실행

```bash
npm run test:e2e -- src/components/traits/tests/traits.e2e.test.ts
```

### 특정 테스트만 실행

```bash
npm run test:e2e -- src/components/traits/tests/traits.e2e.test.ts -g "초기 상태"
```

## 인증 설정

### tests/setup/auth.setup.ts

모든 E2E 테스트 실행 전에 자동으로 실행되는 **공통 인증 설정** 파일입니다.

**동작 방식:**

1. 로그인 페이지 접속
2. 환경 변수에서 테스트 계정 정보 가져오기
3. 로그인 수행
4. HttpOnly 쿠키를 포함한 인증 상태를 `.auth/user.json` (프로젝트 루트)에 저장
5. 모든 테스트에서 저장된 인증 상태 재사용

**장점:**

- 매 테스트마다 로그인할 필요 없음
- HttpOnly 쿠키 자동 관리
- 테스트 실행 속도 향상

## 테스트 구조

### traits.e2e.test.ts

**테스트 범위:**

- 설문 기본 흐름 (답변 선택, 이전/다음, 진행률)
- 스케줄 질문 처리
- 전체 설문 완료 및 결과 페이지 도달
- 답변 상태 유지

**주요 테스트 케이스:**

- ✅ 초기 상태: 첫 번째 질문 표시
- ✅ 답변 선택: 자동 다음 질문 이동
- ✅ 이전/다음 버튼 동작
- ✅ 진행률 표시
- ✅ 답변 유지 (이전/다음 이동 시)
- ✅ 스케줄 선택 후 자동 완료
- ✅ API 호출 및 결과 페이지 이동

## 문제 해결

### 환경 변수 오류

```
Error: TEST_USER_EMAIL 및 TEST_USER_PASSWORD 환경 변수가 필요합니다.
```

→ `.env.local` 파일에 환경 변수를 추가하세요.

### 로그인 실패

```
[Auth Setup] ⚠ 인증 쿠키가 확인되지 않음
```

→ 테스트 계정의 이메일/비밀번호가 올바른지 확인하세요.

### 인증 상태 파일 오류

→ `.auth/` 폴더(프로젝트 루트)가 없으면 자동으로 생성됩니다. (`.gitignore`에 포함)
