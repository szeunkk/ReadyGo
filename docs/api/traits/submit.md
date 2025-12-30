# API 명세서

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2025-12-30                                                                                                     |
| 최종 수정일 | 2025-12-30                                                                                                     |
| 관련 화면   | 성향 분석 계산                                                                                                 |
| 관련 이슈   | [사용자 요구사항 정의서(UR-13)](https://www.notion.so/UR-13-2ca130d16ff481388ef3f365f34037d9?source=copy_link) |

---

## 기능

- 사용자의 성향 분석 결과와 플레이 스케줄을 검증하고, 이를 `user_traits`, `user_profiles`, `user_play_schedules` 테이블에 저장합니다.

## 카테고리

- Traits

## 설명

- 성향 테스트 결과 데이터를 서버로 전송하여 다음 3가지 테이블의 정보를 최신화합니다.
  - `user_traits`: 5가지 성향 점수 (cooperation, exploration, strategy, leadership, social)
  - `user_profiles`: 분석된 동물 유형 (animal_type)
  - `user_play_schedules`: 선호 플레이 요일 및 시간대 (day_type, time_slot)

---

## Method

- POST

## URL

- /api/traits/submit

---

## Param

### Path Parameter

- 없음

### Query Parameter

- 없음

---

## 사용자

- 로그인 필요 여부: 필수
  - 코드는 `supabaseAdmin.auth.getUser(accessToken)`을 통해 인증된 사용자 정보를 가져옴
  - 만약 user 객체가 없거나 인증 에러가 발생하면 `401 Unauthorized`를 반환

- 접근 가능한 사용자 범위: 모든 로그인된 사용자 (Authenticated Users)
  - 별도의 역할(Role)이나 권한 체크 로직은 없음
  - 로그인하여 유요한 AccessToken 을 가진 사용자라면 누구나 자신의 성향 정보를 제출할 수 있음
  - 단, 제출된 데이터는 요청을 보낸 사용자 본인의 ID (`user.id`)로만 저장.
  - body에 다른 `user_id`를 포함하여 요청하면 `400 Bad Request`로 거부되므로, 다른 사용자의 정보를 임의로 수정할 수 없음

---

## Request

### Header

| key           | 설명      | value            | 필수 | 비고                               |
| :------------ | :-------- | :--------------- | :--- | :--------------------------------- |
| Authorization | 인증 토큰 | `Bearer <token>` | O    | `sb-access-token` 쿠키로 대체 가능 |

### Body

| key                | 설명                    | value 타입 | 옵션     | Nullable | 예시                       |
| :----------------- | :---------------------- | :--------- | :------- | :------- | :------------------------- |
| traits             | 5가지 성향 점수 객체    | Object     | Required | X        | `{"cooperation": 80, ...}` |
| traits.cooperation | 협동 점수 (0~100)       | Number     | Required | X        | 80                         |
| traits.exploration | 탐험 점수 (0~100)       | Number     | Required | X        | 70                         |
| traits.strategy    | 전략 점수 (0~100)       | Number     | Required | X        | 60                         |
| traits.leadership  | 리더십 점수 (0~100)     | Number     | Required | X        | 50                         |
| traits.social      | 교류 점수 (0~100)       | Number     | Required | X        | 90                         |
| animalType         | 성향 동물 타입          | String     | Required | X        | `"TIGER"`                  |
| dayTypes           | 선호 플레이 요일 목록   | String[]   | Required | X        | `["weekday", "weekend"]`   |
| timeSlots          | 선호 플레이 시간대 목록 | String[]   | Required | X        | `["evening", "dawn"]`      |

---

## Response

### Body

| key | 설명                | value 타입 | 옵션     | Nullable | 예시   |
| :-- | :------------------ | :--------- | :------- | :------- | :----- |
| ok  | 요청 처리 성공 여부 | Boolean    | Required | X        | `true` |

### Example

```json
{
  "ok": true
}
```

---

## Status

| status | response content      | 설명                                            |
| :----- | :-------------------- | :---------------------------------------------- |
| 200    | OK                    | 저장 성공                                       |
| 400    | Bad Request           | 데이터 검증 실패 (잘못된 값, 필수 필드 누락 등) |
| 401    | Unauthorized          | 로그인 필요                                     |
| 500    | Internal Server Error | 서버 에러                                       |

---

## 기타

##### 에러 처리 및 UX 관련 사항 (`src/components/traits/traitsTestPage.tsx`

1. 로딩 상태 (loading state)
   - 제출이 시작되면(isLoading = true) `<AnalysisLoading />` 컴포넌트를 전체 화면에 표시
   - 성공 시 결과 페이지로 이동할 때까지 로딩 상태를 유지하여 중복 제출을 방지하고 부드러운 전환을 유도
   - 에러 발생 시에만 로딩 상태를 해제하여 사용자가 다시 시도할 수 있게 함

2. 중복 제출 방지 (Double Submission Prevention)
   - `isSubmittingRef`와 `isLoading` 상태를 사용하여 API 요청이 진행 중일 때 추가적인 `handleQuestionComplete` 호출을 즉시 반환(return)시켜 차단

3. 에러 표시 (Error Display)
   - API 호출 실패 시 상단에 붉은색 박스로 에러 메시지("오류가 발생했습니다: {error message}")를 표시
   - 화면은 그대로 유지되므로(로딩 해제), 사용자는 에러메시지를 확인하고 다시 제출 버튼을 누를 수 있음

4. 페이지 이동 (Navigation)
   - 성공 시(ok: true) `router.push(URL_PATHS.TRAITS_RESULT)`를 통해 결과 페이지로 이동
