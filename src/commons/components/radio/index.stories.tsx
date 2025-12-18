import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Radio from '.';

const meta = {
  title: 'Commons/Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '라디오 버튼 컴포넌트입니다. 반드시 RadioGroup 형태로 사용해야 하며, 같은 name을 가진 라디오 중 하나만 선택할 수 있습니다. checked는 부모에서 관리하고, onChange로 선택된 value를 받습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'hover', 'press', 'disabled', 'error'],
      description: '라디오 버튼의 상태 (CSS 전용)',
      table: {
        type: { summary: 'RadioState' },
        defaultValue: { summary: 'default' },
      },
    },
    checked: {
      control: { type: 'boolean' },
      description: '라디오 버튼 선택 여부 (RadioGroup에서 관리)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    value: {
      control: { type: 'text' },
      description: '라디오 버튼의 값 (그룹 내에서 식별용, 필수)',
      table: {
        type: { summary: 'string' },
      },
    },
    name: {
      control: { type: 'text' },
      description: '라디오 버튼 그룹 이름 (같은 name을 가진 radio는 하나만 선택 가능, 필수)',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '라디오 버튼 비활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onChange: {
      description: '라디오 버튼 변경 이벤트 핸들러 (필수)',
      table: {
        type: { summary: '(e: React.ChangeEvent<HTMLInputElement>) => void' },
      },
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 라디오 그룹 스토리
const BasicGroupComponent = () => {
  const [selected, setSelected] = React.useState('option1');
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Radio
        name="basic"
        value="option1"
        checked={selected === 'option1'}
        onChange={(e) => setSelected(e.target.value)}
      />
      <Radio
        name="basic"
        value="option2"
        checked={selected === 'option2'}
        onChange={(e) => setSelected(e.target.value)}
      />
      <Radio
        name="basic"
        value="option3"
        checked={selected === 'option3'}
        onChange={(e) => setSelected(e.target.value)}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <BasicGroupComponent />,
  parameters: {
    docs: {
      description: {
        story: '기본 라디오 버튼 그룹입니다.',
      },
    },
  },
};

// State 스토리
export const UnselectedDefault: Story = {
  render: () => (
    <Radio name="demo" value="demo" checked={false} state="default" />
  ),
};

export const UnselectedHover: Story = {
  render: () => (
    <Radio name="demo" value="demo" checked={false} state="hover" />
  ),
};

export const UnselectedPress: Story = {
  render: () => (
    <Radio name="demo" value="demo" checked={false} state="press" />
  ),
};

export const UnselectedDisabled: Story = {
  render: () => (
    <Radio name="demo" value="demo" checked={false} state="disabled" />
  ),
};

export const UnselectedError: Story = {
  render: () => (
    <Radio name="demo" value="demo" checked={false} state="error" />
  ),
};

export const SelectedDefault: Story = {
  render: () => (
    <Radio name="demo" value="demo" checked={true} state="default" />
  ),
};

export const SelectedHover: Story = {
  render: () => (
    <Radio name="demo" value="demo" checked={true} state="hover" />
  ),
};

export const SelectedPress: Story = {
  render: () => (
    <Radio name="demo" value="demo" checked={true} state="press" />
  ),
};

export const SelectedDisabled: Story = {
  render: () => (
    <Radio name="demo" value="demo" checked={true} state="disabled" />
  ),
};

export const SelectedError: Story = {
  render: () => (
    <Radio name="demo" value="demo" checked={true} state="error" />
  ),
};

// 조합 스토리
export const AllStatesUnselected: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Radio name="demo1" value="demo" checked={false} state="default" />
      <Radio name="demo2" value="demo" checked={false} state="hover" />
      <Radio name="demo3" value="demo" checked={false} state="press" />
      <Radio name="demo4" value="demo" checked={false} state="disabled" />
      <Radio name="demo5" value="demo" checked={false} state="error" />
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
      <Radio name="demo6" value="demo" checked={true} state="default" />
      <Radio name="demo7" value="demo" checked={true} state="hover" />
      <Radio name="demo8" value="demo" checked={true} state="press" />
      <Radio name="demo9" value="demo" checked={true} state="disabled" />
      <Radio name="demo10" value="demo" checked={true} state="error" />
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

export const StateMatrix: Story = {
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
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Checked / State</div>
        <div style={{ fontWeight: 'bold' }}>Default</div>
        <div style={{ fontWeight: 'bold' }}>Hover</div>
        <div style={{ fontWeight: 'bold' }}>Press</div>
        <div style={{ fontWeight: 'bold' }}>Disabled</div>
        <div style={{ fontWeight: 'bold' }}>Error</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Unselected</div>
        <Radio name="m1" value="demo" checked={false} state="default" />
        <Radio name="m2" value="demo" checked={false} state="hover" />
        <Radio name="m3" value="demo" checked={false} state="press" />
        <Radio name="m4" value="demo" checked={false} state="disabled" />
        <Radio name="m5" value="demo" checked={false} state="error" />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Selected</div>
        <Radio name="m6" value="demo" checked={true} state="default" />
        <Radio name="m7" value="demo" checked={true} state="hover" />
        <Radio name="m8" value="demo" checked={true} state="press" />
        <Radio name="m9" value="demo" checked={true} state="disabled" />
        <Radio name="m10" value="demo" checked={true} state="error" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '모든 checked 상태와 state의 조합을 한눈에 확인할 수 있는 매트릭스입니다.',
      },
    },
  },
};

const WithLabelsComponent = () => {
  const [selected, setSelected] = React.useState('option2');
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
          name="option"
          value="option1"
          checked={selected === 'option1'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <span>옵션 1</span>
      </label>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Radio
          name="option"
          value="option2"
          checked={selected === 'option2'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <span>옵션 2</span>
      </label>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Radio
          name="option"
          value="option3"
          checked={selected === 'option3'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <span>옵션 3</span>
      </label>
      <label
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          opacity: 0.5,
        }}
      >
        <Radio
          name="option"
          value="option4"
          disabled={true}
          checked={selected === 'option4'}
        />
        <span>옵션 4 (비활성화)</span>
      </label>
    </div>
  );
};

export const WithLabels: Story = {
  render: () => <WithLabelsComponent />,
  parameters: {
    docs: {
      description: {
        story:
          '실제 사용 예시로 라벨과 함께 사용하는 경우입니다. 같은 name을 가진 라디오 버튼 중 하나만 선택할 수 있습니다.',
      },
    },
  },
};

const RadioGroupComponent = () => {
  const [selected, setSelected] = React.useState('option1');
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
          name="group"
          value="option1"
          checked={selected === 'option1'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <span>옵션 1</span>
      </label>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Radio
          name="group"
          value="option2"
          checked={selected === 'option2'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <span>옵션 2</span>
      </label>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Radio
          name="group"
          value="option3"
          checked={selected === 'option3'}
          onChange={(e) => setSelected(e.target.value)}
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
          '라디오 버튼 그룹으로 사용하는 예시입니다. 같은 name을 가진 라디오 버튼 중 하나만 선택됩니다. onChange 핸들러로 선택된 값을 관리할 수 있습니다.',
      },
    },
  },
};




