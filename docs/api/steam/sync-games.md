# API 명세서

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2025-12-30                                                                                                     |
| 최종 수정일 | 2025-12-30                                                                                                     |
| 관련 화면   | 프로필 분석                                                                                                    |
| 관련 이슈   | [사용자 요구사항 정의서(UR-12)](https://www.notion.so/UR-12-2ca130d16ff48123a0def99362c8767d?source=copy_link) |

---

## 기능

- Steam API로부터 최신 게임 목록을 가져와 게임 상세 정보를 동기화합니다.
- 배치(Cron) 작업용 API로 설계되었습니다.

## 카테고리

- Steam

## 설명

- Steam `GetAppList` API를 호출하여 최신 게임 목록을 가져옵니다.
- 이미 동기화가 완료된 게임(`steam_game_sync_logs` 기준)을 제외하고, 설정된 `limit`만큼 상세 정보를 조회(`appdetails`)합니다.
- 유효한 게임 정보(type='game')인 경우 `steam_game_info` 테이블에 저장 또는 업데이트합니다.
- 처리 결과(성공, 실패, 건너뜀)는 `steam_game_sync_logs`에 기록됩니다.

---

## Method

- POST

## URL

- /api/steam/sync-games

---

## Param

### Path Parameter

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| :-- | :--- | :--------- | :--- | :------- | :--- |
| -   | -    | -          | -    | -        | -    |

### Query Parameter

| key   | 설명                  | value 타입 | 옵션     | Nullable | 예시 |
| :---- | :-------------------- | :--------- | :------- | :------- | :--- |
| limit | 동기화할 최대 게임 수 | Number     | Optional | X        | 200  |

---

## 사용자

- 로그인 필요 여부: 불필요 (Cron 작업용)
- 접근 가능한 사용자 범위: 내부 시스템 (또는 Cron Secret 헤더를 가진 요청자)

---

## Request

### Header

| key           | 설명              | value  | 필수 | 비고                                       |
| :------------ | :---------------- | :----- | :--- | :----------------------------------------- |
| x-cron-secret | Cron 작업 인증 키 | String | △    | 현재 코드상 주석 처리됨 (향후 활성화 예정) |

### Body

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| :-- | :--- | :--------- | :--- | :------- | :--- |
| -   | -    | -          | -    | -        | -    |

---

## Response

### Body

| key        | 설명                                    | value 타입 | 옵션     | Nullable | 예시   |
| :--------- | :-------------------------------------- | :--------- | :------- | :------- | :----- |
| ok         | 성공 여부                               | Boolean    | Required | X        | `true` |
| candidates | Steam API에서 조회한 전체 후보 수       | Number     | Required | X        | 1000   |
| queued     | 실제 처리를 위해 큐잉된(동기화 대상) 수 | Number     | Required | X        | 200    |

### Example

```json
{
  "ok": true,
  "candidates": 1000,
  "queued": 200
}
```

---

## Status

| status | response content      | 설명                                           |
| :----- | :-------------------- | :--------------------------------------------- |
| 200    | OK                    | 동기화 작업 시작 성공                          |
| 401    | Unauthorized          | 인증 실패 (Cron Secret 불일치) - _현재 비활성_ |
| 500    | Internal Server Error | Steam API 호출 실패 등 서버 에러               |

---

## 기타

- **배치 작업 특성**:
  - 대량의 게임 정보를 처리하므로 실행 시간이 길어질 수 있습니다. Vercel 함수 타임아웃에 주의해야 합니다.
- **Steam API 제한**:
  - Steam API 호출량 제한(Rate Limit)을 고려하여 `limit` 값을 적절히 조절해야 합니다.
- **로그 기록**:
  - 개별 게임의 동기화 성공/실패 여부는 `steam_game_sync_logs` 테이블에 상세히 기록됩니다.
