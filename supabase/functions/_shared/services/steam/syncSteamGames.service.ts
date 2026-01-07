import type { DbClient } from '../../types/dbClient.ts';
import * as userProfilesRepository from '../../repositories/userProfilesRepository.ts';
import * as steamUserGamesRepository from '../../repositories/steamUserGamesRepository.ts';
import * as steamSyncLogRepository from '../../repositories/steamSyncLogRepository.ts';
import * as steamApiClient from './steamApiClient.ts';

/**
 * syncSteamGames Service
 * 책임: Steam 소유 게임 동기화 오케스트레이션
 */

export type SyncResult = {
  status: 'success' | 'failed' | 'private' | 'not_linked' | 'invalid_steam_id';
  syncedGamesCount: number;
};

/**
 * 64-bit SteamID 형식 검증
 * - 17자리 숫자 문자열
 * - 7656119xxxxxxxx 형식
 */
const isSteamId64 = (id: string): boolean => {
  return /^7656119\d{10}$/.test(id);
};

/**
 * Unix timestamp를 ISO 8601 timestamptz 형식으로 변환
 */
const convertUnixToTimestamptz = (unixTime: number): string => {
  return new Date(unixTime * 1000).toISOString();
};

/**
 * Steam 소유 게임 동기화
 *
 * 책임:
 * - Repository 및 Steam API Client 조합
 * - 실패 케이스를 명시적으로 처리 (throw 금지)
 * - 로그 기록
 *
 * 비책임:
 * - Domain 로직
 * - UI 로직
 * - ViewModel 변환
 *
 * 흐름:
 * 1. user_profiles에서 steam_id 조회
 * 2. steam_id 검증 (없음/형식 오류)
 * 3. Steam API 호출
 * 4. 응답 매핑 및 DB 저장
 * 5. 로그 기록
 * 6. Result 반환
 *
 * @param client - DB 클라이언트
 * @param userId - 인증된 유저 ID
 * @returns SyncResult (throw 없음)
 */
export const syncSteamGames = async (
  client: DbClient,
  userId: string
): Promise<SyncResult> => {
  // 1. user_profiles에서 steam_id 조회
  console.log(`[Sync User ${userId}] Fetching user profile`);
  const profileResult = await userProfilesRepository.findByUserId(
    client,
    userId
  );

  // Repository 에러는 throw (인프라 오류)
  if (profileResult.error) {
    console.error(`[Sync User ${userId}] Failed to fetch user profile:`, profileResult.error);
    throw new Error(
      `Failed to fetch user profile: ${profileResult.error.message}`
    );
  }

  const profile = profileResult.data;

  // 2-1. steam_id 없음
  if (!profile || !profile.steam_id) {
    const result: SyncResult = {
      status: 'not_linked',
      syncedGamesCount: 0,
    };

    // 로그 기록 (실패해도 무시)
    await steamSyncLogRepository.insertLog(client, {
      userId,
      status: 'not_linked',
      syncedGamesCount: 0,
    });

    return result;
  }

  const steamId = profile.steam_id;

  // 2-2. steam_id 형식 검증
  if (!isSteamId64(steamId)) {
    const result: SyncResult = {
      status: 'invalid_steam_id',
      syncedGamesCount: 0,
    };

    // 로그 기록
    await steamSyncLogRepository.insertLog(client, {
      userId,
      status: 'invalid_steam_id',
      syncedGamesCount: 0,
    });

    return result;
  }

  // 3. Steam API 호출
  console.log(`[Sync User ${userId}] Calling Steam API with steamId: ${steamId}`);
  const apiResult = await steamApiClient.getOwnedGames(steamId);

  if (!apiResult.ok) {
    // 비공개 프로필
    if (apiResult.reason === 'private') {
      console.log(`[Sync User ${userId}] Steam profile is private`);
      const result: SyncResult = {
        status: 'private',
        syncedGamesCount: 0,
      };

      await steamSyncLogRepository.insertLog(client, {
        userId,
        status: 'private',
        syncedGamesCount: 0,
      });

      return result;
    }

    // 네트워크 오류/타임아웃
    console.error(`[Sync User ${userId}] Steam API call failed: ${apiResult.reason}`);
    const result: SyncResult = {
      status: 'failed',
      syncedGamesCount: 0,
    };

    await steamSyncLogRepository.insertLog(client, {
      userId,
      status: 'failed',
      syncedGamesCount: 0,
    });

    return result;
  }

  const { games } = apiResult;

  // 4. 응답 매핑 (Steam API 형식 → DB 형식)
  const gameInputs: steamUserGamesRepository.SteamUserGameInput[] = games.map(
    (game) => ({
      app_id: game.appid,
      name: game.name ?? null,
      playtime_forever: game.playtime_forever,
      playtime_recent: game.playtime_2weeks ?? null,
      last_played: game.rtime_last_played
        ? convertUnixToTimestamptz(game.rtime_last_played)
        : null,
    })
  );

  // 5. DB 저장 (bulk upsert)
  console.log(`[Sync User ${userId}] Upserting ${gameInputs.length} games to DB`);
  const upsertResult = await steamUserGamesRepository.bulkUpsert(
    client,
    userId,
    gameInputs
  );

  // Repository 에러는 throw (인프라 오류)
  if (upsertResult.error) {
    console.error(`[Sync User ${userId}] Failed to upsert games:`, upsertResult.error);
    throw new Error(`Failed to upsert games: ${upsertResult.error.message}`);
  }

  const syncedCount = gameInputs.length;

  // 6. 로그 기록 (성공)
  console.log(`[Sync User ${userId}] Successfully synced ${syncedCount} games`);
  await steamSyncLogRepository.insertLog(client, {
    userId,
    status: 'success',
    syncedGamesCount: syncedCount,
  });

  // 7. Result 반환
  return {
    status: 'success',
    syncedGamesCount: syncedCount,
  };
};

