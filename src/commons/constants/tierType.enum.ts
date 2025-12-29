/**
 * Tier Type Enum & Metadata
 * ReadyGo 게이머 매칭 플랫폼의 티어 정의
 * 유저의 게임 실력을 나타내는 등급 레이블
 */

// ============================================
// Tier Type Enum
// ============================================

export enum TierType {
  bronze = 'bronze',
  silver = 'silver',
  gold = 'gold',
  platinum = 'platinum',
  diamond = 'diamond',
  master = 'master',
  champion = 'champion',
}

// ============================================
// Tier Type Metadata Type
// ============================================

export type TierTypeMeta = {
  label: string;
  ui: {
    iconS: string;
    iconM: string;
  };
};

// ============================================
// Tier Type Metadata Object
// ============================================

export const tierTypeMeta = {
  [TierType.bronze]: {
    label: '브론즈',
    ui: {
      iconS: '/icons/bronze_s.svg',
      iconM: '/icons/bronze_m.svg',
    },
  },
  [TierType.silver]: {
    label: '실버',
    ui: {
      iconS: '/icons/silver_s.svg',
      iconM: '/icons/silver_m.svg',
    },
  },
  [TierType.gold]: {
    label: '골드',
    ui: {
      iconS: '/icons/gold_s.svg',
      iconM: '/icons/gold_m.svg',
    },
  },
  [TierType.platinum]: {
    label: '플래티넘',
    ui: {
      iconS: '/icons/platinum_s.svg',
      iconM: '/icons/platinum_m.svg',
    },
  },
  [TierType.diamond]: {
    label: '다이아',
    ui: {
      iconS: '/icons/diamond_s.svg',
      iconM: '/icons/diamond_m.svg',
    },
  },
  [TierType.master]: {
    label: '마스터',
    ui: {
      iconS: '/icons/master_s.svg',
      iconM: '/icons/master_m.svg',
    },
  },
  [TierType.champion]: {
    label: '챌린저',
    ui: {
      iconS: '/icons/champion_s.svg',
      iconM: '/icons/champion_m.svg',
    },
  },
} as const satisfies Record<TierType, TierTypeMeta>;

// ============================================
// Type Definitions & Utilities
// ============================================

export type TierTypeKey = keyof typeof tierTypeMeta;

/**
 * 모든 티어 타입 목록을 배열로 반환
 */
export const getAllTierTypes = (): TierType[] => {
  return Object.values(TierType);
};

/**
 * 티어 타입의 메타데이터를 반환
 */
export const getTierTypeMeta = (type: TierType): TierTypeMeta => {
  return tierTypeMeta[type];
};

/**
 * 티어의 순위를 반환 (낮을수록 높은 티어)
 */
export const getTierRank = (type: TierType): number => {
  const rankMap: Record<TierType, number> = {
    [TierType.bronze]: 7,
    [TierType.silver]: 6,
    [TierType.gold]: 5,
    [TierType.platinum]: 4,
    [TierType.diamond]: 3,
    [TierType.master]: 2,
    [TierType.champion]: 1,
  };
  return rankMap[type];
};

/**
 * 두 티어를 비교 (a가 b보다 높으면 양수, 같으면 0, 낮으면 음수)
 */
export const compareTiers = (a: TierType, b: TierType): number => {
  return getTierRank(b) - getTierRank(a);
};
