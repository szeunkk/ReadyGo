// import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// HttpOnly 쿠키 방식 사용으로 localStorage 저장 비활성화
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false, // localStorage에 세션 저장 비활성화
      autoRefreshToken: false, // 서버에서 토큰 갱신 관리
      detectSessionInUrl: true, // OAuth 콜백 후 URL에서 세션 감지 (필수)
    },
  }
);
