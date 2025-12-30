# API 명세서

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2025-12-30                                                                                                     |
| 최종 수정일 | 2025-12-30                                                                                                     |
| 관련 화면   | 성향 분석                                                                                                      |
| 관련 이슈   | [사용자 요구사항 정의서(UR-13)](https://www.notion.so/UR-13-2ca130d16ff481388ef3f365f34037d9?source=copy_link) |

---

## 기능

- 인증된 사용자의 성향 분석 결과(성향 점수, 동물 유형)와 플레이 스케줄 정보를 조회합니다.

## 카테고리

- Traits

## 설명

- 사용자 ID(로그인 세션 기반)를 사용하여 다음 정보들을 조회하고 조합하여 반환합니다.
  - 5가지 성향 점수 (cooperation, exploration, strategy, leadership, social)
  - 분석된 동물 유형 (animal_type)
  - 선호 플레이 스케줄 (dayTypes, timeSlots)

---

## Method

- GET

## URL

- /api/traits/result

---

## Param

### Path Parameter

- 없음

### Query Parameter

- 없음

---

## 사용자

- 로그인 필요 여부: 필수
  - 로그인하지 않은 경우 `401 Unauthorized` 반환
- 접근 가능한 사용자 범위: 모든 로그인된 사용자
  - 본인의 성향 정보만 조회 가능 (토큰에서 사용자 ID 추출)

---

## Request

### Header

| key           | 설명      | value            | 필수 | 비고                               |
| :------------ | :-------- | :--------------- | :--- | :--------------------------------- |
| Authorization | 인증 토큰 | `Bearer <token>` | O    | `sb-access-token` 쿠키로 대체 가능 |

### Body

- 없음

---

## Response

### Body

| key                | 설명                 | value 타입 | 옵션     | Nullable | 예시                       |
| :----------------- | :------------------- | :--------- | :------- | :------- | :------------------------- |
| traits             | 5가지 성향 점수 객체 | Object     | Required | X        | `{"cooperation": 80, ...}` |
| traits.cooperation | 협동 점수            | Number     | Required | X        | 80                         |
| traits.exploration | 탐험 점수            | Number     | Required | X        | 70                         |
| traits.strategy    | 전략 점수            | Number     | Required | X        | 60                         |
| traits.leadership  | 리더십 점수          | Number     | Required | X        | 50                         |
| traits.social      | 교류 점수            | Number     | Required | X        | 90                         |
| animalType         | 성향 동물 타입       | String     | Required | X        | `"TIGER"`                  |
| schedule           | 플레이 스케줄 객체   | Object     | Required | X        | `{"dayTypes": [...], ...}` |
| schedule.dayTypes  | 선호 요일 목록       | String[]   | Required | X        | `["weekday", "weekend"]`   |
| schedule.timeSlots | 선호 시간대 목록     | String[]   | Required | X        | `["evening", "dawn"]`      |

### Example

```json
{
  "traits": {
    "cooperation": 80,
    "exploration": 70,
    "strategy": 60,
    "leadership": 50,
    "social": 90
  },
  "animalType": "TIGER",
  "schedule": {
    "dayTypes": ["weekday", "weekend"],
    "timeSlots": ["evening", "dawn"]
  }
}
```

---

## Status

| status | response content      | 설명                                |
| :----- | :-------------------- | :---------------------------------- |
| 200    | OK                    | 조회 성공                           |
| 401    | Unauthorized          | 로그인 필요                         |
| 404    | Not Found             | 성향 정보가 존재하지 않음 (분석 전) |
| 500    | Internal Server Error | 서버 에러                           |

---

## 기타

- **성향 분석 미실시 사용자 처리**:
  - 404 Status Code 반환됨.
  - 프론트엔드에서는 이를 감지하여 성향 테스트 페이지(`/traits/test`)로 리다이렉트하거나 안내 메시지를 노출해야 함.
- **로딩 처리**:
  - 데이터 로드 중 스켈레톤 UI 또는 로딩 인디케이터 사용 권장.
