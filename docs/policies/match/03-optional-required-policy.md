# Optional / Required Field Policy

## 1. Purpose

이 문서는 `MatchContext` 내부 필드 중  
**어떤 필드는 반드시 존재해야 하고**, **어떤 필드는 없어도 허용되는지**를 정책 수준에서 정의한다.

이 문서의 목적은 다음과 같다.

- MatchContext 생성 시 Service Layer의 책임을 명확히 한다
- Optional 필드의 의미를 “데이터 부재”로 통일한다
- Cold Start / Steam 미연동 상황에서도 Domain 해석을 일관되게 유지한다
- Optional/Required 혼선으로 인한 계산 분기, 예외 처리를 방지한다

---

## 2. Required Field Rule

### 2-1 Required 필드 정의

MatchContext에서 **항상 존재해야 하는 필드**는 아래와 같다.

- `viewer.userId`
- `target.userId`

이 두 필드는 **식별 목적 전용**이며, 점수 계산이나 유사도 비교에는 직접 사용하지 않는다.

### 2-2 Required 필드의 의미

- MatchContext는 **항상 “누가 누구를 평가하는지”를 표현할 수 있어야 한다**
- 데이터가 전혀 없는 Cold Start 상황에서도  
  viewer와 target의 식별자는 반드시 존재해야 한다

> Required 필드는 “계산을 위한 데이터”가 아니라  
> **매칭 행위 자체를 성립시키는 최소 조건**이다

---

## 3. Optional Field Rule

### 3-1 Optional 필드 범위

아래 필드들은 **모두 optional** 이다.

- `traits`
- `animalType`
- `activity.schedule`
- `activity.isOnline`
- `steam`
- `reliability`

이 필드들은 **존재 여부 자체가 의미를 가지며**, 값이 없다고 해서 Context가 무효가 되지 않는다.

### 3-2 Optional 필드의 해석 원칙

Optional 필드는 다음 원칙을 따른다.

- 존재하지 않으면 → “비교 불가”
- 존재하면 → “비교 가능”
- 값의 유효성 판단, 점수 해석은 **Domain 책임**

Service는 Optional 필드를 “채우려고 노력”하지 않는다.
없으면 없는 상태로 전달한다.

---

## 4. Optional ≠ Null 정책

### 4-1 기본 원칙

MatchContext에서 **null 사용은 금지**한다.

- 값이 없으면 → `undefined`
- 의미 없는 값 채우기 금지 (0, 빈 배열, 기본값 등)

### 4-2 이유

- Optional 필드의 존재 여부 자체가 정책 신호이기 때문
- Domain에서 “데이터가 없다”는 상태를 명확히 인식하기 위함
- Cold Start 판단 로직을 단순화하기 위함

> `optional`은 “없을 수 있음”이지  
> “의미 없는 값이 들어올 수 있음”이 아니다

---

## 5. Service Responsibility

Service Layer는 MatchContext를 조립할 때 다음을 보장해야 한다.

- Required 필드는 항상 포함
- Optional 필드는 **존재할 때만 포함**
- Optional 필드를 강제로 생성하거나 보정하지 않음
- Cold Start 여부를 **데이터 존재 여부로만 판단**

Service는 다음 행위를 해서는 안 된다.

- traits가 없다고 기본 TraitVector를 생성
- schedule이 없다고 빈 배열 삽입
- online 상태를 임의로 false 처리

---

## 6. Domain Interpretation Rule

Domain Layer는 MatchContext를 다음과 같이 해석한다.

- Required 필드는 항상 신뢰 가능
- Optional 필드는 존재 여부만 확인
- Optional 필드가 없으면:
  - baseScore: Cold Start 규칙 적용
  - factor: 1.0 반환
  - reason/tag: fallback 정책 사용

Domain은 다음을 수행하지 않는다.

- Context 유효성 검사
- 필드 보완 또는 수정
- 외부 데이터 조회

> Domain은 Context를 “사실(fact)”로 신뢰하고 계산만 수행한다

---

## 7. Anti-Patterns (금지 사례)

다음은 금지된다.

- Optional 필드를 null로 채우는 행위
- “없으면 기본값”을 Service에서 주입하는 행위
- Domain 내부에서 Context를 수정하는 행위
- Optional 필드 존재 여부에 따라 계산 로직 분기를 난립시키는 행위

---

## 8. Contract Stability Rule

- Optional / Required 정책 변경 시:
  1. 이 문서를 먼저 수정한다
  2. 변경 이유를 명시한다
  3. Domain 정책과 충돌 여부를 검토한다

> MatchContext의 Optional/Required 정책은  
> **코드보다 문서가 우선한다**
