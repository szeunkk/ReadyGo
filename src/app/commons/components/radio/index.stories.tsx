import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Radio from './index';

const meta = {
  title: 'Commons/Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '라디오 컴포넌트입니다. status, state, theme 등의 속성을 통해 다양한 상태를 표현할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['unselected', 'selected'],
      description: '라디오의 선택 상태',
      table: {
        type: { summary: 'RadioStatus' },
        defaultValue: { summary: 'unselected' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'press', 'focus', 'disabled', 'error'],
      description: '라디오의 상태',
      table: {
        type: { summary: 'RadioState' },
        defaultValue: { summary: 'default' },
      },
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '라디오의 테마',
      table: {
        type: { summary: 'RadioTheme' },
        defaultValue: { summary: 'light' },
      },
    },
  },
} satisfies Meta<typeof Radio>;

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
      <Radio status="unselected" />
      <Radio status="selected" />
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
      <Radio status="unselected" state="default" />
      <Radio status="unselected" state="hover" />
      <Radio status="unselected" state="press" />
      <Radio status="unselected" state="focus" />
      <Radio status="unselected" state="disabled" />
      <Radio status="unselected" state="error" />
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
      <Radio status="selected" state="default" />
      <Radio status="selected" state="hover" />
      <Radio status="selected" state="press" />
      <Radio status="selected" state="focus" />
      <Radio status="selected" state="disabled" />
      <Radio status="selected" state="error" />
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
        <Radio status="unselected" state="default" />
        <Radio status="unselected" state="hover" />
        <Radio status="unselected" state="press" />
        <Radio status="unselected" state="focus" />
        <Radio status="unselected" state="disabled" />
        <Radio status="unselected" state="error" />
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
        <Radio status="selected" state="default" />
        <Radio status="selected" state="hover" />
        <Radio status="selected" state="press" />
        <Radio status="selected" state="focus" />
        <Radio status="selected" state="disabled" />
        <Radio status="selected" state="error" />
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
        <Radio theme="light" status="unselected" state="default" />
        <Radio theme="light" status="selected" state="default" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Radio theme="light" status="unselected" state="hover" />
        <Radio theme="light" status="selected" state="hover" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Radio theme="light" status="unselected" state="disabled" />
        <Radio theme="light" status="selected" state="disabled" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Radio theme="light" status="unselected" state="error" />
        <Radio theme="light" status="selected" state="error" />
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
        <Radio theme="dark" status="unselected" state="default" />
        <Radio theme="dark" status="selected" state="default" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Radio theme="dark" status="unselected" state="hover" />
        <Radio theme="dark" status="selected" state="hover" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Radio theme="dark" status="unselected" state="disabled" />
        <Radio theme="dark" status="selected" state="disabled" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Radio theme="dark" status="unselected" state="error" />
        <Radio theme="dark" status="selected" state="error" />
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
        <Radio status="unselected" />
        <span>옵션 1</span>
      </label>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Radio status="selected" />
        <span>옵션 2</span>
      </label>
      <label
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          opacity: 0.5,
        }}
      >
        <Radio status="unselected" state="disabled" />
        <span>옵션 3 (비활성화)</span>
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

const RadioGroupComponent = () => {
  const [selectedValue, setSelectedValue] = React.useState('option1');

  const handleChange = (value: string) => {
    setSelectedValue(value);
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
        <Radio
          name="radio-group"
          status={selectedValue === 'option1' ? 'selected' : 'unselected'}
          onChange={() => handleChange('option1')}
        />
        <span>옵션 1</span>
      </label>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Radio
          name="radio-group"
          status={selectedValue === 'option2' ? 'selected' : 'unselected'}
          onChange={() => handleChange('option2')}
        />
        <span>옵션 2</span>
      </label>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Radio
          name="radio-group"
          status={selectedValue === 'option3' ? 'selected' : 'unselected'}
          onChange={() => handleChange('option3')}
        />
        <span>옵션 3</span>
      </label>
    </div>
  );
};

export const RadioGroup: Story = {
  render: () => <RadioGroupComponent />,
  parameters: {
    docs: {
      description: {
        story:
          '라디오 그룹으로 사용하는 경우입니다. 하나의 옵션만 선택할 수 있습니다.',
      },
    },
  },
};
