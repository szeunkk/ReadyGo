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
  extendedDescription: string;
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
    extendedDescription:
      '늑대 타입의 당신은 팀을 이끄는 강한 추진력과 리더십을 지닌 플레이어입니다. 상황이 주어지면 과감하게 전진하며 흐름을 만들어내고, 팀이 따라갈 수 있는 방향을 제시합니다. 협동도 가능하지만 결국 판을 움직이는 핵심 동력은 언제나 당신입니다.',
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
    description: ['판을 깨는 공격수', '빠르고 과감한 돌파형 플레이어'],
    extendedDescription:
      '호랑이 타입의 당신은 과감하고 단독 행동에 능한 공격적 플레이가 특징입니다. 빠른 판단과 높은 모험성으로 누구보다 먼저 치고 나가며 전장의 흐름을 폭발적으로 바꿉니다. 팀에 얽매이기보다는 스스로 기회를 만들고 해결하는 솔로 캐리형입니다.',
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
    description: ['한 방 노리는 딜러', '침착한 판단과 정확한 타이밍'],
    extendedDescription:
      '매 타입의 당신은 침착함과 관찰력, 정확한 판단을 바탕으로 한 방을 노리는 전략적 딜러입니다. 감정에 흔들리지 않고 분석을 통해 최적의 타이밍을 포착하며, 정확한 결정으로 팀의 승리에 기여합니다. 단독 플레이에서도 흔들림 없는 집중형입니다.',
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
    description: ['판을 읽는 전략가', '운영으로 승리를 설계하는 타입'],
    extendedDescription:
      '올빼미 타입의 당신은 게임의 큰 흐름을 읽고 장기적인 전략을 세우는 운영 장인입니다. 계산적인 선택과 안정적 플레이를 선호하며, 팀 전체의 승리 구조를 세밀하게 설계합니다. 눈앞의 싸움보다 전체 판을 바라보는 통찰력 있는 전략가입니다.',
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
    description: ['흐름 뒤집는 전략가', '눈치와 심리전에 강한 플레이'],
    extendedDescription:
      '여우 타입의 당신은 센스와 눈치, 심리전을 통해 흐름을 뒤집는 유연한 전술가입니다. 상대의 의도를 빠르게 파악해 허점을 파고들며, 예측 불가능한 움직임으로 변수를 만들어냅니다. 안정적이면서도 전략적인 플레이로 팀 전황을 변화시키는 타입입니다.',
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
    description: ['공략 파는 연구가', '최적화에 진심인 분석형 플레이어'],
    extendedDescription:
      '고슴도치 타입의 당신은 연구와 분석을 통해 정교한 플레이를 구성하는 학습형 게이머입니다. 공략의 완성도를 중시하며 깊이 파고드는 스타일로 높은 효율을 만들어냅니다. 팀플보다 독립적인 연구에서 강점을 발휘하는 최적화형 플레이어입니다.',
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
    description: ['패턴 읽는 관찰자', '계산적인 예측 플레이의 달인'],
    extendedDescription:
      '까마귀 타입의 당신은 뛰어난 관찰력과 계산 능력으로 판의 흐름을 읽어내는 예측형 플레이어입니다. 상대 패턴을 빠르게 분석해 실수를 최소화하며 안정적인 운영을 만들어냅니다. 조용하지만 정확한 판단으로 팀에 균형과 통찰을 더합니다.',
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
    extendedDescription:
      '곰 타입의 당신은 묵직한 안정감으로 팀을 든든하게 지켜주는 보호자형 스타일입니다. 모험보다는 생존과 유지력을 중심으로 플레이하며, 위기 상황에서도 쉽게 흔들리지 않습니다. 믿고 따라갈 수 있는 안정적 팀 플레이의 핵심 존재입니다.',
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
    description: ['흐름 잇는 힐러', '편안한 분위기의 안정형 플레이'],
    extendedDescription:
      '사슴 타입의 당신은 부드럽고 차분한 플레이로 팀 분위기를 안정시키는 힐러형입니다. 무리한 도전보다 팀의 편안함과 조화를 중요하게 여기며, 공격적인 상황에서도 마음의 여유를 유지합니다. 온화한 감성으로 팀의 긴장을 풀어주는 타입입니다.',
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
    extendedDescription:
      '코알라 타입의 당신은 경쟁보다 즐거움과 편안함을 우선하는 캐주얼 플레이어입니다. 함께 게임하는 사람들과의 대화를 좋아하고 여유로운 분위기를 만들어냅니다. 부담 없이 웃으며 즐기는 플레이에서 최고의 퍼포먼스를 발휘하는 타입입니다.',
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
    extendedDescription:
      '강아지 타입의 당신은 뛰어난 친화력과 소통 능력으로 팀 분위기를 밝게 만드는 플레이어입니다. 적극적인 교류를 통해 팀워크를 강화하고, 어떤 상황에서도 긍정적인 에너지를 유지합니다. 함께할 때 가장 즐거운 케미 메이커입니다.',
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
    description: ['텐션 올리는 파티러', '함께할수록 즐거운 플레이어'],
    extendedDescription:
      '돌고래 타입의 당신은 유쾌하고 활기찬 에너지로 파티 플레이에서 큰 시너지를 만드는 타입입니다. 높은 교류성과 밝은 텐션으로 팀 전체 분위기를 즉시 끌어올립니다. 함께할수록 즐거움이 배가되는 파티형 플레이어입니다.',
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
    description: ['잘 맞는 균형형', '편안하게 함께할 수 있는 타입'],
    extendedDescription:
      '판다 타입의 당신은 누구와도 편안하게 맞춰갈 수 있는 균형 잡힌 플레이 성향을 가졌습니다. 무리하지 않는 선택과 부드러운 교류 방식으로 팀에 조화를 이끌어냅니다. 안정성과 편안함을 동시에 추구하는 조화형 게이머입니다.',
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
    extendedDescription:
      '토끼 타입의 당신은 밝고 빠른 템포의 친화력을 바탕으로 분위기를 환하게 만드는 소셜러입니다. 새로운 사람들과도 금방 친해지고, 가볍고 유쾌한 에너지를 팀 전체로 확산시킵니다. 팀 시너지를 가장 빠르게 끌어올리는 활력형 플레이어입니다.',
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
    description: ['승부 집중 몰입형', '성능과 결과 중심'],
    extendedDescription:
      '표범 타입의 당신은 강한 몰입도와 집중력을 기반으로 실력과 성과를 중시하는 경쟁형 플레이어입니다. 과감한 공격과 단독 판단으로 승부처를 빠르게 장악하며, 성능 향상 자체를 즐깁니다. 솔로 플레이에서도 강한 존재감을 드러내는 타입입니다.',
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
    description: ['깊이 파고드는 전략가', '루트를 만드는 플레이'],
    extendedDescription:
      '고양이 타입의 당신은 조용하지만 깊이 있는 플레이로 자신만의 루트를 구축하는 독립형 전략가입니다. 상대 움직임을 세밀하게 파악하고 효율적인 선택을 추구하며, 혼자 있을 때 오히려 더 강점을 발휘합니다. 고독한 몰입 속에서 실력을 완성하는 타입입니다.',
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
