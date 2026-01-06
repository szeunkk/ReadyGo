# MatchContext Immutability & Domain Boundary Policy

## 1. Purpose

이 문서는 Match Domain에서 사용되는 MatchContext의 불변성(immutability) 과 Domain 경계(boundary) 규칙을 정의한다.

이 정책의 목적은 다음과 같다.

- Domain 계산 로직의 예측 가능성 보장
- MatchContext 조립 책임과 사용 책임의 명확한 분리
- 점수 계산 로직의 부작용(side effect) 방지
- Supabase 기반 Frontend-only 구조에서도 안정적인 계층 분리 유지

⸻

## 2. Core Principle

### 2-1. MatchContext는 “입력 스냅샷”이다

MatchContext는 계산 시점의 입력 사실 데이터 스냅샷이다.

- 상태(state)가 아니다
- 세션 객체가 아니다
- 계산 도중 변경되는 데이터가 아니다

MatchContext는 읽기 전용(read-only) 입력 계약(contract) 이다

⸻

## 3. Immutability Rule

### 3-1. Domain 진입 이후 불변

    - MatchContext는 Domain 함수에 전달된 이후 절대 수정되지 않는다
    - Domain 함수는 Context를 신뢰하고 읽기만 수행한다

허용 ❌

- 필드 값 변경
- 파생 필드 추가
- flag 토글
- 상태 누적

허용 ⭕

- 새로운 결과 DTO 생성
- 계산 결과 반환

### 3-2. 계산 결과는 Context에 포함하지 않는다

다음 값들은 MatchContext에 절대 포함되지 않는다.

- baseScore
- factor (animal / schedule / online / steam)
- finalScore
- rankingScore
- availability 판단 결과

모든 계산 결과는 별도의 Result DTO로만 반환한다

⸻

## 4. Domain Boundary Definition

### 4-1. Domain의 책임

Domain Layer는 다음 책임만 가진다.

- MatchContext를 입력으로 받는다
- 정책에 따라 계산한다
- 결과 DTO를 반환한다

Domain은 다음을 하지 않는다.

- Context 생성
- Context 검증
- Context 보정
- 외부 데이터 조회
- 상태 저장

### 4-2. Domain 함수 입력 규칙

- Domain 함수는 항상 완성된 MatchContext를 입력으로 받는다
- Context 내부 필드의 존재 여부만으로 판단한다
- null / undefined는 정상 상태로 간주한다

“Context가 불완전해서 계산 불가” 상태는 허용하지 않는다

⸻

## 5. Boundary with Other Layers

### 5-1. Service Layer

- MatchContext 조립 책임을 가진다
- Cold Start 판단을 수행한다
- Domain에 전달하기 전 Context를 완성한다

Service Layer는 Domain 계산 결과를 해석하지 않는다.

### 5-2. Repository Layer

- Context 개념을 알지 못한다
- 단일 테이블 / 단일 엔티티 데이터만 반환한다

Repository는 계산 정책을 알 필요가 없다.

### 5-3. UI Layer

- MatchContext에 접근하지 않는다
- Domain 결과 DTO / ViewModel만 사용한다
- 점수 계산 로직, factor 개념을 알 필요가 없다

⸻

## 6. Cold Start & Immutability

Cold Start는 Context 불변성 규칙의 예외가 아니다.

- traits 없음
- schedule 없음
- steam 없음

위 상태에서도:

- Context는 정상
- Domain 계산은 정상
- baseScore = 50
- 모든 factor = 1.0

Cold Start는 “특별한 분기”가 아니라 정상 입력 케이스 중 하나다

⸻

## 7. Rationale

이 정책을 따르는 이유는 다음과 같다.

- 계산 로직 테스트 단순화
- 정책 변경 시 영향 범위 최소화
- 점수 산정 과정의 디버깅 용이성 확보
- Frontend-only 환경에서도 Backend와 동일한 Domain 안정성 확보

⸻

## 8. Scope

이 정책은 다음 영역에 적용된다.

- MatchContext 전체
- Match Score 계산 Domain
- Match Reason / Tag 생성 Domain
- 향후 Party Match 계산 로직

⸻

## 9. Violation Examples (금지 사례)

다음 구현은 정책 위반이다.

- Domain 내부에서 Context 수정
- Context에 계산 결과 저장
- Context 생성 로직을 Domain에 포함
- factor 값을 외부로 노출

⸻

## 10. Contract Stability Rule

- 이 문서는 MatchContext 사용 규칙의 기준 문서다
- Context 관련 변경이 필요할 경우:
  1. 이 문서를 먼저 수정
  2. 변경 사유 명시
  3. Domain 코드 수정

구현이 문서를 따라야 하며, 문서가 구현을 따라가서는 안 된다
