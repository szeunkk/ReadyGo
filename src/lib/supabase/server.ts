import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import { Database } from '@/types/supabase';

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
            // Route Handler에서 쿠키 설정 확인 로그
            if (cookiesToSet.length > 0) {
              // eslint-disable-next-line no-console
              console.log('Supabase cookies set:', {
                count: cookiesToSet.length,
                names: cookiesToSet.map((c) => c.name),
              });
            }
          } catch (error) {
            // Route Handler에서는 에러가 발생하지 않아야 함
            console.error('Error setting cookies in Route Handler:', error);
            throw error;
          }
        },
      },
    }
  );
};
