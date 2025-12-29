import ChatRoom from '@/components/chat/ui/chat-room/chatRoom';

interface ChatRoomPageProps {
  params: {
    roomId: string;
  };
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  return <ChatRoom roomId={params.roomId} />;
}
