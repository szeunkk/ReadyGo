import type { Meta, StoryObj } from "@storybook/react";
import Checkbox from "./index";

const meta = {
  title: "Commons/Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "체크박스 컴포넌트입니다. status, state, checked, indeterminate 등의 속성을 통해 다양한 상태를 표현할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["unselected", "selected", "partial"],
      description: "체크박스의 선택 상태",
      table: {
        type: { summary: "CheckboxStatus" },
      },
    },
    state: {
      control: "select",
      options: ["default", "hover", "press", "focus", "disabled", "error"],
      description: "체크박스의 상태",
      table: {
        type: { summary: "CheckboxState" },
        defaultValue: { summary: "default" },
      },
    },
    checked: {
      control: { type: "boolean" },
      description: "체크박스 선택 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    indeterminate: {
      control: { type: "boolean" },
      description: "체크박스 부분 선택 여부 (indeterminate 상태)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "체크박스 비활성화 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    checked: false,
  },
};

// Status 스토리
export const Unselected: Story = {
  args: {
    status: "unselected",
    checked: false,
  },
};

export const Selected: Story = {
  args: {
    status: "selected",
    checked: true,
  },
};

export const Partial: Story = {
  args: {
    status: "partial",
    indeterminate: true,
  },
};

// State 스토리 - Unselected
export const UnselectedDefault: Story = {
  args: {
    status: "unselected",
    state: "default",
    checked: false,
  },
};

export const UnselectedHover: Story = {
  args: {
    status: "unselected",
    state: "hover",
    checked: false,
  },
};

export const UnselectedPress: Story = {
  args: {
    status: "unselected",
    state: "press",
    checked: false,
  },
};

export const UnselectedFocus: Story = {
  args: {
    status: "unselected",
    state: "focus",
    checked: false,
  },
};

export const UnselectedDisabled: Story = {
  args: {
    status: "unselected",
    state: "disabled",
    checked: false,
  },
};

export const UnselectedError: Story = {
  args: {
    status: "unselected",
    state: "error",
    checked: false,
  },
};

// State 스토리 - Selected
export const SelectedDefault: Story = {
  args: {
    status: "selected",
    state: "default",
    checked: true,
  },
};

export const SelectedHover: Story = {
  args: {
    status: "selected",
    state: "hover",
    checked: true,
  },
};

export const SelectedPress: Story = {
  args: {
    status: "selected",
    state: "press",
    checked: true,
  },
};

export const SelectedFocus: Story = {
  args: {
    status: "selected",
    state: "focus",
    checked: true,
  },
};

export const SelectedDisabled: Story = {
  args: {
    status: "selected",
    state: "disabled",
    checked: true,
  },
};

export const SelectedError: Story = {
  args: {
    status: "selected",
    state: "error",
    checked: true,
  },
};

// State 스토리 - Partial
export const PartialDefault: Story = {
  args: {
    status: "partial",
    state: "default",
    indeterminate: true,
  },
};

export const PartialHover: Story = {
  args: {
    status: "partial",
    state: "hover",
    indeterminate: true,
  },
};

export const PartialPress: Story = {
  args: {
    status: "partial",
    state: "press",
    indeterminate: true,
  },
};

export const PartialFocus: Story = {
  args: {
    status: "partial",
    state: "focus",
    indeterminate: true,
  },
};

export const PartialDisabled: Story = {
  args: {
    status: "partial",
    state: "disabled",
    indeterminate: true,
  },
};

export const PartialError: Story = {
  args: {
    status: "partial",
    state: "error",
    indeterminate: true,
  },
};

// Disabled prop 스토리
export const DisabledProp: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

// 조합 스토리
export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Checkbox status="unselected" checked={false} />
      <Checkbox status="selected" checked={true} />
      <Checkbox status="partial" indeterminate={true} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 status 타입을 한 번에 확인할 수 있습니다.",
      },
    },
  },
};

