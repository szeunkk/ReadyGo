import { NextResponse } from 'next/server';
import { syncSteamGames } from '@/services/steam/steamGame.service';

export const POST = async (req: Request) => {
  // const secret = req.headers.get('x-cron-secret');
  // if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? 200);

  const result = await syncSteamGames(limit);

  return NextResponse.json(result);
};
