# Admin API 문서

## 개요

관리자용 API 엔드포인트 모음입니다. 주로 개발/테스트 환경에서 목업 데이터 생성 및 관리 작업에 사용됩니다.

⚠️ **보안 주의**: 
- 모든 Admin API는 프로덕션 환경에서 자동으로 비활성화됩니다 (`NODE_ENV === 'production'`)
- API Key 인증이 필수입니다 (`x-admin-api-key` 헤더)
- 환경변수 `ADMIN_API_KEY` 설정이 필요합니다

---

## 인증

### API Key 설정

1. `.env.local` 파일에 `ADMIN_API_KEY` 추가:
```bash
ADMIN_API_KEY=your-secret-admin-key
```

2. 요청 시 헤더에 포함:
```bash
curl -H "x-admin-api-key: your-secret-admin-key" ...
```

### 환경 제한

- **개발 환경**: ✅ 사용 가능
- **테스트 환경**: ✅ 사용 가능
- **프로덕션 환경**: ❌ 자동 비활성화 (403 Forbidden)

---

## Steam 관련 API

### 1. Steam ID 단일 연동
**[POST /api/admin/steam/link](./steam-link.md)**

한 명의 유저에게 Steam ID를 연동합니다.

```bash
curl -X POST http://localhost:3000/api/admin/steam/link \
  -H "Content-Type: application/json" \
  -H "x-admin-api-key: your-secret-key" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "steamId": "76561198000000000"
  }'
```

### 2. Steam ID 벌크 연동
**[POST /api/admin/steam/bulk-link](./steam-bulk-link.md)**

여러 유저에게 Steam ID를 한 번에 연동합니다 (최대 100개).

```bash
curl -X POST http://localhost:3000/api/admin/steam/bulk-link \
  -H "Content-Type: application/json" \
  -H "x-admin-api-key: your-secret-key" \
  -d '{
    "users": [
      { "userId": "uuid-1", "steamId": "76561198000000001" },
      { "userId": "uuid-2", "steamId": "76561198000000002" }
    ]
  }'
```

### 3. Steam ID 연결 해제
**[DELETE /api/admin/steam/unlink](./steam-unlink.md)**

유저의 Steam ID 연결을 해제합니다.

```bash
curl -X DELETE http://localhost:3000/api/admin/steam/unlink \
  -H "Content-Type: application/json" \
  -H "x-admin-api-key: your-secret-key" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

---

## 사용 시나리오

### 시나리오 1: 목업 데이터 생성

```javascript
// 1. 여러 유저에게 Steam ID 연동
const mockUsers = [
  { userId: 'user-1-uuid', steamId: '76561198000000001' },
  { userId: 'user-2-uuid', steamId: '76561198000000002' },
  { userId: 'user-3-uuid', steamId: '76561198000000003' },
];

const response = await fetch('/api/admin/steam/bulk-link', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-api-key': process.env.ADMIN_API_KEY,
  },
  body: JSON.stringify({ users: mockUsers }),
});

const result = await response.json();
console.log(`성공: ${result.summary.success}개, 실패: ${result.summary.failure}개`);
```

### 시나리오 2: 잘못된 연동 수정

```javascript
// 1. 잘못 연결된 Steam ID 해제
await fetch('/api/admin/steam/unlink', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-api-key': process.env.ADMIN_API_KEY,
  },
  body: JSON.stringify({ userId: 'user-uuid' }),
});

// 2. 올바른 Steam ID로 재연동
await fetch('/api/admin/steam/link', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-api-key': process.env.ADMIN_API_KEY,
  },
  body: JSON.stringify({
    userId: 'user-uuid',
    steamId: '76561198000000999',
  }),
});
```

### 시나리오 3: 강제 덮어쓰기

```javascript
// 이미 다른 유저에게 연결된 Steam ID를 강제로 재할당
await fetch('/api/admin/steam/link', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-api-key': process.env.ADMIN_API_KEY,
  },
  body: JSON.stringify({
    userId: 'new-user-uuid',
    steamId: '76561198000000001',
    force: true, // 중복 무시하고 강제 연동
  }),
});
```

---

## 데이터베이스 영향

### 업데이트되는 테이블

#### 1. `user_profiles`
```sql
UPDATE user_profiles 
SET steam_id = '76561198000000000' 
WHERE id = 'user-uuid';
```

#### 2. `steam_sync_logs`
```sql
INSERT INTO steam_sync_logs (user_id, status, synced_games_count, synced_at)
VALUES ('user-uuid', 'admin_linked', 0, NOW());
```

### 로그 상태 값

| Status | 의미 | 생성 시점 |
|--------|------|-----------|
| `linked` | 실제 OAuth로 연동 | Steam OAuth 콜백 |
| `admin_linked` | 관리자가 수동 연동 | Admin API 사용 |
| `admin_unlinked` | 관리자가 연결 해제 | Admin API 사용 |

---

## 보안 체크리스트

- [ ] `.env.local`에 `ADMIN_API_KEY` 설정
- [ ] `.env.example`에 `ADMIN_API_KEY` 항목 추가 (값은 제외)
- [ ] `.gitignore`에 `.env.local` 포함 확인
- [ ] 프로덕션 배포 시 `ADMIN_API_KEY` 환경변수 미설정 확인
- [ ] API Key를 코드에 하드코딩하지 않기
- [ ] 로그에 API Key 출력하지 않기

---

## 에러 처리

### 공통 에러 응답 형식

```json
{
  "success": false,
  "error": "에러 메시지",
  "errorCode": "error_code",
  "details": "상세 정보 (선택적)"
}
```

### 주요 에러 코드

| Code | HTTP Status | 설명 |
|------|-------------|------|
| `production_disabled` | 403 | 프로덕션 환경에서 사용 불가 |
| `invalid_api_key` | 401 | API Key 불일치 |
| `missing_parameters` | 400 | 필수 파라미터 누락 |
| `invalid_user_id` | 400 | 잘못된 UUID 형식 |
| `invalid_steam_id` | 400 | 잘못된 Steam ID 형식 |
| `user_not_found` | 404 | 유저 없음 |
| `duplicate_steam_id` | 409 | Steam ID 중복 |

---

## 테스트

### Postman Collection

Postman을 사용하는 경우:

1. 환경 변수 설정:
   - `BASE_URL`: `http://localhost:3000`
   - `ADMIN_API_KEY`: 실제 API Key

2. Pre-request Script에 헤더 자동 추가:
```javascript
pm.request.headers.add({
  key: 'x-admin-api-key',
  value: pm.environment.get('ADMIN_API_KEY')
});
```

### cURL 스크립트 예시

```bash
#!/bin/bash

API_KEY="your-secret-key"
BASE_URL="http://localhost:3000"

# Steam ID 연동
curl -X POST "$BASE_URL/api/admin/steam/link" \
  -H "Content-Type: application/json" \
  -H "x-admin-api-key: $API_KEY" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "steamId": "76561198000000000"
  }'
```

---

## 문의 및 지원

- **작성자**: ReadyGo / Eunkyoung Kim(김은경)
- **생성일**: 2025-01-07
- **상태**: Active

---

## 변경 이력

| Version | Date | Description |
|---------|------|-------------|
| v1.0.0 | 2025-01-07 | 초기 문서 작성 |

