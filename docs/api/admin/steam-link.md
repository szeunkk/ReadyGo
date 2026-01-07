# POST /api/admin/steam/link

## 개요

**관리자용** Steam ID 수동 연동 엔드포인트입니다. 목업 데이터 생성 및 개발/테스트 환경에서 빠른 데이터 세팅을 위해 사용됩니다.

⚠️ **보안 주의**: 이 엔드포인트는 프로덕션 환경에서 자동으로 비활성화되며, API Key 인증이 필요합니다.

---

## 요청

### HTTP Method

```
POST /api/admin/steam/link
```

### Headers

| Header            | Type   | Required | Description                            |
| ----------------- | ------ | -------- | -------------------------------------- |
| `Content-Type`    | string | ✅       | `application/json`                     |
| `x-admin-api-key` | string | ✅       | 환경변수 `ADMIN_API_KEY`와 일치해야 함 |

### Request Body

| Field     | Type          | Required | Description                           |
| --------- | ------------- | -------- | ------------------------------------- |
| `userId`  | string (uuid) | ✅       | 연동할 유저의 ID                      |
| `steamId` | string        | ✅       | Steam ID (17자리 숫자)                |
| `force`   | boolean       | ❌       | 중복 시 강제 덮어쓰기 (기본값: false) |

### Request Example

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "steamId": "76561198000000000",
  "force": false
}
```

---

## 응답

### 성공 응답 (200 OK)

```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "steamId": "76561198000000000",
  "message": "Steam ID가 성공적으로 업데이트되었습니다.",
  "forced": false
}
```

### 응답 필드

| Field     | Type    | Description        |
| --------- | ------- | ------------------ |
| `success` | boolean | 성공 여부          |
| `userId`  | string  | 업데이트된 유저 ID |
| `steamId` | string  | 연동된 Steam ID    |
| `message` | string  | 성공 메시지        |
| `forced`  | boolean | 강제 덮어쓰기 여부 |

---

## 에러 응답

### 403 Forbidden - 프로덕션 환경

```json
{
  "success": false,
  "error": "프로덕션 환경에서는 사용할 수 없습니다.",
  "errorCode": "production_disabled"
}
```

### 401 Unauthorized - API Key 불일치

```json
{
  "success": false,
  "error": "유효하지 않은 API Key입니다.",
  "errorCode": "invalid_api_key"
}
```

### 400 Bad Request - 잘못된 파라미터

```json
{
  "success": false,
  "error": "userId는 유효한 UUID 형식이어야 합니다.",
  "errorCode": "invalid_user_id"
}
```

### 404 Not Found - 유저 없음

```json
{
  "success": false,
  "error": "존재하지 않는 유저입니다.",
  "errorCode": "user_not_found"
}
```

### 409 Conflict - Steam ID 중복

```json
{
  "success": false,
  "error": "이 Steam ID는 이미 다른 유저(nickname)에게 연결되어 있습니다.",
  "errorCode": "duplicate_steam_id",
  "existingUserId": "550e8400-e29b-41d4-a716-446655440001"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "프로필 업데이트에 실패했습니다.",
  "errorCode": "update_failed",
  "details": "..."
}
```

---

## 에러 코드

| Code                     | HTTP Status | Description                 |
| ------------------------ | ----------- | --------------------------- |
| `production_disabled`    | 403         | 프로덕션 환경에서 사용 불가 |
| `server_config_error`    | 500         | ADMIN_API_KEY 미설정        |
| `invalid_api_key`        | 401         | API Key 불일치              |
| `invalid_json`           | 400         | 요청 본문 파싱 실패         |
| `missing_parameters`     | 400         | 필수 파라미터 누락          |
| `invalid_user_id`        | 400         | 잘못된 UUID 형식            |
| `invalid_steam_id`       | 400         | 잘못된 Steam ID 형식        |
| `user_check_failed`      | 500         | 유저 조회 실패              |
| `user_not_found`         | 404         | 유저 없음                   |
| `duplicate_check_failed` | 500         | 중복 검사 실패              |
| `duplicate_steam_id`     | 409         | Steam ID 중복               |
| `update_failed`          | 500         | 프로필 업데이트 실패        |
| `server_error`           | 500         | 서버 오류                   |

---

## 비즈니스 로직

### 1. 인증 및 권한 검증

- 프로덕션 환경 체크 (`NODE_ENV`)
- API Key 검증 (`x-admin-api-key` 헤더)

### 2. 파라미터 검증

- `userId`: UUID v4 형식 검증
- `steamId`: 17자리 숫자 형식 검증

### 3. 유저 존재 확인

- `user_profiles` 테이블에서 userId 조회
- 존재하지 않으면 404 반환

### 4. 중복 검증

- 다른 유저에게 이미 연결된 Steam ID인지 확인
- `force=false`: 중복 시 409 Conflict 반환
- `force=true`: 경고 로그 후 진행

### 5. 데이터 업데이트

- `user_profiles.steam_id` 업데이트
- `steam_sync_logs` 테이블에 로그 기록
  - `status`: `'admin_linked'`
  - `synced_games_count`: 0
  - `synced_at`: 현재 시각

---

## 사용 예시

### cURL

```bash
curl -X POST https://your-domain.com/api/admin/steam/link \
  -H "Content-Type: application/json" \
  -H "x-admin-api-key: your-secret-key" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "steamId": "76561198000000000"
  }'
```

### JavaScript (fetch)

```javascript
const response = await fetch('/api/admin/steam/link', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-api-key': process.env.ADMIN_API_KEY,
  },
  body: JSON.stringify({
    userId: '550e8400-e29b-41d4-a716-446655440000',
    steamId: '76561198000000000',
    force: false,
  }),
});

const data = await response.json();
console.log(data);
```

---

## 보안 고려사항

1. **프로덕션 비활성화**: `NODE_ENV === 'production'`일 때 자동으로 403 반환
2. **API Key 인증**: 환경변수 `ADMIN_API_KEY` 필수 설정
3. **감사 로그**: 모든 작업이 `steam_sync_logs`에 기록됨
4. **강제 덮어쓰기**: `force=true` 사용 시 경고 로그 출력

---

## 관련 엔드포인트

- [POST /api/admin/steam/bulk-link](./steam-bulk-link.md) - 벌크 연동
- [DELETE /api/admin/steam/unlink](./steam-unlink.md) - 연결 해제
- [POST /api/auth/steam/callback](../auth/steam-callback.md) - 실제 OAuth 콜백

---

## 변경 이력

| Version | Date       | Description    |
| ------- | ---------- | -------------- |
| v1.0.0  | 2025-01-07 | 초기 문서 작성 |

---

## 메타데이터

- **Author**: ReadyGo / Eunkyoung Kim(김은경)
- **Created At**: 2025-01-07
- **Status**: Active
- **Environment**: Development/Test Only
