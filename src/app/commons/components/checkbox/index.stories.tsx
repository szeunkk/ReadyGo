import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Checkbox from './index';

const meta = {
  title: 'Commons/Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '체크박스 컴포넌트입니다. status, state, theme 등의 속성을 통해 다양한 상태를 표현할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['unselected', 'selected', 'partial'],
      description: '체크박스의 선택 상태',
      table: {
        type: { summary: 'CheckboxStatus' },
        defaultValue: { summary: 'unselected' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'press', 'focus', 'disabled', 'error'],
      description: '체크박스의 상태',
      table: {
        type: { summary: 'CheckboxState' },
        defaultValue: { summary: 'default' },
      },
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '체크박스의 테마',
      table: {
        type: { summary: 'CheckboxTheme' },
        defaultValue: { summary: 'light' },
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    status: 'unselected',
  },
};

// Status 스토리
export const Unselected: Story = {
  args: {
    status: 'unselected',
  },
};

export const Selected: Story = {
  args: {
    status: 'selected',
  },
};

export const Partial: Story = {
  args: {
    status: 'partial',
  },
};

// State 스토리 - Unselected
export const UnselectedDefault: Story = {
  args: {
    status: 'unselected',
    state: 'default',
  },
};

export const UnselectedHover: Story = {
  args: {
    status: 'unselected',
    state: 'hover',
  },
};

export const UnselectedPress: Story = {
  args: {
    status: 'unselected',
    state: 'press',
  },
};

export const UnselectedFocus: Story = {
  args: {
    status: 'unselected',
    state: 'focus',
  },
};

export const UnselectedDisabled: Story = {
  args: {
    status: 'unselected',
    state: 'disabled',
  },
};

export const UnselectedError: Story = {
  args: {
    status: 'unselected',
    state: 'error',
  },
};

// State 스토리 - Selected
export const SelectedDefault: Story = {
  args: {
    status: 'selected',
    state: 'default',
  },
};

export const SelectedHover: Story = {
  args: {
    status: 'selected',
    state: 'hover',
  },
};

export const SelectedPress: Story = {
  args: {
    status: 'selected',
    state: 'press',
  },
};

export const SelectedFocus: Story = {
  args: {
    status: 'selected',
    state: 'focus',
  },
};

export const SelectedDisabled: Story = {
  args: {
    status: 'selected',
    state: 'disabled',
  },
};

export const SelectedError: Story = {
  args: {
    status: 'selected',
    state: 'error',
  },
};

// State 스토리 - Partial
export const PartialDefault: Story = {
  args: {
    status: 'partial',
    state: 'default',
  },
};

export const PartialHover: Story = {
  args: {
    status: 'partial',
    state: 'hover',
  },
};

export const PartialPress: Story = {
  args: {
    status: 'partial',
    state: 'press',
  },
};

export const PartialFocus: Story = {
  args: {
    status: 'partial',
    state: 'focus',
  },
};

export const PartialDisabled: Story = {
  args: {
    status: 'partial',
    state: 'disabled',
  },
};

export const PartialError: Story = {
  args: {
    status: 'partial',
    state: 'error',
  },
};

// Theme 스토리
export const LightTheme: Story = {
  args: {
    theme: 'light',
    status: 'selected',
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
    status: 'selected',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
};

// 조합 스토리
export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Checkbox status="unselected" />
      <Checkbox status="selected" />
      <Checkbox status="partial" />
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

export const AllStatesUnselected: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Checkbox status="unselected" state="default" />
      <Checkbox status="unselected" state="hover" />
      <Checkbox status="unselected" state="press" />
      <Checkbox status="unselected" state="focus" />
      <Checkbox status="unselected" state="disabled" />
      <Checkbox status="unselected" state="error" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Unselected 상태의 모든 state 타입을 확인할 수 있습니다.',
      },
    },
  },
};

export const AllStatesSelected: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Checkbox status="selected" state="default" />
      <Checkbox status="selected" state="hover" />
      <Checkbox status="selected" state="press" />
      <Checkbox status="selected" state="focus" />
      <Checkbox status="selected" state="disabled" />
      <Checkbox status="selected" state="error" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Selected 상태의 모든 state 타입을 확인할 수 있습니다.',
      },
    },
  },
};

export const AllStatesPartial: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Checkbox status="partial" state="default" />
      <Checkbox status="partial" state="hover" />
      <Checkbox status="partial" state="press" />
      <Checkbox status="partial" state="focus" />
      <Checkbox status="partial" state="disabled" />
      <Checkbox status="partial" state="error" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Partial 상태의 모든 state 타입을 확인할 수 있습니다.',
      },
    },
  },
};

