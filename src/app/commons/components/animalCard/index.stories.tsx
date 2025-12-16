import type { Meta, StoryObj } from "@storybook/react";
import AnimalCard from "./index";
import { TierType } from "../../constants/tierType.enum";
import { AnimalType } from "../../constants/animalType.enum";

const meta = {
  title: "Commons/AnimalCard",
  component: AnimalCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "AnimalCard는 유저의 프로필 정보를 표시하는 카드 컴포넌트입니다. 'my'와 'user' 두 가지 variant를 지원합니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    property: {
      control: "radio",
      options: ["my", "user"],
      description: "카드의 variant (my: 내 프로필, user: 다른 유저 프로필)",
    },
    theme: {
      control: "radio",
      options: ["dark", "light"],
      description: "카드의 테마 (dark: 다크 모드, light: 라이트 모드)",
    },
    nickname: {
      control: "text",
      description: "사용자 닉네임",
    },
    tier: {
      control: "select",
      options: Object.values(TierType),
      description: "티어",
    },
    animal: {
      control: "select",
      options: Object.values(AnimalType),
      description: "동물 타입",
    },
    favoriteGenre: {
      control: "text",
      description: "선호 장르",
    },
    activeTime: {
      control: "text",
      description: "활동 시간",
    },
    gameStyle: {
      control: "text",
      description: "게임 성향",
    },
    weeklyAverage: {
      control: "text",
      description: "주간 평균 플레이 시간",
    },
    perfectMatchTypes: {
      control: "object",
      description: "천생연분 동물 타입들 (my variant)",
    },
    matchPercentage: {
      control: "number",
      description: "매칭 퍼센티지 (user variant)",
    },
    matchReasons: {
      control: "object",
      description: "매칭 이유들 (user variant)",
    },
  },
} satisfies Meta<typeof AnimalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// My Variant Stories
// ============================================

export const MyWolf: Story = {
  args: {
    property: "my",
    nickname: "호쾌한망토",
    tier: TierType.diamond,
    animal: AnimalType.wolf,
    favoriteGenre: "FPS",
    activeTime: "20 - 24시",
    gameStyle: "경쟁적",
    weeklyAverage: "5.4 시간",
    perfectMatchTypes: [AnimalType.fox, AnimalType.bear, AnimalType.raven],
  },
};

export const MyTiger: Story = {
  args: {
    property: "my",
    nickname: "용맹한호랑이",
    tier: TierType.master,
    animal: AnimalType.tiger,
    favoriteGenre: "액션",
    activeTime: "18 - 22시",
    gameStyle: "공격적",
    weeklyAverage: "7.2 시간",
    perfectMatchTypes: [AnimalType.hawk, AnimalType.leopard],
  },
};

export const MyHawk: Story = {
  args: {
    property: "my",
    nickname: "정확한매",
    tier: TierType.platinum,
    animal: AnimalType.hawk,
    favoriteGenre: "FPS",
    activeTime: "21 - 01시",
    gameStyle: "전략적",
    weeklyAverage: "4.8 시간",
    perfectMatchTypes: [AnimalType.owl, AnimalType.fox],
  },
};

export const MyOwl: Story = {
  args: {
    property: "my",
    nickname: "현명한올빼미",
    tier: TierType.gold,
    animal: AnimalType.owl,
    favoriteGenre: "전략",
    activeTime: "22 - 02시",
    gameStyle: "전략적",
    weeklyAverage: "6.1 시간",
    perfectMatchTypes: [AnimalType.raven, AnimalType.fox, AnimalType.bear],
  },
};

export const MyFox: Story = {
  args: {
    property: "my",
    nickname: "영리한여우",
    tier: TierType.diamond,
    animal: AnimalType.fox,
    favoriteGenre: "MOBA",
    activeTime: "20 - 24시",
    gameStyle: "전략적",
    weeklyAverage: "5.5 시간",
    perfectMatchTypes: [AnimalType.wolf, AnimalType.owl],
  },
};

export const MyHedgehog: Story = {
  args: {
    property: "my",
    nickname: "분석하는고슴도치",
    tier: TierType.silver,
    animal: AnimalType.hedgehog,
    favoriteGenre: "RPG",
    activeTime: "19 - 23시",
    gameStyle: "전략적",
    weeklyAverage: "8.3 시간",
    perfectMatchTypes: [AnimalType.owl, AnimalType.raven],
  },
};

