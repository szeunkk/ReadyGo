# API 명세서

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2026-01-02                                                                                                     |
| 최종 수정일 | 2026-01-02                                                                                                     |
| 관련 화면   | 파티 상세, 사이드 프로필 패널, 매칭 결과                                                                       |
| 관련 이슈   | [사용자 요구사항 정의서(UR-32)](https://www.notion.so/UR-32-2ca130d16ff481c48502cea1b8f6f32c?source=copy_link) |

---

## 기능

- 특정 사용자의 프로필 정보를 조회합니다

## 카테고리

- Profile

## 설명

- 로그인한 사용자가 다른 사용자의 프로필 정보를 조회하는 API입니다
- Path Parameter로 userId를 받아 해당 사용자의 프로필을 조회합니다
- user_profiles, user_traits, user_play_schedules 테이블의 데이터를 조합하여 ProfileCoreDTO 형식으로 반환합니다
- 파티 멤버 프로필 보기, 매칭 상대 프로필 확인, 사이드 패널 프로필 표시 등에서 사용됩니다
- 차단/권한 로직은 포함하지 않으며, 순수하게 프로필 데이터만 조회합니다

---

## Method

- GET

## URL

- `/api/profile/[userId]`

---

## Param

### Path Parameter

| key    | 설명                    | value 타입 | 옵션 | Nullable | 예시                                   |
| ------ | ----------------------- | ---------- | ---- | -------- | -------------------------------------- |
| userId | 조회할 사용자의 고유 ID | string     | X    | X        | "123e4567-e89b-12d3-a456-426614174000" |

### Query Parameter

없음

---

## 사용자

- **로그인 필요**: 필수
- **접근 가능한 사용자**: 로그인한 모든 사용자 (본인 및 타인 프로필 조회 가능)
- 차단/친구 관계 등의 권한 체크는 이 API에서 수행하지 않음

---

## Request

### Header

| key    | 설명                    | value 타입 | 필수 | 비고                                   |
| ------ | ----------------------- | ---------- | ---- | -------------------------------------- |
| Cookie | Supabase 인증 세션 쿠키 | string     | O    | Next.js Server Component에서 자동 처리 |

### Body

없음 (GET 메서드)

---

## Response

### Body

| key        | 설명                       | value 타입          | 옵션 | Nullable | 예시                                        |
| ---------- | -------------------------- | ------------------- | ---- | -------- | ------------------------------------------- |
| userId     | 사용자 고유 ID (UUID)      | string              | X    | X        | "123e4567-e89b-12d3-a456-426614174000"      |
| nickname   | 사용자 닉네임              | string              | O    | X        | "게이머호랑이"                              |
| animalType | 동물 유형 (특성 검사 결과) | AnimalType \| null  | O    | O        | "tiger"                                     |
| traits     | 5가지 특성 벡터            | TraitVector \| null | O    | O        | { cooperation: 58, ... }                    |
| schedule   | 플레이 가능 시간대 배열    | PlayScheduleItem[]  | O    | X        | [{ dayType: "weekday", timeSlot: "18-24" }] |

**TraitVector 상세:**

| key         | 설명   | value 타입 | 범위  |
| ----------- | ------ | ---------- | ----- |
| cooperation | 협동성 | number     | 0-100 |
| exploration | 탐험성 | number     | 0-100 |
| strategy    | 전략성 | number     | 0-100 |
| leadership  | 리더십 | number     | 0-100 |
| social      | 사회성 | number     | 0-100 |

**PlayScheduleItem 상세:**

| key      | 설명          | value 타입 | 예시                               |
| -------- | ------------- | ---------- | ---------------------------------- |
| dayType  | 요일 구분     | string     | "weekday", "weekend", "everyday"   |
| timeSlot | 플레이 시간대 | string     | "00-06", "06-12", "12-18", "18-24" |

### Example

**온보딩 완료 사용자:**

```json
{
  "userId": "987e6543-e21b-34d5-b678-123456789abc",
  "nickname": "게임마스터",
  "animalType": "wolf",
  "traits": {
    "cooperation": 75,
    "exploration": 60,
    "strategy": 88,
    "leadership": 92,
    "social": 70
  },
  "schedule": [
    {
      "dayType": "weekday",
      "timeSlot": "18-24"
    },
    {
      "dayType": "weekend",
      "timeSlot": "12-18"
    },
    {
      "dayType": "weekend",
      "timeSlot": "18-24"
    }
  ]
}
```

**온보딩 미완료 사용자:**

```json
{
  "userId": "987e6543-e21b-34d5-b678-123456789abc",
  "nickname": "신규게이머"
}
```

---

## Status

| status | response content           | 설명                                               |
| ------ | -------------------------- | -------------------------------------------------- |
| 200    | ProfileCoreDTO             | 프로필 조회 성공                                   |
| 400    | VALIDATION_ERROR           | userId 파라미터 누락                               |
| 401    | AUTH_REQUIRED              | 인증 필요 (로그인하지 않음)                        |
| 404    | PROFILE_NOT_FOUND          | 프로필이 존재하지 않음 (user_profiles 레코드 없음) |
| 500    | PROFILE_DATA_INCONSISTENCY | 데이터 불일치 (traits/schedule 중 하나만 존재)     |
| 500    | PROFILE_FETCH_ERROR        | 데이터 조회 실패 (DB 연결 오류, 네트워크 문제 등)  |
| 500    | INTERNAL_ERROR             | 예상치 못한 서버 오류                              |

**에러 응답 형식:**

```json
{
  "code": "PROFILE_NOT_FOUND",
  "message": "User profile not found for userId: xxx"
}
```

---

## 기타

### 프론트엔드 처리 시 주의사항

1. **userId 검증:**
   - Path Parameter에 유효한 UUID를 전달해야 합니다
   - 잘못된 형식의 userId는 400 에러를 반환합니다

2. **타인 프로필 표시:**
   - `traits`와 `schedule`이 없으면 → "특성 검사 미완료" 또는 "정보 비공개" 표시
   - `nickname` 없을 때 → "익명 사용자" 표시
   - `animalType` null일 때 → 기본 아이콘 또는 "특성 분석 중" 표시

3. **차단/권한 처리:**
   - 이 API는 차단 여부를 체크하지 않습니다
   - 프론트엔드에서 별도로 차단 API를 호출하여 UI 제어 필요
   - 차단된 사용자인 경우에도 200 응답이 반환될 수 있으므로 주의

4. **에러 UX:**
   - 401: 로그인 페이지로 리다이렉트
   - 404: "존재하지 않는 사용자입니다" 메시지
   - 500: "일시적인 오류가 발생했습니다" + 재시도 버튼

5. **Loading/Empty 상태:**
   - Loading: Skeleton UI 표시 (닉네임, 동물 아이콘, 레이더 차트)
   - Empty (온보딩 미완료): "특성 검사를 완료하지 않은 사용자입니다" 안내 표시
   - 404: "사용자를 찾을 수 없습니다" 메시지

6. **Optimistic Update:**
   - 이 API는 조회 전용이므로 optimistic update 불필요
   - 캐싱 전략: userId별로 캐시 키 관리 필요

7. **캐싱 전략:**
   - SWR이나 React Query로 userId별 캐싱 권장
   - staleTime: 60초 (타인 프로필은 자주 변경되지 않음)
   - cacheTime: 5분
   - Key format: `["profile", userId]`

### 사용 예시

```typescript
// SWR 사용 예시
const {
  data: profile,
  error,
  isLoading,
} = useSWR(`/api/profile/${userId}`, fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1분
});

// React Query 사용 예시
const { data: profile } = useQuery({
  queryKey: ['profile', userId],
  queryFn: () => fetch(`/api/profile/${userId}`).then((res) => res.json()),
  staleTime: 60000, // 1분
  cacheTime: 300000, // 5분
});
```

### /api/profile/me 와의 차이점

- `/api/profile/me`: 본인 프로필 조회 (userId는 auth에서 자동 추출)
- `/api/profile/[userId]`: 특정 사용자 프로필 조회 (userId를 Path Parameter로 전달)
- 응답 형식은 동일 (ProfileCoreDTO)
- 권한 체크는 없음 (차단/친구 여부 무관하게 조회 가능)
