import type { TraitKey } from '@/commons/constants/animal/trait.enum';

export interface QuestionChoice {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
}

export interface Question {
  id: string;
  axis: TraitKey;
  weight: number;
  text: string;
  choices: QuestionChoice[];
}

export const QUESTIONS: Question[] = [
  // =============================
  // 1. 협동성 (COOPERATION)
  // =============================
  {
    id: 'Q1',
    axis: 'cooperation',
    weight: 1.0,
    text: '게임할 때 더 편한 방식은?',
    choices: [
      { value: 1, label: '완전 혼자서 플레이하는 걸 선호함' },
      { value: 2, label: '혼자 플레이가 편하지만 파티도 가끔 함' },
      { value: 3, label: '둘 다 상관없음' },
      { value: 4, label: '팀 플레이가 더 즐거움' },
      { value: 5, label: '팀원과 협력하는 플레이가 핵심이라고 생각함' },
    ],
  },
  {
    id: 'Q2',
    axis: 'cooperation',
    weight: 1.2,
    text: '파티원이 실수했을 때 반응은?',
    choices: [
      { value: 1, label: '말 없이 조용히 플레이함' },
      { value: 2, label: '조금 불편하지만 넘어감' },
      { value: 3, label: '상황 따라 달라짐' },
      { value: 4, label: '가볍게 농담하며 분위기 풀어줌' },
      { value: 5, label: '팀을 다독이며 적극 협력함' },
    ],
  },

  // =============================
  // 2. 모험성 (EXPLORATION)
  // =============================
  {
    id: 'Q3',
    axis: 'exploration',
    weight: 1.0,
    text: '새로운 캐릭터나 빌드를 만났을 때 선택은?',
    choices: [
      { value: 1, label: '절대 모험 안 함. 안정적 선택' },
      { value: 2, label: '익숙해지면 조금 시도' },
      { value: 3, label: '반반 정도' },
      { value: 4, label: '종종 새로운 빌드 도전' },
      { value: 5, label: '실험하는 게 가장 재밌음' },
    ],
  },
  {
    id: 'Q4',
    axis: 'exploration',
    weight: 1.3,
    text: '고난도 콘텐츠나 랭킹전 참여 의향은?',
    choices: [
      { value: 1, label: '스트레스라서 거의 안 함' },
      { value: 2, label: '가끔 도전' },
      { value: 3, label: '기분 따라 다름' },
      { value: 4, label: '꾸준히 도전' },
      { value: 5, label: '고난도가 가장 재밌음' },
    ],
  },

  // =============================
  // 3. 전략성 (STRATEGY)
  // =============================
  {
    id: 'Q5',
    axis: 'strategy',
    weight: 1.1,
    text: '전투·플레이 중 의사결정 스타일은?',
    choices: [
      { value: 1, label: '즉흥적으로 바로 판단' },
      { value: 2, label: '대략적인 계획만' },
      { value: 3, label: '상황 따라 조절' },
      { value: 4, label: '계획적이고 안정적' },
      { value: 5, label: '사전 계산까지 하는 편' },
    ],
  },
  {
    id: 'Q6',
    axis: 'strategy',
    weight: 1.2,
    text: '공략을 볼 때 선호하는 방식은?',
    choices: [
      { value: 1, label: '공략 잘 안 봄' },
      { value: 2, label: '핵심만 훑고 플레이' },
      { value: 3, label: '필요할 때 확인' },
      { value: 4, label: '꼼꼼하게 따라함' },
      { value: 5, label: '직접 분석해서 만듦' },
    ],
  },

  // =============================
  // 4. 리더십 (LEADERSHIP)
  // =============================
  {
    id: 'Q7',
    axis: 'leadership',
    weight: 1.1,
    text: '파티에서 주로 맡는 역할은?',
    choices: [
      { value: 1, label: '따라가는 타입' },
      { value: 2, label: '가끔 리딩' },
      { value: 3, label: '상황별로 다름' },
      { value: 4, label: '의견 적극 제안' },
      { value: 5, label: '전략 설명하며 리딩' },
    ],
  },
  {
    id: 'Q8',
    axis: 'leadership',
    weight: 1.3,
    text: '팀이 우왕좌왕할 때 행동은?',
    choices: [
      { value: 1, label: '흐름에 맡김' },
      { value: 2, label: '필요할 때만 의견' },
      { value: 3, label: '상황 따라 반응' },
      { value: 4, label: '방향 정리해서 제시' },
      { value: 5, label: '목표·전략을 주도함' },
    ],
  },

  // =============================
  // 5. 교류성 (SOCIAL)
  // =============================
  {
    id: 'Q9',
    axis: 'social',
    weight: 1.1,
    text: '게임 중 커뮤니케이션 스타일은?',
    choices: [
      { value: 1, label: '거의 말 안 함' },
      { value: 2, label: '필요할 때만' },
      { value: 3, label: '상황 따라 다름' },
      { value: 4, label: '분위기 좋게 말함' },
      { value: 5, label: '적극 소통 주도' },
    ],
  },
  {
    id: 'Q10',
    axis: 'social',
    weight: 1.2,
    text: '새로운 사람과 파티할 때 느낌은?',
    choices: [
      { value: 1, label: '불편하고 최소 대화' },
      { value: 2, label: '적당히 괜찮음' },
      { value: 3, label: '상황 따라 다름' },
      { value: 4, label: '친해질 기회' },
      { value: 5, label: '새로운 만남 즐김' },
    ],
  },
];
