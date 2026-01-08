import type { Database } from '@/types/supabase';

type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

/**
 * 메시지 시간 포맷팅 함수
 */
export const formatMessageTime = (dateString: string | null): string => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';
  const displayHours = hours % 12 || 12;
  const timeString = `${ampm} ${displayHours}:${minutes
    .toString()
    .padStart(2, '0')}`;

  return timeString;
};

/**
 * 날짜 구분선 포맷팅 함수
 */
export const formatDateDivider = (dateString: string | null): string => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  const weekdays = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  const weekday = weekdays[date.getDay()];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekday}`;
};

/**
 * 날짜가 변경되었는지 확인하는 함수
 */
export const isNewDate = (
  currentDate: string | null,
  previousDate: string | null
): boolean => {
  if (!currentDate || !previousDate) {
    return true;
  }

  const current = new Date(currentDate);
  const previous = new Date(previousDate);

  return (
    current.getFullYear() !== previous.getFullYear() ||
    current.getMonth() !== previous.getMonth() ||
    current.getDate() !== previous.getDate()
  );
};

/**
 * 연속된 메시지인지 확인하는 함수 (하위 호환성)
 */
export const isConsecutiveMessage = (
  currentMessage: ChatMessage,
  previousMessage: ChatMessage | null
): boolean => {
  if (!previousMessage) {
    return false;
  }
  return (
    currentMessage.sender_id === previousMessage.sender_id &&
    currentMessage.content_type !== 'system'
  );
};

/**
 * 같은 시간(시, 분)에 전송된 메시지인지 확인하는 함수
 */
export const isSameTimeGroup = (
  currentMessage: ChatMessage,
  previousMessage: ChatMessage | null
): boolean => {
  if (!previousMessage) {
    return false;
  }

  // 같은 발신자이고 시스템 메시지가 아니어야 함
  if (
    currentMessage.sender_id !== previousMessage.sender_id ||
    currentMessage.content_type === 'system' ||
    previousMessage.content_type === 'system'
  ) {
    return false;
  }

  // 시간(시, 분) 비교
  if (!currentMessage.created_at || !previousMessage.created_at) {
    return false;
  }

  const currentDate = new Date(currentMessage.created_at);
  const previousDate = new Date(previousMessage.created_at);

  return (
    currentDate.getHours() === previousDate.getHours() &&
    currentDate.getMinutes() === previousDate.getMinutes()
  );
};

/**
 * 메시지 내용 포맷팅 함수
 */
export const formatMessageContent = (message: ChatMessage | null): string => {
  if (!message) {
    return '메시지가 없습니다';
  }

  const { content, content_type: contentType } = message;

  if (content === null) {
    return '메시지가 없습니다';
  }

  if (contentType === 'image') {
    return '📷 이미지';
  }

  if (contentType === 'system') {
    return content;
  }

  return content;
};

