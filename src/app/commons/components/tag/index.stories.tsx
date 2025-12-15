import type { Meta, StoryObj } from "@storybook/react";
import Tag from "./index";

const meta = {
  title: "Commons/Components/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "태그 컴포넌트입니다. style, theme 등의 속성을 통해 다양한 스타일을 적용할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    style: {
      control: "select",
      options: ["rectangle", "duotone", "circle"],
      description: "태그의 스타일",
      table: {
        type: { summary: "TagStyle" },
        defaultValue: { summary: "rectangle" },
      },
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "태그의 테마",
      table: {
        type: { summary: "TagTheme" },
        defaultValue: { summary: "light" },
      },
    },
    children: {
      control: "text",
      description: "태그 내부 콘텐츠",
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    children: "Tag",
  },
};

// Style 스토리
export const Rectangle: Story = {
  args: {
    style: "rectangle",
    children: "Rectangle Tag",
  },
};

export const Duotone: Story = {
  args: {
    style: "duotone",
    children: "Duotone Tag",
  },
};

export const Circle: Story = {
  args: {
    style: "circle",
    children: "Circle Tag",
  },
};

// Theme 스토리
export const LightTheme: Story = {
  args: {
    theme: "light",
    style: "rectangle",
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
    style: "rectangle",
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
export const AllStyles: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Tag style="rectangle">Rectangle</Tag>
      <Tag style="duotone">Duotone</Tag>
      <Tag style="circle">Circle</Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 style 타입을 한 번에 확인할 수 있습니다.",
      },
    },
  },
};

export const LightThemeStyles: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        padding: "20px",
        backgroundColor: "#ffffff",
      }}>
      <Tag theme="light" style="rectangle">
        Rectangle
      </Tag>
      <Tag theme="light" style="duotone">
        Duotone
      </Tag>
      <Tag theme="light" style="circle">
        Circle
      </Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Light 테마의 모든 style 타입을 확인할 수 있습니다.",
      },
    },
  },
};

export const DarkThemeStyles: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        padding: "20px",
        backgroundColor: "#030712",
      }}>
      <Tag theme="dark" style="rectangle">
        Rectangle
      </Tag>
      <Tag theme="dark" style="duotone">
        Duotone
      </Tag>
      <Tag theme="dark" style="circle">
        Circle
      </Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Dark 테마의 모든 style 타입을 확인할 수 있습니다.",
      },
    },
  },
};

export const StyleAndThemeMatrix: Story = {
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
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Style / Theme</div>
        <div style={{ fontWeight: "bold" }}>Light</div>
        <div style={{ fontWeight: "bold" }}>Dark</div>
        <div></div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Rectangle</div>
        <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
          <Tag theme="light" style="rectangle">
            Rectangle
          </Tag>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#030712" }}>
          <Tag theme="dark" style="rectangle">
            Rectangle
          </Tag>
        </div>
        <div></div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Duotone</div>
        <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
          <Tag theme="light" style="duotone">
            Duotone
          </Tag>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#030712" }}>
          <Tag theme="dark" style="duotone">
            Duotone
          </Tag>
        </div>
        <div></div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Circle</div>
        <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
          <Tag theme="light" style="circle">
            Circle
          </Tag>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#030712" }}>
          <Tag theme="dark" style="circle">
            Circle
          </Tag>
        </div>
        <div></div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "모든 style과 theme의 조합을 한눈에 확인할 수 있는 매트릭스입니다.",
      },
    },
  },
};

export const CompleteExample: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "20px",
          backgroundColor: "#ffffff",
        }}>
        <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
          Light Theme
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Tag theme="light" style="rectangle">
            카테고리
          </Tag>
          <Tag theme="light" style="duotone">
            새 글
          </Tag>
          <Tag theme="light" style="circle">
            인기
          </Tag>
          <Tag theme="light" style="rectangle">
            추천
          </Tag>
          <Tag theme="light" style="duotone">
            이벤트
          </Tag>
          <Tag theme="light" style="circle">
            공지
          </Tag>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "20px",
          backgroundColor: "#030712",
        }}>
        <div
          style={{ fontWeight: "bold", marginBottom: "8px", color: "#ffffff" }}>
          Dark Theme
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Tag theme="dark" style="rectangle">
            카테고리
          </Tag>
          <Tag theme="dark" style="duotone">
            새 글
          </Tag>
          <Tag theme="dark" style="circle">
            인기
          </Tag>
          <Tag theme="dark" style="rectangle">
            추천
          </Tag>
          <Tag theme="dark" style="duotone">
            이벤트
          </Tag>
          <Tag theme="dark" style="circle">
            공지
          </Tag>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "실제 사용 예시로 다양한 태그를 조합한 경우입니다.",
      },
    },
  },
};


