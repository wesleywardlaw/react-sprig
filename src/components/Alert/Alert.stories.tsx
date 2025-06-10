import { Alert, AlertTitle, AlertDescription } from './index'
import type { AlertVariant } from './index'
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  decorators: [
    (Story) => (
      <div className='flex justify-center items-center min-h-screen'>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof Alert>

const variants: AlertVariant[] = ['default', 'success', 'warning', 'error', 'info']

export const AllVariants: Story = {
  render: () => {
    const [open, setOpen] = React.useState(
      variants.reduce((acc, v) => ({ ...acc, [v]: true }), {} as Record<AlertVariant, boolean>)
    )
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {variants.map((variant) =>
          open[variant] ? (
            <Alert
              key={variant}
              variant={variant}
              onClose={() => setOpen((prev) => ({ ...prev, [variant]: false }))}
            >
              <AlertTitle>{variant.charAt(0).toUpperCase() + variant.slice(1)} Alert</AlertTitle>
              <AlertDescription>
                This is a {variant} alert with both title and description.
              </AlertDescription>
            </Alert>
          ) : null
        )}
      </div>
    )
  },
}

export const OnlyTitle: Story = {
  render: () => {
    const [open, setOpen] = React.useState(
      variants.reduce((acc, v) => ({ ...acc, [v]: true }), {} as Record<AlertVariant, boolean>)
    )
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {variants.map((variant) =>
          open[variant] ? (
            <Alert
              key={variant}
              variant={variant}
              onClose={() => setOpen((prev) => ({ ...prev, [variant]: false }))}
            >
              <AlertTitle>
                {variant.charAt(0).toUpperCase() + variant.slice(1)} Only Title
              </AlertTitle>
            </Alert>
          ) : null
        )}
      </div>
    )
  },
}

export const OnlyDescription: Story = {
  render: () => {
    const [open, setOpen] = React.useState(
      variants.reduce((acc, v) => ({ ...acc, [v]: true }), {} as Record<AlertVariant, boolean>)
    )
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {variants.map((variant) =>
          open[variant] ? (
            <Alert
              key={variant}
              variant={variant}
              onClose={() => setOpen((prev) => ({ ...prev, [variant]: false }))}
            >
              <AlertDescription>
                This is a {variant} alert with only a description.
              </AlertDescription>
            </Alert>
          ) : null
        )}
      </div>
    )
  },
}

export const NoTitleNoDescription: Story = {
  render: () => {
    const [open, setOpen] = React.useState(
      variants.reduce((acc, v) => ({ ...acc, [v]: true }), {} as Record<AlertVariant, boolean>)
    )
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {variants.map((variant) =>
          open[variant] ? (
            <Alert
              key={variant}
              variant={variant}
              onClose={() => setOpen((prev) => ({ ...prev, [variant]: false }))}
            >
              Just plain alert content for {variant} variant.
            </Alert>
          ) : null
        )}
      </div>
    )
  },
}

export const NoIcons: Story = {
  render: () => {
    const [open, setOpen] = React.useState(
      variants.reduce((acc, v) => ({ ...acc, [v]: true }), {} as Record<AlertVariant, boolean>)
    )
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {variants.map((variant) =>
          open[variant] ? (
            <Alert
              key={variant}
              variant={variant}
              showIcon={false}
              onClose={() => setOpen((prev) => ({ ...prev, [variant]: false }))}
            >
              <AlertTitle>{variant.charAt(0).toUpperCase() + variant.slice(1)} No Icon</AlertTitle>
              <AlertDescription>This is a {variant} alert with no icon.</AlertDescription>
            </Alert>
          ) : null
        )}
      </div>
    )
  },
}
