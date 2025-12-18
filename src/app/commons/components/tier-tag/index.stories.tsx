import type { Meta, StoryObj } from '@storybook/react';
import TierTag from './index';
import { TierType } from '../../constants/tierType.enum';

const meta = {
  title: 'Commons/Components/TierTag',
  component: TierTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tier: {
      control: 'select',
      options: Object.values(TierType),
      description: '티어 등급',
    },
  },
} satisfies Meta<typeof TierTag>;

export default meta;
type Story = StoryObj<typeof meta>;

// Individual Tier Stories
export const Bronze: Story = {
  args: {
    tier: TierType.bronze,
  },
};

export const Silver: Story = {
  args: {
    tier: TierType.silver,
  },
};

export const Gold: Story = {
  args: {
    tier: TierType.gold,
  },
};

export const Platinum: Story = {
  args: {
    tier: TierType.platinum,
  },
};

export const Diamond: Story = {
  args: {
    tier: TierType.diamond,
  },
};

export const Master: Story = {
  args: {
    tier: TierType.master,
  },
};

export const Champion: Story = {
  args: {
    tier: TierType.champion,
  },
};

// All Tiers
export const AllTiers: Story = {
  args: {
    tier: TierType.bronze,
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
      <TierTag tier={TierType.bronze} />
      <TierTag tier={TierType.silver} />
      <TierTag tier={TierType.gold} />
      <TierTag tier={TierType.platinum} />
      <TierTag tier={TierType.diamond} />
      <TierTag tier={TierType.master} />
      <TierTag tier={TierType.champion} />
    </div>
  ),
};