export const MyRaven: Story = {
  args: {
    property: "my",
    nickname: "관찰하는까마귀",
    tier: TierType.platinum,
    animal: AnimalType.raven,
    favoriteGenre: "전략",
    activeTime: "21 - 01시",
    gameStyle: "전략적",
    weeklyAverage: "4.9 시간",
    perfectMatchTypes: [AnimalType.owl, AnimalType.bear],
  },
};

export const MyBear: Story = {
  args: {
    property: "my",
    nickname: "든든한곰",
    tier: TierType.gold,
    animal: AnimalType.bear,
    favoriteGenre: "협동",
    activeTime: "20 - 24시",
    gameStyle: "협동적",
    weeklyAverage: "6.7 시간",
    perfectMatchTypes: [AnimalType.wolf, AnimalType.dog, AnimalType.deer],
  },
};

export const MyDeer: Story = {
  args: {
    property: "my",
    nickname: "차분한사슴",
    tier: TierType.silver,
    animal: AnimalType.deer,
    favoriteGenre: "협동",
    activeTime: "18 - 22시",
    gameStyle: "협동적",
    weeklyAverage: "5.2 시간",
    perfectMatchTypes: [AnimalType.bear, AnimalType.panda, AnimalType.dog],
  },
};

export const MyKoala: Story = {
  args: {
    property: "my",
    nickname: "편안한코알라",
    tier: TierType.bronze,
    animal: AnimalType.koala,
    favoriteGenre: "캐주얼",
    activeTime: "19 - 23시",
    gameStyle: "캐주얼",
    weeklyAverage: "3.5 시간",
    perfectMatchTypes: [AnimalType.panda, AnimalType.rabbit, AnimalType.deer],
  },
};

export const MyDog: Story = {
  args: {
    property: "my",
    nickname: "활발한강아지",
    tier: TierType.gold,
    animal: AnimalType.dog,
    favoriteGenre: "협동",
    activeTime: "20 - 24시",
    gameStyle: "사교적",
    weeklyAverage: "5.9 시간",
    perfectMatchTypes: [AnimalType.dolphin, AnimalType.panda, AnimalType.bear],
  },
};

export const MyDolphin: Story = {
  args: {
    property: "my",
    nickname: "즐거운돌고래",
    tier: TierType.platinum,
    animal: AnimalType.dolphin,
    favoriteGenre: "파티",
    activeTime: "20 - 24시",
    gameStyle: "사교적",
    weeklyAverage: "6.4 시간",
    perfectMatchTypes: [AnimalType.dog, AnimalType.rabbit, AnimalType.panda],
  },
};

export const MyPanda: Story = {
  args: {
    property: "my",
    nickname: "균형잡힌판다",
    tier: TierType.diamond,
    animal: AnimalType.panda,
    favoriteGenre: "협동",
    activeTime: "20 - 24시",
    gameStyle: "균형형",
    weeklyAverage: "5.7 시간",
    perfectMatchTypes: [
      AnimalType.dog,
      AnimalType.dolphin,
      AnimalType.deer,
      AnimalType.bear,
    ],
  },
};

export const MyRabbit: Story = {
  args: {
    property: "my",
    nickname: "빠른토끼",
    tier: TierType.silver,
    animal: AnimalType.rabbit,
    favoriteGenre: "액션",
    activeTime: "19 - 23시",
    gameStyle: "사교적",
    weeklyAverage: "4.6 시간",
    perfectMatchTypes: [AnimalType.dolphin, AnimalType.dog, AnimalType.koala],
  },
};

export const MyLeopard: Story = {
  args: {
    property: "my",
    nickname: "집중하는표범",
    tier: TierType.master,
    animal: AnimalType.leopard,
    favoriteGenre: "경쟁",
    activeTime: "21 - 01시",
    gameStyle: "경쟁적",
    weeklyAverage: "8.1 시간",
    perfectMatchTypes: [AnimalType.tiger, AnimalType.hawk],
  },
};

