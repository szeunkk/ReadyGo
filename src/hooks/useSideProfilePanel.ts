import { useSidePanelStore } from '@/stores/sidePanel.store';

/**
 * 사이드 프로필 패널을 제어하는 Hook
 *
 * 사용자 프로필을 사이드 패널에서 열고 닫는 기능을 제공합니다.
 *
 * @returns {object} 프로필 패널 제어 함수 및 상태
 * @returns {boolean} isOpen - 현재 패널이 열려있는지 여부
 * @returns {string | undefined} targetUserId - 현재 열린 프로필의 사용자 ID
 * @returns {function} openProfile - 특정 사용자의 프로필 패널을 엽니다
 * @returns {function} closeProfile - 현재 열린 프로필 패널을 닫습니다
 * @returns {function} toggleProfile - 프로필 패널을 토글합니다 (같은 userId면 닫고, 다르면 해당 프로필을 엽니다)
 *
 * @example
 * // 기본 사용법
 * const { toggleProfile, isOpen, targetUserId } = useSideProfilePanel();
 *
 * // 특정 사용자가 현재 열린 프로필인지 확인
 * const isActive = isOpen && targetUserId === userId;
 *
 * // 버튼 클릭 시 프로필 토글
 * <Button onClick={() => toggleProfile(userId)}>
 *   {isActive ? '프로필 닫기' : '프로필 보기'}
 * </Button>
 */
export const useSideProfilePanel = () => {
  const { isOpen, targetUserId, open, close } = useSidePanelStore();

  const openProfile = (userId: string) => {
    open(userId);
  };

  const closeProfile = () => {
    close();
  };

  const toggleProfile = (userId: string) => {
    if (isOpen && targetUserId === userId) {
      close();
    } else {
      open(userId);
    }
  };

  return {
    isOpen,
    targetUserId,
    openProfile,
    closeProfile,
    toggleProfile,
  };
};
