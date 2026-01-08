// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Supabase Admin Client
 *
 * ⚠️ WARNING
 * - Service Role Key 사용
 * - RLS 완전 우회
 * - 일반 API Route / 사용자 요청에서 사용 금지
 *
 * 사용 허용 예:
 * - CRON jobs
 * - Steam API 동기화
 * - 서버 내부 배치 작업
 */

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Supabase Admin Client: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
  );
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
    },
  }
);
