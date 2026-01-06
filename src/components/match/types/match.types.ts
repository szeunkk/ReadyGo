/**
 * Match 컴포넌트에서 사용하는 타입 정의
 */

/**
 * 매칭 카드에 표시할 데이터
 *
 * 📌 필드:
 * - id: 화면 표시용 순번
 * - userId: 실제 사용자 ID (UUID)
 * - nickname: 사용자 닉네임
 * - matchRate: 매칭 점수 (0~100)
 * - status: 온라인 상태
 * - tags: 매칭 태그 목록
 * - avatarUrl: 아바타 이미지 URL (optional)
 */
export interface MatchData {
  id: number;
  userId: string;
  nickname: string;
  matchRate: number;
  status: 'online' | 'offline';
  tags: string[];
  avatarUrl?: string;
}
