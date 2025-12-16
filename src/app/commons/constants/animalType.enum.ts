/**
 * Animal Type Enum & Metadata
 * ReadyGo 게이머 매칭 플랫폼의 동물 타입 정의
 * 유저의 플레이 성향을 요약하는 결과 레이블
 */

// ============================================
// Trait Types (성향 키)
// ============================================

export type TraitKey =
  | 'cooperation'
  | 'exploration'
  | 'strategy'
  | 'leadership'
  | 'social';

// ============================================
// Animal Group Enum
// ============================================

export enum AnimalGroup {
  attack = 'attack',
  strategy = 'strategy',
  support = 'support',
  social = 'social',
  lone = 'lone',
}

// ============================================
// Animal Type Enum
// ============================================

export enum AnimalType {
  wolf = 'wolf',
  tiger = 'tiger',
  hawk = 'hawk',
  owl = 'owl',
  fox = 'fox',
  hedgehog = 'hedgehog',
  raven = 'raven',
  bear = 'bear',
  deer = 'deer',
  koala = 'koala',
  dog = 'dog',
  dolphin = 'dolphin',
  panda = 'panda',
  rabbit = 'rabbit',
  leopard = 'leopard',
  cat = 'cat',
}

// ============================================
// Animal Type Metadata Type
// ============================================

export type AnimalTypeMeta = {
  label: string;
  group: AnimalGroup;
  description: string[];
  dominantTraits: TraitKey[];
  secondaryTraits: TraitKey[];
  avoidTraits: TraitKey[];
  ui: {
    imageS: string;
    imageM: string;
  };
};

// ============================================
// Animal Type Metadata Object
// ============================================

