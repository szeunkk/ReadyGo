# Table Details(ReadyGo)

본 문서는 ReadyGo 서비스의 public schema 전체 테이블(33개)에 대한 상세 정의 문서이다.

### Source of Truth (SSOT)

1. Supabase 실제 DB
2. database.types.ts
3. 01-schema-analysis.md

📌 본 문서는 컬럼 단위 사실 문서이며,
ERD 구조는 02-domain-erd.md, 03-full-erd.md를 참고한다.

---

### 공통 규칙

- 타입 기준: `database.types.ts`의 Row타입
- Nullable: `| null` 존재 여부 기준
- 기본값(default): 타입 파일에 명시된 경우만 기록
- `auth.users`는 논리적 연결이며 FK로 표기하지 않음

---

### 1️⃣ User / Profile Domain

#### 1. user_profiles

- 유저의 핵심 프로필 정보

| Column            | Type        | Nullable | Description                      |
| ----------------- | ----------- | -------- | -------------------------------- |
| id                | uuid        | ❌       | 유저 ID (auth.users와 논리 연결) |
| nickname          | text        | ⭕       | 닉네임                           |
| bio               | text        | ⭕       | 자기소개                         |
| avatar_url        | text        | ⭕       | 프로필 이미지                    |
| animal_type       | text        | ❌       | 성향 동물 타입                   |
| steam_id          | text        | ⭕       | Steam 계정 ID                    |
| tier              | text        | ❌       | 현재 티어                        |
| temperature_score | int         | ❌       | 온도 점수                        |
| status_message    | text        | ⭕       | 상태 메시지                      |
| created_at        | timestamptz | ⭕       | 생성 시각                        |
| updated_at        | timestamptz | ⭕       | 수정 시각                        |

#### 2. user_settings

- 유저 환경 설정

| Column             | Type        | Nullable | Description    |
| ------------------ | ----------- | -------- | -------------- |
| id                 | uuid        | ❌       | 유저 ID        |
| theme_mode         | text        | ⭕       | 테마 설정      |
| notification_push  | boolean     | ⭕       | 푸시 알림 여부 |
| notification_chat  | boolean     | ⭕       | 채팅 알림 여부 |
| notification_party | boolean     | ⭕       | 파티 알림 여부 |
| language           | text        | ⭕       | 언어 설정      |
| created_at         | timestamptz | ⭕       | 생성 시각      |
| updated_at         | timestamptz | ⭕       | 수정 시각      |

#### 3. user_traits

- 유저 성향 점수 벡터

| Column      | Type        | Nullable | Description    |
| ----------- | ----------- | -------- | -------------- |
| id          | bigint      | ❌       | PK             |
| user_id     | uuid        | ⭕       | 유저           |
| cooperation | int         | ❌       | 협동 성향 점수 |
| exploration | int         | ❌       | 탐험 성향 점수 |
| strategy    | int         | ❌       | 전략 성향 점수 |
| leadership  | int         | ❌       | 리더십 점수    |
| social      | int         | ❌       | 교류 성향 점수 |
| updated_at  | timestamptz | ⭕       | 수정 시각      |

#### 4. user_social_links

- 유저 외부 링크

| Column     | Type        | Nullable | Description |
| ---------- | ----------- | -------- | ----------- |
| id         | bigint      | ❌       | PK          |
| user_id    | uuid        | ⭕       | 유저        |
| platform   | text        | ⭕       | 플랫폼      |
| url        | text        | ⭕       | 링크 URL    |
| created_at | timestamptz | ⭕       | 생성 시각   |

#### 5. user_tags

- 유저-태그 매핑

| Column     | Type        | Nullable | Description |
| ---------- | ----------- | -------- | ----------- |
| id         | bigint      | ❌       | PK          |
| user_id    | uuid        | ⭕       | 유저        |
| tag_id     | bigint      | ⭕       | 태그 ID     |
| created_at | timestamptz | ⭕       | 생성 시각   |

