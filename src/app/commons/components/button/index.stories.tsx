import type { Meta, StoryObj } from "@storybook/react";
import Image from "next/image";
import Button from "./index";

const meta = {
  title: "Commons/Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "버튼 컴포넌트입니다. variant, size, state, shape, theme 등의 속성을 통해 다양한 스타일을 적용할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost"],
      description: "버튼의 변형 스타일",
      table: {
        type: { summary: "ButtonVariant" },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "select",
      options: ["s", "m"],
      description: "버튼의 크기",
      table: {
        type: { summary: "ButtonSize" },
        defaultValue: { summary: "m" },
      },
    },
    state: {
      control: "select",
      options: ["default", "hover", "disabled"],
      description: "버튼의 상태",
      table: {
        type: { summary: "ButtonState" },
        defaultValue: { summary: "default" },
      },
    },
    shape: {
      control: "select",
      options: ["round", "rectangle"],
      description: "버튼의 모양",
      table: {
        type: { summary: "ButtonShape" },
        defaultValue: { summary: "round" },
      },
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "버튼의 테마",
      table: {
        type: { summary: "ButtonTheme" },
        defaultValue: { summary: "light" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "버튼 비활성화 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    children: {
      control: "text",
      description: "버튼 내부 콘텐츠",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    children: "Button",
  },
};

// Variant 스토리
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

// Size 스토리
export const SizeSmall: Story = {
  args: {
    size: "s",
    children: "Small Button",
  },
};

export const SizeMedium: Story = {
  args: {
    size: "m",
    children: "Medium Button",
  },
};

// Shape 스토리
export const Round: Story = {
  args: {
    shape: "round",
    children: "Round Button",
  },
};

export const Rectangle: Story = {
  args: {
    shape: "rectangle",
    children: "Rectangle Button",
  },
};

// State 스토리
export const DefaultState: Story = {
  args: {
    state: "default",
    children: "Default State",
  },
};

export const HoverState: Story = {
  args: {
    state: "hover",
    children: "Hover State",
  },
};

export const DisabledState: Story = {
  args: {
    state: "disabled",
    children: "Disabled State",
  },
};

export const DisabledProp: Story = {
  args: {
    disabled: true,
    children: "Disabled Prop",
  },
};

// Theme 스토리
export const LightTheme: Story = {
  args: {
    theme: "light",
    variant: "primary",
    children: "Light Theme",
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
    children: "Dark Theme",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", backgroundColor: "#030712" }}>
        <Story />
      </div>
    ),
  ],
};

// 조합 스토리
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
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

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <Button size="s">Small</Button>
      <Button size="m">Medium</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 size 타입을 한 번에 확인할 수 있습니다.",
      },
    },
  },
};

export const AllShapes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px" }}>
      <Button shape="round">Round</Button>
      <Button shape="rectangle">Rectangle</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 shape 타입을 한 번에 확인할 수 있습니다.",
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px" }}>
      <Button state="default">Default</Button>
      <Button state="hover">Hover</Button>
      <Button state="disabled">Disabled</Button>
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
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Button theme="light" variant="primary">
          Primary
        </Button>
        <Button theme="light" variant="secondary">
          Secondary
        </Button>
        <Button theme="light" variant="outline">
          Outline
        </Button>
        <Button theme="light" variant="ghost">
          Ghost
        </Button>
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Button theme="light" variant="primary" state="disabled">
          Primary Disabled
        </Button>
        <Button theme="light" variant="secondary" state="disabled">
          Secondary Disabled
        </Button>
        <Button theme="light" variant="outline" state="disabled">
          Outline Disabled
        </Button>
        <Button theme="light" variant="ghost" state="disabled">
          Ghost Disabled
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Light 테마의 모든 variant와 disabled 상태를 확인할 수 있습니다.",
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
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Button theme="dark" variant="primary">
          Primary
        </Button>
        <Button theme="dark" variant="secondary">
          Secondary
        </Button>
        <Button theme="dark" variant="outline">
          Outline
        </Button>
        <Button theme="dark" variant="ghost">
          Ghost
        </Button>
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Button theme="dark" variant="primary" state="disabled">
          Primary Disabled
        </Button>
        <Button theme="dark" variant="secondary" state="disabled">
          Secondary Disabled
        </Button>
        <Button theme="dark" variant="outline" state="disabled">
          Outline Disabled
        </Button>
        <Button theme="dark" variant="ghost" state="disabled">
          Ghost Disabled
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Dark 테마의 모든 variant와 disabled 상태를 확인할 수 있습니다.",
      },
    },
  },
};

export const SizeAndShapeCombinations: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Button size="s" shape="round">
          Small Round
        </Button>
        <Button size="s" shape="rectangle">
          Small Rectangle
        </Button>
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Button size="m" shape="round">
          Medium Round
        </Button>
        <Button size="m" shape="rectangle">
          Medium Rectangle
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Size와 Shape의 모든 조합을 확인할 수 있습니다.",
      },
    },
  },
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Button variant="primary">
        <Image src="/icons/size=20.svg" width={20} height={20} alt="icon" />
        텍스트
      </Button>
      <Button variant="primary" size="s">
        <Image src="/icons/size=16.svg" width={16} height={16} alt="icon" />
        텍스트
      </Button>
      <Button variant="secondary">
        <Image src="/icons/size=20.svg" width={20} height={20} alt="icon" />
        아이콘과 텍스트
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "아이콘과 텍스트를 함께 사용할 수 있습니다. 아이콘은 children으로 전달되며, content 클래스의 gap 속성으로 간격이 조절됩니다.",
      },
    },
  },
};

