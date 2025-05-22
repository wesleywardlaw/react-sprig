import { Alert, AlertTitle, AlertDescription } from './index'
import type { AlertVariant } from './index'
import React from 'react'

export default {
  title: 'Components/Alert',
  component: Alert,
}

const variants: AlertVariant[] = ['default', 'success', 'warning', 'error', 'info']

export const AllVariants = () => {
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
}

export const OnlyTitle = () => {
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
            <AlertTitle>{variant.charAt(0).toUpperCase() + variant.slice(1)} Only Title</AlertTitle>
          </Alert>
        ) : null
      )}
    </div>
  )
}

export const OnlyDescription = () => {
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
            <AlertDescription>This is a {variant} alert with only a description.</AlertDescription>
          </Alert>
        ) : null
      )}
    </div>
  )
}

export const NoTitleNoDescription = () => {
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
}

export const NoIcons = () => {
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
}
