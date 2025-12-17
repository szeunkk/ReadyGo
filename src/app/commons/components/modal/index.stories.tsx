import type { Meta, StoryObj } from '@storybook/react';
import Modal from './index';

const meta = {
  title: 'Commons/Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '모달 컴포넌트입니다. variant 속성을 통해 single(단일 버튼) 또는 dual(두 개의 버튼) 형태로 사용할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['single', 'dual'],
      description: '모달 변형',
      table: {
        type: { summary: 'ModalVariant' },
        defaultValue: { summary: 'single' },
      },
    },
    title: {
      control: 'text',
      description: '모달 제목',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '친구 추가' },
      },
    },
    description: {
      control: 'text',
      description: '모달 설명',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '게이머호랑이님을 친구로 추가하시겠습니까?' },
      },
    },
    showDescription: {
      control: 'boolean',
      description: '설명 표시 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    confirmText: {
      control: 'text',
      description: '확인 버튼 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '확인' },
      },
    },
    cancelText: {
      control: 'text',
      description: '취소 버튼 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '취소' },
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    variant: 'single',
    title: '친구 추가',
    description: '게이머호랑이님을 친구로 추가하시겠습니까?',
    showDescription: true,
    confirmText: '확인',
  },
};

export const Dual: Story = {
  args: {
    variant: 'dual',
    title: '친구 추가',
    description: '게이머호랑이님을 친구로 추가하시겠습니까?',
    showDescription: true,
    confirmText: '확인',
    cancelText: '취소',
  },
};

export const WithoutDescription: Story = {
  args: {
    variant: 'single',
    title: '친구 추가',
    showDescription: false,
    confirmText: '확인',
  },
};

export const CustomText: Story = {
  args: {
    variant: 'dual',
    title: '게임 나가기',
    description: '정말로 게임을 나가시겠습니까?',
    showDescription: true,
    confirmText: '나가기',
    cancelText: '돌아가기',
  },
};

export const DarkThemeExample: Story = {
  args: {
    variant: 'dual',
    title: '친구 삭제',
    description: '게이머호랑이님을 친구 목록에서 삭제하시겠습니까?',
    showDescription: true,
    confirmText: '삭제',
    cancelText: '취소',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Dark 테마 배경에서 모달이 어떻게 표시되는지 확인할 수 있습니다.',
      },
    },
  },
};
