# API 명세서

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2024-12-30                                                                                                     |
| 최종 수정일 | 2024-12-30                                                                                                     |
| 관련 화면   | 유저 프로필 상태 변경 (사이드 패널 등)                                                                         |
| 관련 이슈   | [사용자 요구사항 정의서(UR-71)](https://www.notion.so/UR-71-2ca130d16ff481559ee0c9d1f786061e?source=copy_link) |

---

## 기능

- 로그인한 유저의 상태(online, away, dnd, offline)를 수동으로 변경합니다.
- `user_status` 테이블에 해당 유저의 상태를 upsert 합니다.

## 카테고리

- UserStatus

## 설명

- 프론트엔드에서 유저가 자신의 상태(온라인, 자리비움, 방해금지, 오프라인)를 직접 변경할 때 호출합니다.
- 요청 시 쿠키에 저장된 Supabase 토큰(`sb-access-token`, `sb-refresh-token`)을 사용하여 인증을 수행합니다.
- 토큰 만료 시 서버 사이드에서 세션 갱신을 시도하고, 성공 시 갱신된 토큰을 쿠키에 재설정합니다.

---

## Method

- POST

## URL

- /api/user/status/update

---

## Param

### Path Parameter

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | ---- | ---------- | ---- | -------- | ---- |
| -   | -    | -          | -    | -        | -    |

### Query Parameter

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | ---- | ---------- | ---- | -------- | ---- |
| -   | -    | -          | -    | -        | -    |

---

## 사용자

- 로그인 필요 여부: 필수
- 접근 가능한 사용자 범위: 로그인한 모든 사용자

---

## Request

### Header

| key          | 설명                | value 타입 | 필수 | 비고                                   |
| ------------ | ------------------- | ---------- | ---- | -------------------------------------- |
| Content-Type | application/json    | string     | O    |                                        |
| Cookie       | Supabase Auth Token | string     | O    | sb-access-token, sb-refresh-token 필요 |

### Body

| key    | 설명             | value 타입 | 옵션 | Nullable | 예시                                     |
| ------ | ---------------- | ---------- | ---- | -------- | ---------------------------------------- |
| status | 변경할 유저 상태 | string     | X    | X        | "online" \| "away" \| "dnd" \| "offline" |

---

## Response

### Body

| key     | 설명        | value 타입 | 옵션 | Nullable | 예시                        |
| ------- | ----------- | ---------- | ---- | -------- | --------------------------- |
| success | 성공 여부   | boolean    | O    | X        | true                        |
| error   | 에러 메시지 | string     | O    | X        | "유효하지 않은 상태입니다." |

### Example

#### Success

```json
{
  "success": true
}
```

#### Error

```json
{
  "error": "유효하지 않은 상태입니다."
}
```

---

## Status

| status | response content | 설명                            |
| ------ | ---------------- | ------------------------------- |
| 200    | OK               | 상태 변경 성공                  |
| 400    | BAD_REQUEST      | 유효하지 않은 status 값         |
| 401    | UNAUTHORIZED     | 인증 실패 또는 세션 만료        |
| 500    | INTERNAL_ERROR   | DB 업데이트 실패 또는 서버 오류 |

---

## 기타

- 프론트엔드 처리 시 주의사항
  - 상태 변경 요청 후 UI에 즉시 반영하는 Optimistic Update를 권장합니다.
  - 401 응답 시 로그인 페이지로 리다이렉트하거나 재로그인을 유도해야 합니다.
