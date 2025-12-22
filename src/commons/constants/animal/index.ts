/**
 * Animal Constants Barrel Export
 * 동물 타입 관련 모든 상수 및 유틸리티 통합 export
 */

// ============================================
// Enums & Types
// ============================================
export { AnimalType, AnimalGroup, getAllAnimalTypes } from './animal.enum';
export { type TraitKey, traitLabels, radarTraitLabels } from './trait.enum';
export type { RadarTraitKey } from './trait.enum';

// ============================================
// Profile Data
// ============================================
export {
  type AnimalProfile,
  animalProfiles,
  getAnimalProfile,
  getAnimalTypesByGroup,
} from './animal.profile';

// ============================================
// Copy Data
// ============================================
export {
  type AnimalCopy,
  animalCopies,
  getAnimalCopy,
} from './animal.copy';

// ============================================
// Assets Data
// ============================================
export {
  type AnimalAssets,
  animalAssets,
  getAnimalAssets,
} from './animal.assets';

// ============================================
// Compatibility Data
// ============================================
export {
  type AnimalCompatibility,
  animalCompatibilities,
  getAnimalCompatibility,
  getCompatibilityLevel,
} from './animal.compat';

// ============================================
// Combined Type (기존 호환성)
// ============================================

/**
 * 기존 AnimalTypeMeta와 호환되는 통합 타입
 */
export type AnimalTypeMeta = {
  label: string;
  group: AnimalGroup;
  description: string[];
  extendedDescription: string;
  dominantTraits: TraitKey[];
  secondaryTraits: TraitKey[];
  avoidTraits: TraitKey[];
  mainRole: {
    name: string;
    description: string;
  };
  subRole: {
    name: string;
    description: string;
  };
  checkSentences: string[];
  ui: {
    imageS: string;
    imageM: string;
    avatar: string;
  };
};

/**
 * 기존 animalTypeMeta와 호환되는 통합 객체
 */
export const animalTypeMeta: Record<AnimalType, AnimalTypeMeta> =
  Object.values(AnimalType).reduce(
    (acc, type) => {
      const profile = animalProfiles[type];
      const copy = animalCopies[type];
      const assets = animalAssets[type];

      acc[type] = {
        label: copy.label,
        group: profile.group,
        description: copy.description,
        extendedDescription: copy.extendedDescription,
        dominantTraits: profile.dominantTraits,
        secondaryTraits: profile.secondaryTraits,
        avoidTraits: profile.avoidTraits,
        mainRole: copy.mainRole,
        subRole: copy.subRole,
        checkSentences: copy.checkSentences,
        ui: assets,
      };

      return acc;
    },
    {} as Record<AnimalType, AnimalTypeMeta>
  );

/**
 * 동물 타입의 메타데이터를 반환 (기존 함수 호환)
 */
export const getAnimalTypeMeta = (type: AnimalType): AnimalTypeMeta => {
  return animalTypeMeta[type];
};

