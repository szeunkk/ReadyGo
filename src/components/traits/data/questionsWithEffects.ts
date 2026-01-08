/**
 * ReadyGo 성향 테스트 질문 세트 (Effect 기반)
 *
 * 총 10문항, 5개 성향 축을 기반으로 구성
 * 각 선택지는 주 성향 + 보조 효과를 가짐
 *
 * Effect 범위:
 * - 주 특성: -20 ~ +20
 * - 보조 특성: -10 ~ +10
 */

import type { QuestionWithEffect } from './questionEffects.types';

export const QUESTIONS_WITH_EFFECTS: QuestionWithEffect[] = [
  // =============================
  // 1. 협동성 (COOPERATION)
  // =============================
  {
    id: 'Q1',
    text: '게임할 때 더 편한 방식은?',
    choices: [
      {
        value: 1,
        label: '완전 혼자서 플레이하는 걸 선호함',
        effects: {
          cooperation: -20,
          social: -10,
        },
      },
      {
        value: 2,
        label: '혼자 플레이가 편하지만 파티도 가끔 함',
        effects: {
          cooperation: -10,
        },
      },
      {
        value: 3,
        label: '둘 다 상관없음',
        effects: {},
      },
      {
        value: 4,
        label: '팀 플레이가 더 즐거움',
        effects: {
          cooperation: 10,
        },
      },
      {
        value: 5,
        label: '팀원과 협력하는 플레이가 핵심이라고 생각함',
        effects: {
          cooperation: 20,
          leadership: 6,
        },
      },
    ],
  },
  {
    id: 'Q2',
    text: '파티원이 실수했을 때 반응은?',
    choices: [
      {
        value: 1,
        label: '말 없이 조용히 플레이함',
        effects: {
          cooperation: -20,
          social: -10,
        },
      },
      {
        value: 2,
        label: '조금 불편하지만 넘어감',
        effects: {},
      },
      {
        value: 3,
        label: '상황에 따라 다름',
        effects: {},
      },
      {
        value: 4,
        label: '가볍게 농담하며 분위기 풀어줌',
        effects: {
          social: 10,
        },
      },
      {
        value: 5,
        label: '팀을 다독이며 적극적으로 협력함',
        effects: {
          cooperation: 20,
          leadership: 6,
        },
      },
    ],
  },

  // =============================
  // 2. 모험성 (EXPLORATION)
  // =============================
  {
    id: 'Q3',
    text: '새로운 캐릭터나 빌드를 만났을 때?',
    choices: [
      {
        value: 1,
        label: '절대 모험 안 함, 안정적 선택',
        effects: {
          exploration: -20,
          strategy: 6,
        },
      },
      {
        value: 2,
        label: '익숙해지면 조금 시도',
        effects: {},
      },
      {
        value: 3,
        label: '반반 정도',
        effects: {},
      },
      {
        value: 4,
        label: '종종 새로운 빌드에 도전',
        effects: {
          exploration: 10,
        },
      },
      {
        value: 5,
        label: '실험과 새로운 조합이 가장 재밌음',
        effects: {
          exploration: 20,
        },
      },
    ],
  },
  {
    id: 'Q4',
    text: '고난도 콘텐츠나 랭킹전은?',
    choices: [
      {
        value: 1,
        label: '스트레스라 거의 안 함',
        effects: {
          exploration: -20,
        },
      },
      {
        value: 2,
        label: '가끔 도전',
        effects: {},
      },
      {
        value: 3,
        label: '기분에 따라 다름',
        effects: {},
      },
      {
        value: 4,
        label: '꾸준히 도전',
        effects: {
          exploration: 10,
        },
      },
      {
        value: 5,
        label: '높은 난이도를 깨는 게 진짜 재미',
        effects: {
          exploration: 20,
          leadership: 6,
        },
      },
    ],
  },

  // =============================
  // 3. 전략성 (STRATEGY)
  // =============================
  {
    id: 'Q5',
    text: '전투·플레이 중 의사결정 스타일은?',
    choices: [
      {
        value: 1,
        label: '즉흥적으로 바로 판단',
        effects: {
          strategy: -20,
        },
      },
      {
        value: 2,
        label: '대략적인 계획만 세움',
        effects: {},
      },
      {
        value: 3,
        label: '상황에 따라 조절',
        effects: {},
      },
      {
        value: 4,
        label: '계획적이고 안정적으로 판단',
        effects: {
          strategy: 10,
        },
      },
      {
        value: 5,
        label: '전투 전 시나리오·동선까지 계산',
        effects: {
          strategy: 20,
        },
      },
    ],
  },
  {
    id: 'Q6',
    text: '공략을 볼 때 선호 방식은?',
    choices: [
      {
        value: 1,
        label: '공략 거의 안 보고 직접 해봄',
        effects: {
          strategy: -20,
          exploration: 6,
        },
      },
      {
        value: 2,
        label: '핵심만 훑고 바로 플레이',
        effects: {},
      },
      {
        value: 3,
        label: '필요하면 확인',
        effects: {},
      },
      {
        value: 4,
        label: '꼼꼼히 보고 그대로 따라함',
        effects: {
          strategy: 10,
        },
      },
      {
        value: 5,
        label: '직접 분석해서 커스텀 공략 제작',
        effects: {
          strategy: 20,
        },
      },
    ],
  },

  // =============================
  // 4. 리더십 (LEADERSHIP)
  // =============================
  {
    id: 'Q7',
    text: '파티에서 주로 맡는 역할은?',
    choices: [
      {
        value: 1,
        label: '리딩 부담 싫고 따라가는 타입',
        effects: {
          leadership: -20,
        },
      },
      {
        value: 2,
        label: '요청받으면 가끔 리딩',
        effects: {},
      },
      {
        value: 3,
        label: '리딩·팔로잉 상황별 조절',
        effects: {},
      },
      {
        value: 4,
        label: '적극적으로 의견 제안',
        effects: {
          leadership: 10,
        },
      },
      {
        value: 5,
        label: '전략 설명하고 팀을 이끎',
        effects: {
          leadership: 20,
          cooperation: 6,
        },
      },
    ],
  },
  {
    id: 'Q8',
    text: '팀이 우왕좌왕할 때 행동은?',
    choices: [
      {
        value: 1,
        label: '흐름에 맡김',
        effects: {
          leadership: -20,
        },
      },
      {
        value: 2,
        label: '필요할 때만 조용히 의견',
        effects: {},
      },
      {
        value: 3,
        label: '상황에 따라 반응',
        effects: {},
      },
      {
        value: 4,
        label: '정리해서 방향 제시',
        effects: {
          leadership: 10,
        },
      },
      {
        value: 5,
        label: '명확하게 목표·전략을 제시하며 리딩',
        effects: {
          leadership: 20,
        },
      },
    ],
  },

  // =============================
  // 5. 교류성 (SOCIAL)
  // =============================
  {
    id: 'Q9',
    text: '게임 중 커뮤니케이션 스타일은?',
    choices: [
      {
        value: 1,
        label: '말 거의 안 함',
        effects: {
          social: -20,
        },
      },
      {
        value: 2,
        label: '필요한 말만 최소한',
        effects: {},
      },
      {
        value: 3,
        label: '상황에 따라 다름',
        effects: {},
      },
      {
        value: 4,
        label: '분위기 좋게 편하게 소통',
        effects: {
          social: 10,
        },
      },
      {
        value: 5,
        label: '적극 소통하며 분위기 주도',
        effects: {
          social: 20,
          leadership: 6,
        },
      },
    ],
  },
  {
    id: 'Q10',
    text: '새로운 사람과 파티할 때 느낌은?',
    choices: [
      {
        value: 1,
        label: '불편하고 최소한의 대화만 원함',
        effects: {
          social: -20,
        },
      },
      {
        value: 2,
        label: '적당히 괜찮음',
        effects: {},
      },
      {
        value: 3,
        label: '상황에 따라 다름',
        effects: {},
      },
      {
        value: 4,
        label: '친해질 기회라고 생각',
        effects: {
          social: 10,
        },
      },
      {
        value: 5,
        label: '새로운 사람 만나는 걸 즐김',
        effects: {
          social: 20,
        },
      },
    ],
  },
];
