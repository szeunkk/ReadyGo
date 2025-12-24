import type { Meta, StoryObj } from '@storybook/react';
import Input from './index';

const meta = {
  title: 'Commons/Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '인풋 컴포넌트입니다. variant, state 등의 속성을 통해 다양한 스타일을 적용할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: '인풋의 변형 스타일',
      table: {
        type: { summary: 'InputVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    state: {
      control: 'select',
      options: ['Default', 'hover', 'active', 'filled', 'error', 'disabled'],
      description: '인풋의 상태',
      table: {
        type: { summary: 'InputState' },
        defaultValue: { summary: 'Default' },
      },
    },
    size: {
      control: 'select',
      options: ['m', 'l'],
      description: '인풋의 크기',
      table: {
        type: { summary: 'InputSize' },
        defaultValue: { summary: 'm' },
      },
    },
    label: {
      control: 'text',
      description: '인풋 라벨',
    },
    additionalInfo: {
      control: 'text',
      description: '인풋 추가 정보',
    },
    required: {
      control: { type: 'boolean' },
      description: '필수 입력 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    iconLeft: {
      control: 'select',
      options: [
        'add-user',
        'alert',
        'arrow-left',
        'arrow-right',
        'bar-chart-square',
        'calendar',
        'check',
        'chevron-down',
        'chevron-left',
        'chevron-right',
        'chevron-up',
        'clover',
        'crown',
        'dice',
        'edit',
        'envelope',
        'eye',
        'eye-slash',
        'gamepad',
        'gaming',
        'group',
        'handheld',
        'home',
        'home-circle',
        'joystick-alt',
        'lightbulb',
        'lock',
        'log-out',
        'mail-open',
        'match',
        'message-bubble',
        'message-circle-dots',
        'message-circle-dots-outline',
        'mic',
        'minus',
        'moon',
        'notification',
        'pencil',
        'plus',
        'refresh',
        'review',
        'search',
        'send',
        'settings',
        'steam',
        'sun',
        'sword-alt',
        'time',
        'trophy',
        'user',
        'userprofile',
        'warning',
        'x',
        'readygo-fox',
      ],
      description: '왼쪽 아이콘 이름',
    },
    iconRight: {
      control: 'select',
      options: [
        'add-user',
        'alert',
        'arrow-left',
        'arrow-right',
        'bar-chart-square',
        'calendar',
        'check',
        'chevron-down',
        'chevron-left',
        'chevron-right',
        'chevron-up',
        'clover',
        'crown',
        'dice',
        'edit',
        'envelope',
        'eye',
        'eye-slash',
        'gamepad',
        'gaming',
        'group',
        'handheld',
        'home',
        'home-circle',
        'joystick-alt',
        'lightbulb',
        'lock',
        'log-out',
        'mail-open',
        'match',
        'message-bubble',
        'message-circle-dots',
        'message-circle-dots-outline',
        'mic',
        'minus',
        'moon',
        'notification',
        'pencil',
        'plus',
        'refresh',
        'review',
        'search',
        'send',
        'settings',
        'steam',
        'sun',
        'sword-alt',
        'time',
        'trophy',
        'user',
        'userprofile',
        'warning',
        'x',
        'readygo-fox',
      ],
      description: '오른쪽 아이콘 이름',
    },
    iconSize: {
      control: 'select',
      options: [14, 16, 20, 24, 32, 40],
      description: '아이콘 크기',
      table: {
        type: { summary: '14 | 16 | 20 | 24 | 32 | 40' },
        defaultValue: { summary: '20' },
      },
    },
    iconLeftColor: {
      control: 'text',
      description: '왼쪽 아이콘 색상 (CSS 값)',
      table: {
        type: { summary: 'string' },
      },
    },
    iconRightColor: {
      control: 'text',
      description: '오른쪽 아이콘 색상 (CSS 값)',
      table: {
        type: { summary: 'string' },
      },
    },
    labelIcon: {
      control: 'select',
      options: [
        'add-user',
        'alert',
        'arrow-left',
        'arrow-right',
        'bar-chart-square',
        'calendar',
        'check',
        'chevron-down',
        'chevron-left',
        'chevron-right',
        'chevron-up',
        'clover',
        'crown',
        'dice',
        'edit',
        'envelope',
        'eye',
        'eye-slash',
        'gamepad',
        'gaming',
        'group',
        'handheld',
        'home',
        'home-circle',
        'joystick-alt',
        'lightbulb',
        'lock',
        'log-out',
        'mail-open',
        'match',
        'message-bubble',
        'message-circle-dots',
        'message-circle-dots-outline',
        'mic',
        'minus',
        'moon',
        'notification',
        'pencil',
        'plus',
        'refresh',
        'review',
        'search',
        'send',
        'settings',
        'steam',
        'sun',
        'sword-alt',
        'time',
        'trophy',
        'user',
        'userprofile',
        'warning',
        'x',
        'readygo-fox',
      ],
      description: '라벨 아이콘 이름',
    },
    labelIconColor: {
      control: 'text',
      description: '라벨 아이콘 색상 (CSS 값)',
      table: {
        type: { summary: 'string' },
      },
    },
    labelColor: {
      control: 'text',
      description: '라벨의 폰트 색상 (CSS 값)',
      table: {
        type: { summary: 'string' },
      },
    },
    labelSize: {
      control: 'text',
      description: '라벨의 폰트 크기 (CSS 값)',
      table: {
        type: { summary: 'string' },
      },
    },
    labelWeight: {
      control: 'text',
      description: '라벨의 폰트 굵기 (CSS 값)',
      table: {
        type: { summary: 'string' },
      },
    },
    labelLineHeight: {
      control: 'text',
      description: '라벨의 줄 간격 (CSS 값)',
      table: {
        type: { summary: 'string' },
      },
    },
    labelClassName: {
      control: 'text',
      description: '라벨에 적용할 추가 CSS 클래스',
      table: {
        type: { summary: 'string' },
      },
    },
    additionalInfoIcon: {
      control: 'select',
      options: [
        'add-user',
        'alert',
        'arrow-left',
        'arrow-right',
        'bar-chart-square',
        'calendar',
        'check',
        'chevron-down',
        'chevron-left',
        'chevron-right',
        'chevron-up',
        'clover',
        'crown',
        'dice',
        'edit',
        'envelope',
        'eye',
        'eye-slash',
        'gamepad',
        'gaming',
        'group',
        'handheld',
        'home',
        'home-circle',
        'joystick-alt',
        'lightbulb',
        'lock',
        'log-out',
        'mail-open',
        'match',
        'message-bubble',
        'message-circle-dots',
        'message-circle-dots-outline',
        'mic',
        'minus',
        'moon',
        'notification',
        'pencil',
        'plus',
        'refresh',
        'review',
        'search',
        'send',
        'settings',
        'steam',
        'sun',
        'sword-alt',
        'time',
        'trophy',
        'user',
        'userprofile',
        'warning',
        'x',
        'readygo-fox',
      ],
      description: '추가 정보 아이콘 이름',
    },
    additionalInfoIconColor: {
      control: 'text',
      description: '추가 정보 아이콘 색상 (CSS 값)',
      table: {
        type: { summary: 'string' },
      },
    },
    gap: {
      control: { type: 'number' },
      description: '요소 간 간격',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '4' },
      },
    },
    onIconRightClick: {
      action: 'iconRightClicked',
      description: '오른쪽 아이콘 클릭 핸들러',
      table: {
        type: { summary: '() => void' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '인풋 비활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    type: {
      control: 'select',
      options: [
        'text',
        'password',
        'email',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'time',
        'datetime-local',
        'month',
        'week',
      ],
      description: '인풋 타입',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    'data-testid': {
      control: 'text',
      description: '테스트 ID',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    placeholder: '입력하세요',
  },
};

// Variant 스토리
export const Primary: Story = {
  args: {
    variant: 'primary',
    placeholder: 'Primary Input',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    placeholder: 'Secondary Input',
  },
};

export const Hover: Story = {
  args: {
    state: 'hover',
    placeholder: 'Hover Input',
  },
};

export const Active: Story = {
  args: {
    state: 'active',
    placeholder: 'Active Input',
  },
};

export const Filled: Story = {
  args: {
    state: 'filled',
    placeholder: 'Filled Input',
    defaultValue: '입력된 값',
  },
};

export const Error: Story = {
  args: {
    state: 'error',
    placeholder: 'Error Input',
  },
};

export const Disabled: Story = {
  args: {
    state: 'disabled',
    placeholder: 'Disabled Input',
  },
};

// State 스토리
export const DefaultState: Story = {
  args: {
    state: 'Default',
    placeholder: 'Default State',
  },
};

export const HoverState: Story = {
  args: {
    state: 'hover',
    placeholder: 'Hover State',
  },
};

export const ActiveState: Story = {
  args: {
    state: 'active',
    placeholder: 'Active State',
  },
};

export const FilledState: Story = {
  args: {
    state: 'filled',
    placeholder: 'Filled State',
    defaultValue: '입력된 값',
  },
};

export const ErrorState: Story = {
  args: {
    state: 'error',
    placeholder: 'Error State',
  },
};

export const DisabledState: Story = {
  args: {
    state: 'disabled',
    placeholder: 'Disabled State',
  },
};

export const DisabledProp: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled Prop',
  },
};

