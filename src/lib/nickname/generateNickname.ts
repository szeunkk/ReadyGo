import { adjectives, animals } from './data';

// 배열에서 랜덤 1개 선택
const pickRandom = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// 글자 수
const charLength = (str: string): number => {
  return Array.from(str).length;
};

// 닉네임 생성
export const generateNickname = (maxLength: number = 8): string => {
  const MaxTry = 20;

  const nickname = Array.from({ length: MaxTry })
    .map(() => pickRandom(adjectives) + pickRandom(animals))
    .find((name) => charLength(name) <= maxLength);

  return nickname ?? 'Unknown';
};
