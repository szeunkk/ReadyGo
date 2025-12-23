import OverlayContainer from '@/commons/components/overlay';
import Notifications from '@/components/overlay/notifications/ui';
import { FriendsContainer } from '@/components/overlay/friends';
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
        <FriendsContainer />
      </OverlayContainer>
    );
  }

  return null;
};
