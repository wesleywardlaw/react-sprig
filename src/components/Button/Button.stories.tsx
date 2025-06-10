import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './'
import { FaBeer, FaCoffee } from 'react-icons/fa'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Button size',
      table: {
        type: { summary: 'small | medium | large' },
        defaultValue: { summary: 'medium' },
      },
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'danger', 'success', 'secondary', 'outline'],
      description: 'Button color variant',
      table: {
        type: { summary: 'primary | danger | success | secondary | outline' },
        defaultValue: { summary: 'primary' },
      },
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['before', 'after'],
      description: 'Icon position relative to text',
      table: {
        type: { summary: 'before | after' },
        defaultValue: { summary: 'before' },
      },
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Show loading spinner',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Make button full width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: { type: 'text' },
      description: 'Button content/text',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessibility label',
    },
    icon: {
      control: false,
      description: 'Icon element to display',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  args: {
    children: 'Click Me',
    icon: <FaBeer />,
    iconPosition: 'before',
    color: 'primary',
    size: 'medium',
    loading: false,
    fullWidth: false,
    disabled: false,
  },
}

// Size variations
export const Small: Story = {
  args: {
    children: 'Small Button',
    icon: <FaCoffee />,
    size: 'small',
    color: 'primary',
  },
}

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    icon: <FaBeer />,
    size: 'medium',
    color: 'primary',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    icon: <FaCoffee />,
    size: 'large',
    color: 'primary',
  },
}

// Color variations
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    color: 'primary',
  },
}

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    color: 'danger',
    icon: <FaBeer />,
  },
}

export const Success: Story = {
  args: {
    children: 'Success Button',
    color: 'success',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    color: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    color: 'outline',
  },
}

// State variations
export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
    color: 'primary',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    icon: <FaCoffee />,
    color: 'danger',
  },
}

// Layout variations
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
    color: 'primary',
  },
  parameters: {
    layout: 'padded',
  },
}

// Icon variations
export const IconBefore: Story = {
  args: {
    children: 'Icon Before',
    icon: <FaBeer />,
    iconPosition: 'before',
    color: 'primary',
  },
}

export const IconAfter: Story = {
  args: {
    children: 'Icon After',
    icon: <FaCoffee />,
    iconPosition: 'after',
    color: 'primary',
  },
}

export const NoIcon: Story = {
  args: {
    children: 'No Icon',
    color: 'primary',
  },
}

// Interactive playground
export const Playground: Story = {
  args: {
    children: 'Playground Button',
    icon: <FaBeer />,
    iconPosition: 'before',
    color: 'primary',
    size: 'medium',
    loading: false,
    fullWidth: false,
    disabled: false,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Interactive playground to test all button variations. Use the controls panel to customize the button.',
      },
    },
  },
}
