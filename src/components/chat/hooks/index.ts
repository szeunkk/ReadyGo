// components/chat/hooks/index.ts
// chat 관련 custom hooks를 여기에 export합니다.

export {
  useChatRoom,
  type UseChatRoomProps,
  type UseChatRoomReturn,
  type FormattedMessageItem,
  type FormattedOtherMemberInfo,
} from './useChatRoom.hook';

export {
  useChatList,
  type UseChatListProps,
  type UseChatListReturn,
  type FormattedChatRoomItem,
} from './useChatList.hook';

export {
  useChatRoomInput,
  type UseChatRoomInputProps,
  type UseChatRoomInputReturn,
} from './useChatRoomInput.hook';
