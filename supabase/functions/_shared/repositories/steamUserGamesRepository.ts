import type { DbClient } from '../types/dbClient.ts';

/**
 * steam_user_games Repository
 * 책임: steam_user_games 테이블 접근 전담
 */

export type SteamUserGameInput = {
  app_id: number;
  name: string | null;
  playtime_forever: number;
  playtime_recent: number | null;
  last_played: string | null; // timestamptz (ISO 8601 형식)
};

/**
 * steam_user_games 테이블에 bulk upsert 수행
 *
 * 책임:
 * - (user_id, app_id) unique 기준으로 upsert
 * - 갱신 컬럼: name, playtime_forever, playtime_recent, last_played
 * - DB 접근만 수행, 에러 처리는 상위 레이어에서 담당
 *
 * 비책임:
 * - 데이터 검증
 * - 매핑 로직
 * - 비즈니스 로직
 *
 * @param client - DB 클라이언트
 * @param userId - 사용자 ID
 * @param games - 게임 목록
 * @returns DB 응답 구조를 그대로 반환
 */
export const bulkUpsert = async (
  client: DbClient,
  userId: string,
  games: SteamUserGameInput[]
) => {
  if (games.length === 0) {
    return { data: null, error: null };
  }

  const rows = games.map((game) => ({
    user_id: userId,
    app_id: game.app_id,
    name: game.name,
    playtime_forever: game.playtime_forever,
    playtime_recent: game.playtime_recent,
    last_played: game.last_played,
  }));

  return await client.from('steam_user_games').upsert(rows, {
    onConflict: 'user_id,app_id',
  });
};
