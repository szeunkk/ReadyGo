import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * 서버 컴포넌트용 Supabase 클라이언트 (SSR 표준)
 *
 * - 쿠키 기반 세션 자동 관리
 * - Server Component, Server Action, Route Handler에서 사용
 * - 쿠키를 통해 인증 상태 유지
 */
export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server Component에서는 set이 실패할 수 있음
          // Route Handler나 Server Action에서만 쿠키 설정 가능
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // Server Component에서는 remove가 실패할 수 있음
          // Route Handler나 Server Action에서만 쿠키 삭제 가능
        }
      },
    },
  });
};
