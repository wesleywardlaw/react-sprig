import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './index'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'rectangular', 'circular'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
    lines: { control: 'number' },
    loading: { control: 'boolean' },
    className: { control: 'text' },
  },
}
export default meta

type Story = StoryObj<typeof Skeleton>

export const Text: Story = {
  args: {
    variant: 'text',
    width: '60%',
    height: '1.2rem',
    lines: 1,
    loading: true,
  },
}

export const TextMultipleLines: Story = {
  args: {
    variant: 'text',
    lines: 4,
    width: undefined,
    loading: true,
  },
}

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 120,
    loading: true,
  },
}

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 50,
    height: 50,
    loading: true,
  },
}

export const WithChildren: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 120,
    loading: false,
    children: <div style={{ padding: 16 }}>Loaded content</div>,
  },
}

export const CustomClassName: Story = {
  args: {
    variant: 'text',
    width: '80%',
    className: 'border-black border-2',
    loading: true,
  },
}
