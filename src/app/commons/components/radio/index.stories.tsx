import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Radio from "./index";

const meta = {
  title: "Commons/Components/Radio",
  component: Radio,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "라디오 버튼 컴포넌트입니다. status, state, checked 등의 속성을 통해 다양한 상태를 표현할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["unselected", "selected"],
      description: "라디오 버튼의 선택 상태",
      table: {
        type: { summary: "RadioStatus" },
      },
    },
    state: {
      control: "select",
      options: ["default", "hover", "press", "focus", "disabled", "error"],
      description: "라디오 버튼의 상태",
      table: {
        type: { summary: "RadioState" },
        defaultValue: { summary: "default" },
      },
    },
    checked: {
      control: { type: "boolean" },
      description: "라디오 버튼 선택 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "라디오 버튼 비활성화 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof Radio>;

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
      <Radio status="unselected" checked={false} />
      <Radio status="selected" checked={true} />
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
      <Radio status="unselected" state="default" checked={false} />
      <Radio status="unselected" state="hover" checked={false} />
      <Radio status="unselected" state="press" checked={false} />
      <Radio status="unselected" state="focus" checked={false} />
      <Radio status="unselected" state="disabled" checked={false} />
      <Radio status="unselected" state="error" checked={false} />
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
      <Radio status="selected" state="default" checked={true} />
      <Radio status="selected" state="hover" checked={true} />
      <Radio status="selected" state="press" checked={true} />
      <Radio status="selected" state="focus" checked={true} />
      <Radio status="selected" state="disabled" checked={true} />
      <Radio status="selected" state="error" checked={true} />
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
        <Radio status="unselected" state="default" checked={false} />
        <Radio status="unselected" state="hover" checked={false} />
        <Radio status="unselected" state="press" checked={false} />
        <Radio status="unselected" state="focus" checked={false} />
        <Radio status="unselected" state="disabled" checked={false} />
        <Radio status="unselected" state="error" checked={false} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Selected</div>
        <Radio status="selected" state="default" checked={true} />
        <Radio status="selected" state="hover" checked={true} />
        <Radio status="selected" state="press" checked={true} />
        <Radio status="selected" state="focus" checked={true} />
        <Radio status="selected" state="disabled" checked={true} />
        <Radio status="selected" state="error" checked={true} />
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
        <Radio name="option" value="option1" checked={false} />
        <span>옵션 1</span>
      </label>
      <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Radio name="option" value="option2" checked={true} />
        <span>옵션 2</span>
      </label>
      <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Radio name="option" value="option3" checked={false} />
        <span>옵션 3</span>
      </label>
      <label
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          opacity: 0.5,
        }}>
        <Radio name="option" value="option4" disabled={true} checked={false} />
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

const RadioGroupComponent = () => {
  const [selected, setSelected] = React.useState("option1");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}>
      <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Radio
          name="group"
          value="option1"
          checked={selected === "option1"}
          onChange={(e) => setSelected(e.target.value)}
        />
        <span>옵션 1</span>
      </label>
      <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Radio
          name="group"
          value="option2"
          checked={selected === "option2"}
          onChange={(e) => setSelected(e.target.value)}
        />
        <span>옵션 2</span>
      </label>
      <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Radio
          name="group"
          value="option3"
          checked={selected === "option3"}
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
        story: "라디오 버튼 그룹으로 사용하는 경우입니다.",
      },
    },
  },
};
