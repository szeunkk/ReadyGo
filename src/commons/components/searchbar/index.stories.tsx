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
          '검색바 컴포넌트입니다. state prop으로 다양한 상태를 표현할 수 있으며, 테마는 globals.css의 시맨틱 컬러 시스템으로 자동 관리됩니다.',
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
    icon: {
      control: 'select',
      options: ['left', 'right'],
      description: '아이콘 위치',
      table: {
        type: { summary: 'SearchbarIcon' },
        defaultValue: { summary: 'left' },
      },
    },
    size: {
      control: 'select',
      options: ['m', 'l'],
      description: '검색바 크기',
      table: {
        type: { summary: 'SearchbarSize' },
        defaultValue: { summary: 'm' },
      },
    },
    children: {
      control: false,
      description: '검색바 내부 콘텐츠',
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

// Disabled 스토리
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화된 검색바',
  },
};

// Icon Variants
export const IconLeft: Story = {
  args: {
    icon: 'left',
    state: 'default',
    placeholder: '게이머 이름으로 검색...',
  },
  parameters: {
    docs: {
      description: {
        story: '아이콘이 왼쪽에 위치한 검색바입니다.',
      },
    },
  },
};

export const IconRight: Story = {
  args: {
    icon: 'right',
    state: 'default',
    placeholder: '게이머 이름으로 검색...',
  },
  parameters: {
    docs: {
      description: {
        story: '아이콘이 오른쪽에 위치한 검색바입니다.',
      },
    },
  },
};

// Size Variants
export const SizeM: Story = {
  args: {
    size: 'm',
    state: 'default',
    placeholder: '게이머 이름으로 검색...',
  },
  parameters: {
    docs: {
      description: {
        story: '중간 크기(m) 검색바입니다. 높이 48px.',
      },
    },
  },
};

export const SizeL: Story = {
  args: {
    size: 'l',
    state: 'default',
    placeholder: '게이머 이름으로 검색...',
  },
  parameters: {
    docs: {
      description: {
        story: '큰 크기(l) 검색바입니다. 높이 56px.',
      },
    },
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
          '모든 state 변형을 확인할 수 있습니다. 테마는 Storybook 툴바에서 전환 가능합니다.',
      },
    },
  },
};

// All Variants 스토리
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '400px',
      }}
    >
      <div>
        <div
          style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}
        >
          Icon & Size Variants
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              Icon Left, Size M
            </div>
            <Searchbar
              icon="left"
              size="m"
              state="default"
              placeholder="게이머 이름으로 검색..."
            />
          </div>
          <div>
            <div
              style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              Icon Left, Size L
            </div>
            <Searchbar
              icon="left"
              size="l"
              state="default"
              placeholder="게이머 이름으로 검색..."
            />
          </div>
          <div>
            <div
              style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              Icon Right, Size M
            </div>
            <Searchbar
              icon="right"
              size="m"
              state="default"
              placeholder="게이머 이름으로 검색..."
            />
          </div>
          <div>
            <div
              style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              Icon Right, Size L
            </div>
            <Searchbar
              icon="right"
              size="l"
              state="default"
              placeholder="게이머 이름으로 검색..."
            />
          </div>
        </div>
      </div>
      <div>
        <div
          style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}
        >
          Combined Variants (Icon Right + Size L + States)
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              Default
            </div>
            <Searchbar
              icon="right"
              size="l"
              state="default"
              placeholder="게이머 이름으로 검색..."
            />
          </div>
          <div>
            <div
              style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              Hover
            </div>
            <Searchbar
              icon="right"
              size="l"
              state="hover"
              placeholder="게이머 이름으로 검색..."
            />
          </div>
          <div>
            <div
              style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              Active
            </div>
            <Searchbar
              icon="right"
              size="l"
              state="active"
              placeholder="게이머 이름으로 검색..."
            />
          </div>
          <div>
            <div
              style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              Filled
            </div>
            <Searchbar
              icon="right"
              size="l"
              state="filled"
              defaultValue="검색어"
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '모든 variant 조합을 확인할 수 있습니다. icon, size, state의 모든 조합을 테스트해보세요.',
      },
    },
  },
};
