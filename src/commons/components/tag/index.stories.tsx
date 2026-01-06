import type { Meta, StoryObj } from '@storybook/react';
import Tag from './index';
import Icon from '../icon';

const meta = {
  title: 'Commons/Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '태그 컴포넌트입니다. style 등의 속성을 통해 다양한 스타일을 적용할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    style: {
      control: 'select',
      options: ['rectangle', 'duotone', 'circle', 'leader'],
      description: '태그의 스타일',
      table: {
        type: { summary: 'TagStyle' },
        defaultValue: { summary: 'rectangle' },
      },
    },
    children: {
      control: 'text',
      description: '태그 내부 콘텐츠',
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    children: 'Tag',
  },
};

// Style 스토리
export const Rectangle: Story = {
  args: {
    style: 'rectangle',
    children: 'Rectangle Tag',
  },
};

export const Duotone: Story = {
  args: {
    style: 'duotone',
    children: 'Duotone Tag',
  },
};

export const Circle: Story = {
  args: {
    style: 'circle',
    children: 'Circle Tag',
  },
};

export const Leader: Story = {
  args: {
    style: 'leader',
    children: '파티장',
  },
};

// 조합 스토리
export const AllStyles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Tag style="rectangle">Rectangle</Tag>
      <Tag style="duotone">Duotone</Tag>
      <Tag style="circle">Circle</Tag>
      <Tag style="leader">Leader</Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 style 타입을 한 번에 확인할 수 있습니다.',
      },
    },
  },
};

export const CompleteExample: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag style="rectangle">카테고리</Tag>
      <Tag style="duotone">새 글</Tag>
      <Tag style="circle">인기</Tag>
      <Tag style="rectangle">추천</Tag>
      <Tag style="duotone">이벤트</Tag>
      <Tag style="circle">공지</Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 사용 예시로 다양한 태그를 조합한 경우입니다.',
      },
    },
  },
};

export const LeaderWithIcon: Story = {
  render: () => (
    <Tag style="leader">
      <Icon name="crown" size={14} />
      파티장
    </Tag>
  ),
  parameters: {
    docs: {
      description: {
        story: 'leader 스타일과 아이콘을 함께 사용하는 예시입니다. 실제 파티장 태그 사용 예시입니다.',
      },
    },
  },
};
