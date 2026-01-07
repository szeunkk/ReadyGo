# DELETE /api/admin/steam/unlink

## 개요

**관리자용** Steam ID 연결 해제 엔드포인트입니다. 잘못 연결된 Steam ID를 해제하거나 테스트 데이터를 정리할 때 사용됩니다.

⚠️ **보안 주의**: 이 엔드포인트는 프로덕션 환경에서 자동으로 비활성화되며, API Key 인증이 필요합니다.

---

## 요청

### HTTP Method
```
DELETE /api/admin/steam/unlink
```

### Headers
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Content-Type` | string | ✅ | `application/json` |
| `x-admin-api-key` | string | ✅ | 환경변수 `ADMIN_API_KEY`와 일치해야 함 |

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string (uuid) | ✅ | 연결 해제할 유저의 ID |

### Request Example
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 응답

### 성공 응답 (200 OK)
```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "previousSteamId": "76561198000000000",
  "message": "Steam ID 연결이 성공적으로 해제되었습니다."
}
```

### 응답 필드
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | 성공 여부 |
| `userId` | string | 연결 해제된 유저 ID |
| `previousSteamId` | string | 해제된 Steam ID |
| `message` | string | 성공 메시지 |

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

### 400 Bad Request - Steam ID 없음
```json
{
  "success": false,
  "error": "이 유저는 연결된 Steam ID가 없습니다.",
  "errorCode": "no_steam_id"
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

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `production_disabled` | 403 | 프로덕션 환경에서 사용 불가 |
| `server_config_error` | 500 | ADMIN_API_KEY 미설정 |
| `invalid_api_key` | 401 | API Key 불일치 |
| `invalid_json` | 400 | 요청 본문 파싱 실패 |
| `missing_parameters` | 400 | 필수 파라미터 누락 |
| `invalid_user_id` | 400 | 잘못된 UUID 형식 |
| `user_check_failed` | 500 | 유저 조회 실패 |
| `user_not_found` | 404 | 유저 없음 |
| `no_steam_id` | 400 | 연결된 Steam ID 없음 |
| `update_failed` | 500 | 프로필 업데이트 실패 |
| `server_error` | 500 | 서버 오류 |

---

## 비즈니스 로직

### 1. 인증 및 권한 검증
- 프로덕션 환경 체크 (`NODE_ENV`)
- API Key 검증 (`x-admin-api-key` 헤더)

### 2. 파라미터 검증
- `userId`: UUID v4 형식 검증

### 3. 유저 및 Steam ID 확인
- `user_profiles` 테이블에서 userId 조회
- 존재하지 않으면 404 반환
- Steam ID가 이미 NULL이면 400 반환

### 4. 데이터 업데이트
- `user_profiles.steam_id`를 NULL로 설정
- `steam_sync_logs` 테이블에 로그 기록
  - `status`: `'admin_unlinked'`
  - `synced_games_count`: 0
  - `synced_at`: 현재 시각

### 5. 로깅
- 이전 Steam ID를 콘솔에 로깅
- 감사 추적을 위한 정보 기록

---

## 사용 예시

### cURL
```bash
curl -X DELETE https://your-domain.com/api/admin/steam/unlink \
  -H "Content-Type: application/json" \
  -H "x-admin-api-key: your-secret-key" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### JavaScript (fetch)
```javascript
const response = await fetch('/api/admin/steam/unlink', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-api-key': process.env.ADMIN_API_KEY,
  },
  body: JSON.stringify({
    userId: '550e8400-e29b-41d4-a716-446655440000',
  }),
});

const data = await response.json();
console.log(`해제된 Steam ID: ${data.previousSteamId}`);
```

---

## 주의사항

### Steam 게임 데이터
Steam ID 연결을 해제해도 다음 데이터는 유지됩니다:
- `steam_user_games` 테이블의 게임 데이터
- `steam_user_stats` 테이블의 통계 데이터

이 데이터를 삭제하려면 별도의 정리 작업이 필요합니다.

### 재연결
동일한 Steam ID를 다시 연결하려면:
1. [POST /api/admin/steam/link](./steam-link.md) 사용
2. 또는 실제 OAuth 플로우 사용

---

## 보안 고려사항

1. **프로덕션 비활성화**: `NODE_ENV === 'production'`일 때 자동으로 403 반환
2. **API Key 인증**: 환경변수 `ADMIN_API_KEY` 필수 설정
3. **감사 로그**: 모든 작업이 `steam_sync_logs`에 기록됨 (`status: 'admin_unlinked'`)
4. **이전 Steam ID 로깅**: 삭제된 Steam ID가 콘솔에 로깅됨

---

## 관련 엔드포인트

- [POST /api/admin/steam/link](./steam-link.md) - 단일 연동
- [POST /api/admin/steam/bulk-link](./steam-bulk-link.md) - 벌크 연동
- [POST /api/auth/steam/callback](../auth/steam-callback.md) - 실제 OAuth 콜백

---

## 변경 이력

| Version | Date | Description |
|---------|------|-------------|
| v1.0.0 | 2025-01-07 | 초기 문서 작성 |

---

## 메타데이터

- **Author**: ReadyGo / Eunkyoung Kim(김은경)
- **Created At**: 2025-01-07
- **Status**: Active
- **Environment**: Development/Test Only