#### 6. tags

- 태그 마스터

| Column     | Type        | Nullable | Description |
| ---------- | ----------- | -------- | ----------- |
| id         | bigint      | ❌       | PK          |
| name       | text        | ⭕       | 태그 이름   |
| created_at | timestamptz | ⭕       | 생성 시각   |

#### 7. user_reports

- 유저 신고

| Column         | Type        | Nullable | Description |
| -------------- | ----------- | -------- | ----------- |
| id             | bigint      | ❌       | PK          |
| reporter_id    | uuid        | ⭕       | 신고자      |
| target_user_id | uuid        | ⭕       | 신고 대상   |
| type           | text        | ⭕       | 신고 유형   |
| comment        | text        | ⭕       | 신고 내용   |
| created_at     | timestamptz | ⭕       | 신고 시각   |

---

### 2️⃣ Chat Domain

#### 8. chat_rooms

- 채팅방

| Column     | Type        | Nullable | Description          |
| ---------- | ----------- | -------- | -------------------- |
| id         | bigint      | ❌       | PK                   |
| type       | text        | ⭕       | 채팅방 타입 (direct) |
| created_at | timestamptz | ⭕       | 생성 시각            |

#### 9. chat_room_members

- 채팅방 참여자

| Column    | Type        | Nullable | Description |
| --------- | ----------- | -------- | ----------- |
| id        | bigint      | ❌       | PK          |
| room_id   | bigint      | ⭕       | 채팅방 ID   |
| user_id   | uuid        | ⭕       | 참여 유저   |
| joined_at | timestamptz | ⭕       | 참여 시각   |

#### 10. chat_messages

- 채팅 메시지

| Column       | Type        | Nullable | Description |
| ------------ | ----------- | -------- | ----------- |
| id           | bigint      | ❌       | PK          |
| room_id      | bigint      | ⭕       | 채팅방 ID   |
| sender_id    | uuid        | ⭕       | 발신자      |
| content      | text        | ⭕       | 메시지 내용 |
| content_type | text        | ⭕       | 메시지 타입 |
| is_read      | boolean     | ⭕       | 읽음 여부   |
| created_at   | timestamptz | ⭕       | 전송 시각   |

#### 11. chat_message_reads

- 메시지 읽음 기록

| Column     | Type        | Nullable | Description |
| ---------- | ----------- | -------- | ----------- |
| id         | bigint      | ❌       | PK          |
| message_id | bigint      | ⭕       | 메시지 ID   |
| user_id    | uuid        | ⭕       | 읽은 유저   |
| read_at    | timestamptz | ⭕       | 읽은 시각   |

#### 12. chat_blocks

- 채팅 차단

| Column          | Type        | Nullable | Description    |
| --------------- | ----------- | -------- | -------------- |
| id              | bigint      | ❌       | PK             |
| user_id         | uuid        | ⭕       | 차단한 유저    |
| blocked_user_id | uuid        | ⭕       | 차단 대상 유저 |
| created_at      | timestamptz | ⭕       | 차단 시각      |

---

### 3️⃣ Party Domain

#### 13. party_posts

- 파티 모집글

| Column        | Type        | Nullable | Description |
| ------------- | ----------- | -------- | ----------- |
| id            | bigint      | ❌       | PK          |
| creator_id    | uuid        | ⭕       | 작성자      |
| title         | text        | ⭕       | 제목        |
| game_title    | text        | ⭕       | 게임명      |
| platform      | text        | ⭕       | 플랫폼      |
| required_tier | text        | ⭕       | 요구 티어   |
| max_members   | int         | ⭕       | 최대 인원   |
| description   | text        | ⭕       | 설명        |
| status        | text        | ⭕       | 모집 상태   |
| created_at    | timestamptz | ⭕       | 생성 시각   |

#### 14. party_members

- 파티 참여자

