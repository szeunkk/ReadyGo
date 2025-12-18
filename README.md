# 🎮 ReadyGo

**ReadyGo**는 Steam 플레이 데이터를 기반으로  
게이머의 성향을 분석하고, 잘 맞는 친구·파티를 추천해주는  
**게이머 매칭 · 파티 · 채팅 플랫폼**입니다.

단순히 실력이나 티어만을 기준으로 매칭하는 것이 아니라,
플레이 데이터에서 도출한 **성향(Trait)**을 기반으로 유저 간의 궁합을 수치화하고,
플레이 전에 서로를 이해할 수 있도록 돕습니다.

이를 통해:

- 파티 스트레스를 줄이고
- 의미 없는 친구 추가를 줄이며
- 실제로 함께 플레이하는 관계를 늘리는 것

을 목표로 합니다.

---

## 🧩 핵심 기능

- 🔗 Steam 계정 연동 (OpenID)
- 📊 플레이 성향 분석 (Trait Vector / Animal Type)
- 🤝 유저 매칭 추천 (점수 기반)
- 🧑‍🤝‍🧑 파티 모집 / 참여 / 채팅
- 💬 1:1 실시간 채팅 (Supabase Realtime)
- ⭐ 후기 · 온도 · 티어 시스템
- 🔔 알림 / 친구 / 프로필 사이드바 UI

---

## 🛠 Tech Stack

### Frontend

- **Next.js 14 (App Router)**
- TypeScript
- React Server / Client Component 분리
- Zustand (UI / Auth 상태 관리)

### Backend / Infra

- **Supabase**
  - Auth (Google / Kakao OAuth)
  - PostgreSQL
  - Realtime (Chat)
  - Edge Functions / Cron
- Steam Web API / OpenID

---

## 🧠 서비스 동작 개요

ReadyGo의 서비스 흐름은 다음과 같습니다.

1. **Steam 계정 연동**
   - Steam OpenID를 통해 계정을 연결
   - Steam Web API로 플레이 데이터 수집

2. **플레이 성향 분석**
   - 게임 장르, 플레이 시간 기반 점수 계산
   - 5가지 Trait 점수 생성
   - 성향 벡터 및 Animal Type 산출

3. **매칭 점수 계산**
   - 유저 간 성향 벡터 비교
   - 코사인 유사도 기반 매칭 점수 산출
   - 조건(티어, 선호도) 필터 적용

4. **매칭 → 파티 → 채팅**
   - 매칭 결과를 프로필 사이드바로 제공
   - 필요 시 1:1 채팅 또는 파티 참여
   - 플레이 종료 후 후기 작성

---

## 📁 Project Structure

```txt
src
├── app
│   ├── (auth)                # 인증 관련 페이지
│   │   ├── login
│   │   ├── signup
│   │   └── signup-success
│   │
│   ├── (main)                # 로그인 이후 메인 영역
│   │   ├── home              # 홈 대시보드
│   │   ├── match             # 매칭 리스트
│   │   ├── party             # 파티 모집 / 상세
│   │   ├── chat              # 채팅 리스트 / 채팅방
│   │   ├── traits            # 성향 분석 테스트
│   │   └── (overlay)         # 오버레이 UI (friends, notifications)
│   │
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # / → /home redirect
│
├── components                # 전역 UI 컴포넌트
│   ├── profile               # 프로필 사이드바
│   ├── overlay               # Overlay 컨테이너
│   └── common                # 공통 UI
│
├── stores                    # Zustand stores
├── services                  # API / Supabase 연동
├── types                     # TypeScript 타입
├── constants                 # 상수 정의
└── utils                     # 계산 / 헬퍼 로직
```

---

## 🧩 UX 설계 포인트

ReadyGo는 **페이지 이동을 최소화하는 UX**를 중심으로 설계되었습니다.

- 매칭 상세는 별도 페이지가 아닌 **프로필 사이드바**
- 친구 목록 / 알림은 **오버레이 UI**
- 홈 / 매칭 / 파티 어디서든 동일한 인터랙션 제공

이를 통해:

- 매칭 → 비교 → 채팅 흐름을 끊지 않고
- 사용자가 맥락을 잃지 않도록 설계했습니다.

---

## 🚀 방향성

ReadyGo는 MVP 단계에서는:

- 규칙 기반 성향 분석
- 설명 가능한 매칭 점수
- 안정적인 실시간 채팅

에 집중합니다.

이후 Scale-up 단계에서는:

- 매칭 로그 기반 추천 고도화
- AI 기반 성향 보정
- 자동 파티 추천
- 벡터 검색(pgvector) 도입

을 통해 더 정교한 추천 경험을 제공할 예정입니다.

## 라이센스

Private

## 버전

1.0.0

## 작성자

김은경 (2025.12.18) (szeunkk@gmail.com)

## 팀원

김은경 (szeunkk@gmail.com)
양지윤 (jiyoon3522@naver.com)
한지연 (qa7300@gmail.com)
