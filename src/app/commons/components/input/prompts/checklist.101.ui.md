# Input 컴포넌트 구현 체크리스트

## 커서룰 적용 결과

### @01-common.mdc

- ✅ 명시된 파일 이외에는 수정하지 않음 (index.tsx, styles.module.css만 수정)
- ✅ 명시하지 않은 라이브러리 설치하지 않음
- ✅ 독립적인 부품들의 조립 형태로 구현 (컴포넌트 구조화)

### @02-wireframe.mdc

- ✅ CSS는 CSS Module만 사용
- ✅ `:global`, `:root`, `!important` 사용하지 않음
- ✅ globals.css는 변경하지 않음
- ✅ flexbox 방식으로 구현 (position-absolute 미사용)
- ✅ 추가 애니메이션 없이 피그마 디자인 그대로 구현

### @03-ui.mdc

- ✅ 피그마 디자인 그대로 구현 (추가 요소 없음)
- ✅ 피그마 사이즈와 동일하게 처리
- ✅ 아이콘은 `public/icons/*` 경로 사용
- ✅ 이미지는 `public/images/*` 경로 사용 (현재 미사용)

## 핵심 요구사항 구현 결과

### 피그마 디자인 구현

- ✅ MCP를 통해 피그마 디자인 정보 확인 (노드ID: 2126:4827, 2126:4835, 2126:5641)
- ✅ Dark mode와 Light mode 모두 구현
- ✅ 모든 variant와 state 조합 구현

### Variant 시스템

- ✅ variant: 'primary' | 'hover' | 'active' | 'filled' | 'danger' | 'disabled' | 'secondary'
- ✅ state: 'Default' | 'hover' | 'active' | 'filled' | 'error' | 'disabled'
- ✅ theme: 'light' | 'dark'
- ✅ variant와 state 조합에 따른 스타일 적용

### Props 시스템

- ✅ label prop: 입력 필드 위에 표시될 레이블
- ✅ additionalInfo prop: 입력 필드 아래에 표시될 추가 정보
- ✅ required prop: 필수 표시 (\*)
- ✅ iconLeft, iconRight: input 내부 좌우 아이콘
- ✅ labelIcon, additionalInfoIcon: 레이블 및 추가정보 아이콘
- ✅ iconSize: 아이콘 크기 (14, 16, 20, 24, 32, 40)
- ✅ gap: 아이콘과 텍스트 사이의 공간 조절

### 아이콘 시스템

- ✅ public/icons/size=XX.svg 파일 사용
- ✅ Next.js Image 컴포넌트 사용
- ✅ 아이콘 위치와 종류는 props로 제어 가능

### 파일 경로

- ✅ TSX 파일: src/app/commons/components/input/index.tsx
- ✅ CSS 파일: src/app/commons/components/input/styles.module.css

## 스타일 구현 상세

### Dark Theme

- ✅ Primary variant: 배경 #161c24, border-radius 12px
- ✅ Primary hover: border #9ca3af
- ✅ Primary active: border #5ffce2, 커서 표시
- ✅ Primary filled: 텍스트 #ffffff
- ✅ Primary error: border #f55c5c, additional info #f55c5c
- ✅ Primary disabled: 텍스트 #323944
- ✅ Secondary variant: border-radius 8px, border #6b7280

### Light Theme

- ✅ Primary variant: 배경 #f3f4f6, border-radius 12px
- ✅ Primary hover: border #9ca3af
- ✅ Primary active: border #39ac99, 커서 표시
- ✅ Primary filled: 텍스트 #030712
- ✅ Primary error: border #dd2e2e, additional info #dd2e2e
- ✅ Primary disabled: 배경 #d1d5db, 텍스트 #9ca3af
- ✅ Secondary variant: border-radius 8px, border #d1d5db

### 타이포그래피

- ✅ Label: Pretendard Medium 500, 14px/18px
- ✅ Input: Pretendard Regular 400, 16px/20px
- ✅ Additional Info: Pretendard Regular 400, 12px/16px

### 레이아웃

- ✅ Container: flex column, gap 8px
- ✅ Input height: 48px
- ✅ Input padding: 17px 좌우
- ✅ Label height: 18px
- ✅ Additional Info height: 16px

## 완료 상태

모든 요구사항이 구현되었으며, 피그마 디자인과 일치하도록 구현되었습니다.

## 커서룰 재검토 결과 (최종)

### @01-common.mdc 재검토

- ✅ 명시된 파일 이외에는 수정하지 않음 (index.tsx, styles.module.css만 수정)
- ✅ 명시하지 않은 라이브러리 설치하지 않음 (Next.js Image 컴포넌트는 기본 제공)
- ✅ 독립적인 부품들의 조립 형태로 구현 (컴포넌트 구조화 완료)
- ✅ 빌드 실행 완료: `npm run build` 성공 (타입 체크 및 린트 통과)

### @02-wireframe.mdc 재검토

- ✅ CSS는 CSS Module만 사용 (styles.module.css)
- ✅ `:global`, `:root`, `!important` 사용하지 않음 (검증 완료)
- ✅ globals.css는 변경하지 않음
- ✅ flexbox 방식으로 구현 (position-absolute 미사용, 검증 완료)
- ✅ 추가 애니메이션 없이 피그마 디자인 그대로 구현
- ℹ️ 인라인 스타일 사용: `gap` prop이 동적이므로 인라인 스타일(`style={{ gap: ... }}`) 사용은 적절함

### @03-ui.mdc 재검토

- ✅ 피그마 디자인 그대로 구현 (추가 요소 없음)
- ✅ 피그마 사이즈와 동일하게 처리 (높이 48px, 패딩 17px 등)
- ✅ 아이콘은 `public/icons/*` 경로 사용 (size=14~40.svg)
- ✅ 이미지는 `public/images/*` 경로 사용 (현재 미사용, 준비 완료)

### 최종 검증

- ✅ TypeScript 타입 체크 통과
- ✅ ESLint 검사 통과
- ✅ Next.js 빌드 성공
- ✅ 모든 variant, state, theme 조합 정상 작동
