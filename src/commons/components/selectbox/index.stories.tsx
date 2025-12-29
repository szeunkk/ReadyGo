import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Selectbox, { SelectboxItem } from './index';

const meta = {
  title: 'Commons/Components/Selectbox',
  component: Selectbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '셀렉트박스 컴포넌트입니다. state 등의 속성을 통해 다양한 상태를 표현할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'hover', 'filled', 'error', 'disabled', 'active'],
      description: '셀렉트박스의 상태',
      table: {
        type: { summary: 'SelectboxState' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['m', 'l'],
      description: '셀렉트박스의 크기',
      table: {
        type: { summary: 'SelectboxSize' },
        defaultValue: { summary: 'm' },
      },
    },
    label: {
      control: 'text',
      description: '셀렉트박스의 레이블',
    },
    items: {
      control: 'object',
      description: '셀렉트박스의 옵션 아이템 목록',
    },
    selectedId: {
      control: 'text',
      description: '선택된 아이템의 ID',
    },
    placeholder: {
      control: 'text',
      description: '셀렉트박스의 플레이스홀더',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Placeholder' },
      },
    },
  },
} satisfies Meta<typeof Selectbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems: SelectboxItem[] = [
  { id: '1', value: '옵션 1' },
  { id: '2', value: '옵션 2' },
  { id: '3', value: '옵션 3' },
  { id: '4', value: '옵션 4' },
];

// 기본 스토리
export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

// State 스토리
export const DefaultState: Story = {
  args: {
    state: 'default',
    items: sampleItems,
  },
};

export const HoverState: Story = {
  args: {
    state: 'hover',
    items: sampleItems,
  },
};

export const FilledState: Story = {
  args: {
    state: 'filled',
    items: sampleItems,
    selectedId: '2',
  },
};

export const ErrorState: Story = {
  args: {
    state: 'error',
    items: sampleItems,
  },
};

export const DisabledState: Story = {
  args: {
    state: 'disabled',
    items: sampleItems,
  },
};

export const ActiveState: Story = {
  args: {
    state: 'active',
    items: sampleItems,
  },
};

// Label과 AdditionalInfo 스토리
export const WithLabel: Story = {
  args: {
    label: '레이블',
    items: sampleItems,
  },
};

export const WithLabelOnly: Story = {
  args: {
    label: '레이블만',
    items: sampleItems,
  },
};

// Placeholder 스토리
export const WithCustomPlaceholder: Story = {
  args: {
    label: '커스텀 플레이스홀더',
    placeholder: '옵션을 선택해주세요',
    items: sampleItems,
  },
};

export const WithLongPlaceholder: Story = {
  args: {
    label: '긴 플레이스홀더',
    placeholder: '이것은 매우 긴 플레이스홀더 텍스트입니다',
    items: sampleItems,
  },
};

// 조합 스토리
export const AllStates: Story = {
  args: {
    items: sampleItems,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Selectbox state="default" items={sampleItems} />
      <Selectbox state="hover" items={sampleItems} />
      <Selectbox state="filled" items={sampleItems} selectedId="2" />
      <Selectbox state="error" items={sampleItems} />
      <Selectbox state="disabled" items={sampleItems} />
      <Selectbox state="active" items={sampleItems} />
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

export const AllStatesWithLabel: Story = {
  args: {
    items: sampleItems,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Selectbox state="default" label="Default" items={sampleItems} />
      <Selectbox state="hover" label="Hover" items={sampleItems} />
      <Selectbox
        state="filled"
        label="Filled"
        items={sampleItems}
        selectedId="2"
      />
      <Selectbox state="error" label="Error" items={sampleItems} />
      <Selectbox state="disabled" label="Disabled" items={sampleItems} />
      <Selectbox state="active" label="Active" items={sampleItems} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '레이블과 함께 모든 state 타입을 확인할 수 있습니다.',
      },
    },
  },
};

// 인터랙티브 스토리
const InteractiveSelectboxComponent = () => {
  const [selectedId, setSelectedId] = React.useState<string | undefined>(
    undefined
  );

  const handleSelect = (item: SelectboxItem) => {
    setSelectedId(item.id);
  };

  return (
    <Selectbox
      label="선택하세요"
      items={sampleItems}
      selectedId={selectedId}
      onSelect={handleSelect}
    />
  );
};

export const Interactive: Story = {
  args: {
    items: sampleItems,
  },
  render: () => <InteractiveSelectboxComponent />,
  parameters: {
    docs: {
      description: {
        story: '실제로 작동하는 인터랙티브 셀렉트박스입니다.',
      },
    },
  },
};

// 다양한 아이템 개수 스토리
export const SingleItem: Story = {
  args: {
    label: '단일 옵션',
    items: [{ id: '1', value: '옵션 1' }],
  },
};

export const MultipleItems: Story = {
  args: {
    label: '다중 옵션',
    items: [
      { id: '1', value: '옵션 1' },
      { id: '2', value: '옵션 2' },
      { id: '3', value: '옵션 3' },
      { id: '4', value: '옵션 4' },
      { id: '5', value: '옵션 5' },
      { id: '6', value: '옵션 6' },
    ],
  },
};

export const WithSelectedValue: Story = {
  args: {
    label: '선택된 값',
    items: sampleItems,
    selectedId: '3',
  },
};

// Children 사용 예시
export const WithCustomChildren: Story = {
  args: {
    items: sampleItems,
  },
  render: () => (
    <Selectbox label="커스텀 콘텐츠" items={sampleItems} selectedId="2">
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>✓</span>
        <span>선택된 옵션</span>
      </span>
    </Selectbox>
  ),
  parameters: {
    docs: {
      description: {
        story: 'children을 사용하여 커스텀 콘텐츠를 표시할 수 있습니다.',
      },
    },
  },
};

// Size 스토리
export const SizeM: Story = {
  args: {
    size: 'm',
    label: 'Medium Size (48px)',
    items: sampleItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium 크기의 셀렉트박스입니다. 기본 크기입니다.',
      },
    },
  },
};

export const SizeL: Story = {
  args: {
    size: 'l',
    label: 'Large Size (56px)',
    items: sampleItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large 크기의 셀렉트박스입니다.',
      },
    },
  },
};

export const SizeComparison: Story = {
  args: {
    items: sampleItems,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Selectbox size="m" label="Medium Size (48px)" items={sampleItems} />
      <Selectbox size="l" label="Large Size (56px)" items={sampleItems} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '크기별 셀렉트박스를 비교할 수 있습니다.',
      },
    },
  },
};
