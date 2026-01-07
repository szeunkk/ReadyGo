import { supabaseAdmin } from '@/lib/supabase/admin';

export type SteamCategoryJson = { id: number; label: string };

export type SteamGameUpsertInput = {
  app_id: number;
  name: string;
  short_description: string | null;
  header_image: string | null;
  genres: string[];
  categories: SteamCategoryJson[];
};

export const upsertSteamGame = async (input: SteamGameUpsertInput) => {
  const { error } = await supabaseAdmin
    .from('steam_game_info')
    .upsert(input, { onConflict: 'app_id' });

  if (error) {
    throw error;
  }
};
