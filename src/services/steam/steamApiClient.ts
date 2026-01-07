/**
 * Steam API Client
 * 책임: Steam Web API 호출 전담
 */

export type SteamGame = {
  appid: number;
  name?: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  rtime_last_played?: number;
};

export type GetOwnedGamesResult =
  | { ok: true; games: SteamGame[] }
  | { ok: false; reason: 'network_error' | 'private' | 'timeout' };

type SteamApiResponse = {
  response?: {
    game_count?: number;
    games?: SteamGame[];
  };
};

/**
 * Steam GetOwnedGames API 호출
 *
 * 책임:
 * - IPlayerService/GetOwnedGames/v0001/ 엔드포인트 호출
 * - 네트워크/타임아웃 에러 처리
 * - 비공개 프로필 감지
 *
 * 비책임:
 * - 데이터 매핑/변환
 * - 비즈니스 로직
 * - DB 저장
 *
 * @param steamId - 64-bit Steam ID
 * @returns Result 객체 (ok: true/false)
 */
export const getOwnedGames = async (
  steamId: string
): Promise<GetOwnedGamesResult> => {
  const steamApiKey = process.env.STEAM_API_KEY;

  if (!steamApiKey) {
    return {
      ok: false,
      reason: 'network_error',
    };
  }

  try {
    const url = new URL(
      'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/'
    );
    url.searchParams.set('key', steamApiKey);
    url.searchParams.set('steamid', steamId);
    url.searchParams.set('include_appinfo', '1');
    url.searchParams.set('include_played_free_games', '1');
    url.searchParams.set('format', 'json');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'ReadyGo/1.0 (Steam Sync Service)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10초 타임아웃
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: 'network_error',
      };
    }

    const data = (await response.json()) as SteamApiResponse;

    // 비공개 프로필 또는 games 필드 없음
    if (!data.response || !data.response.games) {
      return {
        ok: false,
        reason: 'private',
      };
    }

    // 게임 수가 너무 많으면 메모리 문제 발생 가능
    // playtime 기준 상위 1000개만 처리
    const games = data.response.games;
    const sortedGames = games
      .sort((a, b) => b.playtime_forever - a.playtime_forever)
      .slice(0, 1000);

    return {
      ok: true,
      games: sortedGames,
    };
  } catch (error) {
    // 네트워크 에러, 타임아웃, JSON 파싱 에러 등
    if (error instanceof Error && error.name === 'TimeoutError') {
      return {
        ok: false,
        reason: 'timeout',
      };
    }

    return {
      ok: false,
      reason: 'network_error',
    };
  }
};

