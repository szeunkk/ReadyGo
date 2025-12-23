import OverlayContainer from '@/commons/components/overlay';
import Notifications from '@/components/overlay/notifications/ui';
import { mockNotifications } from '../constants/mockData';

interface LayoutOverlaysProps {
  currentOverlay: string | null;
  onClose: () => void;
}

export const LayoutOverlays = ({
  currentOverlay,
  onClose,
}: LayoutOverlaysProps) => {
  if (currentOverlay === 'notifications') {
    return (
      <OverlayContainer onClose={onClose}>
        <Notifications
          notifications={mockNotifications}
          onMarkAllAsRead={() => {
            // TODO: 모두 읽음 처리 로직 구현
          }}
          onNotificationClick={() => {
            // TODO: 알림 클릭 처리 로직 구현
          }}
        />
      </OverlayContainer>
    );
  }

  if (currentOverlay === 'friends') {
    return (
      <OverlayContainer onClose={onClose}>
        <div style={{ padding: '24px' }}>
          {/* TODO: Friends 컴포넌트 구현 */}
          <h2>Friends (준비 중)</h2>
        </div>
      </OverlayContainer>
    );
  }

  return null;
};
