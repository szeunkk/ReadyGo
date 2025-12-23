import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './index';

const meta = {
  title: 'Commons/Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '아바타 컴포넌트입니다. size, status 등의 속성을 통해 다양한 스타일을 적용할 수 있습니다. 테마는 시멘틱 색상 변수로 자동 적용됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    animalType: {
      control: 'select',
      options: [
        'wolf',
        'tiger',
        'hawk',
        'owl',
        'fox',
        'hedgehog',
        'raven',
        'bear',
        'deer',
        'koala',
        'dog',
        'dolphin',
        'panda',
        'rabbit',
        'leopard',
        'cat',
      ],
      description: '동물 타입 (자동으로 해당 동물의 아바타 이미지 사용)',
      table: {
        type: { summary: 'AnimalType' },
      },
    },
    alt: {
      control: 'text',
      description: '아바타 이미지 대체 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Avatar' },
      },
    },
    size: {
      control: 'select',
      options: ['s', 'm', 'L'],
      description: '아바타의 크기',
      table: {
        type: { summary: 'AvatarSize' },
        defaultValue: { summary: 'm' },
      },
    },
    status: {
      control: 'select',
      options: ['online', 'away', 'ban', 'offline'],
      description: '아바타의 상태',
      table: {
        type: { summary: 'AvatarStatus' },
        defaultValue: { summary: 'offline' },
      },
    },
    showStatus: {
      control: { type: 'boolean' },
      description: '상태 표시 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
      table: {
        type: { summary: 'string' },
      },
    },
    color: {
      control: 'color',
      description:
        '아바타 색상 (CSS color 값). animalType을 사용할 때만 적용됩니다.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'var(--color-icon-primary)' },
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {},
};

// Size 스토리
export const SizeSmall: Story = {
  args: {
    size: 's',
  },
};

export const SizeMedium: Story = {
  args: {
    size: 'm',
  },
};

export const SizeLarge: Story = {
  args: {
    size: 'L',
  },
};

// Status 스토리
export const StatusOnline: Story = {
  args: {
    status: 'online',
  },
};

export const StatusAway: Story = {
  args: {
    status: 'away',
  },
};

export const StatusBan: Story = {
  args: {
    status: 'ban',
  },
};

export const StatusOffline: Story = {
  args: {
    status: 'offline',
  },
};

// Theme 스토리 (dark class로 테마 전환)
export const LightTheme: Story = {
  args: {
    status: 'online',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#ffffff' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = {
  args: {
    status: 'online',
  },
  decorators: [
    (Story) => (
      <div
        className="dark"
        style={{ padding: '20px', backgroundColor: '#030712' }}
      >
        <Story />
      </div>
    ),
  ],
};

// ShowStatus 스토리
export const WithoutStatus: Story = {
  args: {
    showStatus: false,
  },
};

export const WithStatus: Story = {
  args: {
    showStatus: true,
    status: 'online',
  },
};

// 조합 스토리
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Avatar size="s" status="online" />
      <Avatar size="m" status="online" />
      <Avatar size="L" status="online" />
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

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Avatar status="online" />
      <Avatar status="away" />
      <Avatar status="ban" />
      <Avatar status="offline" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 status 타입을 한 번에 확인할 수 있습니다.',
      },
    },
  },
};

export const LightThemeStatuses: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#ffffff',
      }}
    >
      <Avatar status="online" />
      <Avatar status="away" />
      <Avatar status="ban" />
      <Avatar status="offline" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Light 테마의 모든 status 타입을 확인할 수 있습니다.',
      },
    },
  },
};

export const DarkThemeStatuses: Story = {
  render: () => (
    <div
      className="dark"
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#030712',
      }}
    >
      <Avatar status="online" />
      <Avatar status="away" />
      <Avatar status="ban" />
      <Avatar status="offline" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dark 테마의 모든 status 타입을 확인할 수 있습니다.',
      },
    },
  },
};

export const SizeAndStatusMatrix: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Size / Status</div>
        <div style={{ fontWeight: 'bold' }}>Online</div>
        <div style={{ fontWeight: 'bold' }}>Away</div>
        <div style={{ fontWeight: 'bold' }}>Ban</div>
        <div style={{ fontWeight: 'bold' }}>Offline</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Small (s)</div>
        <Avatar size="s" status="online" />
        <Avatar size="s" status="away" />
        <Avatar size="s" status="ban" />
        <Avatar size="s" status="offline" />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Medium (m)</div>
        <Avatar size="m" status="online" />
        <Avatar size="m" status="away" />
        <Avatar size="m" status="ban" />
        <Avatar size="m" status="offline" />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Large (L)</div>
        <Avatar size="L" status="online" />
        <Avatar size="L" status="away" />
        <Avatar size="L" status="ban" />
        <Avatar size="L" status="offline" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '모든 size와 status의 조합을 한눈에 확인할 수 있는 매트릭스입니다.',
      },
    },
  },
};

