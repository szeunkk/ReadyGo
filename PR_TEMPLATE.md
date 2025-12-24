# refactor: 컴포넌트를 barrel 구조로 리팩토링

## 📋 변경 사항

컴포넌트 구조를 barrel 패턴으로 변경하여 import 경로를 간소화하고 모듈 구조를 개선했습니다.

### 주요 변경사항

- **party 컴포넌트**
  - `index.tsx` → `party.tsx`로 파일명 변경
  - `index.ts` barrel 파일 추가 (default export 및 named exports 제공)
  - `ui/card/index.ts`, `ui/index.ts` barrel 파일 추가

- **party-submit 컴포넌트**
  - `index.tsx` → `PartySubmit.tsx`로 파일명 변경
  - `index.ts` barrel 파일 추가
  - `hooks/index.ts` 추가

- **기타**
  - `matchPage.tsx` 컴포넌트 제거
  - `review-submit` 컴포넌트 초기 파일 추가
  - 관련 import 경로 업데이트

## 🎯 목적

- 컴포넌트 import 경로 일관성 유지
- 모듈 구조 명확화
- 향후 확장성 개선

## 📝 변경된 파일

- `src/components/party/index.ts` (신규)
- `src/components/party/party.tsx` (기존 index.tsx에서 변경)
- `src/components/party/ui/index.ts` (신규)
- `src/components/party/ui/card/index.ts` (신규)
- `src/components/party-submit/index.ts` (신규)
- `src/components/party-submit/PartySubmit.tsx` (기존 index.tsx에서 변경)
- `src/components/party-submit/hooks/index.ts` (신규)
- `src/components/match/matchPage.tsx` (삭제)
- `src/components/review-submit/` (신규)

## ✅ 체크리스트

- [x] barrel 구조로 변경 완료
- [x] import 경로 업데이트 완료
- [x] 기존 기능 동작 확인 필요


