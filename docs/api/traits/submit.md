# API 명세서

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2025-12-30                                                                                                     |
| 최종 수정일 | 2026-01-02                                                                                                     |
| 관련 화면   | 성향 분석 제출                                                                                                 |
| 관련 이슈   | [사용자 요구사항 정의서(UR-13)](https://www.notion.so/UR-13-2ca130d16ff481388ef3f365f34037d9?source=copy_link) |

---

## 기능

- 사용자의 성향 분석 결과와 플레이 스케줄을 검증하고, 이를 `user_traits`, `user_profiles`, `user_play_schedules` 테이블에 저장합니다.

## 카테고리

- Traits

## 설명

- 로그인한 사용자 본인의 성향 분석 결과를 제출합니다
- 인증 토큰에서 userId를 자동으로 추출하므로 요청 Body에 user_id를 포함하면 안 됩니다
- 성향 테스트 결과 데이터를 검증하고 다음 3가지 테이블의 정보를 저장/업데이트합니다:
  - `user_traits`: 5가지 성향 점수 (cooperation, exploration, strategy, leadership, social)
  - `user_profiles`: 분석된 동물 유형 (animal_type)
  - `user_play_schedules`: 선호 플레이 요일 및 시간대 (day_type, time_slot)
- Zod 스키마를 사용하여 요청 데이터 검증을 수행합니다

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

- **로그인 필요**: 필수
  - 로그인하지 않은 경우 `401 Unauthorized` 반환
  - 인증 세션(auth.uid())에서 userId 추출

- **접근 가능한 사용자**: 본인만 제출 가능
  - 모든 로그인된 사용자가 자신의 성향 정보를 제출할 수 있습니다
  - userId는 인증 세션에서 자동으로 추출되어 사용됩니다
  - **중요**: Request Body에 `user_id`를 포함하면 `400 Bad Request`로 즉시 거부됩니다
  - 이를 통해 다른 사용자의 정보를 임의로 수정할 수 없도록 보장합니다

---

## Request

### Header

| key    | 설명                    | value 타입 | 필수 | 비고                                   |
| ------ | ----------------------- | ---------- | ---- | -------------------------------------- |
| Cookie | Supabase 인증 세션 쿠키 | string     | O    | Next.js Server Component에서 자동 처리 |

### Body

| key                | 설명                    | value 타입 | 옵션 | Nullable | 예시                       |
| ------------------ | ----------------------- | ---------- | ---- | -------- | -------------------------- |
| traits             | 5가지 성향 점수 객체    | Object     | X    | X        | `{"cooperation": 80, ...}` |
| traits.cooperation | 협동 점수 (0-100)       | number     | X    | X        | 80                         |
| traits.exploration | 탐험 점수 (0-100)       | number     | X    | X        | 70                         |
| traits.strategy    | 전략 점수 (0-100)       | number     | X    | X        | 60                         |
| traits.leadership  | 리더십 점수 (0-100)     | number     | X    | X        | 50                         |
| traits.social      | 교류 점수 (0-100)       | number     | X    | X        | 90                         |
| animalType         | 성향 동물 타입          | string     | X    | X        | "tiger"                    |
| dayTypes           | 선호 플레이 요일 목록   | string[]   | X    | X        | `["weekday", "weekend"]`   |
| timeSlots          | 선호 플레이 시간대 목록 | string[]   | X    | X        | `["18-24", "00-06"]`       |

**검증 규칙:**

- `traits`: 5개 항목(cooperation, exploration, strategy, leadership, social) 모두 필수
- 각 trait 값: 0 이상 100 이하의 숫자
- `animalType`: 유효한 AnimalType enum 값 (bear, cat, deer, dog, dolphin, fox, hawk, hedgehog, koala, leopard, owl, panda, rabbit, raven, tiger, wolf)
- `dayTypes`: 유효한 dayType 값들의 배열 (weekday, weekend, everyday)
- `timeSlots`: 유효한 timeSlot 값들의 배열 (00-06, 06-12, 12-18, 18-24)
- **user_id 포함 시 즉시 400 에러 반환**

---

## Response

### Body

| key | 설명                | value 타입 | 옵션 | Nullable | 예시 |
| --- | ------------------- | ---------- | ---- | -------- | ---- |
| ok  | 요청 처리 성공 여부 | boolean    | X    | X        | true |

### Example

```json
{
  "ok": true
}
```

---

## Status

| status | response content      | 설명                                                |
| ------ | --------------------- | --------------------------------------------------- |
| 200    | OK                    | 저장 성공                                           |
| 400    | Bad Request           | 검증 실패 (잘못된 값, 필수 필드 누락, user_id 포함) |
| 401    | Unauthorized          | 인증 필요 (로그인하지 않음)                         |
| 500    | Internal Server Error | 서버 에러                                           |

**에러 응답 형식:**

**400 - Invalid JSON:**

```json
{
  "message": "Invalid JSON",
  "detail": "Request body must be valid JSON"
}
```

**400 - user_id 포함:**

```json
{
  "message": "Bad Request",
  "detail": "user_id is not allowed in request body"
}
```

**400 - Validation 실패:**

```json
{
  "message": "Validation failed",
  "detail": "traits.cooperation: Required, animalType: Invalid animalType"
}
```

**401 - 인증 필요:**

```json
{
  "message": "Unauthorized",
  "detail": "Authentication required"
}
```

**500 - 서버 에러:**

```json
{
  "message": "Internal Server Error",
  "detail": "에러 상세 메시지"
}
```

---

## 기타

### 프론트엔드 처리 시 주의사항

1. **user_id 절대 포함 금지:**
   - Request Body에 `user_id` 필드를 절대 포함하지 마세요
   - 포함 시 즉시 400 에러가 반환됩니다
   - userId는 서버에서 인증 세션으로부터 자동 추출됩니다

2. **로딩 상태 처리:**
   - 제출 시작 시 `<AnalysisLoading />` 컴포넌트를 전체 화면에 표시
   - 성공 시 결과 페이지로 이동할 때까지 로딩 상태를 유지하여 중복 제출 방지
   - 에러 발생 시에만 로딩 상태를 해제하여 사용자가 다시 시도할 수 있게 함

3. **중복 제출 방지:**
   - `isSubmittingRef`와 `isLoading` 상태를 사용하여 API 요청 진행 중 추가 호출 차단
   - 버튼 비활성화 또는 로딩 인디케이터로 중복 클릭 방지

4. **에러 UX:**
   - 400 (Validation): 구체적인 에러 메시지를 사용자에게 표시 (어떤 필드가 잘못되었는지)
   - 401: 로그인 페이지로 리다이렉트
   - 500: "일시적인 오류가 발생했습니다. 다시 시도해주세요" + 재시도 버튼

5. **성공 후 처리:**
   - 성공 시(`ok: true`) 결과 페이지로 이동: `router.push('/traits/result')`
   - 이동 전까지 로딩 상태 유지로 부드러운 전환 유도

6. **Validation:**
   - 클라이언트 측에서도 동일한 validation 수행 권장 (서버 에러 방지)
   - traits 5개 모두 0-100 범위 검증
   - animalType, dayTypes, timeSlots 유효성 검증

### 데이터 저장 흐름

1. `user_traits` 테이블: 5가지 성향 점수 upsert
2. `user_profiles` 테이블: animal_type 업데이트
3. `user_play_schedules` 테이블: 기존 데이터 삭제 후 새 데이터 insert

**주의**: 다중 테이블 트랜잭션이 보장되지 않습니다. 일부 단계 성공 후 실패가 발생할 수 있으며, 이 경우 500 에러가 반환됩니다.

### 요청 예시

```typescript
const submitTraits = async (data: {
  traits: {
    cooperation: number;
    exploration: number;
    strategy: number;
    leadership: number;
    social: number;
  };
  animalType: string;
  dayTypes: string[];
  timeSlots: string[];
}) => {
  // ❌ 절대 user_id를 포함하지 마세요!
  const response = await fetch('/api/traits/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), // user_id 없음
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.message);
  }

  return response.json();
};
```
