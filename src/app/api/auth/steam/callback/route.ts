import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// nonce 기반 검증 결과 캐시 (메모리 기반, 서버 재시작 시 초기화)
// 프로덕션에서는 Redis 등을 사용하는 것이 좋지만, 현재는 간단한 메모리 캐시 사용
const verificationCache = new Map<
  string,
  { steamId: string; timestamp: number }
>();

// 캐시 만료 시간: 5분
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Steam OpenID 검증 및 연동 처리 API Route
 * POST /api/auth/steam/callback
 */
export const POST = async (request: NextRequest) => {
  try {
    // 1. OpenID 파라미터 수신
    let openIdParams: Record<string, string>;

    try {
      const body = await request.json();
      openIdParams = body;
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        {
          success: false,
          error: '요청 데이터 파싱에 실패했습니다.',
          errorCode: 'parse_error',
        },
        { status: 400 }
      );
    }

    // 빈 객체 체크
    if (
      !openIdParams ||
      typeof openIdParams !== 'object' ||
      Object.keys(openIdParams).length === 0
    ) {
      console.error('Empty or invalid OpenID params');
      return NextResponse.json(
        {
          success: false,
          error: 'OpenID 파라미터가 비어있습니다.',
          errorCode: 'empty_params',
        },
        { status: 400 }
      );
    }

    // 디버깅: 받은 파라미터 로깅 (제거됨)

    // 필수 파라미터 확인
    if (!openIdParams['openid.mode'] || !openIdParams['openid.identity']) {
      // eslint-disable-next-line no-console
      console.error('Missing required OpenID parameters', {
        hasMode: !!openIdParams['openid.mode'],
        hasIdentity: !!openIdParams['openid.identity'],
        allParams: Object.keys(openIdParams),
      });
      return NextResponse.json(
        {
          success: false,
          error: 'OpenID 파라미터가 누락되었습니다.',
          errorCode: 'missing_params',
        },
        { status: 400 }
      );
    }

    // 2. Steam OpenID 검증 수행 (nonce 기반 캐싱)
    const responseNonce = openIdParams['openid.response_nonce'];
    const verificationResult = await verifySteamOpenId(
      openIdParams,
      responseNonce
    );

    if (!verificationResult.success || !verificationResult.steamId) {
      return NextResponse.json(
        {
          success: false,
          error:
            verificationResult.error || 'Steam OpenID 검증에 실패했습니다.',
          errorCode: 'verification_failed',
          details: verificationResult.details,
        },
        { status: 400 }
      );
    }

    const { steamId } = verificationResult;

    // 3. 현재 로그인 유저 세션 확인 (서버에서 직접)
    // Supabase SSR 클라이언트 사용 (쿠키 자동 관리, 토큰 자동 갱신)
    const supabase = await createClient();

    // 사용자 정보 조회 (토큰 갱신은 자동으로 처리됨)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          error: '로그인 세션이 없습니다. 다시 로그인해주세요.',
          errorCode: 'invalid_session',
        },
        { status: 401 }
      );
    }

    // 사용자 정보가 정상적으로 조회된 경우
    const currentUserId = user.id;
    const workingSupabase = supabase;

    // 4. 중복 연결 방지 검사
    const { data: existingProfiles, error: checkError } = await workingSupabase
      .from('user_profiles')
      .select('id')
      .eq('steam_id', steamId)
      .limit(1);

    if (checkError) {
      console.error('Duplicate check error:', checkError);
      return NextResponse.json(
        {
          success: false,
          error: '중복 검사 중 오류가 발생했습니다.',
          errorCode: 'server_error',
        },
        { status: 500 }
      );
    }

    // 다른 계정에 이미 연결되어 있는 경우
    if (existingProfiles && existingProfiles.length > 0) {
      const [existingProfile] = existingProfiles;
      if (existingProfile && existingProfile.id !== currentUserId) {
        return NextResponse.json(
          {
            success: false,
            error: '이 Steam 계정은 이미 다른 계정에 연결되어 있습니다.',
            errorCode: 'duplicate_steam_id',
          },
          { status: 409 }
        );
      }
    }

    // 5. DB 저장 (트랜잭션)
    // user_profiles 업데이트
    const { error: updateError } = await workingSupabase
      .from('user_profiles')
      .update({ steam_id: steamId as string | null })
      .eq('id', currentUserId as string);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: '프로필 업데이트에 실패했습니다.',
          errorCode: 'update_failed',
        },
        { status: 500 }
      );
    }

    // steam_sync_logs insert (중복 방지: 같은 user_id로 이미 'linked' 상태가 있으면 insert하지 않음)
    const { data: existingLogs, error: checkLogError } = await workingSupabase
      .from('steam_sync_logs')
      .select('id')
      .eq('user_id', currentUserId)
      .eq('status', 'linked')
      .limit(1);

    // 기존 'linked' 로그가 없을 때만 insert
    if (!checkLogError && (!existingLogs || existingLogs.length === 0)) {
      const { error: logError } = await workingSupabase
        .from('steam_sync_logs')
        .insert({
          user_id: currentUserId as string | null,
          status: 'linked' as string | null,
          synced_games_count: 0 as number | null,
          synced_at: new Date().toISOString() as string | null,
        });

      if (logError) {
        // eslint-disable-next-line no-console
        console.error('Sync log insert error:', logError);
        // 로그 실패는 치명적이지 않으므로 경고만 출력
      }
    } else if (existingLogs && existingLogs.length > 0) {
      // Steam sync log already exists, skipping insert
    } else if (checkLogError) {
      // eslint-disable-next-line no-console
      console.error('Error checking existing sync logs:', checkLogError);
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      steamId,
    });
  } catch (error) {
    console.error('Steam callback API error:', error);
    // eslint-disable-next-line no-console
    console.error('Steam callback API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다.',
        errorCode: 'server_error',
      },
      { status: 500 }
    );
  }
};