export const MyCat: Story = {
  args: {
    property: "my",
    nickname: "독립적인고양이",
    tier: TierType.champion,
    animal: AnimalType.cat,
    favoriteGenre: "전략",
    activeTime: "22 - 02시",
    gameStyle: "전략적",
    weeklyAverage: "7.8 시간",
    perfectMatchTypes: [AnimalType.owl, AnimalType.hedgehog],
  },
};

// ============================================
// User Variant Stories
// ============================================

export const UserRaven: Story = {
  args: {
    property: "user",
    nickname: "까칠한까마귀",
    tier: TierType.diamond,
    animal: AnimalType.raven,
    favoriteGenre: "FPS",
    activeTime: "20 - 24시",
    gameStyle: "전략적",
    weeklyAverage: "5.4 시간",
    matchPercentage: 94,
    matchReasons: ["동일 게임 선호", "유사한 플레이 시간대"],
  },
};

export const UserFox: Story = {
  args: {
    property: "user",
    nickname: "센스있는여우",
    tier: TierType.master,
    animal: AnimalType.fox,
    favoriteGenre: "MOBA",
    activeTime: "21 - 01시",
    gameStyle: "전략적",
    weeklyAverage: "6.2 시간",
    matchPercentage: 89,
    matchReasons: ["유사한 플레이 스타일", "비슷한 티어"],
  },
};

export const UserBear: Story = {
  args: {
    property: "user",
    nickname: "든든한곰",
    tier: TierType.gold,
    animal: AnimalType.bear,
    favoriteGenre: "협동",
    activeTime: "20 - 24시",
    gameStyle: "협동적",
    weeklyAverage: "6.7 시간",
    matchPercentage: 92,
    matchReasons: ["천생연분 타입", "동일 활동 시간대"],
  },
};

export const UserDolphin: Story = {
  args: {
    property: "user",
    nickname: "텐션업돌고래",
    tier: TierType.platinum,
    animal: AnimalType.dolphin,
    favoriteGenre: "파티",
    activeTime: "20 - 24시",
    gameStyle: "사교적",
    weeklyAverage: "6.4 시간",
    matchPercentage: 87,
    matchReasons: ["유사한 게임 성향", "동일 활동 시간대"],
  },
};

export const UserTiger: Story = {
  args: {
    property: "user",
    nickname: "돌파하는호랑이",
    tier: TierType.diamond,
    animal: AnimalType.tiger,
    favoriteGenre: "액션",
    activeTime: "18 - 22시",
    gameStyle: "공격적",
    weeklyAverage: "7.2 시간",
    matchPercentage: 78,
    matchReasons: ["유사한 티어", "비슷한 플레이 시간"],
  },
};

// ============================================
// Light Theme Stories
// ============================================

export const LightMyWolf: Story = {
  args: {
    property: "my",
    theme: "light",
    nickname: "호쾌한망토",
    tier: TierType.diamond,
    animal: AnimalType.wolf,
    favoriteGenre: "FPS",
    activeTime: "20 - 24시",
    gameStyle: "경쟁적",
    weeklyAverage: "5.4 시간",
    perfectMatchTypes: [AnimalType.fox, AnimalType.bear, AnimalType.raven],
  },
};

export const LightUserRaven: Story = {
  args: {
    property: "user",
    theme: "light",
    nickname: "까칠한까마귀",
    tier: TierType.diamond,
    animal: AnimalType.raven,
    favoriteGenre: "FPS",
    activeTime: "20 - 24시",
    gameStyle: "전략적",
    weeklyAverage: "5.4 시간",
    matchPercentage: 94,
    matchReasons: ["동일 게임 선호", "유사한 플레이 시간대"],
  },
};

// ============================================
// Interactive Stories
// ============================================

export const Interactive: Story = {
  args: {
    property: "my",
    theme: "dark",
    nickname: "호쾌한망토",
    tier: TierType.diamond,
    animal: AnimalType.wolf,
    favoriteGenre: "FPS",
    activeTime: "20 - 24시",
    gameStyle: "경쟁적",
    weeklyAverage: "5.4 시간",
    perfectMatchTypes: [AnimalType.fox, AnimalType.bear, AnimalType.raven],
  },
};