export const StatusAndStateMatrix: Story = {
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
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Status / State</div>
        <div style={{ fontWeight: 'bold' }}>Default</div>
        <div style={{ fontWeight: 'bold' }}>Hover</div>
        <div style={{ fontWeight: 'bold' }}>Press</div>
        <div style={{ fontWeight: 'bold' }}>Focus</div>
        <div style={{ fontWeight: 'bold' }}>Disabled</div>
        <div style={{ fontWeight: 'bold' }}>Error</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Unselected</div>
        <Checkbox status="unselected" state="default" />
        <Checkbox status="unselected" state="hover" />
        <Checkbox status="unselected" state="press" />
        <Checkbox status="unselected" state="focus" />
        <Checkbox status="unselected" state="disabled" />
        <Checkbox status="unselected" state="error" />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Selected</div>
        <Checkbox status="selected" state="default" />
        <Checkbox status="selected" state="hover" />
        <Checkbox status="selected" state="press" />
        <Checkbox status="selected" state="focus" />
        <Checkbox status="selected" state="disabled" />
        <Checkbox status="selected" state="error" />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Partial</div>
        <Checkbox status="partial" state="default" />
        <Checkbox status="partial" state="hover" />
        <Checkbox status="partial" state="press" />
        <Checkbox status="partial" state="focus" />
        <Checkbox status="partial" state="disabled" />
        <Checkbox status="partial" state="error" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '모든 status와 state의 조합을 한눈에 확인할 수 있는 매트릭스입니다.',
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
      }}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox theme="light" status="unselected" state="default" />
        <Checkbox theme="light" status="selected" state="default" />
        <Checkbox theme="light" status="partial" state="default" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox theme="light" status="unselected" state="hover" />
        <Checkbox theme="light" status="selected" state="hover" />
        <Checkbox theme="light" status="partial" state="hover" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox theme="light" status="unselected" state="disabled" />
        <Checkbox theme="light" status="selected" state="disabled" />
        <Checkbox theme="light" status="partial" state="disabled" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox theme="light" status="unselected" state="error" />
        <Checkbox theme="light" status="selected" state="error" />
        <Checkbox theme="light" status="partial" state="error" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Light 테마의 모든 status와 state 조합을 확인할 수 있습니다.',
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
      }}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox theme="dark" status="unselected" state="default" />
        <Checkbox theme="dark" status="selected" state="default" />
        <Checkbox theme="dark" status="partial" state="default" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox theme="dark" status="unselected" state="hover" />
        <Checkbox theme="dark" status="selected" state="hover" />
        <Checkbox theme="dark" status="partial" state="hover" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox theme="dark" status="unselected" state="disabled" />
        <Checkbox theme="dark" status="selected" state="disabled" />
        <Checkbox theme="dark" status="partial" state="disabled" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox theme="dark" status="unselected" state="error" />
        <Checkbox theme="dark" status="selected" state="error" />
        <Checkbox theme="dark" status="partial" state="error" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dark 테마의 모든 status와 state 조합을 확인할 수 있습니다.',
      },
    },
  },
};

export const WithLabels: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Checkbox status="unselected" />
        <span>옵션 1</span>
      </label>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Checkbox status="selected" />
        <span>옵션 2</span>
      </label>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Checkbox status="partial" />
        <span>옵션 3 (일부 선택)</span>
      </label>
      <label
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          opacity: 0.5,
        }}
      >
        <Checkbox status="unselected" state="disabled" />
        <span>옵션 4 (비활성화)</span>
      </label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 사용 예시로 라벨과 함께 사용하는 경우입니다.',
      },
    },
  },
};

const CheckboxGroupComponent = () => {
  const [checkedItems, setCheckedItems] = React.useState({
    option1: false,
    option2: true,
    option3: false,
  });

  const handleChange = (option: keyof typeof checkedItems) => {
    setCheckedItems((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const allChecked = Object.values(checkedItems).every(Boolean);
  const someChecked = Object.values(checkedItems).some(Boolean);
  const parentStatus = allChecked
    ? 'selected'
    : someChecked
    ? 'partial'
    : 'unselected';

  const handleParentChange = () => {
    const newValue = !allChecked;
    setCheckedItems({
      option1: newValue,
      option2: newValue,
      option3: newValue,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Checkbox status={parentStatus} onChange={handleParentChange} />
        <span>전체 선택</span>
      </label>
      <div
        style={{
          marginLeft: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Checkbox
            status={checkedItems.option1 ? 'selected' : 'unselected'}
            onChange={() => handleChange('option1')}
          />
          <span>옵션 1</span>
        </label>
        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Checkbox
            status={checkedItems.option2 ? 'selected' : 'unselected'}
            onChange={() => handleChange('option2')}
          />
          <span>옵션 2</span>
        </label>
        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Checkbox
            status={checkedItems.option3 ? 'selected' : 'unselected'}
            onChange={() => handleChange('option3')}
          />
          <span>옵션 3</span>
        </label>
      </div>
    </div>
  );
};

export const CheckboxGroup: Story = {
  render: () => <CheckboxGroupComponent />,
  parameters: {
    docs: {
      description: {
        story:
          '체크박스 그룹으로 사용하는 경우입니다. 전체 선택 시 partial 상태도 확인할 수 있습니다.',
      },
    },
  },
};
