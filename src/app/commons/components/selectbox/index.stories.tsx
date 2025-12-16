import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Selectbox from './index';

const meta = {
  title: 'Commons/Components/Selectbox',
  component: Selectbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '셀렉트박스 컴포넌트입니다. variant, state, theme 등의 속성을 통해 다양한 상태를 표현할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'hover', 'active', 'filled', 'danger', 'disabled'],
      description: '셀렉트박스의 variant',
      table: {
        type: { summary: 'SelectboxVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'filled', 'error', 'disabled'],
      description: '셀렉트박스의 상태',
      table: {
        type: { summary: 'SelectboxState' },
        defaultValue: { summary: 'default' },
      },
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '셀렉트박스의 테마',
      table: {
        type: { summary: 'SelectboxTheme' },
        defaultValue: { summary: 'light' },
      },
    },
    label: {
      control: 'text',
      description: '셀렉트박스의 라벨',
    },
    additionalInfo: {
      control: 'text',
      description: '추가 정보 텍스트',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
      defaultValue: '선택하세요',
    },
  },
} satisfies Meta<typeof Selectbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  { id: '1', value: '옵션 1' },
  { id: '2', value: '옵션 2' },
  { id: '3', value: '옵션 3' },
  { id: '4', value: '옵션 4' },
];

// 기본 스토리
export const Default: Story = {
  args: {
    variant: 'primary',
    state: 'default',
    items: sampleItems,
  },
};

// Variant 스토리
export const Primary: Story = {
  args: {
    variant: 'primary',
    state: 'default',
    items: sampleItems,
  },
};

export const Hover: Story = {
  args: {
    variant: 'hover',
    state: 'default',
    items: sampleItems,
  },
};

export const Active: Story = {
  args: {
    variant: 'active',
    state: 'default',
    items: sampleItems,
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    state: 'default',
    items: sampleItems,
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    state: 'default',
    items: sampleItems,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'disabled',
    state: 'disabled',
    items: sampleItems,
  },
};

// State 스토리
export const StateDefault: Story = {
  args: {
    variant: 'primary',
    state: 'default',
    items: sampleItems,
  },
};

export const StateHover: Story = {
  args: {
    variant: 'primary',
    state: 'hover',
    items: sampleItems,
  },
};

export const StateFilled: Story = {
  args: {
    variant: 'primary',
    state: 'filled',
    items: sampleItems,
  },
};

export const StateError: Story = {
  args: {
    variant: 'primary',
    state: 'error',
    items: sampleItems,
  },
};

export const StateDisabled: Story = {
  args: {
    variant: 'primary',
    state: 'disabled',
    items: sampleItems,
  },
};

// Theme 스토리
export const LightTheme: Story = {
  args: {
    theme: 'light',
    variant: 'primary',
    state: 'default',
    items: sampleItems,
  },
  decorators: [
    (Story) => (
      <div
        style={{ padding: '20px', backgroundColor: '#ffffff', width: '300px' }}
      >
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    variant: 'primary',
    state: 'default',
    items: sampleItems,
  },
  decorators: [
    (Story) => (
      <div
        style={{ padding: '20px', backgroundColor: '#030712', width: '300px' }}
      >
        <Story />
      </div>
    ),
  ],
};

// Label과 Additional Info
export const WithLabel: Story = {
  args: {
    label: '셀렉트박스',
    items: sampleItems,
  },
};

export const WithLabelAndInfo: Story = {
  args: {
    label: '셀렉트박스',
    additionalInfo: '추가 정보를 입력하세요',
    items: sampleItems,
  },
};

// Children 사용
export const WithChildren: Story = {
  args: {
    items: sampleItems,
    children: (
      <>
        <span>🎯</span>
        <span>선택된 옵션</span>
      </>
    ),
  },
};

// 선택된 아이템
export const WithSelectedItem: Story = {
  args: {
    items: sampleItems,
    selectedId: '2',
  },
};

// 조합 스토리
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '300px',
      }}
    >
      <Selectbox variant="primary" state="default" items={sampleItems} />
      <Selectbox variant="hover" state="default" items={sampleItems} />
      <Selectbox variant="active" state="default" items={sampleItems} />
      <Selectbox variant="filled" state="default" items={sampleItems} />
      <Selectbox variant="danger" state="default" items={sampleItems} />
      <Selectbox variant="disabled" state="disabled" items={sampleItems} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 variant 타입을 한 번에 확인할 수 있습니다.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '300px',
      }}
    >
      <Selectbox variant="primary" state="default" items={sampleItems} />
      <Selectbox variant="primary" state="hover" items={sampleItems} />
      <Selectbox variant="primary" state="filled" items={sampleItems} />
      <Selectbox variant="primary" state="error" items={sampleItems} />
      <Selectbox variant="primary" state="disabled" items={sampleItems} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 state 타입을 한 번에 확인할 수 있습니다.',
      },
    },
  },
};

