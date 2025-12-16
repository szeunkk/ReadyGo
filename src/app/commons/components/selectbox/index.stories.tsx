import type { Meta, StoryObj } from "@storybook/react";
import Selectbox from "./index";

const meta = {
  title: "Commons/Components/Selectbox",
  component: Selectbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "셀렉트박스 컴포넌트입니다. variant, state, theme 등의 속성을 통해 다양한 스타일을 적용할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "hover", "active", "filled", "danger", "disabled"],
      description: "셀렉트박스의 변형 스타일",
      table: {
        type: { summary: "SelectboxVariant" },
        defaultValue: { summary: "primary" },
      },
    },
    state: {
      control: "select",
      options: ["default", "hover", "filled", "error", "disabled"],
      description: "셀렉트박스의 상태",
      table: {
        type: { summary: "SelectboxState" },
        defaultValue: { summary: "default" },
      },
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "셀렉트박스의 테마",
      table: {
        type: { summary: "SelectboxTheme" },
        defaultValue: { summary: "light" },
      },
    },
    label: {
      control: "text",
      description: "셀렉트박스 라벨",
    },
    additionalInfo: {
      control: "text",
      description: "셀렉트박스 추가 정보",
    },
    required: {
      control: { type: "boolean" },
      description: "필수 선택 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    placeholder: {
      control: "text",
      description: "플레이스홀더 텍스트",
    },
    gap: {
      control: { type: "number" },
      description: "요소 간 간격",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "4" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "셀렉트박스 비활성화 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    value: {
      control: "text",
      description: "선택된 값의 ID",
    },
  },
} satisfies Meta<typeof Selectbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
  { id: "1", value: "옵션 1" },
  { id: "2", value: "옵션 2" },
  { id: "3", value: "옵션 3" },
  { id: "4", value: "옵션 4" },
  { id: "5", value: "옵션 5" },
];

// 기본 스토리
export const Default: Story = {
  args: {
    items: defaultItems,
    placeholder: "선택하세요",
  },
};

// Variant 스토리
export const Primary: Story = {
  args: {
    variant: "primary",
    items: defaultItems,
    placeholder: "Primary Selectbox",
  },
};

export const Hover: Story = {
  args: {
    variant: "hover",
    items: defaultItems,
    placeholder: "Hover Selectbox",
  },
};

export const Active: Story = {
  args: {
    variant: "active",
    items: defaultItems,
    placeholder: "Active Selectbox",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    items: defaultItems,
    value: "1",
    placeholder: "Filled Selectbox",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    items: defaultItems,
    placeholder: "Danger Selectbox",
  },
};

export const Disabled: Story = {
  args: {
    variant: "disabled",
    items: defaultItems,
    placeholder: "Disabled Selectbox",
  },
};

// State 스토리
export const DefaultState: Story = {
  args: {
    state: "default",
    items: defaultItems,
    placeholder: "Default State",
  },
};

export const HoverState: Story = {
  args: {
    state: "hover",
    items: defaultItems,
    placeholder: "Hover State",
  },
};

export const FilledState: Story = {
  args: {
    state: "filled",
    items: defaultItems,
    value: "2",
    placeholder: "Filled State",
  },
};

export const ErrorState: Story = {
  args: {
    state: "error",
    items: defaultItems,
    placeholder: "Error State",
  },
};

export const DisabledState: Story = {
  args: {
    state: "disabled",
    items: defaultItems,
    placeholder: "Disabled State",
  },
};

export const DisabledProp: Story = {
  args: {
    disabled: true,
    items: defaultItems,
    placeholder: "Disabled Prop",
  },
};

