# API 명세서

---

## 문서 정보

| 항목        | 내용                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| 작성자      | 김은경                                                                                                         |
| 최초 작성일 | 2024-12-31                                                                                                     |
| 최종 수정일 | 2024-12-31                                                                                                     |
| 관련 화면   | Steam 연동 페이지                                                                                              |
| 관련 이슈   | [사용자 요구사항 정의서(UR-02)](https://www.notion.so/UR-02-2ca130d16ff481f1a3b5efbbd79a922f?source=copy_link) |

---

## 기능

- Steam OpenID 인증 검증 및 사용자 계정 연동

## 카테고리

- Auth / Steam

## 설명

- 클라이언트가 Steam 로그인 후 받은 OpenID 파라미터들을 서버로 전송하면, 서버는 이 정보를 바탕으로 Steam 서버에 유효성을 검증(`check_authentication`)합니다.
- 검증에 성공하면 추출된 Steam ID를 현재 로그인된 사용자의 프로필(`user_profiles`)에 업데이트하여 연동합니다.
- 이미 다른 사용자에 의해 사용 중인 Steam ID인 경우 연동을 거부합니다.
- 연동 성공 시 `steam_sync_logs`에 연동 기록을 생성합니다.

---

## Method

- POST

## URL

- /api/auth/steam/callback

---

## Param

### Path Parameter

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | ---- | ---------- | ---- | -------- | ---- |
| -   | -    | -          | -    | -        | -    |

### Query Parameter

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | ---- | ---------- | ---- | -------- | ---- |
| -   | -    | -          | -    | -        | -    |

---

## 사용자

- 로그인 필요 여부: **필수** (Supabase 세션 필요)
- 접근 가능한 사용자 범위: 로그인한 모든 사용자

---

## Request

### Header

| key           | 설명           | value 타입 | 필수 | 비고                                |
| ------------- | -------------- | ---------- | ---- | ----------------------------------- |
| Content-Type  | 요청 본문 타입 | string     | O    | `application/json`                  |
| Authorization | Bearer 토큰    | string     | △    | 쿠키 인증이 아닌 경우 필수          |
| Cookie        | 세션 쿠키      | string     | △    | Authorization 헤더가 없는 경우 필수 |

### Body

Steam OpenID 인증 후 리다이렉트된 URL의 쿼리 파라미터 전체를 JSON 객체로 전송합니다.

| key                   | 설명                              | value 타입 | 옵션 | Nullable | 예시                                                                           |
| --------------------- | --------------------------------- | ---------- | ---- | -------- | ------------------------------------------------------------------------------ |
| openid.mode           | OpenID 모드                       | string     | X    | X        | "id_res"                                                                       |
| openid.ns             | OpenID 네임스페이스               | string     | X    | X        | "http://specs.openid.net/auth/2.0"                                             |
| openid.op_endpoint    | OpenID 제공자 엔드포인트          | string     | X    | X        | "https://steamcommunity.com/openid/login"                                      |
| openid.claimed_id     | 사용자 식별자 (Steam ID 포함)     | string     | X    | X        | "https://steamcommunity.com/openid/id/76561198..."                             |
| openid.identity       | 사용자 식별자 (claimed_id와 동일) | string     | X    | X        | "https://steamcommunity.com/openid/id/76561198..."                             |
| openid.return_to      | 리턴 URL                          | string     | X    | X        | "http://localhost:3000/auth/steam/callback"                                    |
| openid.response_nonce | 응답 Nonce (재사용 방지)          | string     | X    | X        | "2024-01-01T00:00:00ZParams..."                                                |
| openid.assoc_handle   | 연결 핸들                         | string     | X    | X        | "1234567890"                                                                   |
| openid.signed         | 서명된 필드 목록                  | string     | X    | X        | "signed,op_endpoint,claimed_id,identity,return_to,response_nonce,assoc_handle" |
| openid.sig            | 서명값                            | string     | X    | X        | "Base64Signature..."                                                           |

---

## Response

### Body

| key       | 설명                      | value 타입 | 옵션 | Nullable | 예시                                |
| --------- | ------------------------- | ---------- | ---- | -------- | ----------------------------------- |
| success   | 성공 여부                 | boolean    | X    | X        | true                                |
| steamId   | 연동된 Steam ID (성공 시) | string     | O    | X        | "76561198000000000"                 |
| error     | 에러 메시지 (실패 시)     | string     | O    | X        | "Steam OpenID 검증에 실패했습니다." |
| errorCode | 에러 코드 (실패 시)       | string     | O    | X        | "verification_failed"               |
| details   | 상세 에러 정보            | object     | O    | O        | {}                                  |

### Example

**성공 시**

```json
{
  "success": true,
  "steamId": "76561198123456789"
}
```

**실패 시**

```json
{
  "success": false,
  "error": "이 Steam 계정은 이미 다른 계정에 연결되어 있습니다.",
  "errorCode": "duplicate_steam_id"
}
```

---

## Status

| status | response content      | 설명                                                    |
| ------ | --------------------- | ------------------------------------------------------- |
| 200    | OK                    | Steam 연동 성공                                         |
| 400    | BAD_REQUEST           | 잘못된 요청 (파라미터 누락, 파싱 오류, Steam 검증 실패) |
| 401    | UNAUTHORIZED          | 인증 실패 (로그인 세션 없음)                            |
| 409    | CONFLICT              | 충돌 (이미 다른 계정에 연결된 Steam ID)                 |
| 500    | INTERNAL_SERVER_ERROR | 서버 내부 오류 (DB 업데이트 실패 등)                    |

---

## 기타

- **중복 방지**: 이미 다른 사용자와 연동된 Steam ID는 연동할 수 없습니다. (`duplicate_steam_id` 에러 반환)
- **보안**: Steam 서버와 직접 통신하여 `check_authentication`을 수행하므로 위조된 요청을 걸러냅니다.
- **캐싱**: `openid.response_nonce`를 사용하여 동일한 응답에 대한 재검증 요청을 메모리 캐시로 처리하거나 방지합니다.
