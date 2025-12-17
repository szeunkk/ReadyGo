import type { Meta, StoryObj } from '@storybook/react';
import RadarChart from './index';
import { RadarChartData } from './index';

const meta: Meta<typeof RadarChart> = {
  title: 'Commons/RadarChart',
  component: RadarChart,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#030712' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
      description: '차트 크기',
    },
    showLabels: {
      control: 'boolean',
      description: '축 레이블 표시 여부',
    },
    data: {
      control: 'object',
      description: '레이더 차트 데이터 (5개 축)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadarChart>;

// 기본 데이터
const defaultData: RadarChartData[] = [
  { trait: 'exploration', value: 80 },
  { trait: 'cooperation', value: 70 },
  { trait: 'strategy', value: 60 },
  { trait: 'leadership', value: 50 },
  { trait: 'social', value: 65 },
];

// 기본 스토리
export const Default: Story = {
  args: {
    data: defaultData,
    size: 'm',
    showLabels: true,
  },
};

// 균형 잡힌 타입 (판다)
export const Balanced: Story = {
  args: {
    data: [
      { trait: 'exploration', value: 60 },
      { trait: 'cooperation', value: 65 },
      { trait: 'strategy', value: 55 },
      { trait: 'leadership', value: 70 },
      { trait: 'social', value: 65 },
    ],
    size: 'm',
    showLabels: true,
  },
};

// 공격형 타입 (호랑이)
export const AttackType: Story = {
  args: {
    data: [
      { trait: 'exploration', value: 95 },
      { trait: 'cooperation', value: 30 },
      { trait: 'strategy', value: 40 },
      { trait: 'leadership', value: 20 },
      { trait: 'social', value: 25 },
    ],
    size: 'm',
    showLabels: true,
  },
};

// 전략형 타입 (올빼미)
export const StrategyType: Story = {
  args: {
    data: [
      { trait: 'exploration', value: 35 },
      { trait: 'cooperation', value: 50 },
      { trait: 'strategy', value: 95 },
      { trait: 'leadership', value: 40 },
      { trait: 'social', value: 30 },
    ],
    size: 'm',
    showLabels: true,
  },
};

// 소셜형 타입 (강아지)
export const SocialType: Story = {
  args: {
    data: [
      { trait: 'exploration', value: 55 },
      { trait: 'cooperation', value: 85 },
      { trait: 'strategy', value: 40 },
      { trait: 'leadership', value: 60 },
      { trait: 'social', value: 90 },
    ],
    size: 'm',
    showLabels: true,
  },
};

// 균형형 타입 (코알라)
export const BalancedType: Story = {
  args: {
    data: [
      { trait: 'exploration', value: 40 },
      { trait: 'cooperation', value: 70 },
      { trait: 'strategy', value: 50 },
      { trait: 'leadership', value: 60 },
      { trait: 'social', value: 80 },
    ],
    size: 'm',
    showLabels: true,
  },
};

// 극단값 - 최대
export const MaxValues: Story = {
  args: {
    data: [
      { trait: 'exploration', value: 100 },
      { trait: 'cooperation', value: 100 },
      { trait: 'strategy', value: 100 },
      { trait: 'leadership', value: 100 },
      { trait: 'social', value: 100 },
    ],
    size: 'm',
    showLabels: true,
  },
};

// 극단값 - 최소
export const MinValues: Story = {
  args: {
    data: [
      { trait: 'exploration', value: 10 },
      { trait: 'cooperation', value: 10 },
      { trait: 'strategy', value: 10 },
      { trait: 'leadership', value: 10 },
      { trait: 'social', value: 10 },
    ],
    size: 'm',
    showLabels: true,
  },
};

// 사이즈 S
export const SizeSmall: Story = {
  args: {
    data: defaultData,
    size: 's',
    showLabels: true,
  },
};

// 사이즈 L
export const SizeLarge: Story = {
  args: {
    data: defaultData,
    size: 'l',
    showLabels: true,
  },
};

// 레이블 숨김
export const NoLabels: Story = {
  args: {
    data: defaultData,
    size: 'm',
    showLabels: false,
  },
};

// 리더형 타입 (늑대)
export const LeaderType: Story = {
  args: {
    data: [
      { trait: 'exploration', value: 85 },
      { trait: 'cooperation', value: 70 },
      { trait: 'strategy', value: 60 },
      { trait: 'leadership', value: 30 },
      { trait: 'social', value: 65 },
    ],
    size: 'm',
    showLabels: true,
  },
};

// 서포트형 타입 (곰)
export const SupportType: Story = {
  args: {
    data: [
      { trait: 'exploration', value: 40 },
      { trait: 'cooperation', value: 90 },
      { trait: 'strategy', value: 70 },
      { trait: 'leadership', value: 55 },
      { trait: 'social', value: 75 },
    ],
    size: 'm',
    showLabels: true,
  },
};

