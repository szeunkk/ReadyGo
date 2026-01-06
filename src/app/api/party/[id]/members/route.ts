import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * 파티 참여
 * POST /api/party/[id]/members
 */
export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // 사용자 정보 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const postId = parseInt(params.id, 10);
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '유효하지 않은 파티 ID입니다.' },
        { status: 400 }
      );
    }

    // 파티 존재 확인
    const { data: partyData, error: fetchError } = await supabase
      .from('party_posts')
      .select('id, max_members, creator_id')
      .eq('id', postId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: '파티를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // 작성자는 이미 멤버이므로 중복 참여 방지
    if (partyData.creator_id === user.id) {
      return NextResponse.json(
        { error: '이미 파티의 작성자입니다.' },
        { status: 400 }
      );
    }

    // 이미 참여한 멤버인지 확인
    const { data: existingMember } = await supabase
      .from('party_members')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: '이미 참여한 파티입니다.' },
        { status: 400 }
      );
    }

    // 현재 참여자 수 확인
    const { count: currentMembers, error: countError } = await supabase
      .from('party_members')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // 최대 인원 확인
    if (currentMembers && currentMembers >= partyData.max_members) {
      return NextResponse.json(
        { error: '파티 인원이 가득 찼습니다.' },
        { status: 400 }
      );
    }

    // party_members에 추가
    const { data: insertData, error: insertError } = await supabase
      .from('party_members')
      .insert({
        post_id: postId,
        user_id: user.id,
        role: 'member',
        joined_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      // 중복 키 에러 처리 (unique constraint가 있는 경우)
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: '이미 참여한 파티입니다.' },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ data: insertData }, { status: 201 });
  } catch (error) {
    console.error('Party join API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
