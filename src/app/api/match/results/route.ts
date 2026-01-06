import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateMatchResults } from '@/services/match/calculateMatchResults.service';
import { findByUserId } from '@/repositories/userProfiles.repository';
import { findByUserIds } from '@/repositories/userStatus.repository';
import { getAvatarImagePath } from '@/lib/avatar/getAvatarImagePath';

/**
 * GET /api/match/results
 * 
 * 현재 로그인한 사용자의 매칭 결과를 조회합니다.
 * 프로필 정보와 상태 정보를 포함하여 반환합니다.
 * 
 * @returns 매칭 결과 배열 (프로필 및 상태 정보 포함)
 */
export async function GET() {
  try {
    // 1. 서버 사이드 Supabase 클라이언트 생성 (쿠키에서 세션 자동 로드)
    const supabase = createClient();

    // 2. 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 3. 매칭 결과 계산
    const results = await calculateMatchResults(supabase, user.id);

    // 4. 모든 target 사용자의 프로필 및 상태 정보 조회
    const userIds = results.map((result) => result.targetUserId);
    
    // 상태 정보 조회 (병렬)
    const statusResponse = await findByUserIds(supabase, userIds);
    
    // status를 Map으로 변환 (빠른 조회)
    const statusMap = new Map<string, 'online' | 'away' | 'dnd' | 'offline'>();
    if (statusResponse.data) {
      statusResponse.data.forEach((status) => {
        statusMap.set(status.user_id, status.status);
      });
    }

    // 5. 프로필 정보 조회 및 데이터 조합
    const enrichedResults = await Promise.all(
      results.map(async (result) => {
        const { data: profile } = await findByUserId(
          supabase,
          result.targetUserId
        );

        // 아바타 경로 계산
        const avatarUrl = getAvatarImagePath(
          profile?.avatar_url,
          profile?.animal_type
        );

        // 실제 상태 가져오기
        const status = statusMap.get(result.targetUserId) || 'offline';

        return {
          ...result,
          profile: {
            nickname: profile?.nickname || '알 수 없음',
            avatarUrl,
            animalType: profile?.animal_type,
          },
          status,
        };
      })
    );

    // 6. 결과 반환
    return NextResponse.json({ results: enrichedResults });
  } catch (error) {
    console.error('[API] Error fetching match results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