| Column    | Type        | Nullable | Description |
| --------- | ----------- | -------- | ----------- |
| id        | bigint      | ❌       | PK          |
| post_id   | bigint      | ⭕       | 파티 ID     |
| user_id   | uuid        | ⭕       | 참여 유저   |
| role      | text        | ⭕       | 역할        |
| joined_at | timestamptz | ⭕       | 참여 시각   |

#### 15. party_messages

- 파티 채팅

| Column     | Type        | Nullable | Description |
| ---------- | ----------- | -------- | ----------- |
| id         | bigint      | ❌       | PK          |
| post_id    | bigint      | ⭕       | 파티 ID     |
| sender_id  | uuid        | ⭕       | 발신자      |
| content    | text        | ⭕       | 메시지      |
| created_at | timestamptz | ⭕       | 전송 시각   |

#### 16. party_activity_logs

- 파티 활동 로그

| Column     | Type        | Nullable | Description |
| ---------- | ----------- | -------- | ----------- |
| id         | bigint      | ❌       | PK          |
| post_id    | bigint      | ⭕       | 파티 ID     |
| user_id    | uuid        | ⭕       | 유저        |
| action     | text        | ⭕       | 활동 타입   |
| created_at | timestamptz | ⭕       | 발생 시각   |

---

### 4️⃣ Match Domain

#### 17. match_scores

- 매칭 점수

| Column           | Type        | Nullable | Description |
| ---------------- | ----------- | -------- | ----------- |
| id               | bigint      | ❌       | PK          |
| user_id          | uuid        | ⭕       | 기준 유저   |
| target_user_id   | uuid        | ⭕       | 매칭 대상   |
| similarity_score | int         | ⭕       | 매칭 점수   |
| calculated_at    | timestamptz | ⭕       | 계산 시각   |

#### 18. match_filters

- 매칭 필터

| Column          | Type        | Nullable | Description |
| --------------- | ----------- | -------- | ----------- |
| id              | bigint      | ❌       | PK          |
| user_id         | uuid        | ⭕       | 유저        |
| age_range       | text        | ⭕       | 연령대 필터 |
| preferred_genre | text        | ⭕       | 선호 장르   |
| mode            | text        | ⭕       | 플레이 모드 |
| updated_at      | timestamptz | ⭕       | 수정 시각   |

#### 19. match_recent_views

- 최근 조회

| Column         | Type        | Nullable | Description |
| -------------- | ----------- | -------- | ----------- |
| id             | bigint      | ❌       | PK          |
| user_id        | uuid        | ⭕       | 기준 유저   |
| target_user_id | uuid        | ⭕       | 조회 대상   |
| viewed_at      | timestamptz | ⭕       | 조회 시각   |

---

### 5️⃣ Steam Domain

#### 20. steam_user_games

- 유저 게임 기록

| Column           | Type        | Nullable | Description      |
| ---------------- | ----------- | -------- | ---------------- |
| id               | bigint      | ❌       | PK               |
| user_id          | uuid        | ⭕       | 유저             |
| app_id           | int         | ❌       | Steam App ID     |
| name             | text        | ⭕       | 게임명           |
| playtime_forever | int         | ⭕       | 총 플레이 시간   |
| playtime_recent  | int         | ⭕       | 최근 플레이 시간 |
| last_played      | timestamptz | ⭕       | 마지막 실행 시각 |
| created_at       | timestamptz | ⭕       | 생성 시각        |

#### 21. steam_game_info

- 게임 메타

| Column            | Type        | Nullable | Description         |
| ----------------- | ----------- | -------- | ------------------- |
| app_id            | int         | ❌       | Steam App ID        |
| name              | text        | ⭕       | 게임명              |
| genres            | text[]      | ⭕       | 장르                |
| categories        | jsonb[]     | ⭕       | Steam 카테고리 목록 |
| short_description | text        | ⭕       | 설명                |
| header_image      | text        | ⭕       | 헤더 이미지         |
| created_at        | timestamptz | ⭕       | 생성 시각           |

