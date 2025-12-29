# Database Migration Notes

본 문서는 ReadyGo 서비스의 데이터베이스 스키마 변경 이력을 기록한다.

📌 이 문서는 “무엇을 바꿨는지”가 아니라  
“왜 바꿨는지”와 “어디에 영향이 있는지”를 기록한다.

---

## v1.0.0 – Initial Schema

**Date**: 2025-12-24  
**Author**: ReadyGo / Eunkyoung Kim(김은경)

### Summary

- public schema 33개 테이블 초기 구조 확정
- database.types.ts 기반 문서화 완료

### Changes

- Initial production schema applied
- ERD / Table Details 문서 생성

### Impact

- Affected Domains: All
- Backward Compatibility: N/A

### Related Docs

- 01-schema-analysis.md
- 02-domain-erd.md
- 03-full-erd.md
- 04-table-details.md

---

## v1.0.1

**Date**: 2025-12-26  
**Author**: ReadyGo / Eunkyoung Kim(김은경)

### steam_game_info

- ADD COLUMN categories (jsonb[]), EDIT COLUMN genres (text[])
- 이유: 게임 카테고리 컬럼 추가 및 수정

---

## v1.0.2

**Date**: 2025-12-26  
**Author**: ReadyGo / Eunkyoung Kim(김은경)

### steam_game_sync_logs

- ADD TABLE
- 이유: 게임 단위 steam 메타 동기화 상세 로그 기록을 위한 테이블 추가

---

## v1.0.3

**Date**: 2025-12-29  
**Author**: ReadyGo / Jiyoun Han(한지연)

### user_status

- ADD TABLE
- 이유: 유저의 온라인 상태(online, away, dnd, offline)를 관리하기 위한 테이블 추가
- 영향: User / Profile Domain 확장, 실시간 상태 표시 기능 지원
- 관련 기능: 채팅, 파티 참여 등에서 유저의 현재 상태를 확인하는데 활용
