import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "./index";

const meta = {
  title: "Commons/Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "아바타 컴포넌트입니다. size, status, theme 등의 속성을 통해 다양한 스타일을 적용할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["s", "m", "L"],
      description: "아바타의 크기",
      table: {
        type: { summary: "AvatarSize" },
        defaultValue: { summary: "m" },
      },
    },
    status: {
      control: "select",
      options: ["online", "away", "ban", "offline"],
      description: "아바타의 상태",
      table: {
        type: { summary: "AvatarStatus" },
        defaultValue: { summary: "offline" },
      },
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "아바타의 테마",
      table: {
        type: { summary: "AvatarTheme" },
        defaultValue: { summary: "light" },
      },
    },
    src: {
      control: "text",
      description: "아바타 이미지 경로",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "/images/bird.svg" },
      },
    },
    alt: {
      control: "text",
      description: "아바타 이미지 대체 텍스트",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Avatar" },
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    src: "/images/bird.svg",
    alt: "Avatar",
  },
};

// Size 스토리
export const SizeSmall: Story = {
  args: {
    size: "s",
    src: "/images/bird.svg",
    alt: "Small Avatar",
  },
};

export const SizeMedium: Story = {
  args: {
    size: "m",
    src: "/images/bird.svg",
    alt: "Medium Avatar",
  },
};

export const SizeLarge: Story = {
  args: {
    size: "L",
    src: "/images/bird.svg",
    alt: "Large Avatar",
  },
};

// Status 스토리
export const StatusOnline: Story = {
  args: {
    status: "online",
    src: "/images/bird.svg",
    alt: "Online Avatar",
  },
};

export const StatusAway: Story = {
  args: {
    status: "away",
    src: "/images/bird.svg",
    alt: "Away Avatar",
  },
};

export const StatusBan: Story = {
  args: {
    status: "ban",
    src: "/images/bird.svg",
    alt: "Ban Avatar",
  },
};

export const StatusOffline: Story = {
  args: {
    status: "offline",
    src: "/images/bird.svg",
    alt: "Offline Avatar",
  },
};

// Theme 스토리
export const LightTheme: Story = {
  args: {
    theme: "light",
    src: "/images/bird.svg",
    alt: "Light Theme Avatar",
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
    src: "/images/bird.svg",
    alt: "Dark Theme Avatar",
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
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      <Avatar size="s" src="/images/bird.svg" alt="Small" />
      <Avatar size="m" src="/images/bird.svg" alt="Medium" />
      <Avatar size="L" src="/images/bird.svg" alt="Large" />
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

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      <Avatar status="online" src="/images/bird.svg" alt="Online" />
      <Avatar status="away" src="/images/bird.svg" alt="Away" />
      <Avatar status="ban" src="/images/bird.svg" alt="Ban" />
      <Avatar status="offline" src="/images/bird.svg" alt="Offline" />
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

export const LightThemeVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "20px",
        backgroundColor: "#ffffff",
      }}>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Avatar
          theme="light"
          size="m"
          status="online"
          src="/images/bird.svg"
          alt="Online"
        />
        <Avatar
          theme="light"
          size="m"
          status="away"
          src="/images/bird.svg"
          alt="Away"
        />
        <Avatar
          theme="light"
          size="m"
          status="ban"
          src="/images/bird.svg"
          alt="Ban"
        />
        <Avatar
          theme="light"
          size="m"
          status="offline"
          src="/images/bird.svg"
          alt="Offline"
        />
      </div>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Avatar
          theme="light"
          size="s"
          status="online"
          src="/images/bird.svg"
          alt="Small Online"
        />
        <Avatar
          theme="light"
          size="m"
          status="online"
          src="/images/bird.svg"
          alt="Medium Online"
        />
        <Avatar
          theme="light"
          size="L"
          status="online"
          src="/images/bird.svg"
          alt="Large Online"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Light 테마의 모든 variant와 size 조합을 확인할 수 있습니다.",
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
        gap: "24px",
        padding: "20px",
        backgroundColor: "#030712",
      }}>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Avatar
          theme="dark"
          size="m"
          status="online"
          src="/images/bird.svg"
          alt="Online"
        />
        <Avatar
          theme="dark"
          size="m"
          status="away"
          src="/images/bird.svg"
          alt="Away"
        />
        <Avatar
          theme="dark"
          size="m"
          status="ban"
          src="/images/bird.svg"
          alt="Ban"
        />
        <Avatar
          theme="dark"
          size="m"
          status="offline"
          src="/images/bird.svg"
          alt="Offline"
        />
      </div>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Avatar
          theme="dark"
          size="s"
          status="online"
          src="/images/bird.svg"
          alt="Small Online"
        />
        <Avatar
          theme="dark"
          size="m"
          status="online"
          src="/images/bird.svg"
          alt="Medium Online"
        />
        <Avatar
          theme="dark"
          size="L"
          status="online"
          src="/images/bird.svg"
          alt="Large Online"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Dark 테마의 모든 variant와 size 조합을 확인할 수 있습니다.",
      },
    },
  },
};

