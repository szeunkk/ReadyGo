import { generateNickname } from '@/lib/nickname/generateNickname';

export default function Home() {
  return <>readygo{generateNickname()}</>;
}
