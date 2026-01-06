import type { Database } from '@/types/supabase';

/**
 * 채팅 관련 공통 타입 정의
 */
export type ChatRoom = Database['public']['Tables']['chat_rooms']['Row'];
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];


