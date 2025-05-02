import { Button, ButtonProps } from './' // Assuming your Button component is in the same directory
import { FaBeer, FaCoffee } from 'react-icons/fa' // Example React Icons

// Default export with metadata
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    iconPosition: {
      control: { type: 'select', options: ['before', 'after'] },
    },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
    color: {
      control: {
        type: 'select',
        options: ['primary', 'danger', 'success', 'secondary', 'outline'],
      },
    },
    loading: { control: { type: 'boolean' } },
    fullWidth: { control: { type: 'boolean' } },
    icon: { control: { type: 'text' } },
    children: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
  },
}

// Default button (with icon before)
export const Default = {
  render: (args: ButtonProps) => <Button {...args} />,
  args: {
    children: 'Click Me',
    icon: <FaBeer />, // Example of React Icon
    iconPosition: 'before',
    color: 'primary',
    size: 'medium',
    loading: false,
    fullWidth: false,
  },
}

// Disabled button (with icon after)
export const Disabled = {
  render: (args: ButtonProps) => <Button {...args} />,
  args: {
    children: 'Disabled Button',
    icon: <FaCoffee />,
    iconPosition: 'after',
    color: 'danger',
    size: 'medium',
    loading: false,
    fullWidth: false,
    disabled: true,
  },
}

// Loading button (with spinner icon, loading state)
export const Loading = {
  render: (args: ButtonProps) => <Button {...args} />,
  args: {
    children: 'Loading...',
    iconPosition: 'before',
    color: 'success',
    size: 'medium',
    loading: true,
    fullWidth: false,
  },
}

// Large button (with icon before)
export const LargeButton = {
  render: (args: ButtonProps) => <Button {...args} />,
  args: {
    children: 'Large Button',
    icon: <FaBeer />,
    iconPosition: 'before',
    color: 'primary',
    size: 'large',
    loading: false,
    fullWidth: false,
  },
}

// Button with icon after text
export const IconAfter = {
  render: (args: ButtonProps) => <Button {...args} />,
  args: {
    children: 'Click Me',
    icon: <FaCoffee />, // React Icon with "after" position
    iconPosition: 'after',
    color: 'primary',
    size: 'medium',
    loading: false,
    fullWidth: false,
  },
}

// Full width button (no icon)
export const FullWidthButton = {
  render: (args: ButtonProps) => <Button {...args} />,
  args: {
    children: 'Full Width Button',
    icon: null, // No icon
    iconPosition: 'before',
    color: 'primary',
    size: 'medium',
    loading: false,
    fullWidth: true,
  },
}

// Small button (with icon before)
export const SmallButton = {
  render: (args: ButtonProps) => <Button {...args} />,
  args: {
    children: 'Small Button',
    icon: <FaCoffee />,
    iconPosition: 'before',
    color: 'secondary',
    size: 'small',
    loading: false,
    fullWidth: false,
  },
}

// Outline button (no icon)
export const OutlineButton = {
  render: (args: ButtonProps) => <Button {...args} />,
  args: {
    children: 'Outline Button',
    icon: null,
    iconPosition: 'before',
    color: 'outline',
    size: 'medium',
    loading: false,
    fullWidth: false,
  },
}

// Danger button (with icon before)
export const DangerButton = {
  render: (args: ButtonProps) => <Button {...args} />,
  args: {
    children: 'Danger Button',
    icon: <FaBeer />,
    iconPosition: 'before',
    color: 'danger',
    size: 'medium',
    loading: false,
    fullWidth: false,
  },
}