// Theme 스토리
export const LightTheme: Story = {
  args: {
    variant: 'primary',
    placeholder: 'Light Theme',
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
    variant: 'primary',
    placeholder: 'Dark Theme',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
};

// Label 스토리
export const WithLabel: Story = {
  args: {
    label: '라벨',
    placeholder: '입력하세요',
  },
};

export const WithRequiredLabel: Story = {
  args: {
    label: '필수 입력',
    required: true,
    placeholder: '입력하세요',
  },
};

export const WithLabelIcon: Story = {
  args: {
    label: '라벨',
    labelIcon: 'search',
    placeholder: '입력하세요',
  },
};

export const WithCustomLabelStyle: Story = {
  args: {
    label: '커스텀 스타일 라벨',
    labelColor: 'var(--color-text-danger)',
    labelSize: '18px',
    labelWeight: '600',
    labelLineHeight: '1.5',
    placeholder: '입력하세요',
  },
  parameters: {
    docs: {
      description: {
        story: '라벨의 색상, 크기, 굵기, 줄 간격을 커스터마이징할 수 있습니다.',
      },
    },
  },
};

export const WithCustomLabelColor: Story = {
  args: {
    label: '빨간색 라벨',
    labelColor: 'var(--color-text-danger)',
    placeholder: '입력하세요',
  },
};

export const WithCustomLabelSize: Story = {
  args: {
    label: '큰 라벨',
    labelSize: '20px',
    placeholder: '입력하세요',
  },
};

export const WithCustomLabelWeight: Story = {
  args: {
    label: '굵은 라벨',
    labelWeight: '700',
    placeholder: '입력하세요',
  },
};

// AdditionalInfo 스토리
export const WithAdditionalInfo: Story = {
  args: {
    label: '입력 필드',
    additionalInfo: '추가 정보를 표시합니다',
    placeholder: '입력하세요',
  },
};

export const WithErrorInfo: Story = {
  args: {
    label: '입력 필드',
    state: 'error',
    additionalInfo: '오류 메시지가 표시됩니다',
    placeholder: '입력하세요',
  },
};

export const WithAdditionalInfoIcon: Story = {
  args: {
    label: '입력 필드',
    additionalInfo: '추가 정보',
    additionalInfoIcon: 'lightbulb',
    placeholder: '입력하세요',
  },
};

// Icon 스토리
export const WithLeftIcon: Story = {
  args: {
    iconLeft: 'search',
    placeholder: '검색하세요',
  },
};

export const WithRightIcon: Story = {
  args: {
    iconRight: 'x',
    placeholder: '입력하세요',
  },
};

export const WithRightIconClickable: Story = {
  args: {
    iconRight: 'x',
    placeholder: '입력하세요',
    onIconRightClick: () => {
      console.log('Right icon clicked');
    },
  },
  parameters: {
    docs: {
      description: {
        story: '오른쪽 아이콘 클릭 핸들러가 있는 인풋입니다.',
      },
    },
  },
};

export const WithBothIcons: Story = {
  args: {
    iconLeft: 'search',
    iconRight: 'x',
    placeholder: '입력하세요',
  },
};

export const WithCustomIconSize: Story = {
  args: {
    iconLeft: 'search',
    iconSize: 24,
    placeholder: '큰 아이콘',
  },
};

// 조합 스토리
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Input variant="primary" placeholder="Primary" />
      <Input variant="secondary" placeholder="Secondary" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Input state="Default" placeholder="Default" />
      <Input state="hover" placeholder="Hover" />
      <Input state="active" placeholder="Active" />
      <Input state="filled" defaultValue="Filled" />
      <Input state="error" placeholder="Error" />
      <Input state="disabled" placeholder="Disabled" />
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
        <div style={{ fontWeight: 'bold' }}>Variant / State</div>
        <div style={{ fontWeight: 'bold' }}>Default</div>
        <div style={{ fontWeight: 'bold' }}>Hover</div>
        <div style={{ fontWeight: 'bold' }}>Active</div>
        <div style={{ fontWeight: 'bold' }}>Filled</div>
        <div style={{ fontWeight: 'bold' }}>Error</div>
        <div style={{ fontWeight: 'bold' }}>Disabled</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Primary</div>
        <Input variant="primary" state="Default" placeholder="" />
        <Input variant="primary" state="hover" placeholder="" />
        <Input variant="primary" state="active" placeholder="" />
        <Input variant="primary" state="filled" defaultValue="값" />
        <Input variant="primary" state="error" placeholder="" />
        <Input variant="primary" state="disabled" placeholder="" />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Secondary</div>
        <Input variant="secondary" state="Default" placeholder="" />
        <Input variant="secondary" state="hover" placeholder="" />
        <Input variant="secondary" state="active" placeholder="" />
        <Input variant="secondary" state="filled" defaultValue="값" />
        <Input variant="secondary" state="error" placeholder="" />
        <Input variant="secondary" state="disabled" placeholder="" />
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

// Size 스토리
export const SizeMedium: Story = {
  args: {
    size: 'm',
    label: 'Medium Size',
    placeholder: 'Size M (48px)',
  },
};

export const SizeLarge: Story = {
  args: {
    size: 'l',
    label: 'Large Size',
    placeholder: 'Size L (56px)',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Input size="m" label="Medium Size (48px)" placeholder="Placeholder" />
      <Input size="l" label="Large Size (56px)" placeholder="Placeholder" />
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