export const SizeAndStatusCombinations: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Avatar
          size="s"
          status="online"
          src="/images/bird.svg"
          alt="Small Online"
        />
        <Avatar
          size="s"
          status="away"
          src="/images/bird.svg"
          alt="Small Away"
        />
        <Avatar size="s" status="ban" src="/images/bird.svg" alt="Small Ban" />
        <Avatar
          size="s"
          status="offline"
          src="/images/bird.svg"
          alt="Small Offline"
        />
      </div>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Avatar
          size="m"
          status="online"
          src="/images/bird.svg"
          alt="Medium Online"
        />
        <Avatar
          size="m"
          status="away"
          src="/images/bird.svg"
          alt="Medium Away"
        />
        <Avatar size="m" status="ban" src="/images/bird.svg" alt="Medium Ban" />
        <Avatar
          size="m"
          status="offline"
          src="/images/bird.svg"
          alt="Medium Offline"
        />
      </div>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Avatar
          size="L"
          status="online"
          src="/images/bird.svg"
          alt="Large Online"
        />
        <Avatar
          size="L"
          status="away"
          src="/images/bird.svg"
          alt="Large Away"
        />
        <Avatar size="L" status="ban" src="/images/bird.svg" alt="Large Ban" />
        <Avatar
          size="L"
          status="offline"
          src="/images/bird.svg"
          alt="Large Offline"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Size와 Status의 모든 조합을 확인할 수 있습니다.",
      },
    },
  },
};

export const CompleteExample: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "20px",
          backgroundColor: "#ffffff",
        }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
          Light Theme
        </h3>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Avatar
            theme="light"
            size="s"
            status="online"
            src="/images/bird.svg"
            alt="Small Online"
          />
          <Avatar
            theme="light"
            size="m"
            status="away"
            src="/images/bird.svg"
            alt="Medium Away"
          />
          <Avatar
            theme="light"
            size="L"
            status="ban"
            src="/images/bird.svg"
            alt="Large Ban"
          />
          <Avatar
            theme="light"
            size="m"
            status="offline"
            src="/images/bird.svg"
            alt="Medium Offline"
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "20px",
          backgroundColor: "#030712",
        }}>
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "bold",
            color: "#ffffff",
          }}>
          Dark Theme
        </h3>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Avatar
            theme="dark"
            size="s"
            status="online"
            src="/images/bird.svg"
            alt="Small Online"
          />
          <Avatar
            theme="dark"
            size="m"
            status="away"
            src="/images/bird.svg"
            alt="Medium Away"
          />
          <Avatar
            theme="dark"
            size="L"
            status="ban"
            src="/images/bird.svg"
            alt="Large Ban"
          />
          <Avatar
            theme="dark"
            size="m"
            status="offline"
            src="/images/bird.svg"
            alt="Medium Offline"
          />
        </div>
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

export const SizeAndStatusMatrix: Story = {
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
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Size / Status</div>
        <div style={{ fontWeight: "bold" }}>Online</div>
        <div style={{ fontWeight: "bold" }}>Away</div>
        <div style={{ fontWeight: "bold" }}>Ban</div>
        <div style={{ fontWeight: "bold" }}>Offline</div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Small (s)</div>
        <Avatar
          size="s"
          status="online"
          src="/images/bird.svg"
          alt="Small Online"
        />
        <Avatar
          size="s"
          status="away"
          src="/images/bird.svg"
          alt="Small Away"
        />
        <Avatar size="s" status="ban" src="/images/bird.svg" alt="Small Ban" />
        <Avatar
          size="s"
          status="offline"
          src="/images/bird.svg"
          alt="Small Offline"
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Medium (m)</div>
        <Avatar
          size="m"
          status="online"
          src="/images/bird.svg"
          alt="Medium Online"
        />
        <Avatar
          size="m"
          status="away"
          src="/images/bird.svg"
          alt="Medium Away"
        />
        <Avatar size="m" status="ban" src="/images/bird.svg" alt="Medium Ban" />
        <Avatar
          size="m"
          status="offline"
          src="/images/bird.svg"
          alt="Medium Offline"
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          alignItems: "center",
        }}>
        <div style={{ fontWeight: "bold" }}>Large (L)</div>
        <Avatar
          size="L"
          status="online"
          src="/images/bird.svg"
          alt="Large Online"
        />
        <Avatar
          size="L"
          status="away"
          src="/images/bird.svg"
          alt="Large Away"
        />
        <Avatar size="L" status="ban" src="/images/bird.svg" alt="Large Ban" />
        <Avatar
          size="L"
          status="offline"
          src="/images/bird.svg"
          alt="Large Offline"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "모든 size와 status의 조합을 한눈에 확인할 수 있는 매트릭스입니다.",
      },
    },
  },
};
