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
          '검색바 컴포넌트입니다. iconLeft, iconRight 등의 속성을 통해 다양한 스타일을 적용할 수 있습니다. 테마는 globals.css의 시맨틱 컬러 시스템으로 자동 관리됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: '검색바 내부 콘텐츠 (input 대신 사용)',
    },
    iconLeft: {
      control: { type: 'boolean' },
      description: '왼쪽 아이콘 표시 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    iconRight: {
      control: { type: 'boolean' },
      description: '오른쪽 아이콘 표시 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    iconSize: {
      control: 'select',
      options: [14, 16, 20, 24, 32, 40],
      description: '아이콘 크기',
      table: {
        type: { summary: '14 | 16 | 20 | 24 | 32 | 40' },
        defaultValue: { summary: '20' },
      },
    },
    gap: {
      control: { type: 'number' },
      description: '요소 간 간격',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '4' },
      },
    },
    onIconLeftClick: {
      action: 'iconLeftClicked',
      description: '왼쪽 아이콘 클릭 핸들러',
    },
    onIconRightClick: {
      action: 'iconRightClicked',
      description: '오른쪽 아이콘 클릭 핸들러',
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
    placeholder: '검색하세요',
  },
};


// Icon 스토리
export const WithLeftIcon: Story = {
  args: {
    iconLeft: true,
    placeholder: '검색하세요',
  },
};

export const WithRightIcon: Story = {
  args: {
    iconRight: true,
    placeholder: '검색하세요',
  },
};

export const WithBothIcons: Story = {
  args: {
    iconLeft: true,
    iconRight: true,
    placeholder: '검색하세요',
  },
};

export const WithCustomIconSize: Story = {
  args: {
    iconLeft: true,
    iconRight: true,
    iconSize: 24,
    placeholder: '검색하세요',
  },
};

// Children 스토리
export const WithChildren: Story = {
  args: {
    children: <input type="text" placeholder="커스텀 입력 필드" />,
  },
};

export const WithChildrenAndIcons: Story = {
  args: {
    iconLeft: true,
    iconRight: true,
    children: <input type="text" placeholder="커스텀 입력 필드" />,
  },
};

// Disabled 스토리
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화된 검색바',
  },
};

export const DisabledWithIcons: Story = {
  args: {
    disabled: true,
    iconLeft: true,
    iconRight: true,
    placeholder: '비활성화된 검색바',
  },
};

// 조합 스토리

export const AllIconCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Searchbar placeholder="아이콘 없음" />
      <Searchbar iconLeft={true} placeholder="왼쪽 아이콘만" />
      <Searchbar iconRight={true} placeholder="오른쪽 아이콘만" />
      <Searchbar iconLeft={true} iconRight={true} placeholder="양쪽 아이콘" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 아이콘 조합을 한 번에 확인할 수 있습니다.',
      },
    },
  },
};

export const AllIconSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Searchbar iconLeft={true} iconSize={14} placeholder="아이콘 크기: 14" />
      <Searchbar iconLeft={true} iconSize={16} placeholder="아이콘 크기: 16" />
      <Searchbar iconLeft={true} iconSize={20} placeholder="아이콘 크기: 20" />
      <Searchbar iconLeft={true} iconSize={24} placeholder="아이콘 크기: 24" />
      <Searchbar iconLeft={true} iconSize={32} placeholder="아이콘 크기: 32" />
      <Searchbar iconLeft={true} iconSize={40} placeholder="아이콘 크기: 40" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 아이콘 크기를 한 번에 확인할 수 있습니다.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <Searchbar placeholder="기본" />
      <Searchbar iconLeft={true} placeholder="왼쪽 아이콘" />
      <Searchbar iconRight={true} placeholder="오른쪽 아이콘" />
      <Searchbar
        iconLeft={true}
        iconRight={true}
        placeholder="양쪽 아이콘"
      />
      <Searchbar disabled placeholder="비활성화" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 변형을 확인할 수 있습니다. 테마는 Storybook 툴바에서 전환 가능합니다.',
      },
    },
  },
};

export const CompleteExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Searchbar
        iconLeft={true}
        iconRight={true}
        placeholder="검색어를 입력하세요"
        onIconLeftClick={() => console.log('검색 클릭')}
        onIconRightClick={() => console.log('초기화 클릭')}
      />
      <Searchbar iconLeft={true} placeholder="왼쪽 아이콘만 있는 검색바" />
      <Searchbar iconRight={true} placeholder="오른쪽 아이콘만 있는 검색바" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 사용 예시로 다양한 속성을 조합한 경우입니다.',
      },
    },
  },
};

export const WithCustomGap: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Searchbar
        iconLeft={true}
        iconRight={true}
        gap={4}
        placeholder="간격: 4px"
      />
      <Searchbar
        iconLeft={true}
        iconRight={true}
        gap={8}
        placeholder="간격: 8px"
      />
      <Searchbar
        iconLeft={true}
        iconRight={true}
        gap={12}
        placeholder="간격: 12px"
      />
      <Searchbar
        iconLeft={true}
        iconRight={true}
        gap={16}
        placeholder="간격: 16px"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 gap 값을 확인할 수 있습니다.',
      },
    },
  },
};
