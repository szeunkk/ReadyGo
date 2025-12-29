'use client';

import { ChatList } from '@/components/chat';
import ChatNull from '@/components/chat/ui/chat-null/chatNull';

export default function ChatLayout({ room }: { room: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <ChatList />
      {room || <ChatNull />}
    </div>
  );
}
