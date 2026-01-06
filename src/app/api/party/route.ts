import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';

type PartyPost = Database['public']['Tables']['party_posts']['Row'];

/**
 * 파티 목록 조회
 * GET /api/party
 * 인증되지 않은 유저도 조회 가능
 */
export const GET = async (request: NextRequest) => {
  try {
    // Supabase SSR 클라이언트 생성 (쿠키 자동 처리)
    const supabase = createClient();

    // 쿼리 파라미터 처리
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const genreParam = searchParams.get('genre'); // 장르 필터 파라미터
    const searchParam = searchParams.get('search'); // 검색어 파라미터
    const tabParam = searchParams.get('tab'); // 탭 파라미터 ('all' | 'participating')

    // limit 기본값 10, offset 기본값 0
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;
    const tab = tabParam === 'participating' ? 'participating' : 'all';

    // 현재 로그인한 유저 정보 확인 (참여 중인 파티 탭인 경우 필요)
    let currentUserId: string | null = null;
    if (tab === 'participating') {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        // 로그인하지 않은 경우 빈 목록 반환
        return NextResponse.json({ data: [] });
      }

      currentUserId = user.id;
    }

    // 1단계: party_posts 조회
    // 참여 중인 파티 탭인 경우: party_members에서 현재 유저가 참여한 post_id만 조회
    let allPartyPosts: PartyPost[] = [];

    if (tab === 'participating' && currentUserId) {
      // party_members에서 현재 유저가 참여한 post_id 조회
      const { data: partyMembers, error: membersError } = await supabase
        .from('party_members')
        .select('post_id')
        .eq('user_id', currentUserId);

      if (membersError) {
        console.error('party_members 조회 실패:', membersError);
        return NextResponse.json({ data: [] });
      }

      if (!partyMembers || partyMembers.length === 0) {
        return NextResponse.json({ data: [] });
      }

      // 참여한 post_id 목록 추출
      const postIds = partyMembers
        .map((m) => m.post_id)
        .filter((id): id is number => id !== null);

      if (postIds.length === 0) {
        return NextResponse.json({ data: [] });
      }

      // 해당 post_id에 해당하는 party_posts 조회
      const { data: posts, error: partyError } = await supabase
        .from('party_posts')
        .select('*')
        .in('id', postIds)
        .order('created_at', { ascending: false });

      if (partyError) {
        return NextResponse.json(
          { error: partyError.message },
          { status: 500 }
        );
      }

      allPartyPosts = posts || [];
    } else {
      // 전체 파티 탭: 모든 party_posts 조회
      const partyQuery = supabase
        .from('party_posts')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: posts, error: partyError } = await partyQuery;

      if (partyError) {
        return NextResponse.json(
          { error: partyError.message },
          { status: 500 }
        );
      }

      allPartyPosts = posts || [];
    }

    if (!allPartyPosts || allPartyPosts.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 2단계: steam_game_info 조회 및 매칭
    // game_title 목록 추출 (중복 제거)
    const uniqueGameTitles = Array.from(
      new Set(allPartyPosts.map((post) => post.game_title).filter(Boolean))
    );

    // steam_game_info 전체 조회 (성능 최적화: 한 번의 쿼리)
    // 부분 일치를 위해 모든 게임 정보를 조회하고 메모리에서 매칭
    const { data: allGameInfos, error: gameError } = await supabase
      .from('steam_game_info')
      .select('name, genres')
      .not('name', 'is', null);

    if (gameError) {
      console.error('steam_game_info 조회 실패:', gameError);
      // 게임 정보 조회 실패해도 파티 목록은 반환 (NULL 처리)
    }

    // game_title과 steam_game_info.name을 부분 일치로 매칭하는 맵 생성
    const gameInfoMap = new Map<
      string,
      { name: string; genres: string[] | null }
    >();

    if (allGameInfos) {
      for (const gameTitle of uniqueGameTitles) {
        // 부분 일치 검색: game_title이 steam_game_info.name에 포함되거나,
        // steam_game_info.name이 game_title에 포함되는 경우
        const matchedGame = allGameInfos.find((gameInfo) => {
          if (!gameInfo.name) {
            return false;
          }
          const gameTitleLower = gameTitle.toLowerCase();
          const gameNameLower = gameInfo.name.toLowerCase();
          // 부분 일치: 양방향 검사
          return (
            gameNameLower.includes(gameTitleLower) ||
            gameTitleLower.includes(gameNameLower)
          );
        });

        if (matchedGame && matchedGame.name) {
          gameInfoMap.set(gameTitle, {
            name: matchedGame.name,
            genres: matchedGame.genres,
          });
        }
      }
    }

    // 3단계: 필터링 적용
    let filteredPartyPosts = allPartyPosts;

    // 검색 필터 적용
    if (searchParam && searchParam.trim()) {
      const searchLower = searchParam.trim().toLowerCase();
      filteredPartyPosts = filteredPartyPosts.filter((post) => {
        // party_posts.game_title에서 검색
        if (post.game_title?.toLowerCase().includes(searchLower)) {
          return true;
        }
        // steam_game_info.name에서 검색
        const gameInfo = gameInfoMap.get(post.game_title);
        if (gameInfo?.name?.toLowerCase().includes(searchLower)) {
          return true;
        }
        return false;
      });
    }

    // 장르 필터 적용
    if (genreParam && genreParam !== 'all') {
      filteredPartyPosts = filteredPartyPosts.filter((post) => {
        const gameInfo = gameInfoMap.get(post.game_title);
        // steam_game_info에 해당 게임이 없거나 genres가 NULL이면 필터링에서 제외하지 않음
        // (NULL 처리: 게임 정보가 없어도 파티는 표시)
        if (!gameInfo || !gameInfo.genres) {
          return false; // 장르 정보가 없으면 해당 장르 필터에서는 제외
        }
        // genres 배열에 선택한 장르가 포함되어 있는지 확인
        return gameInfo.genres.includes(genreParam);
      });
    }

    // 4단계: 정렬 및 페이징
    // created_at 기준으로 다시 정렬 (필터링 후에도 정렬 유지)
    filteredPartyPosts.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // 내림차순
    });

    // 페이징 적용
    const paginatedPosts = filteredPartyPosts.slice(offset, offset + limit);

    return NextResponse.json({ data: paginatedPosts });
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
    // Supabase SSR 클라이언트 생성 (쿠키 자동 처리)
    const supabase = createClient();

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

    // party_members 테이블에 작성자를 leader로 자동 추가
    const { error: memberError } = await supabase.from('party_members').insert({
      post_id: insertData.id,
      user_id: user.id,
      role: 'leader',
      joined_at: new Date().toISOString(),
    });

    if (memberError) {
      console.error('Failed to add creator to party_members:', memberError);
      return NextResponse.json(
        { error: '파티 멤버 추가에 실패했습니다.' },
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
