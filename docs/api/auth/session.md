# API 명세서: Auth Session

---

## 문서 정보

| 항목        | 내용                                   |
| ----------- | -------------------------------------- |
| 작성자      | AI Assistant                           |
| 최초 작성일 | 2024-12-31                             |
| 최종 수정일 | 2026-01-06                             |
| 관련 화면   | 로그인, 회원가입, 전역 헤더(유저 상태) |
| 관련 이슈   | -                                      |

---

## 기능

- 사용자 로그인 (이메일/비밀번호)
- 현재 세션 조회 및 토큰 자동 갱신
- 로그아웃 및 세션 종료

> **참고**: OAuth 로그인은 별도의 엔드포인트 `/api/auth/oauth/session`을 사용합니다.

## 카테고리

- Auth

## 설명

- 프론트엔드에서 인증 세션을 관리하기 위한 통합 엔드포인트입니다.
- **POST**: 이메일/비밀번호 로그인 폼 제출 시 호출합니다. 성공 시 Supabase SSR 클라이언트를 통해 `HttpOnly` 쿠키에 액세스/리프레시 토큰을 자동 설정합니다.
- **GET**: 앱 초기 로딩 시 또는 페이지 이동 시 사용자의 로그인 상태를 확인합니다. 토큰이 만료된 경우 자동으로 갱신을 시도합니다.
- **DELETE**: 사용자가 로그아웃 버튼을 클릭했을 때 호출하여 서버 측 세션을 정리하고 쿠키를 삭제합니다.

> **OAuth 로그인 플로우**: Google/Kakao OAuth 로그인은 별도의 플로우를 따릅니다. 자세한 내용은 인증 플로우 다이어그램을 참고하세요.

---

## Method

- GET | POST | DELETE

## URL

- /api/auth/session

---

## Param

### Path Parameter

없음

### Query Parameter

없음

---

## 사용자

- 로그인 필요 여부:
  - POST, GET: 불필요 (Public)
  - DELETE: 로그인 된 상태에서 호출 (토큰 필요)

---

## Request

### Header

| key          | 설명           | value 타입 | 필수 | 비고                      |
| ------------ | -------------- | ---------- | ---- | ------------------------- |
| Content-Type | 요청 본문 타입 | string     | O    | `application/json` (POST) |

### Body (POST)

| key      | 설명            | value 타입 | 옵션 | Nullable | 예시               |
| -------- | --------------- | ---------- | ---- | -------- | ------------------ |
| email    | 사용자 이메일   | string     | X    | X        | `user@example.com` |
| password | 사용자 비밀번호 | string     | X    | X        | `password123!`     |

### Body (GET, DELETE)

없음

---

## Response

### Body (Common Success - GET/POST)

| key        | 설명             | value 타입 | 옵션 | Nullable | 예시                                   |
| ---------- | ---------------- | ---------- | ---- | -------- | -------------------------------------- |
| user       | 사용자 정보 객체 | object     | X    | O        | `{"id": "...", "email": "..."}`        |
| user.id    | 사용자 UUID      | string     | X    | X        | `550e8400-e29b-41d4-a716-446655440000` |
| user.email | 사용자 이메일    | string     | O    | O        | `user@example.com`                     |

> GET 요청 시 비로그인 상태이거나 유효하지 않은 세션일 경우 `user: null`을 반환합니다.

### Body (Success - DELETE)

| key     | 설명      | value 타입 | 옵션 | Nullable | 예시   |
| ------- | --------- | ---------- | ---- | -------- | ------ |
| success | 성공 여부 | boolean    | X    | X        | `true` |

### Body (Error)

| key   | 설명        | value 타입 | 옵션 | Nullable | 예시                                        |
| ----- | ----------- | ---------- | ---- | -------- | ------------------------------------------- |
| error | 에러 메시지 | string     | X    | X        | `이메일 또는 비밀번호가 올바르지 않습니다.` |

### Example (Success - Login/Session Check)

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

### Example (Not Logged In - GET)

```json
{
  "user": null
}
```

---

## Status

| status | response content | 설명                                        |
| ------ | ---------------- | ------------------------------------------- |
| 200    | OK               | 로그인 성공, 세션 조회 성공 (로그아웃 포함) |
| 400    | BAD_REQUEST      | 필수 파라미터 누락                          |
| 401    | UNAUTHORIZED     | 인증 실패, 유효하지 않은 세션               |
| 500    | INTERNAL_ERROR   | 서버 내부 오류                              |

---

## 기타

- **보안**: 액세스 토큰과 리프레시 토큰은 클라이언트에 노출되지 않고 `HttpOnly` 쿠키로 관리됩니다. Supabase SSR 클라이언트는 `sb-{project-id}-auth-token.0` 형식의 쿠키를 사용합니다.
- **자동 갱신**: GET 요청 시 액세스 토큰이 만료되었더라도 유효한 리프레시 토큰이 있다면 자동으로 갱신되고 새 쿠키가 설정됩니다.
- **로그아웃**: DELETE 요청 시 서버 DB의 `user_status`를 `offline`으로 변경하는 로직이 포함되어 있습니다.
- **로그인 후 상태 업데이트**: POST 요청 성공 시 `user_status`를 `online`으로 자동 업데이트합니다.
- **OAuth 로그인**: Google/Kakao OAuth 로그인은 `/api/auth/oauth/session` 엔드포인트를 사용하며, 신규 유저 판단 및 프로필 생성 로직이 포함되어 있습니다.
