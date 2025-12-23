import type { Meta, StoryObj } from '@storybook/react';
import Searchbar from './index';
import Icon from '../icon';

const meta = {
  title: 'Commons/Components/Searchbar',
  component: Searchbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '검색바 컴포넌트입니다. children을 통해 아이콘과 입력 필드를 유연하게 배치할 수 있으며, state prop으로 다양한 상태를 표현할 수 있습니다. 테마는 globals.css의 시맨틱 컬러 시스템으로 자동 관리됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'filled'],
      description: '검색바의 상태',
      table: {
        type: { summary: 'SearchbarState' },
        defaultValue: { summary: 'default' },
      },
    },
    children: {
      control: false,
      description: '검색바 내부 콘텐츠 (아이콘, input 등을 포함한 유연한 배치)',
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
    state: 'default',
    placeholder: '게이머 이름으로 검색...',
  },
};

// State Variants
export const Hover: Story = {
  args: {
    state: 'hover',
    placeholder: '게이머 이름으로 검색...',
  },
  parameters: {
    docs: {
      description: {
        story: 'hover 상태의 검색바입니다. border가 표시됩니다.',
      },
    },
  },
};

export const Active: Story = {
  args: {
    state: 'active',
    placeholder: '게이머 이름으로 검색...',
  },
  parameters: {
    docs: {
      description: {
        story: 'active 상태의 검색바입니다. 포커스된 상태를 나타냅니다.',
      },
    },
  },
};

export const Filled: Story = {
  args: {
    state: 'filled',
    defaultValue: '검색어',
  },
  parameters: {
    docs: {
      description: {
        story: 'filled 상태의 검색바입니다. 값이 입력된 상태를 나타냅니다.',
      },
    },
  },
};

// Children을 통한 아이콘 배치
export const WithIconLeft: Story = {
  render: () => (
    <Searchbar state="default" placeholder="게이머 이름으로 검색...">
      <Icon name="search" size={20} />
      <input
        type="text"
        placeholder="게이머 이름으로 검색..."
        style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
      />
    </Searchbar>
  ),
  parameters: {
    docs: {
      description: {
        story: '왼쪽에 검색 아이콘이 있는 검색바입니다.',
      },
    },
  },
};

export const WithIconRight: Story = {
  render: () => (
    <Searchbar state="default" placeholder="게이머 이름으로 검색...">
      <input
        type="text"
        placeholder="게이머 이름으로 검색..."
        defaultValue="검색어"
        style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
      />
      <Icon
        name="x"
        size={20}
        style={{ cursor: 'pointer' }}
        onClick={() => alert('삭제 클릭')}
      />
    </Searchbar>
  ),
  parameters: {
    docs: {
      description: {
        story: '오른쪽에 삭제 아이콘이 있는 검색바입니다.',
      },
    },
  },
};

export const WithIconsBoth: Story = {
  render: () => (
    <Searchbar state="active" placeholder="게이머 이름으로 검색...">
      <Icon name="search" size={20} />
      <input
        type="text"
        placeholder="게이머 이름으로 검색..."
        defaultValue="검색어"
        style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
      />
      <Icon
        name="x"
        size={20}
        style={{ cursor: 'pointer' }}
        onClick={() => alert('삭제 클릭')}
      />
    </Searchbar>
  ),
  parameters: {
    docs: {
      description: {
        story: '왼쪽과 오른쪽 모두에 아이콘이 있는 검색바입니다.',
      },
    },
  },
};

// Disabled 스토리
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화된 검색바',
  },
};

// All States 스토리
export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '320px',
      }}
    >
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
          Default
        </div>
        <Searchbar state="default" placeholder="게이머 이름으로 검색..." />
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
          Hover
        </div>
        <Searchbar state="hover" placeholder="게이머 이름으로 검색..." />
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
          Active
        </div>
        <Searchbar state="active" placeholder="게이머 이름으로 검색..." />
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
          Filled
        </div>
        <Searchbar state="filled" defaultValue="검색어" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '모든 state 변형을 확인할 수 있습니다. children을 통해 아이콘과 입력 필드를 자유롭게 배치할 수 있으며, 테마는 Storybook 툴바에서 전환 가능합니다.',
      },
    },
  },
};

// All Variants with Icons
export const AllVariantsWithIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '320px',
      }}
    >
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
          With Icon Left (Default)
        </div>
        <Searchbar state="default" placeholder="게이머 이름으로 검색...">
          <Icon name="search" size={20} />
          <input
            type="text"
            placeholder="게이머 이름으로 검색..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
          />
        </Searchbar>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
          With Icon Right (Hover)
        </div>
        <Searchbar state="hover" placeholder="게이머 이름으로 검색...">
          <input
            type="text"
            placeholder="게이머 이름으로 검색..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
          />
          <Icon name="x" size={20} style={{ cursor: 'pointer' }} />
        </Searchbar>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
          With Icons Both (Active)
        </div>
        <Searchbar state="active" placeholder="게이머 이름으로 검색...">
          <Icon name="search" size={20} />
          <input
            type="text"
            placeholder="게이머 이름으로 검색..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
          />
          <Icon name="x" size={20} style={{ cursor: 'pointer' }} />
        </Searchbar>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
          With Icons Both (Filled)
        </div>
        <Searchbar state="filled">
          <Icon name="search" size={20} />
          <input
            type="text"
            defaultValue="검색어"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
          />
          <Icon name="x" size={20} style={{ cursor: 'pointer' }} />
        </Searchbar>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '아이콘과 함께 사용하는 다양한 state 변형입니다. children을 통해 아이콘을 왼쪽, 오른쪽, 양쪽 모두 배치할 수 있습니다.',
      },
    },
  },
};
