import { upsertSteamGame } from '@/repositories/steamGame.repository';
import { insertSteamGameSyncLog } from '@/repositories/steamGameSyncLog.repository';

type SteamStoreApp = {
  appid: number;
  name: string;
};

type SteamAppListResponse = {
  response?: {
    apps?: SteamStoreApp[];
  };
};

export async function syncSteamGames(limit = 200) {
  const steamApiKey = process.env.STEAM_API_KEY;
  if (!steamApiKey) {
    throw new Error('STEAM_API_KEY is missing');
  }

  // 1) 앱 리스트
  const listRes = await fetch(
    `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${steamApiKey}&max_results=${limit}`,
    {
      cache: 'no-store',
      headers: {
        'User-Agent': 'ReadyGo/1.0 (Steam Sync Service)',
        Accept: 'application/json',
      },
    }
  );

  if (!listRes.ok) {
    throw new Error(`Steam app list fetch failed: ${listRes.status}`);
  }

  const listData = (await listRes.json()) as SteamAppListResponse;
  const targetApps = listData.response?.apps ?? [];

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
        genres: detail.genres?.map((g: any) => g.description) ?? [],
        categories:
          detail.categories?.map((c: any) => ({
            id: Number(c.id),
            label: c.description,
          })) ?? [],
      });

      await insertSteamGameSyncLog({
        app_id: app.appid,
        status: 'success',
      });
    } catch (e: any) {
      await insertSteamGameSyncLog({
        app_id: app.appid,
        status: 'failed',
        reason: e?.message ?? 'unknown error',
      });
    }
  }

  return { ok: true, synced: targetApps.length };
}
