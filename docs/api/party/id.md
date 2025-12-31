# API 명세서

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2025-12-31                                                                                                     |
| 최종 수정일 | 2025-12-31                                                                                                     |
| 관련 화면   | 파티 상세 페이지                                                                                               |
| 관련 이슈   | [사용자 요구사항 정의서(UR-51)](https://www.notion.so/UR-51-2ca130d16ff4818a9034e345bc6b0abc?source=copy_link) |

---

## 기능

- **조회**: 파티 ID를 통한 상세 정보 조회
- **삭제**: 파티 생성자에 의한 파티 삭제
- **수정**: 파티 생성자에 의한 파티 정보 수정

## 카테고리

- Party

## 설명

- `id`에 해당하는 파티의 정보를 조회, 수정, 삭제합니다.
- 모든 요청은 **로그인 상태**여야 가능합니다 (Cookie의 `sb-access-token` 확인).
- **수정/삭제**는 해당 파티를 생성한 사용자(`creator_id` 일치)만 수행할 수 있습니다.

---

## Method

- GET | PATCH | DELETE

## URL

- /api/party/:id

---

## Param

### Path Parameter

| key | 설명           | value 타입 | 옵션 | Nullable | 예시 |
| --- | -------------- | ---------- | ---- | -------- | ---- |
| id  | 파티 ID (숫자) | Integer    | 필수 | N        | 123  |

### Query Parameter

없음

---

## 사용자

- **공통**: 로그인 필요 (Supabase Auth)
- **수정/삭제**: 파티 생성자 본인만 가능

---

## Request

### Header

| key           | 설명            | value 타입 | 필수 | 비고                          |
| ------------- | --------------- | ---------- | ---- | ----------------------------- |
| Authorization | Bearer {token}  | String     | -    | (서버 내부에서 쿠키로 처리됨) |
| Cookie        | sb-access-token | String     | Y    | 인증 토큰                     |

> **Note**: 클라이언트는 브라우저 쿠키를 통해 자동으로 인증 정보를 전달합니다.

### Body (PATCH)

파티 정보 수정을 위한 필드입니다. 변경하고자 하는 필드만 포함하여 전송합니다.

| key           | 설명                | value 타입    | 옵션 | Nullable | 예시                 |
| ------------- | ------------------- | ------------- | ---- | -------- | -------------------- |
| game_title    | 게임 제목           | String        | O    | N        | "League of Legends"  |
| party_title   | 파티 모집 제목      | String        | O    | N        | "랭크 듀오 구합니다" |
| start_date    | 시작 날짜           | String        | O    | N        | "2025-01-01"         |
| start_time    | 시작 시간           | String        | O    | N        | "20:00"              |
| description   | 파티 설명           | String        | O    | Y        | "마이크 필수입니다." |
| max_members   | 최대 인원           | Integer       | O    | N        | 2                    |
| control_level | 조작 방식/레벨      | String        | O    | Y        | "EXPERT"             |
| difficulty    | 난이도              | String        | O    | Y        | "HARD"               |
| voice_chat    | 음성 채팅 사용 여부 | Boolean       | O    | N        | true                 |
| tags          | 태그 목록           | Array<String> | O    | Y        | ["친목", "빡겜"]     |
| status        | 파티 상태           | String        | O    | N        | "RECRUITING"         |

> **GET, DELETE** 요청에는 Body가 필요하지 않습니다.

---

## Response

### Body (GET / PATCH Success)

| key  | 설명           | value 타입 | 옵션 | Nullable | 예시           |
| ---- | -------------- | ---------- | ---- | -------- | -------------- |
| data | 파티 정보 객체 | Object     | N    | N        | (Example 참고) |

### Body (DELETE Success)

| key     | 설명           | value 타입 | 옵션 | Nullable | 예시 |
| ------- | -------------- | ---------- | ---- | -------- | ---- |
| success | 삭제 성공 여부 | Boolean    | N    | N        | true |

### Body (Error)

| key   | 설명        | value 타입 | 옵션 | Nullable | 예시                 |
| ----- | ----------- | ---------- | ---- | -------- | -------------------- |
| error | 에러 메시지 | String     | N    | N        | "인증이 필요합니다." |

### Example (GET / PATCH Response)

```json
{
  "data": {
    "id": 123,
    "creator_id": "user-uuid-123",
    "game_title": "League of Legends",
    "party_title": "랭크 듀오 구합니다",
    "description": "마이크 필수입니다.",
    "max_members": 2,
    "current_members": 1,
    "status": "RECRUITING",
    "created_at": "2025-12-31T10:00:00Z",
    "updated_at": "2025-12-31T10:00:00Z"
    // ... 기타 DB 컬럼
  }
}
```

### Example (DELETE Response)

```json
{
  "success": true
}
```

---

## Status

| status | response content | 설명                                                       |
| ------ | ---------------- | ---------------------------------------------------------- |
| 200    | OK               | 요청 처리 성공 (GET: 데이터 반환, DELETE/PATCH: 처리 완료) |
| 400    | VALIDATION_ERROR | 유효하지 않은 파티 ID (숫자 아님) 또는 수정 데이터 없음    |
| 401    | AUTH_REQUIRED    | 인증되지 않은 사용자 (토큰 없음)                           |
| 403    | FORBIDDEN        | 삭제/수정 권한 없음 (생성자가 아님)                        |
| 404    | NOT_FOUND        | 해당 ID의 파티를 찾을 수 없음                              |
| 500    | INTERNAL_ERROR   | 서버 내부 오류 (DB 연결 등)                                |

---

## 기타

- **GET 요청 시**: 토큰이 없으면 401 에러를 반환합니다. 비로그인 사용자의 접근을 허용하려면 API 수정이 필요합니다.
- **PATCH 요청 시**: `body`에 유효한 필드가 하나도 없으면 400 에러를 반환합니다.