#### 22. steam_sync_logs

- 동기화 로그

| Column             | Type        | Nullable | Description    |
| ------------------ | ----------- | -------- | -------------- |
| id                 | bigint      | ❌       | PK             |
| user_id            | uuid        | ⭕       | 유저           |
| status             | text        | ⭕       | 동기화 상태    |
| synced_games_count | int         | ⭕       | 동기화 게임 수 |
| synced_at          | timestamptz | ⭕       | 동기화 시각    |

---

### 6️⃣ Social / Interaction Domain

#### 23. friend_requests

- 유저 간 친구 요청 상태
- 요청 생성, 수락, 거절 등 관계 형성 이전 단계 기록

| Column      | Type        | Nullable | Description    |
| ----------- | ----------- | -------- | -------------- |
| id          | bigint      | ❌       | PK             |
| sender_id   | uuid        | ⭕       | 요청 보낸 유저 |
| receiver_id | uuid        | ⭕       | 요청 받은 유저 |
| status      | text        | ⭕       | 요청 상태      |
| created_at  | timestamptz | ⭕       | 요청 시각      |

#### 24. friendships

- 친구로 연결된 유저 간의 관계 정보
- 쌍방 관계를 하나의 레코드로 관리

| Column     | Type        | Nullable | Description |
| ---------- | ----------- | -------- | ----------- |
| id         | bigint      | ❌       | PK          |
| user_a     | uuid        | ⭕       | 유저 A      |
| user_b     | uuid        | ⭕       | 유저 B      |
| status     | text        | ⭕       | 관계 상태   |
| created_at | timestamptz | ⭕       | 생성 시각   |

#### 25. reviews

- 파티 또는 플레이 이후 유저가 남긴 평가 기록
- 매너, 협업, 소통 등 점수 및 코멘트 포함
- 유저 온도, 티어 계산의 핵심 입력 데이터

| Column              | Type        | Nullable | Description |
| ------------------- | ----------- | -------- | ----------- |
| id                  | bigint      | ❌       | PK          |
| reviewer_id         | uuid        | ⭕       | 작성자      |
| target_user_id      | uuid        | ⭕       | 대상 유저   |
| score_manner        | int         | ⭕       | 매너 점수   |
| score_teamwork      | int         | ⭕       | 팀워크 점수 |
| score_communication | int         | ⭕       | 소통 점수   |
| comment             | text        | ⭕       | 후기 내용   |
| created_at          | timestamptz | ⭕       | 작성 시각   |

---

### 7️⃣ System / Logs Domain

#### 26. analytics_user_actions

- 행동 로그

| Column     | Type        | Nullable | Description        |
| ---------- | ----------- | -------- | ------------------ |
| id         | bigint      | ❌       | PK                 |
| user_id    | uuid        | ⭕       | 행동을 수행한 유저 |
| action     | text        | ⭕       | 행동 타입          |
| target_id  | text        | ⭕       | 행동 대상 식별자   |
| created_at | timestamptz | ⭕       | 행동 발생 시각     |

#### 27. event_logs

- 서비스 이벤트 기록 테이블
- 유저 행동 또는 시스템 이벤트를 구조적으로 기록

| Column     | Type        | Nullable | Description   |
| ---------- | ----------- | -------- | ------------- |
| id         | bigint      | ❌       | PK            |
| user_id    | uuid        | ⭕       | 관련 유저     |
| event_type | text        | ⭕       | 이벤트 타입   |
| metadata   | jsonb       | ⭕       | 이벤트 데이터 |
| created_at | timestamptz | ⭕       | 발생 시각     |

#### 28. error_logs

- 시스템 에러 기록 테이블
- 서버/클라이언트/배치 작업 등에서 발생한 오류를 기록

