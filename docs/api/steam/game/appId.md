# API 명세서

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2025-01-07                                                                                                     |
| 최종 수정일 | 2025-01-07                                                                                                     |
| 관련 화면   | 게임 상세 정보 조회                                                                                            |
| 관련 이슈   | [사용자 요구사항 정의서(UR-12)](https://www.notion.so/UR-12-2ca130d16ff48123a0def99362c8767d?source=copy_link) |

---

## 기능

- Steam app_id를 기반으로 개별 게임의 상세 정보를 조회하고 DB에 저장합니다.

## 카테고리

- Steam

## 설명

- Steam Store API(`appdetails`)를 호출하여 특정 게임의 상세 정보를 조회합니다.
- 유효한 게임 정보(type='game')인 경우 `steam_game_info` 테이블에 저장 또는 업데이트합니다.
- 처리 결과(성공, 실패, 건너뜀)는 `steam_game_sync_logs`에 기록됩니다.
- 게임 이름, 설명, 이미지, 장르, 카테고리 정보를 제공합니다.

---

## Method

- GET

## URL

- /api/steam/game/[appId]

---

## Param

### Path Parameter

| key   | 설명          | value 타입 | 옵션     | Nullable | 예시 |
| ----- | ------------- | ---------- | -------- | -------- | ---- |
| appId | Steam 게임 ID | Number     | Required | X        | 730  |

### Query Parameter

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | ---- | ---------- | ---- | -------- | ---- |
| -   | -    | -          | -    | -        | -    |

---

## 사용자

- 로그인 필요 여부: 필수
- 접근 가능한 사용자 범위: 인증된 모든 사용자

---

## Request

### Header

| key | 설명 | value 타입 | 필수 | 비고                           |
| --- | ---- | ---------- | ---- | ------------------------------ |
| -   | -    | -          | -    | Supabase 인증 쿠키 자동 포함됨 |

### Body

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | ---- | ---------- | ---- | -------- | ---- |
| -   | -    | -          | -    | -        | -    |

---

## Response

### Body

| key                     | 설명                | value 타입 | 옵션     | Nullable | 예시                               |
| ----------------------- | ------------------- | ---------- | -------- | -------- | ---------------------------------- |
| data                    | 게임 상세 정보 객체 | Object     | Required | X        | -                                  |
| data.app_id             | Steam 앱 ID         | Number     | Required | X        | 730                                |
| data.name               | 게임 이름           | String     | Required | X        | "Counter-Strike 2"                 |
| data.short_description  | 짧은 설명           | String     | Required | O        | "For over two decades..."          |
| data.header_image       | 헤더 이미지 URL     | String     | Required | O        | "https://..."                      |
| data.genres             | 장르 배열           | String[]   | Required | X        | ["Action", "Free to Play"]         |
| data.categories         | 카테고리 배열       | Object[]   | Required | X        | [{ id: 1, label: "Multi-player" }] |
| data.categories[].id    | 카테고리 ID         | Number     | Required | X        | 1                                  |
| data.categories[].label | 카테고리 라벨       | String     | Required | X        | "Multi-player"                     |

### Example

```json
{
  "data": {
    "app_id": 730,
    "name": "Counter-Strike 2",
    "short_description": "For over two decades, Counter-Strike has offered an elite competitive experience...",
    "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
    "genres": ["Action", "Free to Play"],
    "categories": [
      { "id": 1, "label": "Multi-player" },
      { "id": 36, "label": "Online Multi-Player" },
      { "id": 37, "label": "Local Multi-Player" }
    ]
  }
}
```

---

## Status

| status | response content | 설명                                         |
| ------ | ---------------- | -------------------------------------------- |
| 200    | OK               | 게임 정보 조회 및 저장 성공                  |
| 400    | INVALID_APP_ID   | 잘못된 app_id 형식                           |
| 400    | NOT_A_GAME       | 게임이 아닌 앱 (DLC, 비디오, 소프트웨어 등)  |
| 401    | Unauthorized     | 인증 필요 (로그인 필요)                      |
| 404    | GAME_NOT_FOUND   | 게임을 찾을 수 없음 (존재하지 않거나 비공개) |
| 502    | STEAM_API_ERROR  | Steam API 호출 실패                          |
| 500    | INTERNAL_ERROR   | 서버 내부 오류                               |

---

## 기타

- **DB 저장**: Steam API를 호출하여 조회한 게임 정보를 `steam_game_info` 테이블에 저장합니다.
- **중복 방지**: 동일한 `app_id`가 이미 존재하면 UPDATE, 없으면 INSERT 합니다 (`upsert`).
- **로그 기록**: 처리 결과는 `steam_game_sync_logs` 테이블에 기록됩니다.
- **Loading 상태**: Steam API 응답 시간이 1-3초 정도 소요될 수 있으므로 로딩 UI 필수입니다.
- **에러 처리**:
  - 400 (NOT_A_GAME): DLC, 비디오 등 게임이 아닌 경우 → "게임이 아닙니다" 메시지 표시
  - 404 에러: 게임이 존재하지 않거나 비공개 상태 → "게임을 찾을 수 없습니다" 메시지 표시
  - 502 에러: Steam API 장애 → "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요" 메시지 표시
- **sync-games와의 차이**:
  - `sync-games`: 배치로 대량의 게임을 자동 동기화
  - 이 API: 사용자가 특정 게임을 요청했을 때 개별 조회 및 저장
- **지역 및 언어**: 현재 미국 지역(`cc=us`), 영어(`l=en`)로 고정되어 있습니다.
