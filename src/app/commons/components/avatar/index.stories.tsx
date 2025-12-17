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
          '아바타 컴포넌트입니다. size, status, theme 등의 속성을 통해 다양한 스타일을 적용할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: '아바타 이미지 소스 URL',
      table: {
        type: { summary: 'string' },
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
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '아바타의 테마',
      table: {
        type: { summary: 'AvatarTheme' },
        defaultValue: { summary: 'light' },
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
    statusRingColor: {
      control: 'color',
      description: '상태 링 색상 (커스텀)',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
      table: {
        type: { summary: 'string' },
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

// Theme 스토리
export const LightTheme: Story = {
  args: {
    theme: 'light',
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
    theme: 'dark',
    status: 'online',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
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

// Custom Image 스토리
export const WithCustomImage: Story = {
  args: {
    src: 'https://via.placeholder.com/100',
    alt: 'Custom Avatar',
  },
};

// Custom Status Ring Color 스토리
export const CustomStatusRingColor: Story = {
  args: {
    status: 'online',
    statusRingColor: '#FF00FF',
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
      <Avatar theme="light" status="online" />
      <Avatar theme="light" status="away" />
      <Avatar theme="light" status="ban" />
      <Avatar theme="light" status="offline" />
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
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#030712',
      }}
    >
      <Avatar theme="dark" status="online" />
      <Avatar theme="dark" status="away" />
      <Avatar theme="dark" status="ban" />
      <Avatar theme="dark" status="offline" />
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

export const ThemeAndStatusMatrix: Story = {
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
        <Avatar theme="light" status="online" />
        <Avatar theme="light" status="away" />
        <Avatar theme="light" status="ban" />
        <Avatar theme="light" status="offline" />
      </div>
      <div
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
        <Avatar theme="dark" status="online" />
        <Avatar theme="dark" status="away" />
        <Avatar theme="dark" status="ban" />
        <Avatar theme="dark" status="offline" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '모든 theme과 status의 조합을 한눈에 확인할 수 있는 매트릭스입니다.',
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
            <Avatar theme="light" size="s" status="online" />
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
            <Avatar theme="light" size="m" status="away" />
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
            <Avatar theme="light" size="L" status="ban" />
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
            <Avatar
              theme="light"
              size="m"
              status="offline"
              showStatus={false}
            />
            <span style={{ fontSize: '12px' }}>No Status</span>
          </div>
        </div>
      </div>
      <div
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
            <Avatar theme="dark" size="s" status="online" />
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
            <Avatar theme="dark" size="m" status="away" />
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
            <Avatar theme="dark" size="L" status="ban" />
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
            <Avatar theme="dark" size="m" status="offline" showStatus={false} />
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