export const VariantAndStateMatrix: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '600px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Variant / State</div>
        <div style={{ fontWeight: 'bold' }}>Default</div>
        <div style={{ fontWeight: 'bold' }}>Hover</div>
        <div style={{ fontWeight: 'bold' }}>Filled</div>
        <div style={{ fontWeight: 'bold' }}>Error</div>
        <div style={{ fontWeight: 'bold' }}>Disabled</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Primary</div>
        <Selectbox variant="primary" state="default" items={sampleItems} />
        <Selectbox variant="primary" state="hover" items={sampleItems} />
        <Selectbox variant="primary" state="filled" items={sampleItems} />
        <Selectbox variant="primary" state="error" items={sampleItems} />
        <Selectbox variant="primary" state="disabled" items={sampleItems} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Hover</div>
        <Selectbox variant="hover" state="default" items={sampleItems} />
        <Selectbox variant="hover" state="hover" items={sampleItems} />
        <Selectbox variant="hover" state="filled" items={sampleItems} />
        <Selectbox variant="hover" state="error" items={sampleItems} />
        <Selectbox variant="hover" state="disabled" items={sampleItems} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Active</div>
        <Selectbox variant="active" state="default" items={sampleItems} />
        <Selectbox variant="active" state="hover" items={sampleItems} />
        <Selectbox variant="active" state="filled" items={sampleItems} />
        <Selectbox variant="active" state="error" items={sampleItems} />
        <Selectbox variant="active" state="disabled" items={sampleItems} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Filled</div>
        <Selectbox variant="filled" state="default" items={sampleItems} />
        <Selectbox variant="filled" state="hover" items={sampleItems} />
        <Selectbox variant="filled" state="filled" items={sampleItems} />
        <Selectbox variant="filled" state="error" items={sampleItems} />
        <Selectbox variant="filled" state="disabled" items={sampleItems} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Danger</div>
        <Selectbox variant="danger" state="default" items={sampleItems} />
        <Selectbox variant="danger" state="hover" items={sampleItems} />
        <Selectbox variant="danger" state="filled" items={sampleItems} />
        <Selectbox variant="danger" state="error" items={sampleItems} />
        <Selectbox variant="danger" state="disabled" items={sampleItems} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '모든 variant와 state의 조합을 한눈에 확인할 수 있는 매트릭스입니다.',
      },
    },
  },
};

export const LightThemeVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px',
        backgroundColor: '#ffffff',
        width: '300px',
      }}
    >
      <Selectbox
        theme="light"
        variant="primary"
        state="default"
        items={sampleItems}
      />
      <Selectbox
        theme="light"
        variant="hover"
        state="default"
        items={sampleItems}
      />
      <Selectbox
        theme="light"
        variant="active"
        state="default"
        items={sampleItems}
      />
      <Selectbox
        theme="light"
        variant="filled"
        state="default"
        items={sampleItems}
      />
      <Selectbox
        theme="light"
        variant="danger"
        state="default"
        items={sampleItems}
      />
      <Selectbox
        theme="light"
        variant="disabled"
        state="disabled"
        items={sampleItems}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Light 테마의 모든 variant를 확인할 수 있습니다.',
      },
    },
  },
};

export const DarkThemeVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px',
        backgroundColor: '#030712',
        width: '300px',
      }}
    >
      <Selectbox
        theme="dark"
        variant="primary"
        state="default"
        items={sampleItems}
      />
      <Selectbox
        theme="dark"
        variant="hover"
        state="default"
        items={sampleItems}
      />
      <Selectbox
        theme="dark"
        variant="active"
        state="default"
        items={sampleItems}
      />
      <Selectbox
        theme="dark"
        variant="filled"
        state="default"
        items={sampleItems}
      />
      <Selectbox
        theme="dark"
        variant="danger"
        state="default"
        items={sampleItems}
      />
      <Selectbox
        theme="dark"
        variant="disabled"
        state="disabled"
        items={sampleItems}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dark 테마의 모든 variant를 확인할 수 있습니다.',
      },
    },
  },
};

// 실제 사용 예시
const SelectboxWithStateComponent = () => {
  const [selectedId, setSelectedId] = React.useState<string | undefined>();

  return (
    <div style={{ width: '300px' }}>
      <Selectbox
        label="옵션 선택"
        additionalInfo="원하는 옵션을 선택하세요"
        items={sampleItems}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </div>
  );
};

export const InteractiveExample: Story = {
  render: () => <SelectboxWithStateComponent />,
  parameters: {
    docs: {
      description: {
        story: '실제 사용 예시로 상태 관리와 함께 사용하는 경우입니다.',
      },
    },
  },
};

export const WithManyItems: Story = {
  args: {
    label: '많은 옵션',
    items: Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      value: `옵션 ${i + 1}`,
    })),
  },
};

export const WithCustomChildren: Story = {
  args: {
    items: sampleItems,
    children: (
      <>
        <span style={{ fontSize: '20px' }}>⭐</span>
        <span>커스텀 컨텐츠</span>
      </>
    ),
    gap: 12,
  },
};
