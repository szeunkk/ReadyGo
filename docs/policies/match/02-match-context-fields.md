# MatchContext Fields Specification

## 1. Purpose

이 문서는 MatchContext에 포함되는 모든 필드의 의미, 책임, 선택 여부(optional)를 정의한다.
이 문서의 목적은 다음과 같다.

- Match Domain이 의존하는 입력 데이터의 범위를 명확히 한다.
- Cold Start / Steam 미연동 시나리오에서 필드 해석을 일관되게 유지한다
- Service / Domain / UI 간 필드 책임 혼선을 방지한다
- 필드 추가, 변경 시 계약(Contract) 기준 문서로 사용한다.

---

## 2. MatchContext 개요

MatchContext는 매칭 계산에 필요한 모든 “입력 사실 데이터”의 집합이다.

- 계산 결과, 점수, 보정 결과는 포함하지 않는다
- 파생 필드는 포함하지 않는다
- 모든 필드는 비교 가능성 기준으로만 포함된다

```
MatchContext {
  viewer: UserMatchInput
  target: UserMatchInput
}
```

MatchContext는 Domain 계산 기준에서의 **최소 계산 단위**이며,
viewer와 하나의 target 후보를 비교하기 위한 구조이다.

---

## 3. Top-Level Structure

| Field  | Type           | Required | Description          |
| ------ | -------------- | -------- | -------------------- |
| viewer | UserMatchInput | O        | 매칭을 요청한 사용자 |
| target | UserMatchInput | O        | 매칭 대상 사용자     |

> viewer / target는 1:N 매칭 평가 과정에서
> 단일 target을 평가하기 위한 비교 단위

---

## 4. UserMatchInput Field

UserMatchInput은 MatchContext 내부에서
**viewer 또는 target 한 명의 비교 가능한 입력 사실 데이터**를 표현한다.

- 계산 결과를 포함하지 않는다
- 파생 값, 점수, 보정 결과를 포함하지 않는다
- 필드 존재 여부 자체가 의미를 가진다

```ts
interface UserMatchInput {
  userId: string;
  traits?: TraitsContext;
  activity?: ActivityContext;
  steam?: SteamContext;
  reliability?: ReliabilityContext;
}
```

---

## 5. UserMatchInput – Required Field

| Field  | Type | Required | Description                            |
| ------ | ---- | -------- | -------------------------------------- |
| userId | uuid | O        | 사용자 식별자 (계산에는 사용하지 않음) |

- userId는 **식별 목적 전용**
- 매칭 점수, 비교 계산에 직접 사용 ❌
- 로그, 결과 저장, UI 연결을 위한 키

---

## 6. Traits Context (성향 정보)

```ts
interface TraitsContext {
  traits?: TraitVector;
  animalType?: AnimalType;
}
```

| Field      | Type        | Required | Description                      |
| ---------- | ----------- | -------- | -------------------------------- |
| traits     | TraitVector | ❌       | 성향 벡터 (코사인 유사도 계산용) |
| animalType | AnimalType  | ❌       | 동물 유형 (궁합 팩터 계산용)     |

**정책**

- traits가 없으면 → Cold Start
- animalType이 없으면 → 궁합 팩터 1.0
- 존재 여부만 판단, 계산은 Domain 책임

---

## 7. Activity Context (활동 정보)

```ts
interface ActivityContext {
  schedule?: PlaySchedule[];
  isOnline?: boolean;
}
```

| Field    | Type           | Required | Description        |
| -------- | -------------- | -------- | ------------------ |
| schedule | PlaySchedule[] | ❌       | 플레이 시간대 목록 |
| isOnline | boolean        | ❌       | 현재 온라인 상태   |

**정책**

- schedule은 시간대 호환성 팩터 계산에만 사용
- isOnline은
  - score 보정 (onlineFactor)
  - 메타 정보 (isOnlineMatched, availabilityHint)
    로 분리 제공

---

## 8. Steam Context (외부 연동 정보)

```ts
interface SteamContext {
  steamGames?: number[];
  totalPlayTime?: number;
}
```

| Field         | Type     | Required | Description        |
| ------------- | -------- | -------- | ------------------ |
| steamGames    | number[] | ❌       | Steam 게임 ID 목록 |
| totalPlayTime | number   | ❌       | 총 플레이 시간     |

**정책**

- Steam 미연동 상태가 기본
- 미연동 시 Domain은 factor = 1.0 처리
- Steam 존재 여부만 확인, 외부 API 호출 ❌

---

## 9. Reliability Context (신뢰도 정보)

```ts
interface ReliabilityContext {
  reliabilityScore?: number;
  partyCount?: number;
}
```

| Field            | Type   | Required | Description    |
| ---------------- | ------ | -------- | -------------- |
| reliabilityScore | number | ❌       | 신뢰도 점수    |
| partyCount       | number | ❌       | 파티 참여 횟수 |

**정책**

- 최종 매칭 점수 계산에는 직접 사용하지 않는다
- 신뢰도는 “함께 플레이해도 안전한가”에 대한 설명 요소로만 사용된다
- MatchReason / MatchTag 생성에만 사용

---

## 10. Cold Start Interpretation Policy

- MatchContext는 항상 생성 가능해야 한다
- 아래 상황 모두 허용:
  - traits 없음
  - schedule 없음
  - steam 없음
  - isOnline 미확인

Cold Start 기준:

- traits 미존재 → baseScore = 50
- 모든 factor → 1.0

> Context 부족으로 계산 불가 상태는 허용하지 않는다

---

## 11. Responsibility Boundary Summary

```text
Repository  → 단일 데이터 제공
Service     → MatchContext 조립 (1:N 반복)
Domain      → MatchContext 신뢰 후 계산
UI          → Context 미접근, ViewModel만 사용
```

---

## 12. Contract Stability Rule

- 이 문서는 MatchContext의 **계약 기준 문서**다
- 필드 추가/변경 시:
  1. 이 문서를 먼저 수정
  2. 변경 이유를 명시
  3. Domain 정책과 일관성 유지

> 구현보다 문서가 먼저 바뀌는 것이 정상이다