// Theme 스토리
export const LightTheme: Story = {
  args: {
    theme: "light",
    variant: "primary",
    items: defaultItems,
    placeholder: "Light Theme",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = {
  args: {
    theme: "dark",
    variant: "primary",
    items: defaultItems,
    placeholder: "Dark Theme",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", backgroundColor: "#030712" }}>
        <Story />
      </div>
    ),
  ],
};

// Label 스토리
export const WithLabel: Story = {
  args: {
    label: "선택",
    items: defaultItems,
    placeholder: "선택하세요",
  },
};

export const WithRequiredLabel: Story = {
  args: {
    label: "필수 선택",
    required: true,
    items: defaultItems,
    placeholder: "선택하세요",
  },
};

// AdditionalInfo 스토리
export const WithAdditionalInfo: Story = {
  args: {
    label: "선택 필드",
    additionalInfo: "추가 정보를 표시합니다",
    items: defaultItems,
    placeholder: "선택하세요",
  },
};

export const WithErrorInfo: Story = {
  args: {
    label: "선택 필드",
    state: "error",
    additionalInfo: "오류 메시지가 표시됩니다",
    items: defaultItems,
    placeholder: "선택하세요",
  },
};

// 조합 스토리
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Selectbox variant="primary" items={defaultItems} placeholder="Primary" />
      <Selectbox variant="hover" items={defaultItems} placeholder="Hover" />
      <Selectbox variant="active" items={defaultItems} placeholder="Active" />
      <Selectbox
        variant="filled"
        items={defaultItems}
        value="1"
        placeholder="Filled"
      />
      <Selectbox variant="danger" items={defaultItems} placeholder="Danger" />
      <Selectbox
        variant="disabled"
        items={defaultItems}
        placeholder="Disabled"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 variant 타입을 한 번에 확인할 수 있습니다.",
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Selectbox state="default" items={defaultItems} placeholder="Default" />
      <Selectbox state="hover" items={defaultItems} placeholder="Hover" />
      <Selectbox
        state="filled"
        items={defaultItems}
        value="2"
        placeholder="Filled"
      />
      <Selectbox state="error" items={defaultItems} placeholder="Error" />
      <Selectbox state="disabled" items={defaultItems} placeholder="Disabled" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 state 타입을 한 번에 확인할 수 있습니다.",
      },
    },
  },
};

export const LightThemeVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "20px",
        backgroundColor: "#ffffff",
      }}>
      <Selectbox
        theme="light"
        variant="primary"
        items={defaultItems}
        placeholder="Primary"
      />
      <Selectbox
        theme="light"
        variant="hover"
        items={defaultItems}
        placeholder="Hover"
      />
      <Selectbox
        theme="light"
        variant="active"
        items={defaultItems}
        placeholder="Active"
      />
      <Selectbox
        theme="light"
        variant="filled"
        items={defaultItems}
        value="1"
        placeholder="Filled"
      />
      <Selectbox
        theme="light"
        variant="danger"
        items={defaultItems}
        placeholder="Danger"
      />
      <Selectbox
        theme="light"
        variant="disabled"
        items={defaultItems}
        placeholder="Disabled"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Light 테마의 모든 variant를 확인할 수 있습니다.",
      },
    },
  },
};

export const DarkThemeVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "20px",
        backgroundColor: "#030712",
      }}>
      <Selectbox
        theme="dark"
        variant="primary"
        items={defaultItems}
        placeholder="Primary"
      />
      <Selectbox
        theme="dark"
        variant="hover"
        items={defaultItems}
        placeholder="Hover"
      />
      <Selectbox
        theme="dark"
        variant="active"
        items={defaultItems}
        placeholder="Active"
      />
      <Selectbox
        theme="dark"
        variant="filled"
        items={defaultItems}
        value="1"
        placeholder="Filled"
      />
      <Selectbox
        theme="dark"
        variant="danger"
        items={defaultItems}
        placeholder="Danger"
      />
      <Selectbox
        theme="dark"
        variant="disabled"
        items={defaultItems}
        placeholder="Disabled"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Dark 테마의 모든 variant를 확인할 수 있습니다.",
      },
    },
  },
};

