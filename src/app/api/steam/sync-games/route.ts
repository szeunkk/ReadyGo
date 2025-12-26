import { NextResponse } from 'next/server';
import { syncSteamGames } from '@/services/steam/steamGame.service';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? 200);

  const result = await syncSteamGames(limit);

  return NextResponse.json(result);
}
