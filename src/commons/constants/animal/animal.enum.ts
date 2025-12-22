/**
 * Animal Type & Group Enums
 * 동물 타입 및 그룹 정의
 */

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
// Utilities
// ============================================

/**
 * 모든 동물 타입 목록을 배열로 반환
 */
export const getAllAnimalTypes = (): AnimalType[] => {
  return Object.values(AnimalType);
};

/**
 * 특정 그룹에 속하는 동물 타입들을 반환
 * 실제 구현은 animal.profile.ts에 있음 (순환 참조 방지)
 */
export const getAnimalTypesByGroup = (_group: AnimalGroup): AnimalType[] => {
  return getAllAnimalTypes().filter((_type) => {
    // animal.profile.ts에서 import하여 사용해야 함
    // 순환 참조 방지를 위해 여기서는 기본 구조만 제공
    return true;
  });
};

