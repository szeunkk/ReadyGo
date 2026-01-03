# API 명세서

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2025-12-30                                                                                                     |
| 최종 수정일 | 2026-01-02                                                                                                     |
| 관련 화면   | 성향 분석 결과                                                                                                 |
| 관련 이슈   | [사용자 요구사항 정의서(UR-13)](https://www.notion.so/UR-13-2ca130d16ff481388ef3f365f34037d9?source=copy_link) |

---

## 기능

- 인증된 사용자의 성향 분석 결과(성향 점수, 동물 유형)와 플레이 스케줄 정보를 조회합니다.

## 카테고리

- Traits

## 설명

- 로그인한 사용자 본인의 성향 분석 결과를 조회합니다
- 인증 토큰에서 userId를 자동으로 추출하므로 요청 파라미터로 전달하지 않습니다
- 다음 정보들을 조회하고 조합하여 반환합니다:
  - 5가지 성향 점수 (cooperation, exploration, strategy, leadership, social)
  - 분석된 동물 유형 (animalType)
  - 사용자 닉네임 (nickname)
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

- **로그인 필요**: 필수
  - 로그인하지 않은 경우 `401 Unauthorized` 반환
- **접근 가능한 사용자**: 본인만 접근 가능
  - userId는 인증 세션(auth.uid())에서 자동 추출
  - 본인의 성향 정보만 조회 가능

---

## Request

### Header

| key    | 설명                    | value 타입 | 필수 | 비고                                   |
| ------ | ----------------------- | ---------- | ---- | -------------------------------------- |
| Cookie | Supabase 인증 세션 쿠키 | string     | O    | Next.js Server Component에서 자동 처리 |

### Body

- 없음

---

## Response

### Body

| key                | 설명                 | value 타입 | 옵션 | Nullable | 예시                       |
| ------------------ | -------------------- | ---------- | ---- | -------- | -------------------------- |
| traits             | 5가지 성향 점수 객체 | Object     | X    | X        | `{"cooperation": 80, ...}` |
| traits.cooperation | 협동 점수 (0-100)    | number     | X    | X        | 80                         |
| traits.exploration | 탐험 점수 (0-100)    | number     | X    | X        | 70                         |
| traits.strategy    | 전략 점수 (0-100)    | number     | X    | X        | 60                         |
| traits.leadership  | 리더십 점수 (0-100)  | number     | X    | X        | 50                         |
| traits.social      | 교류 점수 (0-100)    | number     | X    | X        | 90                         |
| animalType         | 성향 동물 타입       | string     | X    | X        | "tiger"                    |
| nickname           | 사용자 닉네임        | string     | X    | X        | "게이머호랑이"             |
| schedule           | 플레이 스케줄 객체   | Object     | X    | X        | `{"dayTypes": [...], ...}` |
| schedule.dayTypes  | 선호 요일 목록       | string[]   | X    | X        | `["weekday", "weekend"]`   |
| schedule.timeSlots | 선호 시간대 목록     | string[]   | X    | X        | `["18-24", "00-06"]`       |

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
  "animalType": "tiger",
  "nickname": "게이머호랑이",
  "schedule": {
    "dayTypes": ["weekday", "weekend"],
    "timeSlots": ["18-24", "00-06"]
  }
}
```

---

## Status

| status | response content      | 설명                                |
| ------ | --------------------- | ----------------------------------- |
| 200    | TraitsResultDTO       | 조회 성공                           |
| 401    | Unauthorized          | 인증 필요 (로그인하지 않음)         |
| 404    | traits not found      | 성향 정보가 존재하지 않음 (분석 전) |
| 500    | Internal Server Error | 서버 에러                           |

**에러 응답 형식:**

```json
{
  "message": "traits not found",
  "detail": "User traits data does not exist"
}
```

또는

```json
{
  "message": "Internal Server Error",
  "detail": "에러 상세 메시지"
}
```

---

## 기타

### 프론트엔드 처리 시 주의사항

1. **성향 분석 미실시 사용자 처리:**
   - 404 상태 코드 반환 시 성향 검사를 완료하지 않은 상태입니다
   - 프론트엔드에서 404를 감지하여 성향 테스트 페이지로 리다이렉트 필요
   - 또는 "성향 검사를 먼저 완료해주세요" 안내 메시지 표시

2. **에러 UX:**
   - 401: 로그인 페이지로 리다이렉트
   - 404: 성향 검사 페이지(`/traits/test`)로 리다이렉트 또는 안내
   - 500: "일시적인 오류가 발생했습니다" + 재시도 버튼

3. **Loading 상태:**
   - 데이터 로드 중 Skeleton UI 또는 로딩 인디케이터 사용 권장
   - 레이더 차트, 동물 아이콘, 스케줄 정보 영역 모두 Skeleton 처리

4. **캐싱 전략:**
   - SWR이나 React Query로 클라이언트 캐싱 권장
   - staleTime: 60초 (성향 검사는 자주 변경되지 않음)
   - revalidateOnFocus: false (불필요한 재호출 방지)

### 사용 예시

```typescript
// SWR 사용 예시
const {
  data: traitsResult,
  error,
  isLoading,
} = useSWR('/api/traits/result', fetcher, {
  revalidateOnFocus: false,
  onError: (err) => {
    if (err.status === 404) {
      router.push('/traits/test');
    }
  },
});

// React Query 사용 예시
const { data: traitsResult } = useQuery({
  queryKey: ['traits', 'result'],
  queryFn: () => fetch('/api/traits/result').then((res) => res.json()),
  staleTime: 60000, // 1분
});
```