export const animalTypeMeta = {
  // ========== attack 그룹 ==========
  [AnimalType.wolf]: {
    label: '늑대',
    group: AnimalGroup.attack,
    description: ['타고난 리더', '팀을 이끄는 카리스마와 강한 주도력'],
    dominantTraits: ['exploration', 'leadership'],
    secondaryTraits: ['cooperation', 'social'],
    avoidTraits: ['strategy'],
    ui: {
      imageS: '/images/wolf_s.svg',
      imageM: '/images/wolf_m.svg',
    },
  },
  [AnimalType.tiger]: {
    label: '호랑이',
    group: AnimalGroup.attack,
    description: ['혼자서 판을 깨는 공격수', '빠르고 과감한 돌파형 플레이어'],
    dominantTraits: ['exploration'],
    secondaryTraits: ['leadership'],
    avoidTraits: ['cooperation', 'strategy', 'social'],
    ui: {
      imageS: '/images/tiger_s.svg',
      imageM: '/images/tiger_m.svg',
    },
  },
  [AnimalType.hawk]: {
    label: '매',
    group: AnimalGroup.attack,
    description: ['한 방을 노리는 정밀 딜러', '침착한 판단과 정확한 타이밍'],
    dominantTraits: ['strategy'],
    secondaryTraits: ['exploration'],
    avoidTraits: ['cooperation', 'leadership', 'social'],
    ui: {
      imageS: '/images/hawk_s.svg',
      imageM: '/images/hawk_m.svg',
    },
  },

  // ========== strategy 그룹 ==========
  [AnimalType.owl]: {
    label: '올빼미',
    group: AnimalGroup.strategy,
    description: ['전체 판을 읽는 전략가', '운영으로 승리를 설계하는 타입'],
    dominantTraits: ['strategy'],
    secondaryTraits: ['leadership'],
    avoidTraits: ['cooperation', 'exploration', 'social'],
    ui: {
      imageS: '/images/owl_s.svg',
      imageM: '/images/owl_m.svg',
    },
  },
  [AnimalType.fox]: {
    label: '여우',
    group: AnimalGroup.strategy,
    description: ['센스로 흐름을 뒤집는 전략가', '눈치와 심리전에 강한 플레이'],
    dominantTraits: ['strategy'],
    secondaryTraits: ['cooperation', 'exploration', 'social'],
    avoidTraits: ['leadership'],
    ui: {
      imageS: '/images/fox_s.svg',
      imageM: '/images/fox_m.svg',
    },
  },
  [AnimalType.hedgehog]: {
    label: '고슴도치',
    group: AnimalGroup.strategy,
    description: ['혼자 공략을 파는 연구가', '최적화에 진심인 분석형 플레이어'],
    dominantTraits: ['strategy'],
    secondaryTraits: ['exploration'],
    avoidTraits: ['cooperation', 'leadership', 'social'],
    ui: {
      imageS: '/images/hedgehog_s.svg',
      imageM: '/images/hedgehog_m.svg',
    },
  },
  [AnimalType.raven]: {
    label: '까마귀',
    group: AnimalGroup.strategy,
    description: ['상대 패턴을 읽는 관찰자', '계산적인 예측 플레이의 달인'],
    dominantTraits: ['strategy'],
    secondaryTraits: ['cooperation'],
    avoidTraits: ['exploration', 'leadership', 'social'],
    ui: {
      imageS: '/images/raven_s.svg',
      imageM: '/images/raven_m.svg',
    },
  },

  // ========== support 그룹 ==========
  [AnimalType.bear]: {
    label: '곰',
    group: AnimalGroup.support,
    description: ['팀을 지켜주는 버팀목', '안정적인 보호와 든든한 팀플레이'],
    dominantTraits: ['cooperation'],
    secondaryTraits: ['strategy', 'leadership', 'social'],
    avoidTraits: ['exploration'],
    ui: {
      imageS: '/images/bear_s.svg',
      imageM: '/images/bear_m.svg',
    },
  },
  [AnimalType.deer]: {
    label: '사슴',
    group: AnimalGroup.support,
    description: ['차분하게 흐름을 잇는 힐러', '편안한 분위기의 안정형 플레이'],
    dominantTraits: ['cooperation'],
    secondaryTraits: ['social'],
    avoidTraits: ['exploration', 'strategy', 'leadership'],
    ui: {
      imageS: '/images/deer_s.svg',
      imageM: '/images/deer_m.svg',
    },
  },
  [AnimalType.koala]: {
    label: '코알라',
    group: AnimalGroup.support,
    description: ['편하게 즐기는 감성러', '웃으면서 게임하는 캐주얼 타입'],
    dominantTraits: ['social'],
    secondaryTraits: ['cooperation'],
    avoidTraits: ['exploration', 'strategy', 'leadership'],
    ui: {
      imageS: '/images/koala_s.svg',
      imageM: '/images/koala_m.svg',
    },
  },

  // ========== social 그룹 ==========
  [AnimalType.dog]: {
    label: '강아지',
    group: AnimalGroup.social,
    description: ['팀 분위기 메이커', '케미와 소통으로 판을 살리는 타입'],
    dominantTraits: ['cooperation', 'social'],
    secondaryTraits: ['exploration', 'leadership'],
    avoidTraits: ['strategy'],
    ui: {
      imageS: '/images/dog_s.svg',
      imageM: '/images/dog_m.svg',
    },
  },
  [AnimalType.dolphin]: {
    label: '돌고래',
    group: AnimalGroup.social,
    description: ['텐션을 끌어올리는 파티러', '함께할수록 즐거운 플레이어'],
    dominantTraits: ['cooperation', 'social'],
    secondaryTraits: ['exploration'],
    avoidTraits: ['strategy', 'leadership'],
    ui: {
      imageS: '/images/dolphin_s.svg',
      imageM: '/images/dolphin_m.svg',
    },
  },
  [AnimalType.panda]: {
    label: '판다',
    group: AnimalGroup.social,
    description: ['누구와도 잘 맞는 균형형', '편안하게 함께할 수 있는 타입'],
    dominantTraits: ['cooperation', 'social'],
    secondaryTraits: ['strategy'],
    avoidTraits: ['exploration', 'leadership'],
    ui: {
      imageS: '/images/panda_s.svg',
      imageM: '/images/panda_m.svg',
    },
  },
  [AnimalType.rabbit]: {
    label: '토끼',
    group: AnimalGroup.social,
    description: ['밝고 빠른 소셜러', '분위기를 가볍게 만드는 친화력 타입'],
    dominantTraits: ['social'],
    secondaryTraits: ['cooperation', 'exploration'],
    avoidTraits: ['strategy', 'leadership'],
    ui: {
      imageS: '/images/rabbit_s.svg',
      imageM: '/images/rabbit_m.svg',
    },
  },

  // ========== lone 그룹 ==========
  [AnimalType.leopard]: {
    label: '표범',
    group: AnimalGroup.lone,
    description: ['승부에 집중하는 몰입형 플레이어', '성능과 결과 중심'],
    dominantTraits: ['exploration'],
    secondaryTraits: ['strategy', 'leadership'],
    avoidTraits: ['cooperation', 'social'],
    ui: {
      imageS: '/images/leopard_s.svg',
      imageM: '/images/leopard_m.svg',
    },
  },
  [AnimalType.cat]: {
    label: '고양이',
    group: AnimalGroup.lone,
    description: ['혼자 깊게 파고드는 고독한 전략가', '루트를 만드는 플레이'],
    dominantTraits: ['strategy'],
    secondaryTraits: ['exploration'],
    avoidTraits: ['cooperation', 'leadership', 'social'],
    ui: {
      imageS: '/images/cat_s.svg',
      imageM: '/images/cat_m.svg',
    },
  },
} as const satisfies Record<AnimalType, AnimalTypeMeta>;

// ============================================
// Type Definitions & Utilities
// ============================================

export type AnimalTypeKey = keyof typeof animalTypeMeta;

/**
 * 모든 동물 타입 목록을 배열로 반환
 */
export const getAllAnimalTypes = (): AnimalType[] => {
  return Object.values(AnimalType);
};

/**
 * 특정 그룹에 속하는 동물 타입들을 반환
 */
export const getAnimalTypesByGroup = (group: AnimalGroup): AnimalType[] => {
  return Object.entries(animalTypeMeta)
    .filter(([_, meta]) => meta.group === group)
    .map(([type]) => type as AnimalType);
};

/**
 * 동물 타입의 메타데이터를 반환
 */
export const getAnimalTypeMeta = (type: AnimalType): AnimalTypeMeta => {
  return animalTypeMeta[type];
};
