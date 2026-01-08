import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { upsertSteamGame } from '@/repositories/steamGame.repository';
import { insertSteamGameSyncLog } from '@/repositories/steamGameSyncLog.repository';

export const dynamic = 'force-dynamic';

type SteamAppDetail = {
  type: string;
  name: string;
  short_description?: string;
  header_image?: string;
  genres?: Array<{ description: string }>;
  categories?: Array<{ id: string; description: string }>;
};

/**
 * GET /api/steam/game/[appId]
 *
 * 책임:
 * - 인증 확인
 * - Steam API에서 app_id로 게임 정보 조회
 * - steam_game_info 테이블에 저장 (upsert)
 * - steam_game_sync_logs에 로그 기록
 * - 게임 정보 반환
 *
 * 비책임:
 * - UI 가공, ViewModel 변환 금지
 */
export const GET = async (
  _request: NextRequest,
  { params }: { params: { appId: string } }
) => {
  try {
    // 1. Supabase SSR 클라이언트 생성
    const supabase = createClient();

    // 2. 사용자 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
          detail: 'Authentication required',
        },
        { status: 401 }
      );
    }

    // 3. app_id 파싱
    const { appId } = params;
    if (!appId || isNaN(Number(appId))) {
      return NextResponse.json(
        {
          code: 'INVALID_APP_ID',
          message: 'Bad Request',
          detail: 'Invalid app_id',
        },
        { status: 400 }
      );
    }

    // 4. Steam API로 게임 정보 조회
    const detailRes = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=en`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'ReadyGo/1.0 (Steam Game Service)',
        },
      }
    );

    if (!detailRes.ok) {
      await insertSteamGameSyncLog({
        app_id: Number(appId),
        status: 'failed',
        reason: `HTTP ${detailRes.status}`,
      });

      return NextResponse.json(
        {
          code: 'STEAM_API_ERROR',
          message: 'Internal Server Error',
          detail: `Steam API returned ${detailRes.status}`,
        },
        { status: 502 }
      );
    }

    const detailJson = await detailRes.json();
    const appData = detailJson?.[appId];

    if (!appData?.success || !appData?.data) {
      await insertSteamGameSyncLog({
        app_id: Number(appId),
        status: 'skipped',
        reason: 'no data',
      });

      return NextResponse.json(
        {
          code: 'GAME_NOT_FOUND',
          message: 'Not Found',
          detail: 'Game not found or unavailable',
        },
        { status: 404 }
      );
    }

    const detail: SteamAppDetail = appData.data;

    // 5. type='game'인지 확인
    if (detail.type !== 'game') {
      await insertSteamGameSyncLog({
        app_id: Number(appId),
        status: 'skipped',
        reason: `type=${detail.type}`,
      });

      return NextResponse.json(
        {
          code: 'NOT_A_GAME',
          message: 'Bad Request',
          detail: `This app is not a game (type: ${detail.type})`,
        },
        { status: 400 }
      );
    }

    // 6. steam_game_info 테이블에 저장
    const gameData = {
      app_id: Number(appId),
      name: detail.name,
      short_description: detail.short_description ?? null,
      header_image: detail.header_image ?? null,
      genres: detail.genres?.map((g) => g.description) ?? [],
      categories:
        detail.categories?.map((c) => ({
          id: Number(c.id),
          label: c.description,
        })) ?? [],
    };

    await upsertSteamGame(gameData);

    // 7. 로그 기록
    await insertSteamGameSyncLog({
      app_id: Number(appId),
      status: 'success',
    });

    // 8. 저장된 게임 정보 반환
    return NextResponse.json(
      {
        data: gameData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('게임 정보 조회 중 오류 발생:', error);

    // 에러 로그 기록 (appId가 유효한 경우에만)
    if (params.appId && !isNaN(Number(params.appId))) {
      await insertSteamGameSyncLog({
        app_id: Number(params.appId),
        status: 'failed',
        reason: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return NextResponse.json(
      {
        code: 'INTERNAL_ERROR',
        message: 'Internal Server Error',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