/**
 * Steam OpenID 검증 함수
 * Steam 서버로 검증 요청을 보내고 SteamID를 추출합니다.
 */
const verifySteamOpenId = async (
  openIdParams: Record<string, string>,
  responseNonce?: string
): Promise<{
  success: boolean;
  steamId?: string;
  error?: string;
  errorCode?: string;
  details?: Record<string, unknown>;
}> => {
  try {
    // 캐시 확인: 같은 nonce로 이미 검증 성공한 경우
    if (responseNonce) {
      const cached = verificationCache.get(responseNonce);
      if (cached) {
        const now = Date.now();
        if (now - cached.timestamp < CACHE_EXPIRY_MS) {
          // Returning cached verification result for nonce
          return {
            success: true,
            steamId: cached.steamId,
          };
        } else {
          // 만료된 캐시 제거
          verificationCache.delete(responseNonce);
        }
      }
    }

    // 필수 파라미터 확인
    if (!openIdParams['openid.mode'] || !openIdParams['openid.identity']) {
      const errorDetails = {
        receivedParams: Object.keys(openIdParams),
        hasMode: !!openIdParams['openid.mode'],
        hasIdentity: !!openIdParams['openid.identity'],
      };
      console.error('Missing required OpenID parameters', errorDetails);
      return {
        success: false,
        error: '필수 OpenID 파라미터가 누락되었습니다.',
        details: errorDetails,
      };
    }

    // Steam OpenID 검증을 위한 파라미터 구성
    const verifyParams = new URLSearchParams();

    // 원본 파라미터를 모두 복사 (openid.mode는 나중에 설정)
    Object.entries(openIdParams).forEach(([key, value]) => {
      if (key !== 'openid.mode') {
        verifyParams.append(key, value);
      }
    });

    // mode를 check_authentication으로 변경
    verifyParams.set('openid.mode', 'check_authentication');

    // 디버깅: 검증 요청 파라미터 로깅 (제거됨)

    // Steam 서버로 검증 요청
    const verifyBody = verifyParams.toString();
    const response = await fetch('https://steamcommunity.com/openid/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (compatible; ReadyGo/1.0)',
      },
      body: verifyBody,
    });

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => 'Failed to read error response');
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText.substring(0, 200),
      };
      console.error('Steam verification request failed:', errorDetails);
      return {
        success: false,
        error: `Steam 서버 요청 실패: ${response.status} ${response.statusText}`,
        details: errorDetails,
      };
    }

    const responseText = await response.text();

    // 디버깅: Steam 응답 로깅 (제거됨)

    // Steam 응답 파싱 (줄바꿈과 공백 고려)
    // Steam은 줄바꿈으로 구분된 키-값 쌍 형식으로 응답
    const isValidMatch = responseText.match(/is_valid\s*:\s*(true|false)/i);

    if (!isValidMatch) {
      const errorDetails = {
        response: responseText,
        responseLength: responseText.length,
      };
      console.error(
        'Steam verification failed: is_valid not found',
        errorDetails
      );
      return {
        success: false,
        error: 'Steam 검증 응답에서 is_valid를 찾을 수 없습니다.',
        details: errorDetails,
      };
    }

    if (isValidMatch[1].toLowerCase() !== 'true') {
      const errorDetails = {
        response: responseText,
        isValidValue: isValidMatch[1],
      };
      console.error(
        'Steam verification failed: is_valid is false',
        errorDetails
      );
      return {
        success: false,
        error: 'Steam 검증이 실패했습니다. (is_valid: false)',
        details: errorDetails,
      };
    }

    // SteamID 추출 (claimed_id 또는 identity에서)
    const claimedId =
      openIdParams['openid.claimed_id'] || openIdParams['openid.identity'];

    if (!claimedId) {
      const errorDetails = {
        params: Object.keys(openIdParams),
        hasClaimedId: !!openIdParams['openid.claimed_id'],
        hasIdentity: !!openIdParams['openid.identity'],
      };
      console.error(
        'Steam ID extraction failed: no claimed_id or identity',
        errorDetails
      );
      return {
        success: false,
        error: 'SteamID를 추출할 수 없습니다. (claimed_id 또는 identity 없음)',
        details: errorDetails,
      };
    }

    // SteamID 추출: 'https://steamcommunity.com/openid/id/76561198000000000' → '76561198000000000'
    const steamIdMatch = claimedId.match(/\/id\/(\d+)$/);

    if (!steamIdMatch || !steamIdMatch[1]) {
      const errorDetails = {
        claimedId,
        pattern: '/id/(\\d+)$',
      };
      console.error('Steam ID extraction failed: invalid format', errorDetails);
      return {
        success: false,
        error: `SteamID 형식이 올바르지 않습니다: ${claimedId}`,
        details: errorDetails,
      };
    }

    const [, steamId] = steamIdMatch;

    // 검증 성공 시 캐시에 저장
    if (responseNonce && steamId) {
      verificationCache.set(responseNonce, {
        steamId,
        timestamp: Date.now(),
      });
      // Cached verification result for nonce
    }

    return {
      success: true,
      steamId,
    };
  } catch (error) {
    const errorDetails = {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };
    console.error('Steam OpenID verification error:', errorDetails);

    // 에러 타입에 따라 구체적인 메시지 제공
    let errorMessage = 'Steam 인증 검증에 실패했습니다.';
    let errorCode = 'verification_error';

    if (error instanceof TypeError && error.message.includes('fetch')) {
      // 네트워크 에러 또는 fetch 관련 에러
      errorMessage =
        'Steam 서버와의 통신에 실패했습니다. 네트워크 연결을 확인해주세요.';
      errorCode = 'network_error';
    } else if (error instanceof ReferenceError) {
      // 코드 버그 관련 에러 (예: 변수 미정의)
      errorMessage = '서버 오류가 발생했습니다. 관리자에게 문의해주세요.';
      errorCode = 'server_error';
    } else if (error instanceof Error) {
      // 기타 예상치 못한 에러
      const errorMsg = error.message.toLowerCase();
      if (
        errorMsg.includes('network') ||
        errorMsg.includes('fetch') ||
        errorMsg.includes('timeout')
      ) {
        errorMessage =
          'Steam 서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.';
        errorCode = 'network_error';
      } else {
        errorMessage = 'Steam 인증 검증 중 오류가 발생했습니다.';
        errorCode = 'verification_error';
      }
    }

    return {
      success: false,
      error: errorMessage,
      errorCode,
      details: errorDetails,
    };
  }
};
