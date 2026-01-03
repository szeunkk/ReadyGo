# 🎨 UI 퍼블리싱 PR 템플릿

## 📌 PR 제목

```
style(ui): 파티 페이지 로딩 스켈레톤 UI 구현
```

---

## 📌 작업 개요

파티 리스트 로딩 중 사용자 경험 개선을 위한 스켈레톤 UI 컴포넌트를 추가했습니다. 초기 로딩 시 실제 카드 레이아웃과 유사한 스켈레톤을 표시하여 로딩 상태를 더 명확하게 보여줍니다.

---

## 🎨 퍼블리싱 범위

- [x] 페이지 레이아웃 (로딩 상태 UI)
- [x] 공통 컴포넌트 (Skeleton, SkeletonCard)
- [ ] 반응형 (모바일 / 태블릿)
- [ ] 다크모드 고려 여부

---

## 🧱 사용 컴포넌트 / 구조

- 페이지: `src/components/party/party.tsx`
- 컴포넌트:
  - `Skeleton` (`src/components/ui/skeleton.tsx`) - 기본 스켈레톤 UI 컴포넌트
  - `SkeletonCard` (`src/components/party/ui/skeleton-card/skeleton-card.tsx`) - 파티 카드 스켈레톤 컴포넌트

---

## 🚫 포함하지 않은 것 (중요)

- API 연동 ❌ (기존 API 연동 로직 유지)
- 상태 관리 / 비즈니스 로직 ❌ (로딩 상태 표시만 추가)
- Supabase / Realtime 연동 ❌

> 이 PR은 **UI 퍼블리싱만을 목적**으로 합니다.

---

## 🧪 확인 사항

- [x] 하드코딩 데이터로 정상 렌더링 (로딩 중 6개의 SkeletonCard 표시)
- [x] 레이아웃 깨짐 없음 (실제 파티 카드와 동일한 크기 및 구조)
- [x] 콘솔 에러 없음

---

## 📸 스크린샷

<!-- 로딩 중 스켈레톤 UI 캡처 필요 -->

---

## ⚠️ 리뷰 포인트

- SkeletonCard 컴포넌트가 실제 Card 컴포넌트와 레이아웃 일치 여부
- 스켈레톤 애니메이션 적용 여부 (기본 Skeleton 컴포넌트에 animate-pulse 적용)
- CSS 모듈 구조 및 스타일링 방식
