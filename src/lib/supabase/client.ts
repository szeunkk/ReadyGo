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
 * - OAuth PKCE를 위한 localStorage 사용
 * - 세션은 API를 통해서만 관리 (AuthProvider 참조)
 */
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      // ✅ OAuth PKCE를 위해 localStorage 사용 (code_verifier 저장)
      persistSession: true,
      // ✅ 자동 토큰 갱신 비활성화 (API에서 처리)
      autoRefreshToken: false,
      // ✅ 세션 감지 비활성화 (서버에서 처리)
      detectSessionInUrl: false,
    },
  }
);
