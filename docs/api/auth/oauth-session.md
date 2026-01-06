# API 명세서: OAuth Session

---

## 문서 정보

| 항목        | 내용                                   |
| ----------- | -------------------------------------- |
| 작성자      | AI Assistant                           |
| 최초 작성일 | 2026-01-06                             |
| 최종 수정일 | 2026-01-06                             |
| 관련 화면   | OAuth 로그인 콜백 처리                  |
| 관련 이슈   | -                                      |

---

## 기능

- OAuth 로그인 후 클라이언트에서 받은 토큰을 서버 쿠키에 설정
- 신규 유저 여부 판단 및 프로필 생성
- 사용자 상태를 `online`으로 업데이트

## 카테고리

- Auth

## 설명

OAuth 로그인 콜백 시 클라이언트에서 추출한 토큰을 서버로 전달하여 HttpOnly 쿠키에 저장합니다. 신규 유저인 경우 프로필을 생성하고 `isNewUser: true`를 반환합니다. 이 API는 `OAuthCallbackHandler` 컴포넌트에서 자동으로 호출됩니다.

---

## Method

- POST

## URL

- /api/auth/oauth/session

---

## Param

### Path Parameter

없음

### Query Parameter

없음

---

## 사용자

- 로그인 필요 여부: 불필요 (Public)
- OAuth 콜백 처리 중에만 호출됨

---

## Request

### Header

| key          | 설명           | value 타입 | 필수 | 비고               |
| ------------ | -------------- | ---------- | ---- | ------------------ |
| Content-Type | 요청 본문 타입 | string     | O    | `application/json` |

### Body

| key           | 설명                | value 타입 | 옵션 | Nullable | 예시               |
| ------------- | ------------------- | ---------- | ---- | -------- | ------------------ |
| access_token  | OAuth 액세스 토큰   | string     | X    | X        | `eyJhbGci...`      |
| refresh_token | OAuth 리프레시 토큰 | string     | X    | X        | `random_string...` |

---

## Response

### Body (Success)

| key        | 설명             | value 타입 | 옵션 | Nullable | 예시                                   |
| ---------- | ---------------- | ---------- | ---- | -------- | -------------------------------------- |
| success    | 성공 여부        | boolean    | X    | X        | `true`                                 |
| isNewUser  | 신규 유저 여부   | boolean    | X    | X        | `true` / `false`                       |
| user       | 사용자 정보 객체 | object     | X    | O        | `{"id": "...", "email": "..."}`        |
| user.id    | 사용자 UUID      | string     | X    | X        | `550e8400-e29b-41d4-a716-446655440000` |
| user.email | 사용자 이메일    | string     | O    | O        | `user@example.com`                     |

### Body (Error)

| key   | 설명        | value 타입 | 옵션 | Nullable | 예시                 |
| ----- | ----------- | ---------- | ---- | -------- | -------------------- |
| error | 에러 메시지 | string     | X    | X        | `토큰이 필요합니다.` |

### Example (Success - New User)

```json
{
  "success": true,
  "isNewUser": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

### Example (Success - Existing User)

```json
{
  "success": true,
  "isNewUser": false,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

### Example (Error)

```json
{
  "error": "토큰이 필요합니다."
}
```

---

## Status

| status | response content | 설명                    |
| ------ | ---------------- | ----------------------- |
| 200    | OK               | 세션 설정 성공          |
| 400    | BAD_REQUEST      | 필수 파라미터 누락      |
| 401    | UNAUTHORIZED     | 세션 설정 실패          |
| 500    | INTERNAL_ERROR   | 서버 내부 오류          |

---

## 기타

- **신규 유저 판단**: `user_profiles` 테이블에 프로필이 없거나, `created_at`과 `last_sign_in_at`의 차이가 5초 이내인 경우 신규 유저로 판단합니다.
- **프로필 생성**: 신규 유저인 경우 자동으로 `user_profiles` 레코드를 생성합니다. Race condition을 방지하기 위해 중복 키 에러를 처리합니다.
- **쿠키 설정**: 토큰은 Supabase SSR 클라이언트를 통해 HttpOnly 쿠키에 자동 저장됩니다. 쿠키 이름은 `sb-{project-id}-auth-token.0` 형식입니다.
- **상태 업데이트**: 세션 설정 성공 시 `user_status`를 `online`으로 자동 업데이트합니다.
- **리다이렉트**: 클라이언트에서 `isNewUser` 값에 따라 신규 유저는 `/signup-success`, 기존 유저는 `/home`으로 리다이렉트합니다.