export const CompleteExample: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Selectbox
          label="카테고리"
          required
          items={defaultItems}
          placeholder="카테고리를 선택하세요"
          theme="light"
        />
        <Selectbox
          label="상태"
          required
          state="error"
          additionalInfo="올바른 값을 선택해주세요"
          items={defaultItems}
          placeholder="상태를 선택하세요"
          theme="light"
        />
        <Selectbox
          label="우선순위"
          items={defaultItems}
          value="1"
          placeholder="우선순위를 선택하세요"
          theme="light"
        />
        <Selectbox
          label="비활성화된 선택"
          disabled
          items={defaultItems}
          placeholder="선택할 수 없습니다"
          theme="light"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Selectbox
          label="카테고리"
          required
          items={defaultItems}
          placeholder="카테고리를 선택하세요"
          theme="dark"
        />
        <Selectbox
          label="상태"
          required
          state="error"
          additionalInfo="올바른 값을 선택해주세요"
          items={defaultItems}
          placeholder="상태를 선택하세요"
          theme="dark"
        />
        <Selectbox
          label="우선순위"
          items={defaultItems}
          value="1"
          placeholder="우선순위를 선택하세요"
          theme="dark"
        />
        <Selectbox
          label="비활성화된 선택"
          disabled
          items={defaultItems}
          placeholder="선택할 수 없습니다"
          theme="dark"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "실제 사용 예시로 다양한 속성을 조합한 경우입니다.",
      },
    },
  },
};

export const VariantAndStateMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Variant / State</div>
        <div style={{ fontWeight: "bold" }}>Default</div>
        <div style={{ fontWeight: "bold" }}>Hover</div>
        <div style={{ fontWeight: "bold" }}>Filled</div>
        <div style={{ fontWeight: "bold" }}>Error</div>
        <div style={{ fontWeight: "bold" }}>Disabled</div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Primary</div>
        <Selectbox
          variant="primary"
          state="default"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="primary"
          state="hover"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="primary"
          state="filled"
          items={defaultItems}
          value="1"
          placeholder=""
        />
        <Selectbox
          variant="primary"
          state="error"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="primary"
          state="disabled"
          items={defaultItems}
          placeholder=""
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Hover</div>
        <Selectbox
          variant="hover"
          state="default"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="hover"
          state="hover"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="hover"
          state="filled"
          items={defaultItems}
          value="1"
          placeholder=""
        />
        <Selectbox
          variant="hover"
          state="error"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="hover"
          state="disabled"
          items={defaultItems}
          placeholder=""
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Active</div>
        <Selectbox
          variant="active"
          state="default"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="active"
          state="hover"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="active"
          state="filled"
          items={defaultItems}
          value="1"
          placeholder=""
        />
        <Selectbox
          variant="active"
          state="error"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="active"
          state="disabled"
          items={defaultItems}
          placeholder=""
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Filled</div>
        <Selectbox
          variant="filled"
          state="default"
          items={defaultItems}
          value="1"
          placeholder=""
        />
        <Selectbox
          variant="filled"
          state="hover"
          items={defaultItems}
          value="1"
          placeholder=""
        />
        <Selectbox
          variant="filled"
          state="filled"
          items={defaultItems}
          value="1"
          placeholder=""
        />
        <Selectbox
          variant="filled"
          state="error"
          items={defaultItems}
          value="1"
          placeholder=""
        />
        <Selectbox
          variant="filled"
          state="disabled"
          items={defaultItems}
          value="1"
          placeholder=""
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Danger</div>
        <Selectbox
          variant="danger"
          state="default"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="danger"
          state="hover"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="danger"
          state="filled"
          items={defaultItems}
          value="1"
          placeholder=""
        />
        <Selectbox
          variant="danger"
          state="error"
          items={defaultItems}
          placeholder=""
        />
        <Selectbox
          variant="danger"
          state="disabled"
          items={defaultItems}
          placeholder=""
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "모든 variant와 state의 조합을 한눈에 확인할 수 있는 매트릭스입니다.",
      },
    },
  },
};

export const WithManyItems: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Selectbox
        label="많은 옵션이 있는 셀렉트박스"
        items={Array.from({ length: 20 }, (_, i) => ({
          id: `${i + 1}`,
          value: `옵션 ${i + 1}`,
        }))}
        placeholder="옵션을 선택하세요"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "많은 옵션이 있을 때 드롭다운 스크롤이 작동하는지 확인합니다.",
      },
    },
  },
};

export const WithCustomChildren: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Selectbox
        label="커스텀 자식 요소"
        items={defaultItems}
        placeholder="선택하세요">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🎨</span>
          <span>커스텀 표시</span>
        </div>
      </Selectbox>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "children prop을 사용하여 커스텀 자식 요소를 표시할 수 있습니다.",
      },
    },
  },
};