export const AllStatesUnselected: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Checkbox status="unselected" state="default" checked={false} />
      <Checkbox status="unselected" state="hover" checked={false} />
      <Checkbox status="unselected" state="press" checked={false} />
      <Checkbox status="unselected" state="focus" checked={false} />
      <Checkbox status="unselected" state="disabled" checked={false} />
      <Checkbox status="unselected" state="error" checked={false} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Unselected 상태의 모든 state 타입을 확인할 수 있습니다.",
      },
    },
  },
};

export const AllStatesSelected: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Checkbox status="selected" state="default" checked={true} />
      <Checkbox status="selected" state="hover" checked={true} />
      <Checkbox status="selected" state="press" checked={true} />
      <Checkbox status="selected" state="focus" checked={true} />
      <Checkbox status="selected" state="disabled" checked={true} />
      <Checkbox status="selected" state="error" checked={true} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Selected 상태의 모든 state 타입을 확인할 수 있습니다.",
      },
    },
  },
};

export const AllStatesPartial: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Checkbox status="partial" state="default" indeterminate={true} />
      <Checkbox status="partial" state="hover" indeterminate={true} />
      <Checkbox status="partial" state="press" indeterminate={true} />
      <Checkbox status="partial" state="focus" indeterminate={true} />
      <Checkbox status="partial" state="disabled" indeterminate={true} />
      <Checkbox status="partial" state="error" indeterminate={true} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Partial 상태의 모든 state 타입을 확인할 수 있습니다.",
      },
    },
  },
};

export const StatusAndStateMatrix: Story = {
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
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Status / State</div>
        <div style={{ fontWeight: "bold" }}>Default</div>
        <div style={{ fontWeight: "bold" }}>Hover</div>
        <div style={{ fontWeight: "bold" }}>Press</div>
        <div style={{ fontWeight: "bold" }}>Focus</div>
        <div style={{ fontWeight: "bold" }}>Disabled</div>
        <div style={{ fontWeight: "bold" }}>Error</div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Unselected</div>
        <Checkbox status="unselected" state="default" checked={false} />
        <Checkbox status="unselected" state="hover" checked={false} />
        <Checkbox status="unselected" state="press" checked={false} />
        <Checkbox status="unselected" state="focus" checked={false} />
        <Checkbox status="unselected" state="disabled" checked={false} />
        <Checkbox status="unselected" state="error" checked={false} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Selected</div>
        <Checkbox status="selected" state="default" checked={true} />
        <Checkbox status="selected" state="hover" checked={true} />
        <Checkbox status="selected" state="press" checked={true} />
        <Checkbox status="selected" state="focus" checked={true} />
        <Checkbox status="selected" state="disabled" checked={true} />
        <Checkbox status="selected" state="error" checked={true} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Partial</div>
        <Checkbox status="partial" state="default" indeterminate={true} />
        <Checkbox status="partial" state="hover" indeterminate={true} />
        <Checkbox status="partial" state="press" indeterminate={true} />
        <Checkbox status="partial" state="focus" indeterminate={true} />
        <Checkbox status="partial" state="disabled" indeterminate={true} />
        <Checkbox status="partial" state="error" indeterminate={true} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "모든 status와 state의 조합을 한눈에 확인할 수 있는 매트릭스입니다.",
      },
    },
  },
};

export const WithLabels: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}>
      <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Checkbox checked={false} />
        <span>옵션 1</span>
      </label>
      <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Checkbox checked={true} />
        <span>옵션 2</span>
      </label>
      <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Checkbox indeterminate={true} />
        <span>옵션 3 (부분 선택)</span>
      </label>
      <label
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          opacity: 0.5,
        }}>
        <Checkbox disabled={true} checked={true} />
        <span>옵션 4 (비활성화)</span>
      </label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "실제 사용 예시로 라벨과 함께 사용하는 경우입니다.",
      },
    },
  },
};
