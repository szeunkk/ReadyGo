# POST /api/admin/steam/bulk-link

## 개요

**관리자용** 여러 유저의 Steam ID를 한 번에 연동하는 벌크 처리 엔드포인트입니다. 대량의 목업 데이터 생성 및 마이그레이션 작업에 사용됩니다.

⚠️ **보안 주의**: 이 엔드포인트는 프로덕션 환경에서 자동으로 비활성화되며, API Key 인증이 필요합니다.

---

## 요청

### HTTP Method
```
POST /api/admin/steam/bulk-link
```

### Headers
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Content-Type` | string | ✅ | `application/json` |
| `x-admin-api-key` | string | ✅ | 환경변수 `ADMIN_API_KEY`와 일치해야 함 |

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `users` | array | ✅ | 연동할 유저 목록 (최대 100개) |
| `users[].userId` | string (uuid) | ✅ | 유저 ID |
| `users[].steamId` | string | ✅ | Steam ID (17자리 숫자) |
| `force` | boolean | ❌ | 중복 시 강제 덮어쓰기 (기본값: false) |

### Request Example
```json
{
  "users": [
    {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "steamId": "76561198000000001"
    },
    {
      "userId": "550e8400-e29b-41d4-a716-446655440001",
      "steamId": "76561198000000002"
    },
    {
      "userId": "550e8400-e29b-41d4-a716-446655440002",
      "steamId": "76561198000000003"
    }
  ],
  "force": false
}
```

---

## 응답

### 성공 응답 (200 OK)
```json
{
  "success": true,
  "message": "총 3개 중 2개 성공, 1개 실패",
  "summary": {
    "total": 3,
    "success": 2,
    "failure": 1
  },
  "results": [
    {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "steamId": "76561198000000001",
      "success": true
    },
    {
      "userId": "550e8400-e29b-41d4-a716-446655440001",
      "steamId": "76561198000000002",
      "success": false,
      "error": "이 Steam ID는 이미 다른 유저에게 연결되어 있습니다.",
      "errorCode": "duplicate_steam_id"
    },
    {
      "userId": "550e8400-e29b-41d4-a716-446655440002",
      "steamId": "76561198000000003",
      "success": true
    }
  ]
}
```

### 응답 필드
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | 전체 요청 성공 여부 (항상 true) |
| `message` | string | 요약 메시지 |
| `summary.total` | number | 총 요청 수 |
| `summary.success` | number | 성공 수 |
| `summary.failure` | number | 실패 수 |
| `results` | array | 각 유저별 처리 결과 |
| `results[].userId` | string | 유저 ID |
| `results[].steamId` | string | Steam ID |
| `results[].success` | boolean | 해당 유저 처리 성공 여부 |
| `results[].error` | string | 실패 시 에러 메시지 |
| `results[].errorCode` | string | 실패 시 에러 코드 |

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

### 400 Bad Request - 배치 크기 초과
```json
{
  "success": false,
  "error": "한 번에 최대 100개까지만 처리할 수 있습니다.",
  "errorCode": "batch_size_exceeded"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "서버 오류가 발생했습니다.",
  "errorCode": "server_error",
  "details": "..."
}
```

---

## 에러 코드

### 요청 레벨 에러
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `production_disabled` | 403 | 프로덕션 환경에서 사용 불가 |
| `server_config_error` | 500 | ADMIN_API_KEY 미설정 |
| `invalid_api_key` | 401 | API Key 불일치 |
| `invalid_json` | 400 | 요청 본문 파싱 실패 |
| `missing_parameters` | 400 | 필수 파라미터 누락 |
| `batch_size_exceeded` | 400 | 배치 크기 초과 (최대 100개) |
| `server_error` | 500 | 서버 오류 |

### 개별 유저 에러 (results 내부)
| Code | Description |
|------|-------------|
| `missing_parameters` | userId 또는 steamId 누락 |
| `invalid_user_id` | 잘못된 UUID 형식 |
| `invalid_steam_id` | 잘못된 Steam ID 형식 |
| `user_check_failed` | 유저 조회 실패 |
| `user_not_found` | 유저 없음 |
| `duplicate_check_failed` | 중복 검사 실패 |
| `duplicate_steam_id` | Steam ID 중복 |
| `update_failed` | 프로필 업데이트 실패 |
| `processing_error` | 처리 중 오류 |

---

## 비즈니스 로직

### 1. 인증 및 권한 검증
- 프로덕션 환경 체크 (`NODE_ENV`)
- API Key 검증 (`x-admin-api-key` 헤더)

### 2. 배치 크기 제한
- 최대 100개까지 한 번에 처리
- 초과 시 400 에러 반환

### 3. 순차 처리
- 각 유저를 순차적으로 처리
- 일부 실패해도 나머지 계속 진행
- 각 유저별 결과를 `results` 배열에 저장

### 4. 개별 유저 처리 로직
1. 파라미터 검증 (UUID, Steam ID 형식)
2. 유저 존재 확인
3. 중복 검증 (force 옵션 고려)
4. `user_profiles.steam_id` 업데이트
5. `steam_sync_logs` 로그 기록

---

## 사용 예시

### cURL
```bash
curl -X POST https://your-domain.com/api/admin/steam/bulk-link \
  -H "Content-Type: application/json" \
  -H "x-admin-api-key: your-secret-key" \
  -d '{
    "users": [
      {
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "steamId": "76561198000000001"
      },
      {
        "userId": "550e8400-e29b-41d4-a716-446655440001",
        "steamId": "76561198000000002"
      }
    ],
    "force": false
  }'
```

### JavaScript (fetch)
```javascript
const users = [
  { userId: '550e8400-e29b-41d4-a716-446655440000', steamId: '76561198000000001' },
  { userId: '550e8400-e29b-41d4-a716-446655440001', steamId: '76561198000000002' },
];

const response = await fetch('/api/admin/steam/bulk-link', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-api-key': process.env.ADMIN_API_KEY,
  },
  body: JSON.stringify({
    users,
    force: false,
  }),
});

const data = await response.json();

// 실패한 항목만 필터링
const failures = data.results.filter(r => !r.success);
console.log(`실패: ${failures.length}개`, failures);
```

---

## 성능 및 제약사항

### 배치 크기
- **최대**: 100개
- **권장**: 50개 이하 (안정성)
- 더 많은 데이터 처리 시 여러 번 나눠서 호출

### 처리 시간
- 1개당 약 100-200ms (네트워크 및 DB 상황에 따라 다름)
- 100개 처리 시 약 10-20초 예상

### 타임아웃
- Next.js API Route 기본 타임아웃: 60초
- Vercel 등 플랫폼에서 추가 제한 있을 수 있음

---

## 보안 고려사항

1. **프로덕션 비활성화**: `NODE_ENV === 'production'`일 때 자동으로 403 반환
2. **API Key 인증**: 환경변수 `ADMIN_API_KEY` 필수 설정
3. **배치 크기 제한**: DoS 방지를 위한 100개 제한
4. **감사 로그**: 모든 작업이 `steam_sync_logs`에 기록됨
5. **강제 덮어쓰기**: `force=true` 사용 시 경고 로그 출력

---

## 관련 엔드포인트

- [POST /api/admin/steam/link](./steam-link.md) - 단일 연동
- [DELETE /api/admin/steam/unlink](./steam-unlink.md) - 연결 해제
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

