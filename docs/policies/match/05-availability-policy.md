# Steam / Online / Reliability Handling Policy

(READ-64)

## 1. Purpose

이 문서는 Match Domain에서 사용되는 **Steam / Online / Reliability 입력 데이터의 해석 및 처리 규칙**을 정의한다.

이 정책의 목적은 다음과 같다.

- 외부 연동 데이터(Steam)를 **선택적 시그널**로 취급한다
- 실시간 상태(Online)를 **점수 보정과 메타 정보로 분리**한다
- 신뢰도(Reliability)를 **점수 계산이 아닌 설명 재료**로 활용한다
- Cold Start 상황에서도 **일관된 매칭 결과를 보장**한다
- 점수 정책이 UI/Service/Domain 간에 흔들리지 않도록 한다

---

## 2. Policy Scope

이 문서는 다음 범위에 적용된다.

- Match Domain score 계산 정책
- MatchReason / MatchTag 생성 정책
- MatchResult 메타 정보 생성 정책
- Steam 미연동 / Online 미확인 / Reliability 정보 부족 시나리오

> ❗ 이 문서는 **점수 수식 정의 문서가 아니다**  
> “어떤 데이터가 어떤 역할을 갖는가”를 정의하는 정책 문서다

---

## 3. Steam Handling Policy

### 3.1 Steam 데이터의 성격

Steam 데이터는 다음과 같은 특징을 가진다.

- 외부 플랫폼 연동 데이터
- 유저 선택에 따라 **존재하지 않을 수 있음**
- 신뢰성은 높지만 **필수 데이터는 아님**

따라서 Steam 데이터는 **보조 시그널(Optional Signal)**로만 취급한다.

---

### 3.2 Steam 데이터의 역할

Steam 데이터는 다음 목적에만 사용된다.

- 공통 관심사 설명 (MatchReason)
- 공통 게임 기반 태그 생성 (MatchTag)
- 약한 점수 보정 (Compatibility Factor)

Steam 데이터는 다음 용도로 사용하지 않는다.

- baseScore 계산 ❌
- Cold Start 판단 ❌
- 매칭 불가 판단 ❌

---

### 3.3 Steam 미연동 정책

Steam 데이터가 없는 경우:

- Steam Compatibility Factor = **1.0**
- Steam 관련 Reason / Tag 생성 ❌
- 매칭 계산은 **완전히 정상 동작**

> Steam 미연동은 **감점 사유가 아니다**

---

## 4. Online Handling Policy

### 4.1 Online 데이터의 성격

Online 상태는 다음과 같은 특징을 가진다.

- 실시간 변화 데이터
- 짧은 유효성
- 매칭 성향과는 직접적인 관련 없음

따라서 Online 상태는 **상황 시그널(Situation Signal)**로 취급한다.

---

### 4.2 Online 데이터의 역할 분리

Online 상태는 **두 가지 결과로 분리**하여 사용한다.

1. **Score 보정용**
2. **메타 정보 제공용**

---

### 4.3 Online Score Policy

- Online 상태는 **약한 multiplicative factor**로만 반영한다
- 최대 영향도는 **2% 이하**
- baseScore의 우위를 절대 침범하지 않는다

정책 요약:

- online = true → factor ≤ 1.02
- online = false / unknown → factor = 1.0

> 온라인 여부로 매칭 점수가 역전되는 상황은 허용하지 않는다

---

### 4.4 Online Meta Policy

Online 상태는 점수 외에 다음 메타 정보로 제공된다.

- isOnlineMatched: boolean
- availabilityHint: `'online' | 'offline' | 'unknown'`

이 메타 정보는 다음 용도로 사용된다.

- Home 화면 정렬
- 필터링 조건
- UI 상태 표시

> UI는 Online 메타를 점수와 **독립적으로** 사용한다

---

## 5. Reliability Handling Policy

### 5.1 Reliability 데이터의 성격

Reliability 데이터는 다음을 기반으로 한다.

- 파티 참여 이력
- 사용자 평가
- 누적 행동 로그

이는 **성향이 아닌 신뢰 신호**다.

---

### 5.2 Reliability 데이터의 역할

Reliability 데이터는 다음 용도로만 사용한다.

- MatchReason 생성
- MatchTag 생성
- 설명 신뢰도 보강

Reliability 데이터는 다음 용도로 사용하지 않는다.

- baseScore 계산 ❌
- compatibility factor ❌
- 매칭 제외 조건 ❌

---

### 5.3 Reliability 해석 원칙

- 높은 Reliability → “안정적인 플레이 파트너”
- 낮은 Reliability → **감점 없음**
- Reliability 없음 → 중립 처리

> Reliability는 “보너스 점수”가 아니라 “설명 신뢰도”다

---

## 6. Cold Start 통합 정책

다음 상황은 모두 Cold Start로 간주될 수 있다.

- Steam 미연동
- Traits 없음
- Schedule 없음
- Online 상태 미확인
- Reliability 없음

Cold Start 정책:

- baseScore = 50
- 모든 compatibility factor = 1.0
- MatchReason / Tag는 **대체 Reason**으로 생성
- “정보 부족” 표현 ❌

> Cold Start는 실패 상태가 아니라 **정상 초기 상태**다

---

## 7. Priority Order (개념적)

Match 계산에서 각 데이터의 중요도는 다음 순서를 따른다.

1. Traits (성향)
2. Animal Compatibility
3. Schedule Compatibility
4. Steam Compatibility
5. Online Availability
6. Reliability (설명 전용)

> 위 순서는 **정책적 우선순위**이며  
> 수식이나 가중치를 의미하지 않는다

---

## 8. Stability Rule

- 이 문서는 **Match 정책의 기준 문서**다
- 구현이 바뀌어도 정책은 쉽게 바뀌지 않는다
- 정책 변경 시:
  1. 이 문서를 먼저 수정
  2. 변경 이유를 명시
  3. Domain 로직은 정책을 따르도록 수정

> “코드가 정책을 증명하는 구조”를 유지한다
