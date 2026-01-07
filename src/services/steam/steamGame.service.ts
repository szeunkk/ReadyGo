import { upsertSteamGame } from '@/repositories/steamGame.repository';
import {
  getLastProcessedAppId,
  getProcessedAppIds,
  insertSteamGameSyncLog,
} from '@/repositories/steamGameSyncLog.repository';

type SteamStoreApp = {
  appid: number;
  name: string;
};

type SteamAppListResponse = {
  response?: {
    apps?: SteamStoreApp[];
  };
};

export const syncSteamGames = async (limit = 200) => {
  const steamApiKey = process.env.STEAM_API_KEY;
  if (!steamApiKey) {
    throw new Error('STEAM_API_KEY is missing');
  }

  // ✅ 후보는 넉넉히 받기 (이미 성공한 애들 걸러야 하니까)
  const candidateCount = Math.min(limit * 5, 500);

  // 마지막으로 처리한 app_id 조회 (페이지네이션용)
  const lastAppId = await getLastProcessedAppId();

  // 1) 앱 리스트 (last_appid 이후부터 가져오기)
  const apiUrl = new URL(
    'https://api.steampowered.com/IStoreService/GetAppList/v1/'
  );
  apiUrl.searchParams.set('key', steamApiKey);
  apiUrl.searchParams.set('max_results', candidateCount.toString());
  if (lastAppId) {
    apiUrl.searchParams.set('last_appid', lastAppId.toString());
  }

  const listRes = await fetch(apiUrl.toString(), {
    cache: 'no-store',
    headers: {
      'User-Agent': 'ReadyGo/1.0 (Steam Sync Service)',
      Accept: 'application/json',
    },
  });

  if (!listRes.ok) {
    throw new Error(`Steam app list fetch failed: ${listRes.status}`);
  }

  const listData = (await listRes.json()) as SteamAppListResponse;
  const apps = listData.response?.apps ?? [];

  // 이미 처리된 app_id 한 번에 조회 (success/failed/skipped 모두 제외)
  const processedSet = await getProcessedAppIds(apps.map((a) => a.appid));

  // 처리된 것 제외하고 limit개만 처리
  const targetApps = apps
    .filter((a) => !processedSet.has(a.appid))
    .slice(0, limit);

  // 2) 상세 조회 + 업서트
  for (const app of targetApps) {
    try {
      const detailRes = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${app.appid}&cc=us&l=en`,
        {
          cache: 'no-store',
          headers: {
            'User-Agent': 'ReadyGo/1.0 (Steam Sync Service)',
          },
        }
      );

      if (!detailRes.ok) {
        await insertSteamGameSyncLog({
          app_id: app.appid,
          status: 'failed',
          reason: `HTTP ${detailRes.status}`,
        });
        continue;
      }

      const detailJson = await detailRes.json();
      const detail = detailJson?.[app.appid]?.data;

      if (!detail) {
        await insertSteamGameSyncLog({
          app_id: app.appid,
          status: 'skipped',
          reason: 'no data',
        });
        continue;
      }

      if (detail.type !== 'game') {
        await insertSteamGameSyncLog({
          app_id: app.appid,
          status: 'skipped',
          reason: `type=${detail.type}`,
        });
        continue;
      }

      await upsertSteamGame({
        app_id: app.appid,
        name: detail.name,
        short_description: detail.short_description ?? null,
        header_image: detail.header_image ?? null,
        genres:
          detail.genres?.map((g: { description: string }) => g.description) ??
          [],
        categories:
          detail.categories?.map((c: { id: string; description: string }) => ({
            id: Number(c.id),
            label: c.description,
          })) ?? [],
      });

      await insertSteamGameSyncLog({
        app_id: app.appid,
        status: 'success',
      });
    } catch (e) {
      await insertSteamGameSyncLog({
        app_id: app.appid,
        status: 'failed',
        reason: e instanceof Error ? e.message : 'unknown error',
      });
    }
  }

  return { ok: true, candidates: apps.length, queued: targetApps.length };
};
