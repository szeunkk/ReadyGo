# Cold Start Interpretation Policy

## 1. Purpose

이 문서는 Match Domain에서 말하는 **Cold Start 상태의 정의와 해석 규칙**을 명확히 한다.

Cold Start는 오류 상태가 아니며, **데이터가 부족한 정상적인 초기 상태**로 취급한다.

이 문서의 목적은 다음과 같다.

- Steam 미연동 / 신규 사용자 상황을 일관되게 처리한다
- Context 부족으로 인한 계산 불가 상태를 제거한다
- Domain 로직의 분기 폭발을 방지한다
- UI에 “정보 부족” 같은 부정적 메시지가 노출되지 않도록 한다

---

## 2. Cold Start의 정의

### 2-1 Cold Start란 무엇인가

Cold Start란 다음 조건 중 하나 이상을 만족하는 상태를 의미한다.

- traits 데이터가 존재하지 않는다
- activity.schedule 데이터가 존재하지 않는다
- steam 데이터가 존재하지 않는다

즉, **비교 가능한 입력 데이터가 제한적인 상태**를 의미한다.

> Cold Start는 “데이터 없음”이지  
> “매칭 불가”를 의미하지 않는다

---

## 3. Cold Start 판정 기준

Cold Start 여부는 **MatchContext 내부 데이터 존재 여부로만 판단**한다.

### 3.1 Cold Start 판정 기준

| 조건                        | Cold Start 여부 |
| --------------------------- | --------------- |
| traits 없음                 | YES             |
| traits 있음                 | NO              |
| traits 있음 + schedule 없음 | NO              |
| traits 없음 + schedule 있음 | YES             |
| 모든 optional 필드 없음     | YES             |

> **traits 존재 여부가 Cold Start의 핵심 기준**이다

---

## 4. Cold Start 시 점수 정책

### 4.1 Base Similarity 정책

- traits가 없는 경우:
  - baseScore = 50
- traits가 있는 경우:
  - traits 기반 유사도 계산 결과 사용

> baseScore는 Cold Start 여부와 무관하게  
> 항상 0~100 범위를 유지한다

---

### 4.2 Factor 정책

Cold Start 상태에서는 모든 factor가 다음과 같이 처리된다.

| Factor                      | Cold Start 처리         |
| --------------------------- | ----------------------- |
| animalCompatibilityFactor   | 1.0                     |
| scheduleCompatibilityFactor | 1.0                     |
| onlineFactor                | online 상태에 따라 적용 |
| steamFactor                 | 1.0                     |

- Cold Start는 **벌점이 아니다**
- “보정 없음” 상태로만 처리한다

---

## 5. Cold Start 시 Reason / Tag 정책

### 5.1 Reason 생성 정책

Cold Start 상태에서도 **최소 3개의 MatchReason은 항상 생성**되어야 한다.

우선 순위는 다음과 같다.

1. STYLE_SIMILARITY (fallback 값 허용)
2. ACTIVITY_PATTERN 또는 ONLINE_NOW
3. RELIABILITY (존재 시)

> Reason은 “데이터 존재”가 아니라  
> “비교 가능성” 기준으로 생성한다

---

### 5.2 Tag 생성 정책

Cold Start 상태에서도 **최소 3개의 MatchTag는 항상 생성**한다.

사용 가능한 기본 Tag 예시는 다음과 같다.

- 스타일유사
- 활동패턴
- 지금온라인
- 신뢰높음

> “정보 부족”, “데이터 없음” 같은 Tag는 금지된다

---

## 6. Domain 책임 범위

Domain Layer는 Cold Start에 대해 다음만 수행한다.

- Context 내부 데이터 존재 여부 확인
- 정책에 따른 기본값 / factor 적용
- 결과 점수, reason, tag 생성

Domain은 다음을 수행하지 않는다.

- Cold Start 여부를 외부에 노출
- UI 메시지 결정
- 데이터 보완 시도

> Cold Start는 Domain 내부 상태이며  
> UI에 직접 노출되지 않는다

---

## 7. Service Layer 책임 범위

Service Layer는 Cold Start와 관련해 다음을 보장해야 한다.

- MatchContext는 항상 생성된다
- Optional 필드 부재를 그대로 전달한다
- Cold Start 여부를 flag로 강제 주입하지 않는다

> Cold Start 판단은 **정책과 데이터로 충분**하다

---

## 8. Anti-Patterns (금지 사례)

다음은 Cold Start 처리에서 금지된다.

- traits가 없다고 임의의 TraitVector 생성
- schedule이 없다고 빈 배열 삽입
- “Cold Start”라는 상태 값을 API 응답에 포함
- UI에서 “정보 부족” 문구 노출

---

## 9. Rationale (왜 이 정책인가)

- 신규 사용자 경험을 해치지 않기 위해
- Steam 미연동 사용자를 2등 시민으로 만들지 않기 위해
- Supabase 기반 Frontend-only 구조에서도
  서버 수준의 정책 일관성을 유지하기 위해

---

## 10. Contract Stability Rule

- Cold Start 정책 변경 시:
  1. 이 문서를 먼저 수정한다
  2. 변경 사유를 명시한다
  3. Base Similarity / Factor 정책과 충돌 여부를 검토한다

> Cold Start 정책은  
> Match Domain 전체에 영향을 미치는 핵심 정책이다
