import { upsertSteamGame } from '@/repositories/steamGame.repository';

type SteamAppListResponse = {
  applist: { apps: { appid: number; name: string }[] };
};

export async function syncSteamGames(limit = 200) {
  // 1) 앱 리스트
  const listRes = await fetch(
    'https://api.steampowered.com/ISteamApps/GetAppList/v2/',
    {
      // Next.js 캐시 원치 않으면 아래 옵션 유지
      cache: 'no-store',
    }
  );

  if (!listRes.ok)
    throw new Error(`Steam app list fetch failed: ${listRes.status}`);
  const listData = (await listRes.json()) as SteamAppListResponse;

  const targetApps = listData.applist.apps.slice(0, limit);

  // 2) 상세 조회 + 업서트
  for (const app of targetApps) {
    const detailRes = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${app.appid}&cc=us&l=en`,
      { cache: 'no-store' }
    );

    if (!detailRes.ok) continue;

    const detailJson = await detailRes.json();
    const detail = detailJson?.[app.appid]?.data;

    // store api는 data가 없거나 게임이 아닌 항목도 많음
    if (!detail || detail.type !== 'game') continue;

    await upsertSteamGame({
      app_id: app.appid,
      name: detail.name ?? app.name ?? '',
      short_description: detail.short_description ?? null,
      header_image: detail.header_image ?? null,
      genres:
        detail.genres?.map((g: any) => g.description).filter(Boolean) ?? [],
      categories:
        detail.categories
          ?.map((c: any) => ({ id: Number(c.id), label: c.description }))
          .filter((x: any) => x.label) ?? [],
    });
  }

  return { ok: true, synced: targetApps.length };
}
