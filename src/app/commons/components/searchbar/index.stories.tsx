import type { Meta, StoryObj } from '@storybook/react';
import Searchbar from './index';

const meta = {
  title: 'Commons/Components/Searchbar',
  component: Searchbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '검색바 컴포넌트입니다. 왼쪽에 search 아이콘이 고정으로 표시되며, 테마는 globals.css의 시맨틱 컬러 시스템으로 자동 관리됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: '검색바 내부 콘텐츠 (input 대신 사용)',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '검색바 비활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Searchbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    placeholder: '게이머 이름으로 검색...',
  },
};

// Disabled 스토리
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화된 검색바',
  },
};

// Children 스토리
export const WithChildren: Story = {
  args: {
    children: <input type="text" placeholder="커스텀 입력 필드" />,
  },
};

// 조합 스토리
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <Searchbar placeholder="게이머 이름으로 검색..." />
      <Searchbar disabled placeholder="비활성화된 검색바" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '모든 변형을 확인할 수 있습니다. Search 아이콘은 고정으로 표시되며, 테마는 Storybook 툴바에서 전환 가능합니다.',
      },
    },
  },
};

