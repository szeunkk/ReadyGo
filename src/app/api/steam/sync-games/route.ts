// POST /api/steam/sync-games?limit=200

import { NextResponse } from 'next/server';
import { syncSteamGames } from '@/services/steam/steamGame.service';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get('limit') ?? '200');

  const result = await syncSteamGames(Number.isFinite(limit) ? limit : 200);
  return NextResponse.json(result);
}
