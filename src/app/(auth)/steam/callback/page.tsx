import SteamCallback from '@/components/auth/steam-callback';

interface SteamCallbackPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function SteamCallbackPage({
  searchParams,
}: SteamCallbackPageProps) {
  // searchParams를 일반 객체로 변환
  const openIdParams: Record<string, string> = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      openIdParams[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      const [firstValue] = value;
      openIdParams[key] = firstValue;
    }
  });

  return <SteamCallback initialParams={openIdParams} />;
}
