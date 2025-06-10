import { Badge } from './index'
import type { BadgeVariant, BadgeSize } from './index'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const variants: BadgeVariant[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
]

const sizes: BadgeSize[] = ['sm', 'md', 'lg']

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: variants,
      description: 'Visual style of the badge',
      table: { type: { summary: 'BadgeVariant' } },
    },
    size: {
      control: { type: 'select' },
      options: sizes,
      description: 'Size of the badge',
      table: { type: { summary: 'BadgeSize' } },
    },
    className: {
      control: { type: 'text' },
      description: 'Custom class names',
      table: { type: { summary: 'string' } },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label for accessibility',
      table: { type: { summary: 'string' } },
    },
    role: {
      control: { type: 'select' },
      options: ['status', 'img', 'presentation'],
      description: 'ARIA role',
      table: { type: { summary: 'status | img | presentation' } },
    },
    removable: {
      control: { type: 'boolean' },
      description: 'Whether the badge is removable',
      table: { type: { summary: 'boolean' } },
    },
    onRemove: { action: 'removed', description: 'Callback when removed' },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the badge is disabled',
      table: { type: { summary: 'boolean' } },
    },
    id: {
      control: { type: 'text' },
      description: 'ID for the badge',
      table: { type: { summary: 'string' } },
    },
    children: {
      control: { type: 'text' },
      description: 'Badge content',
      table: { type: { summary: 'ReactNode' } },
    },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {variants.map((variant) => (
        <Badge
          key={variant}
          variant={variant}
        >
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Badge>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {sizes.map((size) => (
        <Badge
          key={size}
          size={size}
          variant='primary'
        >
          {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
        </Badge>
      ))}
    </div>
  ),
}

export const Removable: Story = {
  render: (args) => {
    const [visible, setVisible] = React.useState(true)
    return visible ? (
      <Badge
        {...args}
        removable
        onRemove={() => {
          setVisible(false)
          if (args.onRemove) args.onRemove()
        }}
        variant='success'
      >
        Removable
      </Badge>
    ) : (
      <></>
    )
  },
  args: {
    removable: true,
    disabled: false,
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Badge
        variant='primary'
        disabled
      >
        Disabled
      </Badge>
      <Badge
        variant='warning'
        removable
        disabled
      >
        Disabled Removable
      </Badge>
    </div>
  ),
}

export const Accessibility: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Badge
        variant='success'
        role='status'
        ariaLabel='Online status indicator'
      >
        Online
      </Badge>
      <Badge
        variant='error'
        role='status'
        ariaLabel='3 unread notifications'
      >
        3
      </Badge>
    </div>
  ),
}

export const CustomClassName: Story = {
  render: () => (
    <Badge
      variant='info'
      className='shadow-lg border-2 border-dashed'
    >
      Custom Class
    </Badge>
  ),
}

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: 'Customizable Badge',
    removable: false,
    disabled: false,
    className: '',
    ariaLabel: '',
    role: 'status',
    id: '',
  },
  render: (args) => {
    const [visible, setVisible] = React.useState(true)
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        {visible ? (
          <Badge
            {...args}
            onRemove={() => {
              setVisible(false)
              if (args.onRemove) args.onRemove()
            }}
          />
        ) : (
          <span style={{ color: '#888' }}>[Badge removed]</span>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive badge for customizing all props via controls. Supports removal if `removable` is enabled.',
      },
    },
  },
}
