import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Checkbox, { CheckboxStatus } from './index';

const meta = {
  title: 'Commons/Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '체크박스 컴포넌트입니다. status와 state 속성을 통해 다양한 상태를 표현할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['unselected', 'selected', 'partial'],
      description: '체크박스의 선택 상태 (제어 컴포넌트용)',
      table: {
        type: { summary: 'CheckboxStatus' },
      },
    },
    defaultStatus: {
      control: 'select',
      options: ['unselected', 'selected', 'partial'],
      description: '체크박스의 초기 선택 상태 (비제어 컴포넌트용)',
      table: {
        type: { summary: 'CheckboxStatus' },
        defaultValue: { summary: 'unselected' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'press', 'focus', 'disabled', 'error'],
      description: '체크박스의 상태 (CSS 전용)',
      table: {
        type: { summary: 'CheckboxState' },
        defaultValue: { summary: 'default' },
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    defaultStatus: 'unselected' as CheckboxStatus,
  },
};

// Status 스토리
export const Unselected: Story = {
  args: {
    defaultStatus: 'unselected',
  },
};

export const Selected: Story = {
  args: {
    defaultStatus: 'selected',
  },
};

export const Partial: Story = {
  args: {
    defaultStatus: 'partial',
  },
};

// State 스토리 - Unselected
export const UnselectedDefault: Story = {
  args: {
    defaultStatus: 'unselected',
    state: 'default',
  },
};

export const UnselectedHover: Story = {
  args: {
    defaultStatus: 'unselected',
    state: 'hover',
  },
};

export const UnselectedPress: Story = {
  args: {
    defaultStatus: 'unselected',
    state: 'press',
  },
};

export const UnselectedFocus: Story = {
  args: {
    defaultStatus: 'unselected',
    state: 'focus',
  },
};

export const UnselectedDisabled: Story = {
  args: {
    defaultStatus: 'unselected',
    state: 'disabled',
  },
};

export const UnselectedError: Story = {
  args: {
    defaultStatus: 'unselected',
    state: 'error',
  },
};

// State 스토리 - Selected
export const SelectedDefault: Story = {
  args: {
    defaultStatus: 'selected',
    state: 'default',
  },
};

export const SelectedHover: Story = {
  args: {
    defaultStatus: 'selected',
    state: 'hover',
  },
};

export const SelectedPress: Story = {
  args: {
    defaultStatus: 'selected',
    state: 'press',
  },
};

export const SelectedFocus: Story = {
  args: {
    defaultStatus: 'selected',
    state: 'focus',
  },
};

export const SelectedDisabled: Story = {
  args: {
    defaultStatus: 'selected',
    state: 'disabled',
  },
};

export const SelectedError: Story = {
  args: {
    defaultStatus: 'selected',
    state: 'error',
  },
};

// State 스토리 - Partial
export const PartialDefault: Story = {
  args: {
    defaultStatus: 'partial',
    state: 'default',
  },
};

export const PartialHover: Story = {
  args: {
    defaultStatus: 'partial',
    state: 'hover',
  },
};

export const PartialPress: Story = {
  args: {
    defaultStatus: 'partial',
    state: 'press',
  },
};

export const PartialFocus: Story = {
  args: {
    defaultStatus: 'partial',
    state: 'focus',
  },
};

export const PartialDisabled: Story = {
  args: {
    defaultStatus: 'partial',
    state: 'disabled',
  },
};

export const PartialError: Story = {
  args: {
    defaultStatus: 'partial',
    state: 'error',
  },
};

// Disabled prop 스토리
export const DisabledProp: Story = {
  args: {
    state: 'disabled',
    defaultStatus: 'selected',
  },
};

// 조합 스토리
export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Checkbox defaultStatus="unselected" />
      <Checkbox defaultStatus="selected" />
      <Checkbox defaultStatus="partial" />
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
      <Checkbox defaultStatus="unselected" state="default" />
      <Checkbox defaultStatus="unselected" state="hover" />
      <Checkbox defaultStatus="unselected" state="press" />
      <Checkbox defaultStatus="unselected" state="focus" />
      <Checkbox defaultStatus="unselected" state="disabled" />
      <Checkbox defaultStatus="unselected" state="error" />
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
      <Checkbox defaultStatus="selected" state="default" />
      <Checkbox defaultStatus="selected" state="hover" />
      <Checkbox defaultStatus="selected" state="press" />
      <Checkbox defaultStatus="selected" state="focus" />
      <Checkbox defaultStatus="selected" state="disabled" />
      <Checkbox defaultStatus="selected" state="error" />
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
      <Checkbox defaultStatus="partial" state="default" />
      <Checkbox defaultStatus="partial" state="hover" />
      <Checkbox defaultStatus="partial" state="press" />
      <Checkbox defaultStatus="partial" state="focus" />
      <Checkbox defaultStatus="partial" state="disabled" />
      <Checkbox defaultStatus="partial" state="error" />
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
        <Checkbox defaultStatus="unselected" state="default" />
        <Checkbox defaultStatus="unselected" state="hover" />
        <Checkbox defaultStatus="unselected" state="press" />
        <Checkbox defaultStatus="unselected" state="focus" />
        <Checkbox defaultStatus="unselected" state="disabled" />
        <Checkbox defaultStatus="unselected" state="error" />
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
        <Checkbox defaultStatus="selected" state="default" />
        <Checkbox defaultStatus="selected" state="hover" />
        <Checkbox defaultStatus="selected" state="press" />
        <Checkbox defaultStatus="selected" state="focus" />
        <Checkbox defaultStatus="selected" state="disabled" />
        <Checkbox defaultStatus="selected" state="error" />
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
        <Checkbox defaultStatus="partial" state="default" />
        <Checkbox defaultStatus="partial" state="hover" />
        <Checkbox defaultStatus="partial" state="press" />
        <Checkbox defaultStatus="partial" state="focus" />
        <Checkbox defaultStatus="partial" state="disabled" />
        <Checkbox defaultStatus="partial" state="error" />
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
        <Checkbox defaultStatus="unselected" />
        <span>옵션 1</span>
      </label>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Checkbox defaultStatus="selected" />
        <span>옵션 2</span>
      </label>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Checkbox defaultStatus="partial" />
        <span>옵션 3 (부분 선택)</span>
      </label>
      <label
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          opacity: 0.5,
        }}
      >
        <Checkbox defaultStatus="selected" state="disabled" />
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




