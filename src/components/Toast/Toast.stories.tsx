import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ToastProvider, useToast } from '.'

const ToastDemo: React.FC<{
  type?: 'success' | 'error' | 'warning' | 'info'
  message?: string
  duration?: number
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  action?: { label: string; onClick: () => void }
}> = ({
  type = 'info',
  message = 'This is a toast message',
  duration = 4000,
  position = 'top-right',
  action,
}) => {
  const { addToast, setPosition } = useToast()

  React.useEffect(() => {
    setPosition(position)
  }, [position, setPosition])

  const showToast = () => {
    console.log('Showing toast with:', { type, message, duration, action })
    addToast({
      message,
      type,
      duration,
      action,
    })
  }

  return (
    <div className='flex justify-center'>
      <button
        onClick={showToast}
        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
      >
        Show {type} Toast
      </button>
    </div>
  )
}

const ToastStoryWrapper: React.FC<{
  type?: 'success' | 'error' | 'warning' | 'info'
  message?: string
  duration?: number
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  action?: { label: string; onClick: () => void }
}> = (props) => {
  return (
    <ToastProvider defaultPosition={props.position}>
      <ToastDemo {...props} />
    </ToastProvider>
  )
}

const meta = {
  title: 'Components/Toast',
  component: ToastStoryWrapper,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    },
    message: {
      control: 'text',
    },
    duration: {
      control: 'number',
    },
  },
} satisfies Meta<typeof ToastStoryWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: {
    type: 'success',
    message: 'Operation completed successfully!',
    duration: 4000,
  },
}

export const ErrorWithAction: Story = {
  args: {
    type: 'error',
    message: 'Something went wrong. Please try again.',
    duration: 0,
    action: {
      label: 'Retry',
      onClick: () => console.log('Retry clicked'),
    },
  },
}

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'Please review your input before proceeding.',
    duration: 4000,
  },
}

export const Info: Story = {
  args: {
    type: 'info',
    message: "Here's some helpful information for you.",
    duration: 4000,
  },
}

export const Persistent: Story = {
  args: {
    type: 'warning',
    message: 'This toast stays until manually closed',
    duration: 0,
  },
}

export const QuickDuration: Story = {
  args: {
    type: 'info',
    message: 'This toast disappears in 1 second',
    duration: 1000,
  },
}
