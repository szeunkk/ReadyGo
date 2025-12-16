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
      description: '셀렉트박스의 추가 정보',
    },
    disabled: {
      control: 'boolean',
      description: '셀렉트박스의 비활성화 여부',
    },
  },
} satisfies Meta<typeof Selectbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
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
    items: defaultItems,
  },
};

// Label과 Additional Info가 있는 스토리
export const WithLabelAndInfo: Story = {
  args: {
    variant: 'primary',
    state: 'default',
    label: '선택하세요',
    additionalInfo: '원하는 옵션을 선택해주세요',
    items: defaultItems,
  },
};

// Variant 스토리
export const VariantPrimary: Story = {
  args: {
    variant: 'primary',
    state: 'default',
    items: defaultItems,
  },
};

export const VariantHover: Story = {
  args: {
    variant: 'hover',
    state: 'default',
    items: defaultItems,
  },
};

export const VariantActive: Story = {
  args: {
    variant: 'active',
    state: 'default',
    items: defaultItems,
  },
};

export const VariantFilled: Story = {
  args: {
    variant: 'filled',
    state: 'default',
    items: defaultItems,
  },
};

export const VariantDanger: Story = {
  args: {
    variant: 'danger',
    state: 'default',
    items: defaultItems,
  },
};

export const VariantDisabled: Story = {
  args: {
    variant: 'disabled',
    items: defaultItems,
  },
};

// State 스토리
export const StateDefault: Story = {
  args: {
    variant: 'primary',
    state: 'default',
    items: defaultItems,
  },
};

export const StateHover: Story = {
  args: {
    variant: 'primary',
    state: 'hover',
    items: defaultItems,
  },
};

export const StateFilled: Story = {
  args: {
    variant: 'primary',
    state: 'filled',
    items: defaultItems,
  },
};

export const StateError: Story = {
  args: {
    variant: 'primary',
    state: 'error',
    items: defaultItems,
  },
};

export const StateDisabled: Story = {
  args: {
    variant: 'primary',
    state: 'disabled',
    items: defaultItems,
  },
};

// Theme 스토리
export const LightTheme: Story = {
  args: {
    theme: 'light',
    variant: 'primary',
    state: 'default',
    items: defaultItems,
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
    variant: 'primary',
    state: 'default',
    items: defaultItems,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
};

// Children을 사용한 스토리
export const WithChildren: Story = {
  args: {
    variant: 'primary',
    state: 'default',
    items: defaultItems,
    children: (
      <>
        <span>아이콘</span>
        <span>선택된 값</span>
      </>
    ),
  },
};

// 아이콘이 있는 아이템 스토리
export const WithIconItems: Story = {
  args: {
    variant: 'primary',
    state: 'default',
    items: [
      {
        id: '1',
        value: (
          <>
            <span>📁</span> <span>폴더 1</span>
          </>
        ),
      },
      {
        id: '2',
        value: (
          <>
            <span>📁</span> <span>폴더 2</span>
          </>
        ),
      },
      {
        id: '3',
        value: (
          <>
            <span>📁</span> <span>폴더 3</span>
          </>
        ),
      },
    ],
  },
};

// 선택된 아이템이 있는 스토리
export const WithSelectedItem: Story = {
  args: {
    variant: 'primary',
    state: 'default',
    items: defaultItems,
    selectedItemId: '2',
  },
};

// 많은 아이템이 있는 스토리
export const WithManyItems: Story = {
  args: {
    variant: 'primary',
    state: 'default',
    label: '많은 옵션',
    items: Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      value: `옵션 ${i + 1}`,
    })),
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
      <Selectbox
        variant="primary"
        state="default"
        items={defaultItems}
        label="Primary"
      />
      <Selectbox
        variant="hover"
        state="default"
        items={defaultItems}
        label="Hover"
      />
      <Selectbox
        variant="active"
        state="default"
        items={defaultItems}
        label="Active"
      />
      <Selectbox
        variant="filled"
        state="default"
        items={defaultItems}
        label="Filled"
      />
      <Selectbox
        variant="danger"
        state="default"
        items={defaultItems}
        label="Danger"
      />
      <Selectbox variant="disabled" items={defaultItems} label="Disabled" />
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
      <Selectbox
        variant="primary"
        state="default"
        items={defaultItems}
        label="Default"
      />
      <Selectbox
        variant="primary"
        state="hover"
        items={defaultItems}
        label="Hover"
      />
      <Selectbox
        variant="primary"
        state="filled"
        items={defaultItems}
        label="Filled"
      />
      <Selectbox
        variant="primary"
        state="error"
        items={defaultItems}
        label="Error"
      />
      <Selectbox
        variant="primary"
        state="disabled"
        items={defaultItems}
        label="Disabled"
      />
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
        items={defaultItems}
        label="Primary"
      />
      <Selectbox
        theme="light"
        variant="active"
        state="filled"
        items={defaultItems}
        label="Active Filled"
      />
      <Selectbox
        theme="light"
        variant="danger"
        state="error"
        items={defaultItems}
        label="Danger Error"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Light 테마의 다양한 variant와 state 조합을 확인할 수 있습니다.',
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
        items={defaultItems}
        label="Primary"
      />
      <Selectbox
        theme="dark"
        variant="active"
        state="filled"
        items={defaultItems}
        label="Active Filled"
      />
      <Selectbox
        theme="dark"
        variant="danger"
        state="error"
        items={defaultItems}
        label="Danger Error"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dark 테마의 다양한 variant와 state 조합을 확인할 수 있습니다.',
      },
    },
  },
};

// Interactive 스토리
const InteractiveSelectbox = () => {
  const [selectedId, setSelectedId] = React.useState<string | undefined>('2');

  return (
    <Selectbox
      variant="primary"
      state="default"
      items={defaultItems}
      selectedItemId={selectedId}
      onSelect={setSelectedId}
      label="인터랙티브 셀렉트박스"
      additionalInfo="아이템을 선택하면 상태가 업데이트됩니다"
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveSelectbox />,
  parameters: {
    docs: {
      description: {
        story:
          '실제로 동작하는 셀렉트박스입니다. 아이템을 선택하면 상태가 업데이트됩니다.',
      },
    },
  },
};
