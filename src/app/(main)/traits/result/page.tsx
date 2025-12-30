import { cookies } from 'next/headers';
import TraitsResultPage from '@/components/traits/traitsResultPage';
import {
  AnimalType,
  getAnimalTypeMeta,
  getAnimalCompatibility,
} from '@/commons/constants/animal';
import { URL_PATHS } from '@/commons/constants/url';
import { redirect } from 'next/navigation';

type TraitsResultApiResponse = {
  traits: {
    cooperation: number;
    exploration: number;
    strategy: number;
    leadership: number;
    social: number;
  };
  animalType: string;
  schedule: {
    dayTypes: string[];
    timeSlots: string[];
  };
};

const fetchTraitsResult = async (): Promise<TraitsResultApiResponse | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value || '';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/traits/result`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 401) {
        redirect(URL_PATHS.LOGIN);
      }
      return null;
    }

    const data: TraitsResultApiResponse = await res.json();
    return data;
  } catch {
    return null;
  }
};

export default async function Page() {
  const result = await fetchTraitsResult();

  if (!result) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '16px',
        }}
      >
        <p style={{ fontSize: '18px', fontWeight: 600 }}>
          성향 테스트 결과를 찾을 수 없습니다.
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          먼저 성향 테스트를 완료해주세요.
        </p>
      </div>
    );
  }

  const animalType = result.animalType as AnimalType;
  const animalMeta = getAnimalTypeMeta(animalType);
  const compatibility = getAnimalCompatibility(animalType);

  const radarData: {
    trait: 'cooperation' | 'exploration' | 'strategy' | 'leadership' | 'social';
    value: number;
  }[] = [
    { trait: 'cooperation', value: result.traits.cooperation },
    { trait: 'exploration', value: result.traits.exploration },
    { trait: 'strategy', value: result.traits.strategy },
    { trait: 'leadership', value: result.traits.leadership },
    { trait: 'social', value: result.traits.social },
  ];

  const matchTypes =
    compatibility?.bestMatches.map((type) => getAnimalTypeMeta(type).label) ||
    [];

  return (
    <TraitsResultPage
      animalType={animalType}
      nickname={animalMeta.label}
      radarData={radarData}
      mainRole={{
        label: animalMeta.mainRole.name,
        description: animalMeta.mainRole.description,
      }}
      subRole={{
        label: animalMeta.subRole.name,
        description: animalMeta.subRole.description,
      }}
      matchTypes={matchTypes}
      characteristics={animalMeta.checkSentences}
    />
  );
}
