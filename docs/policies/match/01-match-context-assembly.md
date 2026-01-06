# MatchContext Assembly Policy

## 1. Purpose (목적)

이 문서는 Match Domain에서 사용되는 `MatchContext`가 **어디에서 생성되고, 누가 책임지며, 누가 접근 가능한지**를 명확히 정의한다.

이 정책의 목적은 다음과 같다.

- Domain 로직의 순수성 유지
- Cold Start / Steam 미연동 시나리오의 일관된 처리
- Match 계산 로직과 데이터 조립 책임의 명확한 분리
- UI / API / Domain 간 경계 혼선 방지

---

## 2. MatchContext의 정의

`MatchContext`는 **매칭 계산에 필요한 모든 입력 사실 데이터의 집합**이다.

- 계산 결과를 포함하지 않는다.
- 파생 필드, 점수, 보정 결과를 포함하지 않는다
- 오직 비교 가능한 입력 데이터만 포함한다.

`MatchContext`는 **Match Domain의 단일 입력 컨텍스트(Single Input Contract)**이다.

---

## 3. Assembly 책임 정의 (Responsibility)

### Service Layer (책임 있음)

- MatchContext를 **완성된 형태로 조립한다**
- Resposibility에서 수집한 데이터를 조합한다
- Optional / Required 필드 정책을 준수한다
- Cold Start 판단을 수행한다

> MatchContext는 **Service Layer에서 생성된다**

---

### Domain Layer (책임 없음)

- MatchContext를 생성하지 않는다
- MatchContext를 수정하지 않는다
- MatchContext의 유효성을 판단하지 않는다

> Domain은 MatchContext를 **신뢰하고 계산만 수행**한다

---

### UI Layer (책임 없음)

- MatchContext를 직접 생성하지 않는다
- Context 내부 구조를 알 필요가 없다

> UI는 ViewModel 또는 API 응답만 사용한다

---

### Repository Layer (책임 없음)

- Context 개념을 알지 못한다
- 단일 도메인 데이터만 반환한다

> Repository는 데이터를 어떻게 계산에 쓸지에 대한 어떠한 의사결정도 하지 않는다

## 3-1. Assembly Input / Output Contract

### Input (Service Layer)

Service Layer는 다음 입력을 받아 MatchContext를 조립한다.

- viewerId
- targetUserId
- Repository를 통해 조회된 raw domain data
  - user_traits
  - user_profiles
  - steam_user_games (optional)
  - presence (optional)

### Output

Service Layer는 **항상 유효한 MatchContext**를 반환한다.

- Cold Start 여부와 무관
- optional 필드는 undefined 허용
- Domain이 추가 검증 없이 즉시 계산 가능

> Assembly 단계에서 실패하거나 null을 반환하는 것은 허용하지 않는다.

---

## 4. Assembly 흐름

```text
Repository (raw data)
        ↓
Service Layer (assemble MatchContext)
        ↓
Domain (calculateFinalMatchScore, generateReasons, generateTags)
        ↓
DTO / ViewModel
        ↓
UI
```

---

## 5. Cold Start 정책

- MatchContext는 항상 생성 가능해야 한다
- Traits / Schedule / Steam 데이터가 없더라도 Context는 유효하다
- Cold Start 여부는 Context 내부 플래그 또는 데이터 존재 여부로만 판단한다

> Context가 없어서 계산 불가 상태는 허용하지 않는다

---

## 6. Immutability & Boundary

- MatchContext는 Domain 진입 이후 불변(Immutable)으로 취급한다.
- Domain 함수는 Context를 수정하지 않는다
- 계산 결과는 새로운 DTO로만 반환한다

---

## 7. Rationale (왜 이 구조인가)

- Domain 로직을 테스트 가능하게 유지하기 위해
- Supabase 기반 Frontend-only 구조에서도 서버와 동일한 계층 분리 효과를 얻기 위해
- 정책 변경 시 계산 로직을 최소 수정으로 대응하기 위해

---

## 8. Scope

이 정책은 다음 범위에 적용된다.

- Match Domain 전체
- Matching Score 계산
- Match Reason / Tag 생성
- Party Match 성공 확률 계산 (향후)
