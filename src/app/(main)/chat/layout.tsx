'use client';

import { ChatList } from '@/components/chat';

export default function ChatLayout({ room }: { room?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <ChatList />
      {room}
    </div>
  );
}