| Column     | Type        | Nullable | Description    |
| ---------- | ----------- | -------- | -------------- |
| id         | bigint      | ❌       | PK             |
| source     | text        | ⭕       | 에러 발생 위치 |
| message    | text        | ⭕       | 에러 메시지    |
| stacktrace | text        | ⭕       | 스택 트레이스  |
| created_at | timestamptz | ⭕       | 발생 시각      |

#### 29. bans

- 유저 제재 정보 테이블
- 일시적 또는 영구 제재 상태 관리

| Column     | Type        | Nullable | Description    |
| ---------- | ----------- | -------- | -------------- |
| id         | bigint      | ❌       | PK             |
| user_id    | uuid        | ⭕       | 제재 대상 유저 |
| reason     | text        | ⭕       | 제재 사유      |
| expires_at | timestamptz | ⭕       | 제재 만료 시각 |
| created_at | timestamptz | ⭕       | 제재 생성 시각 |

#### 30. temperature_logs

- 유저 온도 점수 변경 로그
- 후기, 신고, 시스템 판단에 따른 점수 변화 기록

| Column     | Type        | Nullable | Description |
| ---------- | ----------- | -------- | ----------- |
| id         | bigint      | ❌       | PK          |
| user_id    | uuid        | ⭕       | 유저        |
| change     | int         | ⭕       | 점수 변화   |
| reason     | text        | ⭕       | 변경 사유   |
| created_at | timestamptz | ⭕       | 발생 시각   |

#### 31. tier_history

- 유저 티어 변경 이력 테이블
- 티어 상승/하락 이력 보존

| Column        | Type        | Nullable | Description  |
| ------------- | ----------- | -------- | ------------ |
| id            | bigint      | ❌       | PK           |
| user_id       | uuid        | ⭕       | 유저         |
| previous_tier | text        | ⭕       | 이전 티어    |
| current_tier  | text        | ⭕       | 변경 후 티어 |
| changed_at    | timestamptz | ⭕       | 변경 시각    |

#### 32. notifications

- 유저에게 전달되는 시스템 알림 테이블

| Column     | Type        | Nullable | Description    |
| ---------- | ----------- | -------- | -------------- |
| id         | bigint      | ❌       | PK             |
| user_id    | uuid        | ⭕       | 알림 수신 유저 |
| type       | text        | ⭕       | 알림 타입      |
| title      | text        | ⭕       | 알림 제목      |
| message    | text        | ⭕       | 알림 본문      |
| is_read    | boolean     | ⭕       | 읽음 여부      |
| created_at | timestamptz | ⭕       | 생성 시각      |

#### 33. push_tokens

- 푸시 알림 전송을 위한 디바이스 토큰 관리 테이블

| Column     | Type        | Nullable | Description |
| ---------- | ----------- | -------- | ----------- |
| id         | bigint      | ❌       | PK          |
| user_id    | uuid        | ⭕       | 유저        |
| token      | text        | ❌       | 푸시 토큰   |
| platform   | text        | ⭕       | 플랫폼      |
| created_at | timestamptz | ⭕       | 생성 시각   |

---

📌 본 문서는 ReadyGo 데이터베이스 구조에 대한 최종 사실 문서이며,
기획·API·타입 정의·ERD의 기준으로 사용된다.

---

## Document Metadata

- **Author**: ReadyGo / Eunkyoung Kim(김은경)
- **Created At**: 2025-12-24
- **Last Updated At**: 2025-12-24
- **Document Version**: v1.0.0
- **Status**: Active
- **Source of Truth**:
  - Supabase Production Database
  - database.types.ts

## Version History

| Version | Date       | Description                                                   |
| ------: | ---------- | ------------------------------------------------------------- |
|  v1.0.0 | 2025-12-24 | Detailed table & column documentation (33 tables)             |
|  v1.0.1 | 2025-12-26 | steam_game_info 테이블 컬럼 추가 및 수정                      |
|  v1.0.2 | 2025-12-26 | steam_game_info categories, genres 컬럼 수정(jsonb[], text[]) |
