import type { Meta, StoryObj } from '@storybook/react';
import TierTag from './index';
import { TierType } from '../../constants/tierType.enum';

const meta = {
  title: 'Commons/Components/TierTag',
  component: TierTag,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#030712' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tier: {
      control: 'select',
      options: Object.values(TierType),
      description: '티어 등급',
    },
    theme: {
      control: 'radio',
      options: ['light', 'dark'],
      description: '테마 모드',
    },
  },
} satisfies Meta<typeof TierTag>;

export default meta;
type Story = StoryObj<typeof meta>;

// Light Theme Stories
export const LightBronze: Story = {
  args: {
    tier: TierType.bronze,
    theme: 'light',
  },
  // #region agent log
  play: async () => {
    fetch('http://127.0.0.1:7242/ingest/29c7f2c2-61fa-414f-962c-84e088badf45', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'index.stories.tsx:37',
        message: 'LightBronze story args',
        data: {
          tier: TierType.bronze,
          tierValue: String(TierType.bronze),
          theme: 'light',
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
  },
  // #endregion
};

export const LightSilver: Story = {
  args: {
    tier: TierType.silver,
    theme: 'light',
  },
};

export const LightGold: Story = {
  args: {
    tier: TierType.gold,
    theme: 'light',
  },
};

export const LightPlatinum: Story = {
  args: {
    tier: TierType.platinum,
    theme: 'light',
  },
};

export const LightDiamond: Story = {
  args: {
    tier: TierType.diamond,
    theme: 'light',
  },
};

export const LightMaster: Story = {
  args: {
    tier: TierType.master,
    theme: 'light',
  },
};

export const LightChampion: Story = {
  args: {
    tier: TierType.champion,
    theme: 'light',
  },
};

// Dark Theme Stories
export const DarkBronze: Story = {
  args: {
    tier: TierType.bronze,
    theme: 'dark',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkSilver: Story = {
  args: {
    tier: TierType.silver,
    theme: 'dark',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkGold: Story = {
  args: {
    tier: TierType.gold,
    theme: 'dark',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkPlatinum: Story = {
  args: {
    tier: TierType.platinum,
    theme: 'dark',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkDiamond: Story = {
  args: {
    tier: TierType.diamond,
    theme: 'dark',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkMaster: Story = {
  args: {
    tier: TierType.master,
    theme: 'dark',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkChampion: Story = {
  args: {
    tier: TierType.champion,
    theme: 'dark',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
};

// All Tiers in Light Theme
export const AllTiersLight: Story = {
  args: {
    tier: TierType.bronze,
    theme: 'light',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'flex-start',
      }}
    >
      <TierTag tier={TierType.bronze} theme="light" />
      <TierTag tier={TierType.silver} theme="light" />
      <TierTag tier={TierType.gold} theme="light" />
      <TierTag tier={TierType.platinum} theme="light" />
      <TierTag tier={TierType.diamond} theme="light" />
      <TierTag tier={TierType.master} theme="light" />
      <TierTag tier={TierType.champion} theme="light" />
    </div>
  ),
};

// All Tiers in Dark Theme
export const AllTiersDark: Story = {
  args: {
    tier: TierType.bronze,
    theme: 'dark',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'flex-start',
      }}
    >
      <TierTag tier={TierType.bronze} theme="dark" />
      <TierTag tier={TierType.silver} theme="dark" />
      <TierTag tier={TierType.gold} theme="dark" />
      <TierTag tier={TierType.platinum} theme="dark" />
      <TierTag tier={TierType.diamond} theme="dark" />
      <TierTag tier={TierType.master} theme="dark" />
      <TierTag tier={TierType.champion} theme="dark" />
    </div>
  ),
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#030712' }}>
        <Story />
      </div>
    ),
  ],
};
