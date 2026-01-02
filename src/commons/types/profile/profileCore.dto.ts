/**
 * ❗ Single Source of Truth - Profile Core DTO
 *
 * 📌 영향 범위 (Change Impact Scope):
 * - API Layer: /api/user/*, /api/profile/*
 * - Service Layer: userProfiles.repository.ts, userTraits.repository.ts, userPlaySchedules.repository.ts
 * - Frontend Layer: ProfileSection, ProfilePanel, AnimalCard 등 프로필 표시 컴포넌트
 *
 * 📌 책임 (Responsibility):
 * - 사용자 프로필의 핵심 정보만 포함 (내 프로필 / 상대 프로필 공통)
 * - Steam/외부 플랫폼/인증 관련 필드는 절대 포함하지 않음
 * - DB 테이블과 1:1 매핑 가능한 구조 유지
 *
 * 📌 데이터 소스 (Data Source):
 * - user_profiles: nickname, animal_type
 * - user_traits: cooperation, exploration, strategy, leadership, social
 * - user_play_schedules: day_type, time_slot
 */

import type { AnimalType } from '@/commons/constants/animal/animal.enum';
import type { TraitVector } from '@/commons/constants/animal/animal.vector';

/**
 * 플레이 스케줄 항목
 *
 * DB 테이블: user_play_schedules
 * - day_type: 요일 구분 (예: 'weekday', 'weekend', 'everyday')
 * - time_slot: 시간대 (예: '00-06', '06-12', '12-18', '18-24')
 */
export interface PlayScheduleItem {
  dayType: string;
  timeSlot: string;
}

/**
 * ProfileCoreDTO
 *
 * 내 프로필과 상대 프로필 모두에서 재사용 가능한 핵심 프로필 데이터
 *
 * 📌 필수 필드 정책:
 * - userId: 항상 존재 (auth.user.id 기준)
 * - nickname: DB null 가능하지만 UI에서는 fallback 처리 ('익명 사용자' 등)
 *
 * 📌 선택 필드 정책:
 * - animalType: 특성 검사 미완료 시 null (UI에서 '미정' 표시)
 * - traits: 특성 검사 미완료 시 null (UI에서 차트 숨김 또는 placeholder 표시)
 * - schedule: 플레이 시간 미설정 시 undefined 또는 빈 배열 (UI에서 '설정 안 됨' 표시)
 *
 * 📌 타입 규칙:
 * - `field?: T | null` 형태로 명시: DB null 가능 + optional fetch
 * - 배열은 `T[] | undefined` 형태: 데이터 없을 때 undefined, 있으면 빈 배열이라도 []
 *
 * 📌 사용 예시:
 * ```typescript
 * // API Response
 * const profile: ProfileCoreDTO = {
 *   userId: 'uuid-1234',
 *   nickname: '게이머호랑이',
 *   animalType: AnimalType.tiger,
 *   traits: { cooperation: 58, exploration: 85, ... },
 *   schedule: [{ dayType: 'weekday', timeSlot: '18-24' }]
 * };
 *
 * // UI에서 사용
 * <ProfileSection
 *   nickname={profile.nickname || '익명 사용자'}
 *   animal={profile.animalType ?? AnimalType.rabbit}
 *   radarData={profile.traits ? convertToRadarData(profile.traits) : []}
 * />
 * ```
 */
export interface ProfileCoreDTO {
  /**
   * 사용자 고유 ID (UUID)
   *
   * 필수 필드
   * DB: user_profiles.id (PK)
   */
  userId: string;

  /**
   * 닉네임
   *
   * 선택 필드 (UI 레벨에서 fallback 처리)
   * DB: user_profiles.nickname (nullable)
   *
   * - DB에서 null일 경우: undefined로 반환
   * - Service는 기본값 자동 생성하지 않음
   * - UI에서 fallback 값 제공 (예: '익명 사용자', 'User#{랜덤숫자}')
   */
  nickname?: string;

  /**
   * 동물 유형 (특성 검사 결과)
   *
   * 선택 필드
   * DB: user_profiles.animal_type (nullable)
   *
   * - null: 특성 검사 미완료
   * - 값 존재: 특성 검사 완료 (AnimalType enum 값)
   *
   * UI 정책:
   * - null일 경우: '특성 분석 중' 또는 기본 아이콘 표시
   */
  animalType?: AnimalType | null;

  /**
   * 5가지 특성 벡터 (플레이 스타일)
   *
   * 선택 필드
   * DB: user_traits (cooperation, exploration, strategy, leadership, social)
   *
   * - null: 특성 검사 미완료 또는 데이터 없음
   * - 값 존재: 5개 trait 모두 포함 (각 0~100 범위)
   *
   * UI 정책:
   * - null일 경우: 레이더 차트 숨김 또는 placeholder 표시
   * - 값 존재 시: RadarChart로 시각화
   */
  traits?: TraitVector | null;

  /**
   * 플레이 스케줄 (요일별 시간대)
   *
   * 선택 필드
   * DB: user_play_schedules (day_type, time_slot)
   *
   * - undefined: 데이터 fetch 안 함 또는 설정 안 됨
   * - []: 설정했지만 빈 값 (모든 시간 가능 또는 미정)
   * - [{...}]: 설정된 스케줄 존재
   *
   * UI 정책:
   * - undefined/[]: '플레이 시간 미설정' 표시
   * - 값 존재: '주중 18-24시', '주말 12-18시' 등으로 표시
   */
  schedule?: PlayScheduleItem[];
}

/**
 * 📌 사용 가이드 (Usage Guide)
 *
 * 1. API Layer에서 사용:
 * ```typescript
 * export async function GET(request: Request) {
 *   const profile = await getProfileCore(userId);
 *   return Response.json(profile satisfies ProfileCoreDTO);
 * }
 * ```
 *
 * 2. Service/Repository Layer에서 사용:
 * ```typescript
 * export async function getProfileCore(userId: string): Promise<ProfileCoreDTO> {
 *   const [profile, traits, schedules] = await Promise.all([
 *     supabase.from('user_profiles').select('nickname, animal_type').eq('id', userId).single(),
 *     supabase.from('user_traits').select('*').eq('user_id', userId).maybeSingle(),
 *     supabase.from('user_play_schedules').select('day_type, time_slot').eq('user_id', userId),
 *   ]);
 *
 *   return {
 *     userId,
 *     nickname: profile.nickname || `User#${userId.slice(0, 6)}`,
 *     animalType: profile.animal_type as AnimalType | null,
 *     traits: traits ? {
 *       cooperation: traits.cooperation,
 *       exploration: traits.exploration,
 *       strategy: traits.strategy,
 *       leadership: traits.leadership,
 *       social: traits.social,
 *     } : null,
 *     schedule: schedules.map(s => ({
 *       dayType: s.day_type,
 *       timeSlot: s.time_slot,
 *     })),
 *   };
 * }
 * ```
 *
 * 3. Frontend Component에서 사용:
 * ```typescript
 * interface ProfileSectionProps {
 *   profile: ProfileCoreDTO;
 * }
 *
 * export function ProfileSection({ profile }: ProfileSectionProps) {
 *   return (
 *     <AnimalCard
 *       nickname={profile.nickname}
 *       animal={profile.animalType ?? AnimalType.rabbit}
 *     />
 *   );
 * }
 * ```
 */
