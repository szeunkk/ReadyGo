# API 명세서 - 파티 관리

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2024-12-31                                                                                                     |
| 최종 수정일 | 2024-12-31                                                                                                     |
| 관련 화면   | 파티 찾기, 파티 생성                                                                                           |
| 관련 이슈   | [사용자 요구사항 정의서(UR-50)](https://www.notion.so/UR-50-2ca130d16ff48138a5b9faeffffdeb44?source=copy_link) |

---

## 기능

- 파티 목록 조회 (GET)
- 파티 생성 (POST)

## 카테고리

- Party

## 설명

- **GET**: 생성된 파티 목록을 최신순으로 조회합니다. 로그인하지 않은 사용자도 조회 가능합니다.
- **POST**: 새로운 파티를 생성합니다. 로그인한 사용자만 가능합니다.

---

# 1. 파티 목록 조회

## Method

- GET

## URL

- /api/party

---

## Param

### Query Parameter

| key   | 설명                  | value 타입      | 옵션 | Nullable | 예시 |
| ----- | --------------------- | --------------- | ---- | -------- | ---- |
| limit | 조회할 파티 개수 제한 | string (number) | O    | O        | "10" |

---

## 사용자

- 로그인 필요 여부: X
- 접근 가능한 사용자 범위: 모든 사용자

---

## Response

### Body

| key   | 설명                  | value 타입 | 옵션 | Nullable | 예시                        |
| ----- | --------------------- | ---------- | ---- | -------- | --------------------------- |
| data  | 파티 목록             | Party[]    | -    | -        | `[{ "id": "...", ... }]`    |
| error | 에러 메시지 (실패 시) | string     | O    | -        | "서버 오류가 발생했습니다." |

### Example

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "created_at": "2024-12-31T12:00:00Z",
      "creator_id": "user-uuid",
      "game_title": "League of Legends",
      "party_title": "랭크 듀오 구합니다",
      "description": "골드 구간 듀오 구해요",
      "max_members": 2,
      "current_members": 1,
      "start_date": "2024-12-31",
      "start_time": "20:00",
      "control_level": "gold",
      "difficulty": "hard",
      "voice_chat": "discord",
      "tags": ["ranking", "duo"]
    }
  ]
}
```

---

# 2. 파티 생성

## Method

- POST

## URL

- /api/party

---

## 사용자

- 로그인 필요 여부: O
- 접근 가능한 사용자 범위: 로그인한 사용자

---

## Request

### Header

| key    | 설명            | value 타입 | 필수 | 비고                |
| ------ | --------------- | ---------- | ---- | ------------------- |
| Cookie | sb-access-token | string     | O    | Supabase Auth Token |

### Body

| key           | 설명             | value 타입 | 옵션 | Nullable | 예시                    |
| ------------- | ---------------- | ---------- | ---- | -------- | ----------------------- |
| game_title    | 게임 제목        | string     | -    | -        | "League of Legends"     |
| party_title   | 파티 제목        | string     | -    | -        | "랭크 듀오 구합니다"    |
| start_date    | 시작 날짜        | string     | -    | -        | "2024-12-31"            |
| start_time    | 시작 시간        | string     | -    | -        | "20:00"                 |
| description   | 파티 설명        | string     | -    | -        | "골드 구간 듀오 구해요" |
| max_members   | 최대 인원        | number     | -    | -        | 2                       |
| control_level | 조작 난이도/티어 | string     | -    | -        | "gold"                  |
| difficulty    | 파티 성향/난이도 | string     | -    | -        | "hard"                  |
| voice_chat    | 음성 채팅 정보   | string     | O    | O        | "discord"               |
| tags          | 태그 목록        | string[]   | O    | O        | ["ranking", "duo"]      |

---

## Response

### Body

| key     | 설명                  | value 타입 | 옵션 | Nullable | 예시                          |
| ------- | --------------------- | ---------- | ---- | -------- | ----------------------------- |
| data.id | 생성된 파티 ID        | string     | -    | -        | "123e4567-..."                |
| error   | 에러 메시지 (실패 시) | string     | O    | -        | "필수 필드가 누락되었습니다." |

### Example

```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

---

## Status

| status | response content | 설명           |
| ------ | ---------------- | -------------- |
| 200    | OK               | 목록 조회 성공 |
| 201    | CREATED          | 파티 생성 성공 |
| 400    | VALIDATION_ERROR | 필수 필드 누락 |
| 401    | AUTH_REQUIRED    | 인증 필요      |
| 500    | INTERNAL_ERROR   | 서버 오류      |

---

## 기타

- **GET**: `status` 필터링 로직은 현재 주석 처리되어 있음 (DB 스키마 미반영 추정).
- **POST**: `status` 컬럼은 현재 제외되어 있음.
- **POST**: `sb-access-token` 쿠키를 통해 인증을 처리하므로 클라이언트에서 별도 헤더 설정 불필요 (Next.js Middleware/Cookie flow).
