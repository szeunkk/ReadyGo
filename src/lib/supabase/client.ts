import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * 브라우저용 Supabase 클라이언트 (SSR 표준)
 *
 * - 쿠키 기반 세션 자동 관리
 * - Realtime (Broadcast, Presence, Postgres Changes) 지원
 * - localStorage 대신 쿠키 사용
 */
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
