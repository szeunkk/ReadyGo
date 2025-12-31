# API 명세서

---

## 문서 정보

| 항목        | 내용       |
| ----------- | ---------- |
| 작성자      |            |
| 최초 작성일 | YYYY-MM-DD |
| 최종 수정일 | YYYY-MM-DD |
| 관련 화면   |            |
| 관련 이슈   |            |

---

## 기능

- 이 API가 제공하는 기능 요약

## 카테고리

- Auth / Steam / Party / Traits / UserStatus

## 설명

- 프론트엔드 관점에서 이 API가 어떤 역할을 하는지 설명

---

## Method

- GET | POST | PATCH | DELETE

## URL

- /api/xxx/yyy

---

## Param

### Path Parameter

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | ---- | ---------- | ---- | -------- | ---- |

### Query Parameter

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | ---- | ---------- | ---- | -------- | ---- |

---

## 사용자

- 로그인 필요 여부
- 접근 가능한 사용자 범위

---

## Request

### Header

| key | 설명 | value 타입 | 필수 | 비고 |
| --- | ---- | ---------- | ---- | ---- |

### Body

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | ---- | ---------- | ---- | -------- | ---- |

---

## Response

### Body

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | ---- | ---------- | ---- | -------- | ---- |

### Example

```json
{}
```

---

## Status

| status | response content | 설명        |
| ------ | ---------------- | ----------- |
| 200    | OK               | 성공        |
| 201    | CREATED          | 생성 성공   |
| 400    | VALIDATION_ERROR | 요청 오류   |
| 401    | AUTH_REQUIRED    | 인증 필요   |
| 403    | FORBIDDEN        | 권한 없음   |
| 404    | NOT_FOUND        | 리소스 없음 |
| 500    | INTERNAL_ERROR   | 서버 오류   |

---

## 기타

- 프론트엔드 처리 시 주의사항
- empty / loading / error UX
- optimistic update 가능 여부
