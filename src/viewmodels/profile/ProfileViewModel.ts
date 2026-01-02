/**
 * 🎨 UI 전용 ViewModel - Profile
 *
 * 📌 책임 (Responsibility):
 * - UI 렌더링에 필요한 최소 필드만 포함
 * - ProfileCoreDTO와는 별개로 UI 계층 내부에서만 사용
 * - 컴포넌트 props, Hook 반환값 등에 적용
 *
 * 📌 Core DTO와의 차이:
 * - Core DTO는 API/Service/FE 공용 타입 (데이터 전송 중심)
 * - ViewModel은 UI 렌더링 관점으로 재구성 (화면 표시 중심)
 * - Core DTO를 직접 extends 또는 포함하지 않음
 *
 * ⚠️ 금지 사항:
 * - API Layer에서 사용 금지
 * - Service/Repository Layer에서 사용 금지
 * - Core DTO를 import하여 재노출(re-export) 금지
 */

import type { AnimalType } from '@/commons/constants/animal/animal.enum';
import type { TraitVector } from '@/commons/constants/animal/animal.vector';

/**
 * 플레이 스케줄 항목 (UI 전용)
 */
export interface PlayScheduleViewModel {
  dayType: string;
  timeSlot: string;
}

/**
 * ProfileViewModel
 *
 * UI에서 사용자 프로필을 렌더링하기 위한 전용 타입
 */
export interface ProfileViewModel {
  /**
   * 사용자 고유 ID (필수)
   */
  userId: string;

  /**
   * 닉네임 (선택)
   * UI에서 fallback 처리 필요
   */
  nickname?: string;

  /**
   * 동물 유형 (선택)
   * null: 특성 검사 미완료
   */
  animalType?: AnimalType | null;

  /**
   * 5가지 특성 벡터 (선택)
   * null: 특성 검사 미완료
   */
  traits?: TraitVector | null;

  /**
   * 플레이 스케줄 (선택)
   */
  schedule?: PlayScheduleViewModel[];
}
