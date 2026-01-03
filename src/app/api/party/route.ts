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
 * 파티 목록 조회
 * GET /api/party
 * 인증되지 않은 유저도 조회 가능
 */
export const GET = async (request: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    // 인증 토큰이 있으면 사용하고, 없으면 anon key만 사용
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : {},
    });

    // 쿼리 파라미터 처리
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // limit 기본값 10, offset 기본값 0
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

    let query = supabase
      .from('party_posts')
      .select('*')
      .order('created_at', { ascending: false });

    // range를 사용해서 페이징 처리 (limit과 함께 사용하면 충돌하므로 range만 사용)
    // range(from, to): from부터 to까지 (포함)
    query = query.range(offset, offset + limit - 1);

    const { data: partyList, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: partyList || [] });
  } catch (error) {
    console.error('Party list API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};

/**
 * 파티 생성
 * POST /api/party
 */
export const POST = async (request: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // session/route.ts와 동일한 패턴
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

    // 사용자 정보 확인 (session/route.ts와 동일한 패턴)
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

    // 요청 본문 파싱
    const body = await request.json();
    const {
      game_title: gameTitle,
      party_title: partyTitle,
      start_date: startDate,
      start_time: startTime,
      description,
      max_members: maxMembers,
      control_level: controlLevel,
      difficulty,
      voice_chat: voiceChat,
      tags,
    } = body;

    // 필수 필드 검증
    if (
      !gameTitle ||
      !partyTitle ||
      !startDate ||
      !startTime ||
      !description ||
      !maxMembers ||
      !controlLevel ||
      !difficulty
    ) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 파티 생성
    // 주의: party_posts 테이블에 status 컬럼이 없으므로 status 필드 제거
    const { data: insertData, error: insertError } = await supabase
      .from('party_posts')
      .insert({
        creator_id: user.id,
        game_title: gameTitle,
        party_title: partyTitle,
        start_date: startDate,
        start_time: startTime,
        description,
        max_members: maxMembers,
        control_level: controlLevel,
        difficulty,
        voice_chat: voiceChat || null,
        tags: tags || null,
        // status 컬럼이 없으므로 제거
        // status: 'recruiting',
      })
      .select('id')
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    if (!insertData || !insertData.id) {
      return NextResponse.json(
        { error: '파티 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { id: insertData.id } }, { status: 201 });
  } catch (error) {
    console.error('Party create API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