export const ThemeComparison: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Theme / Status</div>
        <div style={{ fontWeight: 'bold' }}>Online</div>
        <div style={{ fontWeight: 'bold' }}>Away</div>
        <div style={{ fontWeight: 'bold' }}>Ban</div>
        <div style={{ fontWeight: 'bold' }}>Offline</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Light</div>
        <Avatar status="online" />
        <Avatar status="away" />
        <Avatar status="ban" />
        <Avatar status="offline" />
      </div>
      <div
        className="dark"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#030712',
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#ffffff' }}>Dark</div>
        <Avatar status="online" />
        <Avatar status="away" />
        <Avatar status="ban" />
        <Avatar status="offline" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Light/Dark 테마와 status의 조합을 비교할 수 있습니다. dark 클래스로 테마가 자동 전환됩니다.',
      },
    },
  },
};

// Color 스토리
export const WithAnimalType: Story = {
  args: {
    animalType: 'leopard',
    status: 'online',
  },
  parameters: {
    docs: {
      description: {
        story:
          'animalType을 사용하면 자동으로 --color-icon-primary 색상이 적용됩니다.',
      },
    },
  },
};

export const WithCustomColor: Story = {
  args: {
    animalType: 'leopard',
    color: '#FF6B6B',
    status: 'online',
  },
  parameters: {
    docs: {
      description: {
        story: 'color prop으로 커스텀 색상을 지정할 수 있습니다.',
      },
    },
  },
};

export const ColorVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <Avatar animalType="tiger" color="#FF6B6B" status="online" />
        <span style={{ fontSize: '12px' }}>Red</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <Avatar animalType="fox" color="#4ECDC4" status="online" />
        <span style={{ fontSize: '12px' }}>Cyan</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <Avatar animalType="owl" color="#FFE66D" status="online" />
        <span style={{ fontSize: '12px' }}>Yellow</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <Avatar animalType="wolf" color="#A8E6CF" status="online" />
        <span style={{ fontSize: '12px' }}>Green</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <Avatar animalType="bear" color="#B4A7D6" status="online" />
        <span style={{ fontSize: '12px' }}>Purple</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '다양한 색상을 적용한 아바타입니다. color prop으로 SVG 색상을 동적으로 변경할 수 있습니다.',
      },
    },
  },
};

export const AnimalTypes: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
      }}
    >
      {[
        'wolf',
        'tiger',
        'hawk',
        'owl',
        'fox',
        'hedgehog',
        'raven',
        'bear',
        'deer',
        'koala',
        'dog',
        'dolphin',
        'panda',
        'rabbit',
        'leopard',
        'cat',
      ].map((animal) => (
        <div
          key={animal}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <Avatar
            animalType={animal as AnimalType}
            status="online"
            showStatus={false}
          />
          <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>
            {animal}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '모든 동물 타입을 확인할 수 있습니다. animalType prop으로 자동으로 해당 동물 아바타가 표시됩니다.',
      },
    },
  },
};

export const CompleteExample: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '20px',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Light Theme - 다양한 상태
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Avatar size="s" status="online" />
            <span style={{ fontSize: '12px' }}>Small Online</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Avatar size="m" status="away" />
            <span style={{ fontSize: '12px' }}>Medium Away</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Avatar size="L" status="ban" />
            <span style={{ fontSize: '12px' }}>Large Ban</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Avatar size="m" status="offline" showStatus={false} />
            <span style={{ fontSize: '12px' }}>No Status</span>
          </div>
        </div>
      </div>
      <div
        className="dark"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '20px',
          backgroundColor: '#030712',
        }}
      >
        <div
          style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}
        >
          Dark Theme - 다양한 상태
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Avatar size="s" status="online" />
            <span style={{ fontSize: '12px', color: '#ffffff' }}>
              Small Online
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Avatar size="m" status="away" />
            <span style={{ fontSize: '12px', color: '#ffffff' }}>
              Medium Away
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Avatar size="L" status="ban" />
            <span style={{ fontSize: '12px', color: '#ffffff' }}>
              Large Ban
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Avatar size="m" status="offline" showStatus={false} />
            <span style={{ fontSize: '12px', color: '#ffffff' }}>
              No Status
            </span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 사용 예시로 다양한 아바타 조합을 확인할 수 있습니다.',
      },
    },
  },
};
