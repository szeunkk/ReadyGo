import type { Meta, StoryObj } from '@storybook/react';
import BarChart from './index';

const meta = {
  title: 'Commons/Components/BarChart',
  component: BarChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '가로 막대 차트 컴포넌트입니다. 게임 플레이 패턴 등의 데이터를 시각화합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm'],
      description: '차트의 크기',
      table: {
        type: { summary: 'BarChartSize' },
        defaultValue: { summary: 's' },
      },
    },
    showValues: {
      control: { type: 'boolean' },
      description: '값 표시 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    data: {
      control: 'object',
      description: '차트 데이터 배열',
      table: {
        type: { summary: 'BarChartDataItem[]' },
      },
    },
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 데이터
const defaultData = [
  { label: 'FPS', value: 23.6 },
  { label: '생존', value: 12.5 },
  { label: '모험', value: 7.2 },
  { label: '캐주얼', value: 3.8 },
];

// 기본 스토리
export const Default: Story = {
  args: {
    data: defaultData,
  },
};

// Size 스토리
export const SizeSmall: Story = {
  args: {
    data: defaultData,
    size: 's',
  },
};

export const SizeMedium: Story = {
  args: {
    data: defaultData,
    size: 'm',
  },
};

// 값 표시 여부
export const WithoutValues: Story = {
  args: {
    data: defaultData,
    showValues: false,
  },
};

// 커스텀 색상
export const CustomColors: Story = {
  args: {
    data: [
      { label: 'FPS', value: 23.6, color: '#5FFCE2' },
      { label: 'MOBA', value: 12.5, color: '#36817C' },
      { label: 'RPG', value: 7.2, color: '#2A5CAF' },
      { label: '전략', value: 3.8, color: '#3676E0' },
    ],
  },
};

// 다양한 데이터 길이
export const TwoItems: Story = {
  args: {
    data: [
      { label: 'FPS', value: 25.0 },
      { label: 'RPG', value: 15.0 },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    data: [
      { label: 'FPS', value: 23.6 },
      { label: '생존', value: 12.5 },
      { label: '모험', value: 7.2 },
      { label: '캐주얼', value: 3.8 },
      { label: 'RPG', value: 15.3 },
      { label: 'MOBA', value: 9.7 },
    ],
  },
};

// 모든 사이즈 비교
export const AllSizes: Story = {
  args: {
    data: defaultData,
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '400px',
      }}
    >
      <div>
        <h3
          style={{ marginBottom: '12px', fontSize: '14px', color: '#31323a' }}
        >
          Size: s
        </h3>
        <BarChart data={args.data} size="s" />
      </div>
      <div>
        <h3
          style={{ marginBottom: '12px', fontSize: '14px', color: '#31323a' }}
        >
          Size: m
        </h3>
        <BarChart data={args.data} size="m" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 size 타입을 한 번에 확인할 수 있습니다.',
      },
    },
  },
};

// 실제 사용 예시
export const GamePlayPattern: Story = {
  args: {
    data: [
      { label: 'FPS', value: 23.6 },
      { label: '생존', value: 12.5 },
      { label: '모험', value: 7.2 },
      { label: '캐주얼', value: 3.8 },
    ],
    size: 's' as const,
  },
  render: (args) => (
    <div style={{ width: '360px', padding: '20px', backgroundColor: '#fff' }}>
      <h2
        style={{
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '20px',
          color: '#030712',
          marginBottom: '24px',
        }}
      >
        최근 플레이 패턴
      </h2>
      <BarChart data={args.data} size={args.size} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Figma 디자인에 따른 실제 사용 예시입니다.',
      },
    },
  },
};
