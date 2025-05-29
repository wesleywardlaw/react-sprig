import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './index'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    delay: { control: 'number' },
    className: { control: 'text' },
    content: { control: 'text' },
  },
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    position: 'top',
    children: <span>Hover or focus me</span>,
  },
  parameters: {
    layout: 'centered',
    docs: {
      story: {
        inline: false,
      },
    },
  },
  render: (args) => (
    <div
      style={{
        marginTop: 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 300,
      }}
    >
      <Tooltip {...args} />
    </div>
  ),
}

export const Positions: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 40,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        marginTop: 100,
      }}
    >
      <Tooltip
        content='Tooltip on top'
        position='top'
      >
        <button>Top</button>
      </Tooltip>
      <Tooltip
        content='Tooltip on right'
        position='right'
      >
        <button>Right</button>
      </Tooltip>
      <Tooltip
        content='Tooltip on bottom'
        position='bottom'
      >
        <button>Bottom</button>
      </Tooltip>
      <Tooltip
        content='Tooltip on left'
        position='left'
      >
        <button>Left</button>
      </Tooltip>
    </div>
  ),
}

export const CustomDelay: Story = {
  args: {
    content: 'Appears after 1 second',
    delay: 1000,
    children: <span>Hover or focus me</span>,
  },
  render: (args) => (
    <div
      style={{
        marginTop: 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 300,
      }}
    >
      <Tooltip {...args} />
    </div>
  ),
}

export const CustomClass: Story = {
  args: {
    content: 'Custom styled tooltip',
    color: '#2563eb',
    children: <span>Hover or focus me</span>,
    className: 'text-black',
  },
  render: (args) => (
    <div
      style={{
        marginTop: 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 300,
      }}
    >
      <Tooltip {...args} />
    </div>
  ),
}
