# API 명세서

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2026-01-02                                                                                                     |
| 최종 수정일 | 2026-01-02                                                                                                     |
| 관련 화면   | 프로필 화면, 사이드 패널                                                                                       |
| 관련 이슈   | [사용자 요구사항 정의서(UR-70)](https://www.notion.so/UR-70-2ca130d16ff48118aa42c12295b0c626?source=copy_link) |

---

## 기능

- 현재 로그인한 사용자 본인의 프로필 정보를 조회합니다

## 카테고리

- Profile

## 설명

- 인증된 사용자의 프로필 정보(닉네임, 동물 타입, 특성 벡터, 플레이 스케줄)를 조회하는 API입니다
- userId는 인증 토큰에서 자동으로 추출되므로 요청 파라미터로 전달하지 않습니다
- user_profiles, user_traits, user_play_schedules 테이블의 데이터를 조합하여 ProfileCoreDTO 형식으로 반환합니다
- 온보딩 완료 여부 판단, 프로필 표시 등 다양한 화면에서 사용됩니다

---

## Method

- GET

## URL

- `/api/profile/me`

---

## Param

### Path Parameter

없음

### Query Parameter

없음

---

## 사용자

- **로그인 필요**: 필수
- **접근 가능한 사용자**: 본인만 접근 가능 (auth.uid()를 통해 자동 확인)

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
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "nickname": "게이머호랑이",
  "animalType": "tiger",
  "traits": {
    "cooperation": 58,
    "exploration": 85,
    "strategy": 72,
    "leadership": 90,
    "social": 65
  },
  "schedule": [
    {
      "dayType": "weekday",
      "timeSlot": "18-24"
    },
    {
      "dayType": "weekend",
      "timeSlot": "12-18"
    }
  ]
}
```

**온보딩 미완료 사용자:**

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "nickname": "신규유저123"
}
```

---

## Status

| status | response content           | 설명                                               |
| ------ | -------------------------- | -------------------------------------------------- |
| 200    | ProfileCoreDTO             | 프로필 조회 성공                                   |
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

1. **온보딩 상태 판단:**
   - `traits`와 `schedule`이 모두 없으면 → 온보딩 미완료 (특성 검사 유도)
   - `traits`와 `schedule`이 모두 있으면 → 온보딩 완료 (정상 프로필 표시)

2. **Fallback 처리:**
   - `nickname` 없을 때 → "익명 사용자" 또는 "User#123456" 표시
   - `animalType` null일 때 → 기본 아이콘 또는 "특성 분석 중" 표시
   - `schedule` 없을 때 → "플레이 시간 미설정" 표시

3. **에러 UX:**
   - 401: 로그인 페이지로 리다이렉트
   - 404: "프로필을 찾을 수 없습니다" 메시지 + 재생성 안내
   - 500: "일시적인 오류가 발생했습니다" + 재시도 버튼

4. **Loading/Empty 상태:**
   - Loading: Skeleton UI 표시 (닉네임, 동물 아이콘, 레이더 차트)
   - Empty (온보딩 미완료): "특성 검사를 완료하고 나만의 게임 동료를 찾아보세요!" CTA 표시

5. **Optimistic Update:**
   - 이 API는 조회 전용이므로 optimistic update 불필요
   - 프로필 수정 시 PATCH API 사용 후 이 API를 재호출하여 최신 데이터 반영

6. **캐싱 전략:**
   - 자주 호출되는 API이므로 SWR이나 React Query로 클라이언트 캐싱 권장
   - staleTime: 30초, revalidateOnFocus: true 권장

### 데이터 일관성 규칙

- `traits`와 `schedule`은 반드시 함께 존재하거나 함께 없어야 함
- 둘 중 하나만 있을 경우 `PROFILE_DATA_INCONSISTENCY` 에러 발생 (500)
- 이 경우 DB 상태 점검 필요 (데이터 정합성 문제)
